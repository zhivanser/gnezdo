from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# --- Схемы для Пользователя ---

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool = True
    is_premium: bool = False
    trial_starts_at: Optional[datetime] = None

    class Config:
        from_attributes = True # Позволяет Pydantic работать с моделями SQLAlchemy

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Схемы для Анкеты (те самые 7 блоков) ---


class HardFilters(BaseModel):
    co_living_gender: str
    alcohol: str
    smoking: str
    parties: str
    guests: str

class RhythmFilters(BaseModel):
    schedule: str
    sleep_time: str
    wake_time: str
    noise: str
    cleanliness: str
    chores: str

class LifestyleFilters(BaseModel):
    home_activities: List[str]
    free_time: List[str]
    has_pets: str
    pet_attitude: str

class CharacterTraits(BaseModel):
    self_traits: List[str]
    roommate_traits: List[str]

class ProfileBase(BaseModel):
    first_name: str
    age: int
    gender: str
    city: str
    university: str
    faculty: str
    course: str
    housing_role: str
    
    # Вложенные фильтры
    hard_filters: HardFilters
    rhythm_filters: RhythmFilters
    lifestyle_filters: LifestyleFilters
    character_filters: CharacterTraits
    
    rent_duration: str
    budget: str
    district: str
    hobbies: str
    ideal_format: str
    about_me: str

class ProfileCreateUpdate(ProfileBase):
    pass

class Profile(ProfileBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Схемы для Свайпов ---

class SwipeCreate(BaseModel):
    target_id: int
    is_like: bool


class Swipe(SwipeCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Схемы для Мэтчей ---

class MatchResponse(BaseModel):
    user_id: int
    email: str
    first_name: str
    city: str
    university: str
    matched_at: Optional[str] = None