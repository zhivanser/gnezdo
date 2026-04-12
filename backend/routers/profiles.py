from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas, database
from .auth import get_current_user
from typing import List

router = APIRouter()

@router.post("/", response_model=schemas.Profile)
def create_or_update_profile(
    profile_data: schemas.ProfileCreateUpdate, 
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(database.get_db)
):
    # Ищем, есть ли уже профиль у этого юзера
    db_profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    
    # Преобразуем Pydantic-модель в словарь для SQLAlchemy
    # Вложенные модели (hard_filters и др.) сохранятся как JSON-словари
    profile_dict = profile_data.model_dump()
    
    if db_profile:
        # Обновляем существующий
        for key, value in profile_dict.items():
            setattr(db_profile, key, value)
    else:
        # Создаем новый
        db_profile = models.Profile(**profile_dict, user_id=current_user.id)
        db.add(db_profile)
    
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.get("/me", response_model=schemas.Profile)
def get_my_profile(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Профиль не найден")
    return profile

@router.get("/feed", response_model=List[schemas.Profile])
def get_feed(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    my_profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not my_profile:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Сначала заполни анкету")

    # Базовая логика: ищем тех, кто ищет "противоположную" роль
    query = db.query(models.Profile).filter(models.Profile.user_id != current_user.id)
    
    if my_profile.housing_role == "ищу соседа для совместной аренды":
        query = query.filter(models.Profile.housing_role == "уже снимаю квартиру и ищу соседа")
    else:
        query = query.filter(models.Profile.housing_role == "ищу соседа для совместной аренды")

    profiles = query.all()
    return profiles
