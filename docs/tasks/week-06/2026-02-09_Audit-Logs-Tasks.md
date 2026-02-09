# Plan: Audit Logs

**Estado**: Planificado

## ✅ Tareas

### Broker (Dev 1)

- [ ] Retención de mensajes, reconsumo, replay

### Audit Service (Dev 2)

- [ ] Consumidores, mapping eventos, idempotencia

### Audit BFF (Dev 3)

- [ ] Filtros, paginación, queries optimizados

### Frontend (Dev 4)

- [ ] Tabla enterprise, filtros, infinite scroll

## 🏁 DoD

1. ✅ No existe POST /audit
2. ✅ Ningún servicio llama audit por HTTP
3. ✅ Todo viene de eventos
