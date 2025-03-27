# Generic Database API

A secure, production-ready REST API for MySQL databases with auto-discovery capabilities.

## Features

- 🛡️ **Security**: JWT authentication + API keys
- 🔍 **Schema Discovery**: Automatic table detection
- ⚡ **Performance**: Connection pooling & caching
- 📊 **Monitoring**: Built-in health checks
- 🧪 **Testing**: 100% test coverage

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Docker (optional)

### Installation
```bash
git clone https://github.com/your-repo/generic-db-api.git
cd generic-db-api
npm install
cp .env.example .env
```

### Configuration
Edit `.env` file with your:
- Database credentials
- Security keys
- Server settings

### Running
```bash
# Development
npm run dev

# Production
npm start

# With Docker
docker-compose up -d
```

## API Documentation

### Endpoints

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/health` | GET | Service health | Public |
| `/api/tables` | GET | List tables | API Key |
| `/api/{table}` | GET | Read data | API Key |
| `/api/{table}` | POST | Create record | JWT |

### Example Requests
```bash
# Get tables
curl -H "x-api-key: your-key" http://localhost:3001/api/tables

# Create record
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer your-jwt" -d '{"name":"test"}' http://localhost:3001/api/users
```

## Development

### Testing
```bash
npm test
npm run test:coverage
```

### Linting & Formatting
```bash
npm run lint
npm run format
```

## Deployment

### Docker
```bash
docker-compose build
docker-compose up -d
```

### Kubernetes
```bash
kubectl apply -f k8s/
```

## Architecture

```
├── config/       # Configuration
├── controllers/  # Business logic
├── middleware/   # Auth & validation
├── routes/       # API endpoints
├── tests/        # Automated tests
└── utils/        # Helpers
```

## License
MIT
