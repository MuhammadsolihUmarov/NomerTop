from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    password: str

class OTPRequest(BaseModel):
    phone: str

class OTPLogin(BaseModel):
    phone: str
    code: str

class Token(BaseModel):
    access_token: str
    token_type: str

class PlateBase(BaseModel):
    number: str
    country: str = "UZ"
    brand: Optional[str] = None
    model: Optional[str] = None
    color: Optional[str] = None

class PlateCreate(PlateBase):
    pass

class MessageCreate(BaseModel):
    content: str
    plateNumber: str
    isQuickMsg: bool = False
    senderName: Optional[str] = "Anonymous"

class MessageResponse(BaseModel):
    id: str
    content: str
    createdAt: datetime
    isRead: bool
