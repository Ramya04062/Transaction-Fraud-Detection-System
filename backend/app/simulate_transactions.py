# app/simulate_transactions.py

import pandas as pd
import requests
import time
import os
from dotenv import load_dotenv
import uuid
import numpy as np

i=11
TXN_COUNT = 15 # change later to 5, 10, 100

load_dotenv()

API_URL = os.getenv("API_URL", "http://localhost:8000/transactions")
DATA_PATH = os.getenv("SIMULATOR_FILE", "./transactions_10000.csv")

# Load data
df = pd.read_csv(DATA_PATH)

# Keep only types used during training
df = df[df["type"].isin(["TRANSFER", "CASH_OUT"])].head(1000)

# Add true_label (rare fraud, for evaluation / feedback loop)
df["true_label"] = np.random.choice([0, 1], size=len(df), p=[0.995, 0.005])

def send_transaction(row):
    payload = {
        # Core identifiers
        "transaction_id": f"TXN-{uuid.uuid4().hex[:12].upper()}",

        # Transaction info
        "transaction_type": row["type"],
        "amount": float(row["amount"]),

        "step": int(row.get("step", 0)),
        
        # Parties
        "sender_id": row.get("nameOrig", "UNKNOWN"),
        "receiver_id": row.get("nameDest", "UNKNOWN"),

        # Paysim numeric fields (MUST match training names)
        "oldbalanceOrg": float(row.get("oldbalanceOrg", 0.0)),
        "newbalanceOrig": float(row.get("newbalanceOrig", 0.0)),
        "oldbalanceDest": float(row.get("oldbalanceDest", 0.0)),
        "newbalanceDest": float(row.get("newbalanceDest", 0.0)),

        # Optional (not used by model)
        "true_label": int(row["true_label"]),
        "raw_payload": row.to_dict(),
    }

    try:
        r = requests.post(API_URL, json=payload, timeout=10)
        if r.status_code == 200:
            j = r.json()
            print(
                f"[OK] txid={payload['transaction_id']} "
                f"score={j['fraud_score']:.4f} "
                f"label={j['fraud_label']}"
                f"source={j['decision_source']} "
            )
        else:
            print("[ERR]", r.status_code, r.text)
    except Exception as e:
        print("EXCEPTION:", e)


# Send transactions
for i in range(TXN_COUNT):
    row = df.iloc[i]
    send_transaction(row)
    time.sleep(0.2)  # avoid hammering API


