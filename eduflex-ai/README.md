# EduFlex AI - Academic Platform

> **AI-Powered Learning Ecosystem for Colleges**

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.11+ (for local development)
- Node.js 18+ (for local development)

### Local Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Database: localhost:5432

### Manual Setup (Without Docker)

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
eduflex-ai/
├── backend/              # FastAPI backend
│   ├── alembic/         # Database migrations
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Config, security
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── services/    # Business logic
│   └── tests/
├── frontend/            # Next.js frontend
│   ├── src/
│   │   ├── app/        # App router pages
│   │   ├── components/ # React components
│   │   └── lib/        # Utilities
│   └── public/
└── docker-compose.yml
```

## 🔧 Development

### Environment Variables

Create `.env` files in backend and frontend directories:

**backend/.env**
```
DATABASE_URL=postgresql://eduflex:eduflex_dev_2024@localhost:5432/eduflex_db
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
```

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Database Migrations

```bash
# Create new migration
cd backend
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Testing

```bash
# Backend tests
cd backend
pytest tests/ -v --cov

# Frontend tests
cd frontend
npm test
```

## 📖 Documentation

- [Architecture](docs/architecture.md)
- [Database Schema](docs/database_schema.md)
- [API Specifications](docs/api_specifications.md)
- [Implementation Plan](docs/implementation_plan.md)

## 🎯 Current Phase: Phase 1 - MVP

**Features:**
- ✅ User authentication (JWT)
- ✅ Question bank management
- ✅ Student practice system
- ✅ MCQ examination engine
- ✅ Automated grading
- ✅ Performance tracking

## 🔐 Default Credentials (Development Only)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eduflex.local | admin123 |
| Faculty | faculty@eduflex.local | faculty123 |
| Student | student@eduflex.local | student123 |

## 📝 License

Proprietary - All rights reserved

## 🤝 Contributing

This is a private project. Contact the team for contribution guidelines.

---

**Built with:** FastAPI • Next.js • PostgreSQL • Redis • Docker
