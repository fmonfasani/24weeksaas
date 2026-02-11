# Propuesta: Automatizaciones (Workflows)

## 1. 🎯 Objetivo

"Si pasa X → hacer Y". Ejemplo: Task DONE → Notificar Creador.

## 2. 💡 Solución Técnica

### Automation Engine Desacoplado

Servicio escucha eventos globales. Evalúa reglas del workspace. Publica **Comandos**.

### Comandos (No Lógica Directa)

Automation Service NO ejecuta lógica de negocio. Publica intención:

- `AssignUserCommand`
- `CreateTaskCommand`
- `SendNotificationCommand`

Tasks/Projects services escuchan comandos y ejecutan.

### Modelo de Regla

```json
{
  "trigger": "TaskStatusChanged",
  "conditions": { "status": "done" },
  "action": "NotifyUser",
  "params": { "user": "creator" }
}
```

## 3. 🛡️ Validación

Crear 100 tasks rápido → Automatización ejecuta 100 veces sin perderse.
