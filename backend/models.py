from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    # Вот это поле мы забыли!
    password = Column(String, nullable=False) 
    
    is_active = Column(Boolean, default=True)
    is_premium = Column(Boolean, default=False)
    trial_starts_at = Column(DateTime, nullable=True)
    
    # Связь с профилем
    profile = relationship("Profile", back_populates="owner", uselist=False)

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    first_name = Column(String, nullable=False)
    age = Column(Integer)
    gender = Column(String)
    city = Column(String)
    university = Column(String)
    faculty = Column(String)
    course = Column(String)
    housing_role = Column(String)

    # Храним сложные фильтры в формате JSON для гибкости MVP
    hard_filters = Column(JSON)
    rhythm_filters = Column(JSON)
    lifestyle_filters = Column(JSON)
    character_filters = Column(JSON)

    rent_duration = Column(String)
    budget = Column(String)
    district = Column(String)
    hobbies = Column(Text)
    ideal_format = Column(Text)
    about_me = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="profile")

class Swipe(Base):
    __tablename__ = "swipes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    target_id = Column(Integer, ForeignKey("users.id"))
    is_like = Column(Boolean)
    created_at = Column(DateTime, default=datetime.utcnow)