# Análisis: Servicio de Projects

## 1. 📊 Descripción del Problema

- **Contexto**: Primera slice de negocio real e independiente. Valida si realmente pueden trabajar equipos sin coordinar deploys.
- **Síntomas**: No existe funcionalidad para crear/gestionar proyectos dentro de workspaces.
- **Impacto**: **Alto** - Sin proyectos, no hay contexto para tareas.

## 2. 🕵️ Diagnóstico

### Causa Raíz

Se necesita el primer dominio de negocio completamente autónomo con:

- Propio microservicio backend
- Propia base de datos
- Propio micro-frontend
- Propios eventos de dominio

### Regla de Validación

Si identity u organizations necesitan redeploy cuando cambia projects → la arquitectura falló.

### Estructura del Slice Completo

```
projects/
├── projects-service/    # Backend
├── projects-db/         # PostgreSQL propio
├── projects-frontend/   # Remote React
├── projects-bff/        # API para frontend
└── Dockerfile          # Pipeline independiente
```

## 3. 🔗 Referencias

- Outbox Pattern: https://microservices.io/patterns/data/transactional-outbox.html
- Vertical Slice Architecture: https://jimmybogard.com/vertical-slice-architecture/
