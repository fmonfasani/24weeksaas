# Propuesta: Servicio de Projects

## 1. 🎯 Objetivo

Dentro de un workspace el usuario puede:

- Crear proyectos
- Listarlos
- Verlos solo en ese workspace

**Validación:** Crear proyecto "Website Redesign" en ACME → Cambiar a Globex → No debe existir.

## 2. 💡 Solución Técnica

### Modelo de Datos

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL,  -- INDEXED
    name VARCHAR(255) NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    archived BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_projects_workspace ON projects(workspace_id);
```

> ⚠️ NO hay FK hacia users ni organizations. Solo IDs.

### APIs

| Método | Ruta                     | Descripción                    |
| ------ | ------------------------ | ------------------------------ |
| POST   | `/projects`              | Crear proyecto                 |
| GET    | `/projects`              | Listar proyectos del workspace |
| GET    | `/projects/{id}`         | Detalle de proyecto            |
| PATCH  | `/projects/{id}/archive` | Archivar proyecto              |

**Todas requieren header `X-Workspace-Id`**

### Eventos (Outbox Pattern)

| Evento            | Payload                                     | Consumidores                             |
| ----------------- | ------------------------------------------- | ---------------------------------------- |
| `ProjectCreated`  | `{projectId, workspaceId, name, createdBy}` | audit, notifications, analytics, billing |
| `ProjectArchived` | `{projectId, workspaceId}`                  | tasks (bloquear), audit                  |

### Outbox Pattern (Obligatorio)

```python
# Dentro de la misma transacción:
with db.transaction():
    project = Project.create(name, workspace_id)
    outbox_events.insert(event_type="ProjectCreated", payload={...})

# Worker separado publica a RabbitMQ
```

Si publicas directamente al broker → NO aceptado.

### Frontend Remote

```
/projects → projects-app (Module Federation remote)
```

El Shell no sabe nada de proyectos.

## 3. 🛡️ Plan de Riesgos/Validación

### Prueba de Fallo: Apagar RabbitMQ

1. Apagar RabbitMQ
2. Crear proyecto
3. Verificar: proyecto existe en DB, sistema no crashea
4. Encender RabbitMQ
5. Verificar: evento se publica

Si el proyecto se pierde → consistencia incorrecta.
