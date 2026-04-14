from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine, SessionLocal
import auth_utils

app = FastAPI(title="Гнездо API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Авторизация"])
app.include_router(profiles.router, prefix="/api/profile", tags=["Анкеты"])
app.include_router(swipes.router, prefix="/api/swipes", tags=["Свайпы"])

@app.on_event("startup")
def create_tables_and_test_user():
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        test_user = db.query(models.User).filter(models.User.email == "1").first()
        if not test_user:
            hashed_password = auth_utils.get_password_hash("1")
            test_user = models.User(
                email="1",
                password=hashed_password,
                is_active=True,
                is_premium=True
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
            
            test_profile = models.Profile(
                user_id=test_user.id,
                first_name="Тестовый",
                age=25,
                gender="мужчина",
                city="Москва",
                university="МГУ",
                faculty="Филологический",
                course="3",
                housing_role="ищу соседа для совместной аренды",
                hard_filters={"co_living_gender": "не имеет значения", "alcohol": "иногда", "smoking": "не курю, но не против", "parties": "нормально отношусь", "guests": "иногда"},
                rhythm_filters={"schedule": "гибкий режим", "sleep_time": "23:00–01:00", "wake_time": "7:00–9:00", "noise": "умеренно", "cleanliness": "поддерживаю чистоту", "chores": "скорее да"},
                lifestyle_filters={"home_activities": [], "free_time": [], "has_pets": "нет", "pet_attitude": "люблю"},
                character_filters={"self_traits": [], "roommate_traits": []},
                rent_duration="6–12 месяцев",
                budget="30–40 тыс ₽",
                district="ЦАО",
                hobbies="Спорт, музыка, кино",
                ideal_format="Ищу спокойного соседа, который любит чистоту и уважает личное пространство.",
                about_me="Я студент, учусь в МГУ. Люблю спорт, музыку и хорошие фильмы. Ищу соседа для совместной аренды квартиры."
            )
            db.add(test_profile)
            db.commit()
            print("Тестовый аккаунт создан: 1 / 1")
    finally:
        db.close()

@app.get("/health")
def health_check():
    return "OK"
