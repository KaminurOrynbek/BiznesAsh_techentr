# BiznesAsh - Full Stack Social Platform

A modern, scalable microservices-based social platform with a professional React frontend and Go backend services.

## Project Overview

BiznesAsh is a complete social platform featuring:
- User authentication and management
- Post creation and sharing
- Comments and likes
- Real-time notifications
- User profiles and interactions

## Architecture

### Frontend
- **React 19** + TypeScript
- **Tailwind CSS** for styling
- **Vite** for fast development
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **Go Microservices**
- **gRPC** for service communication
- **PostgreSQL** for persistence
- **NATS** for event streaming
- **API Gateway** for routing

## Quick Start

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:5173`

For detailed setup, see [FRONTEND_SETUP.md](./FRONTEND_SETUP.md)

### Backend Setup

See individual service README files:
- [APIGateway](/APIGateway)
- [UserService](/UserService)
- [ContentService](/ContentService)
- [NotificationService](/NotificationService)

### Docker Compose (Full Stack)

```bash
docker-compose up
```

This starts:
- Frontend: http://localhost:3001
- API Gateway: http://localhost:8080
- PostgreSQL: localhost:5432
- NATS: localhost:4222

## Project Structure

```
BiznesAsh/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API clients
│   │   ├── context/        # State management
│   │   └── App.tsx
│   ├── package.json
│   └── Dockerfile
│
├── APIGateway/             # Go API Gateway
│   ├── cmd/
│   ├── handler/
│   └── main.go
│
├── UserService/            # User management microservice
│   ├── cmd/
│   ├── internal/
│   └── main.go
│
├── ContentService/         # Posts and comments microservice
│   ├── cmd/
│   ├── internal/
│   └── main.go
│
├── NotificationService/    # Notifications microservice
│   ├── cmd/
│   ├── internal/
│   └── main.go
│
├── docker-compose.yml      # Full stack orchestration
├── go.mod                  # Go modules
└── README.md              # This file
```

## Services

### Frontend Features
- ✅ User authentication (login/register)
- ✅ Post creation and viewing
- ✅ Comments and likes
- ✅ User profiles
- ✅ Notifications
- ✅ Responsive design

### API Gateway
Routes requests to microservices and handles:
- Request validation
- Authentication
- Response transformation

### User Service
Manages:
- User accounts
- Authentication
- Profiles
- User data

### Content Service
Handles:
- Post creation/management
- Comments
- Likes
- Content interactions

### Notification Service
Provides:
- User notifications
- Email notifications
- Notification preferences
- Event subscriptions

## Environment Configuration

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:8080
```

### Backend
See individual service documentation for configuration options.

## Development

### Running Services Individually

```bash
# Frontend
cd frontend && npm run dev

# User Service
cd UserService && go run cmd/user/main.go

# Content Service
cd ContentService && go run cmd/content/main.go

# Notification Service
cd NotificationService && go run cmd/notification/main.go

# API Gateway
cd APIGateway && go run cmd/gateway/main.go
```

### Database Setup

PostgreSQL will be automatically set up via Docker Compose with:
- Database: biznesAsh
- User: postgres
- Password: 0000

### Running Tests

```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd [SERVICE] && go test ./...
```

## API Endpoints

See [FRONTEND_SETUP.md](./FRONTEND_SETUP.md) for complete API documentation.

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS, Vite |
| API Gateway | Go, gRPC |
| Services | Go, PostgreSQL, NATS |
| Database | PostgreSQL 15 |
| Message Queue | NATS |
| Containerization | Docker, Docker Compose |

## Project Features

### User System
- User registration and authentication
- Profile management
- User search and discovery

### Social Features
- Create and share posts
- Like posts
- Comment on posts
- View user profiles

### Notifications
- Real-time notifications
- Email notifications
- Notification preferences
- Read/unread tracking

### UI/UX
- Responsive design for all devices
- Dark mode support (can be added)
- Intuitive navigation
- Form validation
- Error handling

## Dependencies

### Frontend
- react: ^19.2.0
- react-router-dom: ^6.28.2
- axios: ^1.7.7
- tailwindcss: ^3.4.17

### Backend
See go.mod files in respective services

## Contributing

When contributing:
1. Create feature branches from main
2. Follow existing code style
3. Add tests for new functionality
4. Update documentation
5. Submit pull requests

## Performance

- Frontend: Optimized with Vite bundling and tree-shaking
- Backend: Microservices architecture for independent scaling
- Database: PostgreSQL with proper indexing
- Caching: Can be added with Redis

## Security

- JWT token-based authentication
- Password hashing on backend
- Input validation
- CORS protection
- Environment variable configuration

## Monitoring

- Application logs
- Error tracking
- Performance metrics
- Service health checks

## Future Enhancements

- [ ] Real-time chat with WebSockets
- [ ] Media uploads (images/videos)
- [ ] Advanced search and filtering
- [ ] User recommendations
- [ ] Analytics dashboard
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Load testing and optimization

## Support

For issues or questions:
1. Check documentation in respective folders
2. Review API gateway routes
3. Check backend service logs
4. Review browser console for frontend errors

## License

This project is part of the BiznesAsh platform.

## Deployment

### Production Checklist

Frontend:
- [ ] Build optimization verified
- [ ] Environment variables set correctly
- [ ] API endpoint configured for production
- [ ] HTTPS enabled

Backend:
- [ ] Database backups configured
- [ ] Service replicas set up
- [ ] Health checks enabled
- [ ] Monitoring configured

## Contact

For more information about the BiznesAsh platform, contact the development team.
