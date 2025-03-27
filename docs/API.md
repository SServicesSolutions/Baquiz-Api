# API Reference Documentation

## Authentication
All endpoints require:
```http
x-api-key: your-api-key
```

Protected endpoints require:
```http
Authorization: Bearer your.jwt.token
```

## Base URL
`https://api.yourdomain.com/v1`

## Endpoints

### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-03-27T23:30:00Z",
  "uptime": 12345.67,
  "database": "connected"
}
```

### List Tables
```http
GET /tables
```

Response:
```json
["users", "products", "orders"]
```

### Get Table Data
```http
GET /{table}?page=1&limit=50
```

Response:
```json
[
  {"id": 1, "name": "Item 1"},
  {"id": 2, "name": "Item 2"}
]
```

### Create Record
```http
POST /{table}
Content-Type: application/json

{
  "name": "New Item",
  "value": 100
}
```

Response:
```json
{
  "id": 3,
  "name": "New Item",
  "value": 100
}
```

## Error Responses
```json
{
  "error": "Unauthorized",
  "message": "Invalid API key",
  "statusCode": 401
}
```

## Rate Limits
- 100 requests per 15 minutes
- Additional headers returned:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
