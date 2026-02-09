# Semana 20: Caching Distribuido

## Análisis

Cada request consulta DB + permisos. No escala con miles de usuarios.

## Propuesta

Caching multinivel: Gateway (10-30s), Service (queries frecuentes), Permissions (60s).
Redis central. Invalidación por eventos.

## Tareas

- [ ] Permission cache con invalidación
- [ ] Tasks/Projects cache por workspace
- [ ] Gateway cache para GETs
- [ ] Métricas cache_hit_ratio en Grafana
