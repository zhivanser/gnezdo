from sqlalchemy.orm import Session
from sqlalchemy import and_
import models
import schemas

# Матрица весов для мягких (свободных) фильтров. 
# Можно корректировать для улучшения алгоритма.
SOFT_WEIGHTS = {
    "schedule": 3.0,     # Режим дня
    "sleep_time": 2.0,   # Время отхода ко сну
    "wake_time": 2.0,    # Время пробуждения
    "noise": 2.5,        # Отношение к шуму
    "cleanliness": 2.5,  # Отношение к чистоте
    "chores": 1.5        # Готовность делить обязанности
}

def calculate_hard_compatibility(u_hard: dict, c_hard: dict, u_gender: str, c_gender: str) -> float:
    """
    Расчет совпадения по жестким параметрам.
    По ТЗ совпадение должно быть не менее 95%.
    """
    total_criteria = 4 # Пол, алкоголь, курение, вечеринки
    score = 0
    
    # 1. Проверка пола соседа (критический параметр)
    # Если пользователь ищет только свой пол, а кандидат другого пола - сразу отказ.
    u_pref_gender = u_hard.get("co_living_gender")
    c_pref_gender = c_hard.get("co_living_gender")
    
    if u_pref_gender != "не имеет значения" and u_pref_gender != c_gender:
        return 0.0
    if c_pref_gender != "не имеет значения" and c_pref_gender != u_gender:
        return 0.0
    score += 1 # Пол подходит друг другу

    # 2. Отношение к курению, алкоголю и вечеринкам
    # Для получения >= 95% при 4 критериях, они должны совпасть почти идеально.
    if u_hard.get("alcohol") == c_hard.get("alcohol"): score += 1
    if u_hard.get("smoking") == c_hard.get("smoking"): score += 1
    if u_hard.get("parties") == c_hard.get("parties"): score += 1

    return (score / total_criteria) * 100


def calculate_soft_compatibility(u_soft: dict, c_soft: dict) -> float:
    """
    Расчет совпадения по свободным параметрам (режим, шум, чистота).
    Если менее 65%, анкета не попадает в ленту.
    """
    total_weight = sum(SOFT_WEIGHTS.values())
    earned_score = 0.0
    
    for key, weight in SOFT_WEIGHTS.items():
        val1 = u_soft.get(key)
        val2 = c_soft.get(key)
        
        if val1 == val2:
            earned_score += weight * 1.0  # Полное совпадение
        else:
            # Даем частичный балл (0.3), если ответы не совпали, 
            # чтобы алгоритм не был слишком жестоким. 
            # В будущем здесь можно прописать сложную матрицу (например, "сова" и "до 23:00" = 0 баллов)
            earned_score += weight * 0.3
            
    return (earned_score / total_weight) * 100


def get_candidates_for_user(current_user: models.User, db: Session) -> list:
    """
    Формирует ленту кандидатов с учетом роли, фильтров и прошлых свайпов.
    """
    user_profile = current_user.profile
    
    # 1. Определяем противоположную роль
    # Типы ролей строго зафиксированы [cite: 38, 39]
    target_role = "уже снимаю квартиру и ищу соседа" if user_profile.housing_role == "ищу соседа для совместной аренды" else "ищу соседа для совместной аренды"
    
    # 2. Получаем ID тех, кого пользователь уже свайпнул (чтобы не показывать их снова)
    swiped_ids = [
        swipe.target_id 
        for swipe in db.query(models.Swipe).filter(models.Swipe.swiper_id == current_user.id).all()
    ]
    swiped_ids.append(current_user.id) # Исключаем самого себя
    
    # 3. Достаем кандидатов нужной роли из БД
    candidates = db.query(models.Profile).filter(
        and_(
            models.Profile.housing_role == target_role,
            models.Profile.user_id.not_in(swiped_ids)
        )
    ).all()
    
    feed = []
    
    for candidate in candidates:
        # Считаем жесткие фильтры
        hard_score = calculate_hard_compatibility(
            user_profile.hard_filters, candidate.hard_filters,
            user_profile.gender, candidate.gender
        )
        if hard_score < 95.0: # 
            continue
            
        # Считаем мягкие фильтры
        soft_score = calculate_soft_compatibility(
            user_profile.rhythm_filters, candidate.rhythm_filters
        )
        if soft_score < 65.0: # 
            continue
            
        # Итоговый процент совместимости (вес: 40% жесткие, 60% мягкие)
        final_match_percent = round((hard_score * 0.4) + (soft_score * 0.6))
        
        feed.append({
            "profile_id": candidate.id,
            "user_id": candidate.user_id,
            "first_name": candidate.first_name,
            "age": candidate.age,
            "university": candidate.university,
            "course": candidate.course,
            "photo_url": candidate.photo_url,
            "match_percent": final_match_percent,
            "hobbies": candidate.hobbies,
            "about_me": candidate.about_me
        })
        
    # Сортируем выдачу по убыванию процента совместимости 
    feed.sort(key=lambda x: x["match_percent"], reverse=True)
    
    return feed


def handle_swipe_and_check_match(user_id: int, target_id: int, is_like: bool, db: Session) -> dict:
    """
    Сохраняет свайп. Если это лайк, проверяет взаимность. 
    Отдает контакты только при мэтче[cite: 11].
    """
    # 1. Записываем свайп
    new_swipe = models.Swipe(
        swiper_id=user_id,
        target_id=target_id,
        is_like=is_like
    )
    db.add(new_swipe)
    db.commit()

    # 2. Если не понравился - мэтча точно не будет
    if not is_like:
        return {"mutual_match": False}

    # 3. Если лайк, ищем встречный лайк от таргета
    mutual_swipe = db.query(models.Swipe).filter(
        and_(
            models.Swipe.swiper_id == target_id,
            models.Swipe.target_id == user_id,
            models.Swipe.is_like == True
        )
    ).first()

    if mutual_swipe:
        # Взаимная симпатия! Создаем запись о мэтче
        new_match = models.Match(user1_id=user_id, user2_id=target_id)
        db.add(new_match)
        db.commit()

        # Достаем контакты целевого пользователя [cite: 10, 11]
        target_user = db.query(models.User).filter(models.User.id == target_id).first()
        target_profile = db.query(models.Profile).filter(models.Profile.user_id == target_id).first()

        return {
            "mutual_match": True,
            "contact": target_user.tg_username or target_user.phone or "Контакт скрыт",
            "message": f"У вас мэтч с {target_profile.first_name}! Теперь предстоит встретиться и проверить мэтч." # [cite: 181]
        }

    return {"mutual_match": False}