# Plan: Comentarios

**Estado**: Planificado

## ✅ Tareas

### Comments Service (Dev 1)

- [ ] CRUD Comentarios + Threads anidados
- [ ] Parser de menciones (@regex)
- [ ] Eventos: CommentCreated, UserMentioned

### Real-Time (Dev 2)

- [ ] Canal WebSocket por `task_id`
- [ ] Reconexión automática

### Integraciones (Dev 3)

- [ ] Validar permisos (COMMENT_TASK)
- [ ] Emitir a Search (texto de comentario)

### Frontend (Dev 4)

- [ ] Panel lateral de comentarios
- [ ] Editor de texto con sugerencias
- [ ] Resaltado de menciones

## 🏁 DoD

1. ✅ 2 usuarios ven comentarios en vivo
2. ✅ Menciones notifican correctamente
