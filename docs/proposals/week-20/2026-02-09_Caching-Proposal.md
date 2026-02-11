# Propuesta: Performance y Caching Distribuido

## 1. 🎯 Objetivo

Abrir proyecto < 300ms. Latencia baja aunque haya carga.

## 2. 💡 Solución Técnica

### Caching Multinivel

1. **Gateway Cache**: GETs cortos (10-30s). Respuestas completas.
2. **Service Cache**: Consultas DB frecuentes (Lists).
3. **Permissions Cache**: El más crítico (60s). `(user, workspace, resource) → allowed`.

### Redis Cluster

Centralizado. Claves incluyen `workspace_id`.
Ej: `tasks:list:{workspace}:{project}`

### Invalidación por Eventos

TTL no es suficiente.
`TaskCreated` → Borra `tasks:list:...`.
`PermissionsUpdated` → Borra cache de usuario.

## 3. 🛡️ Validación

Apagar Redis → Sistema sigue funcionando (más lento).
