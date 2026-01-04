import os
import joblib
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer, util

load_dotenv()

# =========================
# Paths & Config
# =========================

BASE_DIR = os.getenv(
    "MODEL_DIR",
    os.path.join(os.path.dirname(__file__), "..", "models")
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    os.getenv("MODEL_FILE", "xgb_model.pkl")
)

SCALER_PATH = os.path.join(
    BASE_DIR,
    os.getenv("SCALER_FILE", "scaler.pkl")
)

# =========================
# ML Feature Set
# =========================

EXPECTED_FEATURES = [
    'step',
    'amount',
    'oldbalanceOrg',
    'newbalanceOrig',
    'oldbalanceDest',
    'newbalanceDest',
    'errorBalanceOrig',
    'errorBalanceDest',
    'type_TRANSFER',
]

# =========================
# Confidence Thresholds
# =========================

HIGH_FRAUD_THRESHOLD = 0.9
LOW_FRAUD_THRESHOLD = 0.05
FINAL_DECISION_THRESHOLD = 0.5

# =========================
# MiniLM Config
# =========================

MINILM_MODEL_NAME = "all-MiniLM-L6-v2"

# Example fraud patterns (can grow over time)
KNOWN_FRAUD_TEXTS = [
    "urgent transfer request",
    "customer support asking for money",
    "account verification required immediately",
    "send money to avoid account suspension",
    "emergency fund transfer",
    "lottery winning claim",
    "otp request from unknown person",
]

# =========================
# Model Server
# =========================

class ModelServer:
    def __init__(self,
                 model_path=MODEL_PATH,
                 scaler_path=SCALER_PATH):

        self.model_path = model_path
        self.scaler_path = scaler_path

        self.model = None
        self.scaler = None
        self.version = None

        self.encoder = None
        self.fraud_embeddings = None

        self.load_models()

    # =========================
    # Load Models
    # =========================

    def load_models(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model not found at {self.model_path}")

        if not os.path.exists(self.scaler_path):
            raise FileNotFoundError(f"Scaler not found at {self.scaler_path}")

        self.model = joblib.load(self.model_path)
        self.scaler = joblib.load(self.scaler_path)
        self.version = os.path.basename(self.model_path)

        # Load MiniLM locally (CPU only)
        self.encoder = SentenceTransformer(MINILM_MODEL_NAME)
        self.fraud_embeddings = self.encoder.encode(
            KNOWN_FRAUD_TEXTS,
            convert_to_tensor=True
        )

        print(f"[ModelServer] Loaded ML model: {self.version}")
        print("[ModelServer] Loaded MiniLM encoder locally")

    # =========================
    # ML Prediction
    # =========================

    def predict_proba(self, X_df: pd.DataFrame):
        missing = set(EXPECTED_FEATURES) - set(X_df.columns)
        if missing:
            raise ValueError(f"Missing features: {missing}")

        X_df = X_df[EXPECTED_FEATURES]
        X_scaled = self.scaler.transform(X_df)

        return self.model.predict_proba(X_scaled)

    # =========================
    # MiniLM Similarity
    # =========================

    def llm_similarity_score(self, text: str) -> float:
        """
        Returns semantic similarity score between
        input text and known fraud patterns
        """

        print("LLM_similarity_score: Calculating similarity scores...")
        
        text_embedding = self.encoder.encode(
            text,
            convert_to_tensor=True
        )


        similarity_scores = util.cos_sim(
            text_embedding,
            self.fraud_embeddings
        )

        return float(similarity_scores.max())

    # =========================
    # Ensemble Decision Logic
    # =========================

    def predict_with_uncertainty(self,
                                 X_df: pd.DataFrame,
                                 transaction_text: str = ""):
        """
        Main ensemble prediction method
        """

        proba = self.predict_proba(X_df)
        fraud_prob = float(proba[:, 1][0])

        print(f"[ML] fraud_prob = {fraud_prob:.4f}")

        # -------- High Confidence Decisions --------
        if fraud_prob >= HIGH_FRAUD_THRESHOLD:
            print("[FLOW] ML confident → FRAUD")
            return {
                "decision": "FRAUD",
                "fraud_probability": fraud_prob,
                "decision_source": "ML_CONFIDENT"
            }

        if fraud_prob <= LOW_FRAUD_THRESHOLD:
            print("[FLOW] ML confident → LEGIT")
            return {
                "decision": "LEGIT",
                "fraud_probability": fraud_prob,
                "decision_source": "ML_CONFIDENT"
            }

        # -------- Uncertain Case → MiniLM --------
        print("[FLOW] ML uncertain → invoking MiniLM")
        llm_score = self.llm_similarity_score(transaction_text)
        
        print(f"[MiniLM] similarity_score = {llm_score:.4f}")

        final_score = (0.6 * fraud_prob) + (0.4 * llm_score)
        print(f"[FINAL] combined_score = {final_score:.4f}")

        decision = (
            "FRAUD"
            if final_score >= FINAL_DECISION_THRESHOLD
            else "LEGIT"
        )

        return {
            "decision": decision,
            "fraud_probability": fraud_prob,
            "llm_similarity_score": llm_score,
            "final_score": final_score,
            "decision_source": "ML + MiniLM"
        }
    

