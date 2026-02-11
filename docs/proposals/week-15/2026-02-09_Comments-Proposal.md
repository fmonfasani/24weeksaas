# Propuesta: Comentarios y Menciones

## 1. 🎯 Objetivo

Task deja de ser CRUD y pasa a ser conversación en tiempo real. Soporte para `@usuario`.

## 2. 💡 Solución Técnica

### Arquitectura

- `comments-service` gestiona persistencia y hilos.
- `UserMentioned` se dispara al guardar `CommentCreated`.
- `notifications-service` escucha `UserMentioned`.
- WebSocket (del Notifications Service) distribuye comentarios en vivo.

### Modelo de Datos

```sql
comments (id, workspace_id, task_id, author_id, content, created_at, edited_at)
threads (parent_comment_id, child_comment_id)
```

### Regla de Menciones

1. Parsear `@username`
2. Validar usuario en workspace
3. Emitir evento `UserMentioned`

## 3. 🛡️ Validación

Usuario offline @ana es mencionada → Ana se conecta y recibe notificación.
