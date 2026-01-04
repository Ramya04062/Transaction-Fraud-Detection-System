# app/main.py

from fastapi import FastAPI, Depends, HTTPException
import pandas as pd
from sqlalchemy.orm import Session
from app.db import Base, engine, get_db
from app.models import Transaction, User
from app.schemas import TransactionIn, PredictionOut
from app.feature_pipeline import build_features_df
from app.model_server import HIGH_FRAUD_THRESHOLD, LOW_FRAUD_THRESHOLD, ModelServer
from sqlalchemy.sql import func
from app.schemas import AdminLoginIn, AdminLoginOut
from app.models import Admin
from app.utils.security import verify_password
from app.db import SessionLocal
from app.models import Admin
#from app.utils.security import hash_password
from fastapi import status
import logging
from fastapi.middleware.cors import CORSMiddleware


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("fraud_api")

app = FastAPI(title="Fraud Detection API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Load ML model
model_server = ModelServer()
ALERT_THRESHOLD = 0.7


@app.post("/admin/login", response_model=AdminLoginOut)
def admin_login(payload: AdminLoginIn, db: Session = Depends(get_db)):

    admin = db.query(Admin).filter(Admin.email == payload.email).first()

    if not admin or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account disabled"
        )

    return AdminLoginOut(
        success=True,
        message="Login successful"
    )



# -----------------------------------------------------------
# /transactions  <-- simulator posts here
# -----------------------------------------------------------
@app.post("/transactions", response_model=PredictionOut)
def ingest_transaction(tx: TransactionIn, db: Session = Depends(get_db)):

    # Ensure sender exists
    sender = db.query(User).filter(User.user_id == tx.sender_id).first()
    if not sender:
        sender = User(user_id=tx.sender_id)
        db.add(sender)
        db.commit()
        db.refresh(sender)

    # 1️⃣ Save transaction
    db_tx = Transaction(
        step=tx.step,
        sender_id=tx.sender_id,
        receiver_id=tx.receiver_id,
        transaction_id=tx.transaction_id,
        amount=tx.amount,
        transaction_type=tx.transaction_type,
        channel=tx.channel or "ONLINE_BANKING",
        timestamp=func.now(),
        raw_payload=tx.model_dump(),
        oldbalanceOrg=tx.oldbalanceOrg,
        newbalanceOrig=tx.newbalanceOrig,
        oldbalanceDest=tx.oldbalanceDest,
        newbalanceDest=tx.newbalanceDest,
        true_label=tx.true_label,
        status="RECEIVED"
    )


    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)

    # 2️⃣ DB → DataFrame
    df = pd.DataFrame([{
        "step": tx.step,
        "transaction_type": db_tx.transaction_type,
        "amount": db_tx.amount,
        "oldbalanceOrg": db_tx.oldbalanceOrg,
        "newbalanceOrig": db_tx.newbalanceOrig,
        "oldbalanceDest": db_tx.oldbalanceDest,
        "newbalanceDest": db_tx.newbalanceDest,
    }])

        # Example: auto-generate step if not provided
    if 'step' not in df.columns:
        df['step'] = 0  # or use a timestamp/sequence

    # 3️⃣ Feature engineering
    X = build_features_df(df)

    # 4️⃣ Model prediction
    proba = model_server.predict_proba(X)
    fraud_score = float(proba[0][1])

    # Default activity_text
    activity_text = sender.recent_activity_summary or ""

    # Determine fraud_label
    if fraud_score >= HIGH_FRAUD_THRESHOLD:
        fraud_label = True
        llm_score = 0.0  # optional, skip LLM if ML is confident
        decision_source = "ML_CONFIDENT"

    elif fraud_score <= LOW_FRAUD_THRESHOLD:
        fraud_label = False
        llm_score = 0.0  # optional, skip LLM if ML is confident
        decision_source = "ML_CONFIDENT"

    else:
        print("[FLOW] ML uncertain → invoking MiniLM")
        llm_score = model_server.llm_similarity_score(activity_text)
        final_score = (0.6 * fraud_score) + (0.4 * llm_score)
        fraud_label = final_score >= ALERT_THRESHOLD
        decision_source = "ML + MiniLM"


    # 5️⃣ Update DB with prediction
    db_tx.fraud_score = fraud_score
    db_tx.fraud_label = fraud_label
    db_tx.model_version = model_server.version
    db_tx.prediction_time = func.now()
    db_tx.status = "FLAGGED" if fraud_label else "CLEARED"
    db_tx.decision_source = decision_source

    db.commit()

    # 6️⃣ Response
    return PredictionOut(
        transaction_id=db_tx.transaction_id,
        fraud_score=fraud_score,
        fraud_label=fraud_label,
        model_version=model_server.version,
        prediction_time=db_tx.prediction_time,
        status=db_tx.status,
        decision_source=decision_source
    )



