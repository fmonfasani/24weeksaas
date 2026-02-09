# Propuesta: Observabilidad

## 🎯 Objetivo

Encontrar causa de cualquier error en <5 minutos.

## 💡 Solución

- OpenTelemetry Collector + Jaeger + Prometheus + Grafana
- Instrumentar TODOS los servicios
- Propagar `traceparent` header entre HTTP y eventos
- Logs JSON con trace_id, span_id, workspace_id, user_id
