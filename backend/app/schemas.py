from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class TransactionIn(BaseModel):
    transaction_id: Optional[str]  # UUID / TXN-xxx

    sender_id: str                 # FK → users.user_id
    receiver_id: Optional[str]

    step: int
    amount: float
    transaction_type: str          # TRANSFER / CASH_OUT
    channel: Optional[str] = "ONLINE_BANKING"

    raw_payload: Optional[Dict[str, Any]] = None

    # PaySim balance fields
    oldbalanceOrg: Optional[float] = None
    newbalanceOrig: Optional[float] = None
    oldbalanceDest: Optional[float] = None
    newbalanceDest: Optional[float] = None

    true_label: Optional[int] = None



class TransactionDB(BaseModel):
    id: int

    transaction_id: str
    sender_id: str
    receiver_id: Optional[str]

    step: int
    
    
    amount: float
    transaction_type: str
    channel: str


    timestamp: datetime
    raw_payload: Optional[Dict[str, Any]]

    oldbalanceOrg: Optional[float]
    newbalanceOrig: Optional[float]
    oldbalanceDest: Optional[float]
    newbalanceDest: Optional[float]

    true_label: Optional[int]

    fraud_score: Optional[float]
    fraud_label: Optional[bool]
    model_version: Optional[str]
    prediction_time: Optional[datetime]

    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class AdminLoginIn(BaseModel):
    email: str
    password: str

class AdminLoginOut(BaseModel):
    success: bool
    message: str

    
class PredictionOut(BaseModel):
    transaction_id: str
    status: str
    fraud_score: Optional[float] = None
    fraud_label: Optional[bool] = None
    model_version: Optional[str] = None
    prediction_time: Optional[datetime] = None
    decision_source: str

    model_config = {
        "from_attributes": True
    }

