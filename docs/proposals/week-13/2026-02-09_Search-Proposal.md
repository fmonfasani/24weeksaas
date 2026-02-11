# Propuesta: Búsqueda Global (Read Models)

## 1. 🎯 Objetivo

Desde una sola barra el usuario puede buscar "website" y ver proyectos, tareas y miembros.

## 2. 💡 Solución Técnica

### Arquitectura: CQRS (Command Query Responsibility Segregation)

- Servicios de dominio (Projects, Tasks) → Escritura (OLTP)
- Search Service → Lectura (OLAP) optimizada

### Componentes

- **Elasticsearch / OpenSearch**: Motor de búsqueda
- **Indexer Worker**: Consume eventos y actualiza índices
- **Search BFF**: API de lectura

### Modelo de Documento Indexado

```json
{
  "id": "task-uuid",
  "workspace_id": "w1",
  "type": "task",
  "title": "Fix login bug",
  "project_name": "Website",
  "status": "doing",
  "text": "Fix login bug Website doing",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

### Reglas

- Search nunca llama a otros servicios
- Si el índice se borra → se reconstruye por eventos

## 3. 🛡️ Validación

Borrar índice → Reiniciar servicio → Índice se reconstruye solo.
