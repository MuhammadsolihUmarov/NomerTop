from sqlmodel import create_engine, Session, SQLModel
import os
from dotenv import load_dotenv

load_dotenv()

# We'll use the same sqlite database as Prisma for now to keep data parity
# Or we can use a new one if preferred.
# Prisma path is ../prisma/dev.db relative to this file
sqlite_url = "sqlite:///../prisma/dev.db"

engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def get_session():
    with Session(engine) as session:
        yield session

def init_db():
    # This will create tables if they don't exist
    # Note: If prisma already created them, SQLModel will just use them
    # But we need to make sure models match exactly.
    SQLModel.metadata.create_all(engine)
