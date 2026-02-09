# Análisis: Audit Logs (Compliance Real)

## 1. 📊 Descripción del Problema

- **Contexto**: Empresas grandes piden trazabilidad antes de pagar. Necesitan ver quién hizo qué, cuándo.
- **Impacto**: **Bloqueante para Enterprise** - Sin audit, no hay compliance GDPR/SOC2.

## 2. 🕵️ Diagnóstico

### Causa Raíz

No se puede agregar logs manualmente en cada servicio (rompe independencia).
**Solución**: Auditoría 100% basada en eventos. Ningún microservicio conoce al audit-service.

### Regla Central

- Audit es **append-only**
- Nunca se borra, nunca se actualiza
- Solo inserciones

## 3. 🔗 Referencias

- GDPR: https://gdpr.eu/
- SOC2: https://www.aicpa.org/soc2
