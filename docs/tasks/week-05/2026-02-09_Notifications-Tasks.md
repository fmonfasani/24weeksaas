# Plan de Implementación: Notificaciones en Tiempo Real

**Estado**: Planificado

## ✅ Checklist de Tareas

### 📨 Mensajería (Dev 1)

- [ ] Configurar colas durables
- [ ] Consumer groups
- [ ] Reentrega de eventos

### 🔔 Notifications Service (Dev 2)

- [ ] Consumidores de eventos
- [ ] Persistencia de notificaciones
- [ ] Envío WebSocket por user channel
- [ ] Idempotencia de eventos

### 🌐 Notifications BFF (Dev 3)

- [ ] Endpoints REST
- [ ] Filtro por workspace
- [ ] Contador de no leídas

### 💻 Frontend (Dev 4)

- [ ] Campana en Shell
- [ ] Conexión WebSocket
- [ ] Actualización reactiva
- [ ] Manejo de reconexión

## 🏁 Definition of Done

1. ✅ Notificaciones llegan en tiempo real
2. ✅ Reconexión automática
3. ✅ No duplica notificaciones
4. ✅ Funciona sin refresh
