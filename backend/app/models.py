from sqlalchemy import (
    Column,
    BigInteger,
    Float,
    Integer,
    String,
    DateTime,
    Boolean,
    JSON,
    Text,
    ForeignKey,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy import Column, Integer, String, Boolean
from app.db import Base

Base = declarative_base()


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

# =========================
# USERS TABLE
# =========================
class User(Base):
    __tablename__ = "users"

    user_id = Column(String(50), primary_key=True)

    risk_profile = Column(String(20), nullable=True)  # LOW / MEDIUM / HIGH
    profile_notes = Column(Text, nullable=True)
    recent_activity_summary = Column(Text, nullable=True)
    support_ticket_text = Column(Text, nullable=True)

    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    transactions = relationship(
        "Transaction",
        back_populates="sender",
        cascade="all, delete-orphan"
    )
    alerts = relationship(
        "Alert",
        back_populates="user",
        cascade="all, delete-orphan"
    )


# =========================
# TRANSACTIONS TABLE
# =========================
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(BigInteger, primary_key=True, autoincrement=True)

    step = Column(Integer, nullable=False)

    sender_id = Column(
        String(50),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False
    )
    receiver_id = Column(String(50), nullable=True)
    transaction_id = Column(String(50), unique=True, nullable=True)

    amount = Column(Float, nullable=False)
    transaction_type = Column(String(50), nullable=True)
    channel = Column(String(30), nullable=True, server_default="ONLINE_BANKING")

    timestamp = Column(DateTime, server_default=func.now())
    raw_payload = Column(JSON, nullable=True)

    # PaySim balance fields
    oldbalanceOrg = Column(Float, nullable=True)
    newbalanceOrig = Column(Float, nullable=True)
    oldbalanceDest = Column(Float, nullable=True)
    newbalanceDest = Column(Float, nullable=True)

    true_label = Column(Integer, nullable=True)

    # Prediction outputs
    fraud_score = Column(Float, nullable=True)
    fraud_label = Column(Boolean, nullable=True)
    model_version = Column(String(20), nullable=True)
    prediction_time = Column(DateTime, nullable=True)

    status = Column(String(20), nullable=True, server_default="RECEIVED")
    decision_source = Column(String(50), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    sender = relationship("User", back_populates="transactions")
    alerts = relationship("Alert", back_populates="transactions")


# =========================
# ALERTS TABLE
# =========================
class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(BigInteger, primary_key=True, autoincrement=True)
    
    # Foreign key to users only
    user_id = Column(
        String(50),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False
    )
    
    # Just a normal column, no FK
    transaction_ref = Column(BigInteger, ForeignKey("transactions.id"))

    alert_level = Column(String(10), nullable=False)
    alert_time = Column(DateTime, server_default=func.now())
    alert_status = Column(String(20), server_default="OPEN")

    # Relationships
    user = relationship("User", back_populates="alerts")
    transactions = relationship("Transaction", back_populates="alerts")
    # Removed relationship to Transaction


# =========================
# MODEL METRICS TABLE
# =========================
class ModelMetric(Base):
    __tablename__ = "model_metrics"

    model_version = Column(String(20), primary_key=True)
    ml_precision = Column(Float, nullable=True)
    recall = Column(Float, nullable=True)
    f1_score = Column(Float, nullable=True)
    false_positive_rate = Column(Float, nullable=True)
    data_drift_percent = Column(Float, nullable=True)
    evaluation_date = Column(DateTime, server_default=func.now())
