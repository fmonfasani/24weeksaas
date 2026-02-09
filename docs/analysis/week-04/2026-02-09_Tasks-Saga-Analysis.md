# Análisis: Tasks + Saga Pattern

## 1. 📊 Descripción del Problema

- **Contexto**: Primer flujo distribuido cross-service. Las tasks dependen de projects pero sin acoplamiento síncrono.
- **Síntomas**: No hay gestión de tareas. Se necesita validar que un proyecto existe antes de crear task, pero sin llamadas HTTP directas.
- **Impacto**: **Crítico** - Aquí se valida consistencia eventual real.

## 2. 🕵️ Diagnóstico

### Causa Raíz

tasks-service necesita saber si un proyecto existe pero:

- NO puede consultar DB de projects
- NO puede hacer HTTP síncrono obligatorio

### Solución: Proyección Local + Saga Pattern

```
projects-service emite ProjectCreated
    ↓
tasks-service consume y guarda en projects_cache
    ↓
Al crear task: valida contra cache local
```

### Flujo de Saga

```
ProjectArchived → tasks-service → marca blocked=true → TasksBlockedByProject
```

## 3. 🔗 Referencias

- Saga Pattern: https://microservices.io/patterns/data/saga.html
- CQRS: https://martinfowler.com/bliki/CQRS.html
