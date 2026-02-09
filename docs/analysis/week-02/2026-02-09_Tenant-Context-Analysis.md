# Análisis: Contexto de Tenant y Permisos Reales

## 1. 📊 Descripción del Problema

- **Contexto**: El sistema tiene autenticación pero un usuario solo puede estar en un workspace. Se necesita multi-workspace real donde el contexto cambie dinámicamente.
- **Síntomas**: Un usuario no puede cambiar de workspace sin relogin. Los datos no están aislados correctamente entre tenants.
- **Impacto**: **Crítico** - Sin esto, el SaaS no es realmente multi-tenant.

## 2. 🕵️ Diagnóstico

### Causa Raíz

Error arquitectónico común: "multi-tenant en la UI pero single-tenant en el backend".

El sistema actual no propaga correctamente el **Tenant Context** entre:

```
Browser → Shell → Gateway → BFF → Microservicios → Eventos
```

### Problema Central

- El usuario puede pertenecer a múltiples workspaces
- Puede ser **admin en ACME** pero **viewer en Globex**
- El workspace activo lo decide el **frontend**, no el backend

### Evidencia de Problema

```javascript
// ❌ MAL: Sin tenant context
GET /projects
// Devuelve TODOS los proyectos del usuario

// ✅ BIEN: Con tenant context
GET /projects
Headers: X-Workspace-Id: ws_acme_123
// Devuelve SOLO proyectos de ACME
```

## 3. 🔗 Referencias

- Multi-tenancy patterns: https://docs.microsoft.com/en-us/azure/architecture/guide/multitenant/
- BFF Pattern: https://samnewman.io/patterns/architectural/bff/
