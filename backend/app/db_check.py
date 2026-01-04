from sqlalchemy import text
from app.db import engine

try:
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
        print("✅ Database connection SUCCESS")
        print("👉 Connected to:", engine.url)
except Exception as e:
    print("❌ Database connection FAILED")
    print(e)
