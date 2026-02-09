# Análisis: Fundación del Sistema Multi-Tenant

## 1. 📊 Descripción del Problema

- **Contexto**: Primera semana del desarrollo SaaS. Se necesita crear la columna vertebral del sistema: identidad, tenants, gateway y frontend distribuido.
- **Síntomas**: No existe infraestructura base. Sin autenticación, sin workspaces, sin comunicación entre servicios.
- **Impacto**: **Bloqueante** - Sin esto, todo el sistema carece de base.

## 2. 🕵️ Diagnóstico

### Causa Raíz

El SaaS multi-tenant requiere una arquitectura que resuelva desde el inicio:

1. **Autenticación externa** - Usuarios NO se guardan en nuestra DB
2. **Separación de tenants** - Datos aislados por workspace
3. **Propagación de identidad** - Context fluye entre microservicios
4. **Primer evento del sistema** - Base para event-driven architecture

### Arquitectura Objetivo

```
Browser → Shell → Gateway → identity-service → organizations-service → event bus
```

### Slices Involucrados

| Slice          | Tipo     | Descripción                        |
| -------------- | -------- | ---------------------------------- |
| Identity       | Backend  | Autenticación, federación Keycloak |
| Organizations  | Backend  | Gestión de workspaces/tenants      |
| API Gateway    | Infra    | Routing, propagación JWT           |
| Frontend Shell | Frontend | Host Module Federation             |

## 3. 🔗 Referencias

- Keycloak: https://www.keycloak.org/documentation
- Module Federation: https://webpack.js.org/concepts/module-federation/
- RabbitMQ: https://www.rabbitmq.com/documentation.html
