# Propuesta: RBAC por Recurso

## 🎯 Objetivo

Admin puede crear proyectos, Member puede crear tasks, Viewer solo lee.
Además: usuario puede ser admin en proyecto X pero no en Y.

## 💡 API

```
POST /internal/authorize
{user_id, workspace_id, action, resource_type, resource_id}
→ {allowed: true/false}
```

Cache en Redis, invalidación por evento `PermissionsUpdated`.
