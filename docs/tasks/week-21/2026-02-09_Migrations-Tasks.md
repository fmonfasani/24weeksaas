# Plan: Migraciones

**Estado**: Planificado

## ✅ Tareas

### DB Migrations (Dev 1)

- [ ] Scripts no bloqueantes
- [ ] Workers de backfill por lotes

### API Versioning (Dev 2)

- [ ] Rutas v1/v2 en BFFs
- [ ] Gateway routing logic

### Event Versioning (Dev 3)

- [ ] Consumers tolerantes a campos nuevos
- [ ] Schema Registry (opcional)

### Feature Flags (Dev 4)

- [ ] Servicio simple de flags
- [ ] Activación por workspace

## 🏁 DoD

1. ✅ Deploy sin downtime
2. ✅ Rollback seguro
