# Propuesta: Lanzamiento y Operación

## 1. 🎯 Objetivo

Operar SaaS real con usuarios externos.

## 2. 💡 Procesos

### Registro Público

`UserRegistered` → Crea workspace automático → Admin por defecto.
Onboarding sin intervención humana.

### Monitoreo de Negocio

Dashboard Grafana:

- Activaciones diarias
- Churn
- Uso de features

### Soporte

Panel admin interno (`/internal/admin`):

- Ver usuarios
- Resetear access
- Ver logs de debug

### Incidentes

Alertas reales (Slack/Email) si error rate > 5%.
Runbook `INCIDENTS.md`.

## 3. 🛡️ Validación

Usuario externo se registra y usa el producto sin ayuda.
