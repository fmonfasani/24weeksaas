# SaaS 24 Weeks - Week 01 Implementation

## Project Structure

```
.
├── services/
│   ├── identity/       # Identity Service (NestJS)
│   └── organizations/  # Organizations Service (NestJS)
├── apps/
│   └── shell/         # Frontend Shell (React + Vite)
├── infra/
│   ├── keycloak/      # Keycloak config
│   └── gateway/       # API Gateway config
├── docker-compose.yml
└── README.md
```

## Stack

- Backend: NestJS + TypeScript
- Frontend: React + Vite + Module Federation
- Auth: Keycloak
- DB: PostgreSQL
- Broker: RabbitMQ
- Gateway: Traefik
