# Plan de Implementación: Tasks + Saga Pattern

**Estado**: Planificado

## ✅ Checklist de Tareas

### 📨 Mensajería (Dev 1)

- [ ] Configurar exchanges por dominio
- [ ] Implementar reintentos automáticos
- [ ] Configurar DLQ (Dead Letter Queue)
- [ ] Monitorear colas en RabbitMQ UI

### 🔧 Tasks Service (Dev 2)

- [ ] Crear tabla `tasks`
- [ ] Crear tabla `projects_cache`
- [ ] Implementar consumer `ProjectCreated`
- [ ] Implementar consumer `ProjectArchived`
- [ ] Implementar validación contra cache local
- [ ] Implementar bloqueo de tasks al archivar proyecto
- [ ] Emitir eventos `TaskCreated`, `TasksBlockedByProject`

### 🌐 Tasks BFF (Dev 3)

- [ ] Crear BFF service
- [ ] Implementar endpoints proxy
- [ ] Manejo de errores 409 (consistencia eventual)
- [ ] Configurar timeouts + retries

### 💻 Frontend (Dev 4)

- [ ] Crear remote `tasks-app`
- [ ] Pantalla dentro de `/projects/:id`
- [ ] Lista de tasks
- [ ] Botón "Add Task"
- [ ] Cambio de estado (todo/doing/done)
- [ ] UI deshabilitada si proyecto archivado

### 🧪 Validación (QA)

- [ ] Apagar projects-service NO rompe tasks existentes
- [ ] Apagar tasks-service NO rompe projects
- [ ] Sistema se recupera al volver a levantar
- [ ] Publicar `ProjectArchived` manual → tasks se bloquean

## 🚫 Errores a Evitar

| ❌ Error                        | ✅ Correcto             |
| ------------------------------- | ----------------------- |
| Validar project con HTTP        | Usar proyección local   |
| No guardar proyección local     | Cache local obligatorio |
| No manejar eventos duplicados   | Idempotencia            |
| UI decidiendo reglas de negocio | API decide              |

## 🏁 Definition of Done (DoD)

1. ✅ Tasks funcionan sin projects-service online
2. ✅ Consistencia eventual funciona
3. ✅ Saga bloquea tasks automáticamente
4. ✅ Sin llamadas HTTP cross-service
