# Plan: Caching

**Estado**: Planificado

## ✅ Tareas

### Redis (Dev 1)

- [ ] Cluster Redis persistente
- [ ] Métricas (hit ratio)

### Permissions Cache (Dev 2)

- [ ] Implementar cache de autorización
- [ ] Listener `PermissionsUpdated`

### Service Caches (Dev 3)

- [ ] Listas de Tasks/Projects cacheadas
- [ ] Eviction por eventos de dominio

### Gateway (Dev 4)

- [ ] Cache headers
- [ ] Dashboard de latencia

## 🏁 DoD

1. ✅ Hit ratio > 70%
2. ✅ Datos no quedan stale (invalidación funciona)
