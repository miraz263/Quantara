import hashlib
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, UserResponse, TokenResponse

router = APIRouter()


def hash_pwd(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


@router.post("/register", response_model=UserResponse)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="A user with this email address already exists."
        )
    user = User(
        id=str(uuid.uuid4()),
        email=user_in.email,
        hashed_password=hash_pwd(user_in.password),
        full_name=user_in.full_name,
        role="user"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or user.hashed_password != hash_pwd(login_in.password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email address or password."
        )
    token = f"quantara_token_{user.id}"
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }
