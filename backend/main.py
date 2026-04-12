from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
# Импортируем наши роутеры (убедись, что файлы auth.py и т.д. лежат в папке routers)
from routers import auth, profiles, swipes 

# Создаем таблицы в базе данных при запуске
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Гнездо API")

# Настройка CORS (ОБЯЗАТЕЛЬНО для работы с React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Разрешаем запросы с любого адреса (для MVP)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры с правильными префиксами
app.include_router(auth.router, prefix="/api/auth", tags=["Авторизация"])
app.include_router(profiles.router, prefix="/api/profile", tags=["Анкеты"])
app.include_router(swipes.router, prefix="/api/swipes", tags=["Свайпы"])

@app.get("/health")
def health_check():
    return "OK"