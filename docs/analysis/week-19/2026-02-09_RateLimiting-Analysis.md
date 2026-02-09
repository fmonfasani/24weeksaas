# Semana 19: Rate Limiting por Tenant

## Análisis

Rate limit por IP no sirve en multi-tenant. Un cliente puede degradar a otros.

## Propuesta

Throttling por workspace_id. Redis counters. Cuotas mensuales + limits por plan.

## Tareas

- [ ] Rate limit en Gateway por X-Workspace-Id
- [ ] Quotas Worker (consume eventos, cuenta uso)
- [ ] Integración con billing (isQuotaExceeded)
- [ ] UI avisos de límite
