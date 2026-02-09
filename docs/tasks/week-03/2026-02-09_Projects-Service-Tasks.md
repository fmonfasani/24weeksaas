# Plan de Implementación: Servicio de Projects

**Estado**: Planificado

## ✅ Checklist de Tareas

### 🏗️ Infraestructura (Dev 1)

- [ ] Crear nueva DB PostgreSQL para projects
- [ ] Configurar colas RabbitMQ (topics por dominio)
- [ ] Agregar projects-service a docker-compose
- [ ] Configurar health checks
- [ ] Agregar projects-bff al gateway routing

### 🔧 Projects Service (Dev 2)

- [ ] Crear proyecto backend
- [ ] Implementar modelo `Project`
- [ ] Implementar Tenant Middleware
- [ ] Implementar Outbox Pattern
  - [ ] Tabla `outbox_events`
  - [ ] Worker de publicación
- [ ] Implementar endpoints CRUD
- [ ] Emitir eventos `ProjectCreated`, `ProjectArchived`

### 🌐 Projects BFF (Dev 3)

- [ ] Crear BFF service
- [ ] Implementar validación de JWT
- [ ] Implementar validación de workspace
- [ ] Implementar rate limiting
- [ ] Proxy a projects-service
- [ ] Manejo de errores resiliente

### 💻 Frontend (Dev 4)

- [ ] Crear remote `projects-app`
- [ ] Configurar Module Federation
- [ ] Implementar pantalla de proyectos
  - [ ] Botón "New Project"
  - [ ] Lista de proyectos
  - [ ] Botón "Archive"
- [ ] Configurar routing `/projects`
- [ ] Manejo de errores si BFF cae

### 🧪 Validación (QA)

- [ ] Desplegar projects sin tocar identity
- [ ] Borrar DB projects no afecta login
- [ ] Apagar projects-service no rompe organizations
- [ ] Test Outbox: RabbitMQ down → proyecto persiste → RabbitMQ up → evento publicado

## 🚫 Errores a Evitar

| ❌ Error                            | ✅ Correcto               |
| ----------------------------------- | ------------------------- |
| FK a tabla de usuarios              | Solo guardar IDs          |
| HTTP síncrono a identity-service    | Comunicación por eventos  |
| Eventos fuera de transacción        | Outbox Pattern            |
| Shared database                     | DB aislada                |
| Shell importando código de projects | Module Federation remotes |

## 🏁 Definition of Done (DoD)

1. ✅ Projects se despliega independientemente
2. ✅ Crear proyecto aislado por workspace
3. ✅ Outbox funciona con RabbitMQ down
4. ✅ Remote carga vía Module Federation
5. ✅ Apagar projects no rompe el sistema
