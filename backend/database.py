# backend/database.py

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# ✅ Load .env
load_dotenv()

# ✅ Get MySQL variables
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_PORT = os.getenv("MYSQL_PORT")
MYSQL_DB = os.getenv("MYSQL_DB")

# ✅ Construct the DATABASE_URL
DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"

# ✅ Validate
if not all([MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT, MYSQL_DB]):
    raise ValueError("❌ Missing MySQL environment variables in .env file")

# ✅ Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ✅ Define Quiz table
class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(255))
    title = Column(String(255))
    scraped_content = Column(LONGTEXT)
    full_quiz_data = Column(LONGTEXT)
    date_generated = Column(DateTime, default=datetime.utcnow)

def init_db():
    print("✅ Initializing database...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database ready!")
