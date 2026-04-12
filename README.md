# Гнездо - Сервис поиска сожителей

## Быстрый старт

### 1. Запуск через Docker Compose (рекомендуется)

```bash
docker-compose up --build
```

После запуска:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 2. Локальная разработка

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Переменные окружения

### Backend (.env)
- `DATABASE_URL` - URL базы данных PostgreSQL
- `SECRET_KEY` - Секретный ключ для JWT
- `ALGORITHM` - Алгоритм шифрования (HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Время жизни токена

## API Endpoints

### Авторизация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Текущий пользователь

### Анкеты
- `POST /api/profile` - Создать/обновить анкету
- `GET /api/profile/me` - Моя анкета
- `GET /api/profile/feed` - Лента анкет

### Свайпы
- `POST /api/swipes` - Сделать свайп
