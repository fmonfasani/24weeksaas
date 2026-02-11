# Plan: Analytics

**Estado**: Planificado

## ✅ Tareas

### Infra (Dev 1)

- [ ] Levantar ClickHouse/DB Analytics
- [ ] Colas separadas para analytics (baja prioridad)

### Analytics Service (Dev 2)

- [ ] Ingestión masiva de eventos
- [ ] Workers de agregación (hourly/daily)

### Analytics BFF (Dev 3)

- [ ] API de lectura de estadísticas (cacheada)
- [ ] Endpoints para dashboard

### Frontend (Dev 4)

- [ ] Dashboard de métricas
- [ ] Gráficos (Chart.js / Recharts)

## 🏁 DoD

1. ✅ Analytics funciona aunque servicios caigan
2. ✅ No afecta performance del sistema principal
