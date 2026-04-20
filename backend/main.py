from fastapi import FastAPI, Depends, HTTPException, status, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import List, Optional
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
import random
from datetime import datetime, timedelta

from database import engine, get_session, init_db
from models import User, Plate, Message, Notification, OTPCode
from schemas import UserCreate, UserLogin, Token, PlateCreate, MessageCreate, OTPRequest, OTPLogin
from auth import verify_password, get_password_hash, create_access_token, SECRET_KEY, ALGORITHM

app = FastAPI(title="NomerTop API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme), 
    x_user_id: Optional[str] = Header(None),
    session: Session = Depends(get_session)
):
    # If X-User-ID is provided, we trust it (for internal server-to-server calls)
    if x_user_id:
        user = session.exec(select(User).where(User.id == x_user_id)).first()
        if user:
            return user

    # Otherwise, check for JWT
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = session.exec(select(User).where(User.id == user_id)).first()
    if user is None:
        raise credentials_exception
    return user

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def read_root():
    return {"message": "NomerTop API is running"}

# --- AUTH ENDPOINTS ---

@app.post("/auth/register", response_model=Token)
def register(user_data: UserCreate, session: Session = Depends(get_session)):
    if not user_data.email and not user_data.phone:
        raise HTTPException(status_code=400, detail="Email or phone is required")

    if user_data.email:
        existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    if user_data.phone:
        existing_phone = session.exec(select(User).where(User.phone == user_data.phone)).first()
        if existing_phone:
            raise HTTPException(status_code=400, detail="Phone number already registered")
    
    db_user = User(
        email=user_data.email,
        phone=user_data.phone,
        name=user_data.name,
        password=get_password_hash(user_data.password)
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    access_token = create_access_token(data={"sub": db_user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login", response_model=Token)
def login(user_data: UserLogin, session: Session = Depends(get_session)):
    user = None
    if user_data.email:
        user = session.exec(select(User).where(User.email == user_data.email)).first()
    elif user_data.phone:
        user = session.exec(select(User).where(User.phone == user_data.phone)).first()
    
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect identifiers or password")
    
    access_token = create_access_token(data={"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/otp/send")
def send_otp(data: OTPRequest, session: Session = Depends(get_session)):
    # Use static code as per user request
    code = "123456"
    expires = datetime.utcnow() + timedelta(minutes=5)
    
    # Store in DB
    db_otp = OTPCode(phone=data.phone, code=code, expiresAt=expires)
    session.add(db_otp)
    session.commit()
    
    # FOR DEVELOPMENT: Print to console and return in response (REMOVE IN PRODUCTION)
    print(f"DEBUG: OTP for {data.phone} is {code}")
    return {"status": "success", "message": "OTP sent", "debug_code": code}

@app.post("/auth/otp/login", response_model=Token)
def login_with_otp(data: OTPLogin, session: Session = Depends(get_session)):
    # Check OTP
    otp = session.exec(
        select(OTPCode)
        .where(OTPCode.phone == data.phone)
        .where(OTPCode.code == data.code)
        .where(OTPCode.expiresAt > datetime.utcnow())
        .order_by(OTPCode.createdAt.desc())
    ).first()
    
    if not otp:
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")
    
    # Find user by phone
    user = session.exec(select(User).where(User.phone == data.phone)).first()
    if not user:
        # Auto-register if user doesn't exist?
        # For now, let's just create a basic user
        user = User(phone=data.phone, name=f"User {data.phone[-4:]}")
        session.add(user)
        session.commit()
        session.refresh(user)
    
    # Remove the OTP code after use
    session.delete(otp)
    session.commit()
    
    access_token = create_access_token(data={"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

# --- PLATE ENDPOINTS ---

@app.get("/plates/{number}")
def get_plate(number: str, session: Session = Depends(get_session)):
    plate = session.exec(select(Plate).where(Plate.number == number)).first()
    if not plate:
        raise HTTPException(status_code=404, detail="Plate not found")
    
    # Return plate with owner info
    return {
        "id": plate.id,
        "number": plate.number,
        "displayNumber": plate.displayNumber,
        "country": plate.country,
        "brand": plate.brand,
        "model": plate.model,
        "color": plate.color,
        "owner": {"name": plate.owner.name} if plate.owner else None
    }

@app.post("/plates")
def register_plate(plate_data: PlateCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    existing = session.exec(select(Plate).where(Plate.number == plate_data.number)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Plate already registered")
    
    # Simple display formatting logic (simplified for now)
    display = f"{plate_data.number[:2]} | {plate_data.number[2:]}"
    
    db_plate = Plate(
        number=plate_data.number,
        displayNumber=display,
        country=plate_data.country,
        brand=plate_data.brand,
        model=plate_data.model,
        color=plate_data.color,
        ownerId=current_user.id
    )
    session.add(db_plate)
    session.commit()
    session.refresh(db_plate)
    return db_plate

# --- MESSAGE ENDPOINTS ---

@app.post("/messages")
def send_message(msg_data: MessageCreate, session: Session = Depends(get_session)):
    plate = session.exec(select(Plate).where(Plate.number == msg_data.plateNumber)).first()
    if not plate:
        raise HTTPException(status_code=404, detail="Plate not found")
    
    db_msg = Message(
        content=msg_data.content,
        isQuickMsg=msg_data.isQuickMsg,
        senderName=msg_data.senderName,
        plateId=plate.id
    )
    session.add(db_msg)
    
    # Create notification for owner
    db_notif = Notification(
        userId=plate.ownerId,
        title="New Message for your vehicle",
        body=msg_data.content[:50],
        type="MESSAGE"
    )
    session.add(db_notif)
    
    session.commit()
    return {"status": "success"}

# --- USER DATA ENDPOINTS ---

@app.get("/users/me/plates")
def get_my_plates(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    plates = session.exec(select(Plate).where(Plate.ownerId == current_user.id).order_by(Plate.createdAt.desc())).all()
    return plates

@app.get("/users/me/notifications")
def get_my_notifications(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    notifications = session.exec(select(Notification).where(Notification.userId == current_user.id).order_by(Notification.createdAt.desc())).all()
    return notifications

@app.get("/users/me")
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

if __name__ == "__main__":

    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

