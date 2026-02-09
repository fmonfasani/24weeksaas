# Propuesta: Billing, Planes y Límites

## 1. 🎯 Objetivo

Workspace tiene plan (Free/Pro/Enterprise) y sistema bloquea automáticamente según límites.

## 2. 💡 Solución

### Planes

| Plan       | Max Projects | Max Members | Max Tasks/Project |
| ---------- | ------------ | ----------- | ----------------- |
| Free       | 2            | 5           | 50                |
| Pro        | 20           | 25          | 500               |
| Enterprise | ∞            | ∞           | ∞                 |

### API Policy Check

```
POST /internal/authorize
{workspace_id, action: "CREATE_PROJECT"}
→ {allowed: true/false, reason: "PLAN_LIMIT_REACHED"}
```

### Integración

Otros servicios consultan billing antes de crear recursos.
Si billing falla → 503 (no permitir crear sin validación).
