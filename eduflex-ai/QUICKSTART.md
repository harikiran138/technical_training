# Quick Start Guide

## Start the Application

```bash
cd ~/Desktop/github/technical_training/eduflex-ai

# Create environment files (first time only)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Start all services
docker-compose up -d

# Watch logs
docker-compose logs -f
```

## Access Points
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Test Authentication

### 1. Register a User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "student123",
    "first_name": "Test",
    "last_name": "Student",
    "role": "student"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "student123"
  }'
```

## Stop the Application
```bash
docker-compose down
```

---

For detailed documentation, see [README.md](file:///Users/chepuriharikiran/Desktop/github/technical_training/eduflex-ai/README.md)
