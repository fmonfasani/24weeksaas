# Plan: Búsqueda Global

**Estado**: Planificado

## ✅ Tareas

### Infra (Dev 1)

- [ ] Levantar OpenSearch/Elasticsearch local
- [ ] Configurar persistencia de índices

### Search Service (Dev 2)

- [ ] Indexer Worker (consumidor de eventos)
- [ ] Mapping de eventos a documentos
- [ ] Reconstrucción (replay)

### Search BFF (Dev 3)

- [ ] Endpoint `GET /search?q=...`
- [ ] Filtros obligatorios por workspace_id
- [ ] Highlight de resultados

### Frontend (Dev 4)

- [ ] Barra global (cmd+k)
- [ ] Dropdown con resultados agrupados
- [ ] Navegación a remotes

## 🏁 DoD

1. ✅ Búsqueda < 500ms
2. ✅ Respeta tenants (no muestra datos ajenos)
3. ✅ Reindexación automática
