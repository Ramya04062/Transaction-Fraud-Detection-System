# app/feature_pipeline.py
import pandas as pd

# Columns exactly as used during training
EXPECTED_FEATURES = [
    'step',             # time step of transaction
    'amount',
    'oldbalanceOrg',
    'newbalanceOrig',
    'oldbalanceDest',
    'newbalanceDest',
    'errorBalanceOrig',
    'errorBalanceDest',
    'type_TRANSFER',    # Only this dummy column
]

ALLOWED_TYPES = ['TRANSFER', 'CASH_OUT']

def build_features_df(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # Rename API field to training schema
    df.rename(columns={"transaction_type": "type"}, inplace=True)

    # Keep only supported types
    df = df[df['type'].isin(ALLOWED_TYPES)]

    # Numeric safety
    numeric_cols = [
        'step',
        'amount',
        'oldbalanceOrg',
        'newbalanceOrig',
        'oldbalanceDest',
        'newbalanceDest'
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0.0)

    # Feature engineering
    df['errorBalanceOrig'] = df['newbalanceOrig'] - (df['oldbalanceOrg'] - df['amount'])
    df['errorBalanceDest'] = df['newbalanceDest'] - (df['oldbalanceDest'] + df['amount'])

    # One-hot exactly like training
    df['type_TRANSFER'] = (df['type'] == 'TRANSFER').astype(int)

    # Guarantee all expected columns
    for col in EXPECTED_FEATURES:
        if col not in df.columns:
            df[col] = 0.0

    # Return in exact training order
    return df[EXPECTED_FEATURES]


