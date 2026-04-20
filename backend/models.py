from datetime import datetime
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel
import uuid

def generate_id():
    return str(uuid.uuid4())

class User(SQLModel, table=True):
    id: str = Field(default_factory=generate_id, primary_key=True)
    name: Optional[str] = None
    email: Optional[str] = Field(default=None, unique=True, index=True)
    phone: Optional[str] = Field(default=None, unique=True, index=True)
    emailVerified: Optional[datetime] = None
    image: Optional[str] = None
    password: Optional[str] = None
    role: str = Field(default="USER")
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    plates: List["Plate"] = Relationship(back_populates="owner")
    notifications: List["Notification"] = Relationship(back_populates="user")

class Plate(SQLModel, table=True):
    id: str = Field(default_factory=generate_id, primary_key=True)
    number: str = Field(unique=True, index=True)
    displayNumber: str
    country: str = Field(default="UZ")
    brand: Optional[str] = None
    model: Optional[str] = None
    color: Optional[str] = None
    ownerId: str = Field(foreign_key="user.id")
    verifiedStatus: str = Field(default="PENDING")
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    owner: User = Relationship(back_populates="plates")
    messages: List["Message"] = Relationship(back_populates="plate")

class Message(SQLModel, table=True):
    id: str = Field(default_factory=generate_id, primary_key=True)
    content: str
    isQuickMsg: bool = Field(default=False)
    senderName: Optional[str] = Field(default="Anonymous")
    plateId: str = Field(foreign_key="plate.id")
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    isRead: bool = Field(default=False)

    plate: Plate = Relationship(back_populates="messages")

class Notification(SQLModel, table=True):
    id: str = Field(default_factory=generate_id, primary_key=True)
    userId: str = Field(foreign_key="user.id")
    title: str
    body: str
    type: str  # MESSAGE, SYSTEM, VERIFICATION
    isRead: bool = Field(default=False)
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    user: User = Relationship(back_populates="notifications")

class VehiclePhoto(SQLModel, table=True):
    id: str = Field(default_factory=generate_id, primary_key=True)
    url: str
    plateId: str = Field(foreign_key="plate.id")

class VerificationRequest(SQLModel, table=True):
    id: str = Field(default_factory=generate_id, primary_key=True)
    plateId: str = Field(foreign_key="plate.id")
    documentUrl: Optional[str] = None
    status: str = Field(default="PENDING")
    adminNotes: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class OTPCode(SQLModel, table=True):
    id: str = Field(default_factory=generate_id, primary_key=True)
    phone: str = Field(index=True)
    code: str
    expiresAt: datetime
    createdAt: datetime = Field(default_factory=datetime.utcnow)
