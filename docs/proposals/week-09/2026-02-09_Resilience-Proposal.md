# Propuesta: Resiliencia

## 🎯 Objetivo

Aunque un servicio falle, usuarios pueden seguir trabajando.

## 💡 Reglas

- Timeout máximo: 800ms por request interna
- Circuit breaker: abre tras 5 fallos consecutivos
- Retries: 3 intentos (100ms, 300ms, 700ms)
- Eventos: reintentos infinitos + DLQ
- Idempotencia: tabla `processed_events(event_id UNIQUE)`
