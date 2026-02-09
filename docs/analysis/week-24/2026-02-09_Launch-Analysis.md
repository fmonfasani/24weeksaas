# Semana 24: Lanzamiento y Operación

## Análisis

Sistema técnicamente correcto pero no operable. Necesita procesos, no features.

## Propuesta

- Dominio real + HTTPS (cert-manager)
- Registro público (UserRegistered → WorkspaceCreated)
- status.tudominio.com
- Alertas Grafana (error rate, DB, colas, CPU)
- Panel admin interno /internal/admin
- Métricas de negocio (nuevos workspaces, DAU, churn)
- INCIDENTS.md runbook

## Objetivo Final

Alguien externo puede usar el producto sin ayuda.
Detectar fallos antes que el usuario.
Resolver incidentes sin improvisar.
