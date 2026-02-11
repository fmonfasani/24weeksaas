# Propuesta: Rate Limiting por Tenant (Protección Anti-Abuso)

## 1. 🎯 Objetivo

Un workspace abusivo no degrada el servicio para otros.

## 2. 💡 Solución Técnica

### Throttling por Workspace (No IP)

Gateway lee `X-Workspace-Id` y consulta Redis.
Política:

- **Free**: 100 req/min
- **Pro**: 1000 req/min

Si excede → `429 Too Many Requests`.

### Cuotas Mensuales (Billing)

No es velocidad, es volumen acumulado.

- `TaskCreated` → Incrementa contador mensual.
- `billing-service` valida `isQuotaExceeded`.
- Si excede → `402 Payment Required` (bloqueo funcional).

## 3. 🛡️ Validación

Script lanzando 150 requests/min con Workspace A → Bloqueado. Workspace B sigue OK.
