# Propuesta: Audit Logs

## 1. 🎯 Objetivo

Admin ve: quién hizo qué, cuándo y sobre qué recurso.

## 2. 💡 Solución Técnica

### Modelo

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL,
    actor_user_id UUID NOT NULL,
    action VARCHAR(100),
    entity_type VARCHAR(50),
    entity_id UUID,
    metadata JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);
```

### Eventos Consumidos

`UserRegistered`, `WorkspaceCreated`, `ProjectCreated`, `ProjectArchived`, `TaskCreated`, `TaskStatusChanged`

### APIs

| Método | Ruta                    |
| ------ | ----------------------- |
| GET    | `/audit`                |
| GET    | `/audit?entity=project` |
| GET    | `/audit?user={id}`      |
