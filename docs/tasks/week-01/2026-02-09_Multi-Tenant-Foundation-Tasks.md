# Plan de Implementación: Fundación Multi-Tenant

**Estado**: Planificado

## ✅ Checklist de Tareas

### 🏗️ Infraestructura (Dev 1)

- [ ] Crear `docker-compose.yml` con todos los servicios
- [ ] Configurar Keycloak (realm, client, roles)
- [ ] Configurar PostgreSQL x2 (identity-db, organizations-db)
- [ ] Configurar RabbitMQ (exchanges, queues)
- [ ] Configurar API Gateway (Traefik o Kong)
  - [ ] Routing por servicio
  - [ ] Propagación de JWT headers
- [ ] Crear script `./start.sh` para levantar todo

### 🔐 Identity Service (Dev 2)

- [ ] Crear proyecto (FastAPI o NestJS)
- [ ] Configurar PostgreSQL connection
- [ ] Implementar validación JWT de Keycloak
- [ ] Crear usuario interno al primer login
- [ ] Implementar endpoint `GET /me`
- [ ] Emitir evento `UserRegistered` a RabbitMQ
- [ ] Suscribirse a `MemberAddedToWorkspace`

### 🏢 Organizations Service (Dev 3)

- [ ] Crear proyecto (FastAPI o NestJS)
- [ ] Configurar PostgreSQL connection (DB separada)
- [ ] Crear modelo `Workspace`
- [ ] Crear modelo `Membership` (user_id, workspace_id, role)
- [ ] Implementar `POST /workspaces`
- [ ] Implementar `GET /workspaces`
- [ ] Implementar `POST /workspaces/{id}/members`
- [ ] Emitir evento `WorkspaceCreated`
- [ ] Emitir evento `MemberAddedToWorkspace`
- [ ] Suscribirse a `UserRegistered`

### 💻 Frontend (Dev 4)

- [ ] Crear Shell host (React + Module Federation)
- [ ] Implementar login button (redirect Keycloak)
- [ ] Implementar workspace selector
- [ ] Crear remote `organizations-app`
  - [ ] Botón "Crear Workspace"
  - [ ] Lista de workspaces
- [ ] Shell solo renderiza remotes (no lógica de negocio)
- [ ] Configurar routing federado

### 🧪 Validación (QA)

- [ ] **Smoke Test**: Login → Crear workspace → Ver en lista
- [ ] **Test Aislamiento**: Borrar DBs → docker compose up → Todo funciona
- [ ] **Test Resiliencia**: Apagar organizations-service
  - [ ] Login sigue funcionando
  - [ ] `/me` responde
  - [ ] Frontend no crashea (solo error en módulo organizations)

## 🚫 Errores a Evitar

| ❌ Error                                   | ✅ Correcto                      |
| ------------------------------------------ | -------------------------------- |
| Compartir DB entre servicios               | DB separada por servicio         |
| HTTP entre identity y organizations        | Comunicación por eventos         |
| Guardar usuarios en organizations DB       | Solo guardar membership          |
| Frontend llamando directo a microservicios | Frontend → Gateway → Service     |
| Roles globales                             | Roles por workspace              |
| Tenant en JWT                              | Tenant seleccionado por frontend |

## 🏁 Definition of Done (DoD)

1. ✅ `docker compose up` levanta todo sin errores
2. ✅ Login con Keycloak funciona
3. ✅ Crear workspace persiste en DB
4. ✅ Evento `WorkspaceCreated` se publica en RabbitMQ
5. ✅ `/me` devuelve workspaces del usuario
6. ✅ Frontend muestra workspace creado
7. ✅ Apagar un servicio no rompe todo el sistema
