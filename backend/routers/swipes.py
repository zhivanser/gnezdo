from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database
from .auth import get_current_user

router = APIRouter()

@router.post("/")
def create_swipe(
    swipe: schemas.SwipeCreate, 
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(database.get_db)
):
    new_swipe = models.Swipe(
        user_id=current_user.id,
        target_id=swipe.target_id,
        is_like=swipe.is_like
    )
    db.add(new_swipe)
    db.commit()

    if swipe.is_like:
        reverse_swipe = db.query(models.Swipe).filter(
            models.Swipe.user_id == swipe.target_id,
            models.Swipe.target_id == current_user.id,
            models.Swipe.is_like == True
        ).first()

        if reverse_swipe:
            target_user = db.query(models.User).filter(models.User.id == swipe.target_id).first()
            return {
                "mutual_match": True,
                "contact": target_user.email,
                "message": "Поздравляем! Это взаимно."
            }

    return {"mutual_match": False}

@router.get("/matches", response_model=List[schemas.MatchResponse])
def get_matches(
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(database.get_db)
):
    my_likes = db.query(models.Swipe).filter(
        models.Swipe.user_id == current_user.id,
        models.Swipe.is_like == True
    ).all()
    
    matches = []
    for like in my_likes:
        reverse_like = db.query(models.Swipe).filter(
            models.Swipe.user_id == like.target_id,
            models.Swipe.target_id == current_user.id,
            models.Swipe.is_like == True
        ).first()
        
        if reverse_like:
            target_user = db.query(models.User).filter(models.User.id == like.target_id).first()
            target_profile = db.query(models.Profile).filter(models.Profile.user_id == like.target_id).first()
            
            matches.append({
                "user_id": target_user.id,
                "email": target_user.email,
                "first_name": target_profile.first_name if target_profile else "Неизвестно",
                "city": target_profile.city if target_profile else "",
                "university": target_profile.university if target_profile else "",
                "matched_at": like.created_at.isoformat() if like.created_at else None
            })
    
    return matches