@app.get("/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_today = db.query(Transaction).count()

    fraud_count = db.query(Transaction)\
        .filter(Transaction.fraud_label == True)\
        .count()

    blocked_amount = db.query(func.sum(Transaction.amount))\
        .filter(Transaction.status == "FLAGGED")\
        .scalar() or 0.0

    active_users = db.query(func.count(func.distinct(Transaction.sender_id))).scalar()

    return {
        "transactions_today": total_today,
        "fraud_detected": fraud_count,
        "blocked_amount": blocked_amount,
        "active_users": active_users
    }


@app.get("/admin/transactions")
def get_recent_transactions(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    txs = db.query(Transaction)\
        .order_by(Transaction.timestamp.desc())\
        .limit(limit)\
        .all()

    return [
        {
            "id": tx.transaction_id or f"TXN-{tx.id}",
            "user": tx.sender_id or "Unknown",
            "amount": tx.amount or 0.0,
            "status": (tx.status or "RECEIVED").lower(),
            "risk": "high" if (tx.fraud_score or 0) > 0.7 else "medium" if (tx.fraud_score or 0) > 0.4 else "low",
            "time": tx.timestamp.isoformat() if tx.timestamp else None
        }
        for tx in txs
    ]


@app.get("/admin/alerts")
def get_recent_alerts(
    limit: int = 100,
    db: Session = Depends(get_db)
):
    alerts = db.query(Transaction)\
        .filter(Transaction.status == "FLAGGED")\
        .order_by(Transaction.prediction_time.desc())\
        .limit(limit)\
        .all()

    return [
        {
            "id": tx.id,
            "type": "High Risk Transaction",
            "user": tx.sender_id or "Unknown",
            "amount": tx.amount or 0.0,
            "location": tx.channel or "Unknown",  # until geo IP
            "severity": "high" if (tx.fraud_score or 0) > 0.8 else "medium",
            "time": tx.prediction_time.isoformat() if tx.prediction_time else (tx.timestamp.isoformat() if tx.timestamp else None)
        }
        for tx in alerts
    ]


@app.get("/admin/trends")
def fraud_trends(db: Session = Depends(get_db)):
    # SQLite compatible date grouping
    from datetime import datetime
    from sqlalchemy import case, extract
    
    # Get all transactions
    transactions = db.query(Transaction).order_by(Transaction.timestamp.desc()).limit(1000).all()
    
    # Group by month manually for SQLite compatibility
    monthly_data = {}
    for tx in transactions:
        if tx.timestamp:
            month_key = tx.timestamp.strftime("%Y-%m")
            month_name = tx.timestamp.strftime("%b")
            
            if month_key not in monthly_data:
                monthly_data[month_key] = {
                    "month": month_name,
                    "fraudulent": 0,
                    "legitimate": 0,
                    "blocked": 0
                }
            
            if tx.fraud_label:
                monthly_data[month_key]["fraudulent"] += 1
                monthly_data[month_key]["blocked"] += tx.amount or 0
            else:
                monthly_data[month_key]["legitimate"] += 1
    
    # Convert to list and sort by month key
    result = list(monthly_data.values())
    # Get last 6 months if we have data
    if len(result) > 6:
        result = result[:6]
    
    # If no data, return empty array or sample data
    if not result:
        # Return sample structure for empty state
        result = []
    
    return result






# -----------------------------------------------------------
# Run app
# -----------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
