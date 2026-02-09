# Semana 23: Backups y Disaster Recovery

## Análisis

SaaS no muere por bugs. Muere cuando pierde datos de clientes.

## Propuesta

- DBs: WAL archiving, backups externos (S3)
- Point-in-Time Recovery
- Object Storage: versioning, lifecycle
- Redis: snapshots + AOF
- Search: reconstruible por eventos
- DISASTER.md runbook

## Objetivos

- RPO ≤ 5 min (máx datos perdidos)
- RTO ≤ 30 min (máx tiempo caído)
