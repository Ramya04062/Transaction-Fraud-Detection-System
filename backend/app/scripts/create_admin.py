from app.db import SessionLocal
from app.models import Admin
from app.utils.security import hash_password

db = SessionLocal()

existing = db.query(Admin).filter(Admin.email == "admin@fraudx.com").first()
if not existing:
    admin = Admin(
        email="admin@fraudx.com",
        password_hash=hash_password("admin123"),
        is_active=True
    )
    db.add(admin)
    db.commit()
    print("Admin created")
else:
    print("Admin already exists")

db.close()
