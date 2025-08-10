from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

from models import Base, User, Upload

load_dotenv()

DATABASE_URL = "postgresql://postgres:12345@localhost/secure_photo_app"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

# Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- CRUD functions ---
def add_user(email: str, name: str):
    db = SessionLocal()
    try:
        user = User(email=email, name=name)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    finally:
        db.close()

def get_user_by_email(email: str):
    db = SessionLocal()
    try:
        return db.query(User).filter(User.email == email).first()
    finally:
        db.close()

def add_upload(user_id: int, filename: str, file_url: str):
    db = SessionLocal()
    try:
        upload = Upload(user_id=user_id, filename=filename, file_url=file_url)
        db.add(upload)
        db.commit()
        db.refresh(upload)
        return upload
    finally:
        db.close()

def get_uploads_by_user(user_id: int):
    db = SessionLocal()
    try:
        return db.query(Upload).filter(Upload.user_id == user_id).all()
    finally:
        db.close()
