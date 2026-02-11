# Propuesta: Analytics (Event Warehouse)

## 1. 🎯 Objetivo

Saber qué clientes usan realmente el producto. Dashboard con actividad diaria, usuarios activos, feature usage.

## 2. 💡 Solución Técnica

### Event Warehouse

- No usar DB transaccional.
- Usar **ClickHouse** (recomendado) o PostgreSQL particionado.

### Eventos Analíticos

Crear eventos específicos (no reutilizar dominio):

- `UserLoggedIn`
- `ProjectViewed`
- `TaskViewed`
- `WorkspaceActive`

### Workers Agregadores

Batch job cada minuto que calcula:

- DAU (Daily Active Users)
- WAU (Weekly Active Users)
- Contadores por workspace

## 3. 🛡️ Validación

Generar 10k eventos de carga → Sistema principal no se degrada.
