import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Получаем URL базы данных из переменных окружения.
# Для локальной разработки используем дефолтную строку подключения PostgreSQL.
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@localhost:5432/gnezdo_db"
)

# Создаем движок (engine). 
# pool_pre_ping=True проверяет живость соединения перед использованием, 
# что спасает от ошибок при разрывах связи с БД.
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)

# Фабрика сессий. autocommit=False и autoflush=False дают нам полный контроль над транзакциями.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Базовый класс, от которого будут наследоваться все наши модели (User, Profile и т.д.)
Base = declarative_base()

# Dependency-функция для FastAPI. 
# Она будет открывать сессию БД при запросе и гарантированно закрывать её после ответа.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()