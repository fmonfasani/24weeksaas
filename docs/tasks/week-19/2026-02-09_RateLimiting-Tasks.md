# Plan: Rate Limiting

**Estado**: Planificado

## ✅ Tareas

### Gateway (Dev 1)

- [ ] Redis rate limiter middleware
- [ ] Headers `X-RateLimit-Remaining`

### Quotas Worker (Dev 2)

- [ ] Consumidor de uso (tasks, storage)
- [ ] Reset mensual automático

### Billing Integration (Dev 3)

- [ ] Bloqueo de operaciones por cuota
- [ ] Integración con permissions check

### Frontend (Dev 4)

- [ ] Manejo visual de 429 (retry after)
- [ ] Barra de consumo en settings

## 🏁 DoD

1. ✅ Tenant abusivo aislado
2. ✅ Límites aplican en tiempo real
