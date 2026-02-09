Dijiste:
Actúa como un Principal Architect de una empresa SaaS global.
Tu tarea es entrenarme a mí y a un equipo de 4 desarrolladores para construir durante 24 semanas un SaaS multi-tenant real utilizando Vertical Slice Architecture: cada dominio funcional tendrá su propio microservicio backend y su propio micro-frontend independiente.

Este sistema NO debe ser un monolito separado artificialmente.
Debe ser diseñado para que equipos distintos puedan trabajar sin coordinar despliegues.

El producto a construir será una plataforma SaaS de gestión de trabajo colaborativo (tipo Notion/Jira/ClickUp).

Arquitectura obligatoria:

Modelo organizacional:

- Workspaces (tenants)
- Usuarios pertenecen a múltiples workspaces
- Roles por workspace
- Permisos por recurso

Arquitectura técnica:
Cada dominio debe ser un Slice autónomo compuesto por:

- su propio backend (microservicio)
- su propia base de datos
- su propio micro-frontend
- su propio pipeline de despliegue

Ejemplos de slices:
Identity
Organizations
Projects
Tasks
Billing
Notifications
Audit Logs
Analytics

Reglas obligatorias:

- Database per service
- Ningún servicio puede consultar la DB de otro
- Comunicación sincrónica mínima
- Integración principal por eventos
- Saga pattern para operaciones de negocio
- Outbox pattern para consistencia
- APIs contract-first

Frontend:

- React
- Module Federation
- Un Shell host
- Cada slice es un remote
- Cada remote deploya independientemente
- El Shell nunca contiene lógica de negocio

Infraestructura:

- Docker desde el inicio
- API Gateway
- BFF por dominio
- OAuth2 / OpenID Connect (Keycloak)
- RabbitMQ o Kafka
- Kubernetes
- Helm
- GitOps (ArgoCD)

Observabilidad:

- Logs estructurados
- Métricas
- OpenTelemetry + Jaeger tracing entre servicios y eventos

Resiliencia:

- Circuit breaker
- Retries con backoff
- Rate limiting
- Idempotencia de eventos

IMPORTANTE:
El curso debe ser práctico. No quiero teoría ni explicaciones largas.

Cada semana será un Sprint Scrum real y debe incluir:

SEMANA X — Nombre del Sprint

Objetivo de negocio alcanzado
Problema arquitectónico que aprenderemos
Entregables verificables
Eventos que deben existir
APIs mínimas
UI mínima funcional
Tareas divididas para 4 desarrolladores
Criterios de aceptación verificables
Prueba realista de fallo del sistema
Errores típicos a evitar

Cada semana debe depender de la anterior, construyendo el SaaS progresivamente hasta llegar a producción real.

No avances a la siguiente semana hasta que yo diga:
"Sprint completado"

Empieza con la SEMANA 1 — Fundación del sistema multi-tenant.

ChatGPT dijo:
Perfecto.
Desde ahora esto es un proyecto real. Si algo no funciona → el sprint no está terminado.

SEMANA 1 — Fundación del sistema multi-tenant
Objetivo de negocio
Poder abrir la URL del producto y ver una aplicación SaaS corriendo en Kubernetes donde:
existe un Workspace (tenant)
existe un usuario autenticado
el sistema reconoce a qué workspace pertenece
el frontend muestra:
“Estás dentro del workspace ACME”
Todavía no hay proyectos ni tareas.
Solo demostrar que el SaaS puede existir multi-tenant.

Problema arquitectónico que aprenderemos
Cómo crear la columna vertebral del SaaS:
Identidad + Tenant Context + Gateway + Frontend distribuido
Si esto queda mal → todo lo demás fracasa (billing, permisos, auditoría, etc).
Vamos a resolver:
autenticación externa (NO usuarios en nuestra DB)
separación de tenants
propagación de identidad entre microservicios
primer evento del sistema

Slices que existen en este sprint
Solo 2:
Identity Slice
Organizations Slice (Workspaces)
Y 2 infra:
API Gateway
Frontend Shell

Infraestructura obligatoria (debe correr local)
Debes poder levantar con un solo comando:
docker compose up

Debe iniciar:
Keycloak
PostgreSQL (2 instancias separadas)
RabbitMQ
API Gateway
identity-service
organizations-service
frontend-shell
Si levantas manualmente algo → el sprint no está bien.

Arquitectura mínima
Flujo real:
Browser → Shell → Gateway → identity-service → organizations-service → event bus
NO hay comunicación directa frontend → microservicio.

Eventos que deben existir
Primer evento oficial del sistema:
UserRegistered

Lo emite identity-service cuando un usuario inicia sesión por primera vez.
Luego:
WorkspaceCreated
MemberAddedToWorkspace

Los emite organizations-service.
Todo por RabbitMQ.

APIs mínimas
Identity Service
(No maneja usuarios propios, solo federación con Keycloak)
GET /me

Devuelve:
userId
email
workspaces[]
activeWorkspaceId

Organizations Service
POST /workspaces
GET /workspaces
POST /workspaces/{id}/members

UI mínima funcional
React + Module Federation.
Debe existir:
Shell (host)
login button
workspace selector
Remote: organizations-app
botón “Crear Workspace”
lista de workspaces
Shell solo renderiza remotes.
No contiene lógica de negocio.

Entregables verificables
Si hago esto:
Abro app
Login con Keycloak
Creo workspace “ACME”
Entonces:
se crea en DB de organizations-service
se emite evento WorkspaceCreated
identity-service asocia usuario al workspace
/me devuelve el workspace
frontend lo muestra

Tareas por desarrollador
Dev 1 — Infra & Gateway
docker compose completo
API Gateway (recomendado: Traefik o Kong)
routing por servicio
propagación de JWT
Dev 2 — Identity Service
Stack recomendado:
FastAPI o NestJS
PostgreSQL propio
consumo de eventos
Debe:
validar JWT de Keycloak
crear usuario interno al primer login
emitir UserRegistered
endpoint /me
Dev 3 — Organizations Service
DB propia
crear workspace
agregar miembro
emitir eventos
suscribirse a UserRegistered
Dev 4 — Frontend
React
Module Federation
Shell host
remote organizations-app
login + workspace selector

Criterios de aceptación (medibles)
El sprint está terminado solo si:
Borras TODAS las DB
Levantas docker compose
Entras
Haces login
Creas workspace
Y funciona sin tocar código.

Prueba realista de fallo
Apagar organizations-service mientras el sistema corre.
Luego:
el login debe seguir funcionando
/me debe responder
el frontend no debe caerse (solo mostrar error del módulo organizations)
Si la app completa muere → arquitectura incorrecta.

Errores típicos a evitar (muy importantes)
Compartir base de datos entre servicios
Llamadas HTTP entre identity y organizations
Guardar usuarios en organizations DB
El frontend llamando directo a microservicios
Roles globales (DEBEN ser por workspace)
Crear tenant en el token JWT (NO)

Cuando lo tengas funcionando, escribes:
“Sprint completado”
y recién ahí pasamos a la Semana 2.

Dijiste:
Sprint completado

ChatGPT dijo:
Bien. Ahora empieza el sistema de verdad.

SEMANA 2 — Contexto de Tenant y Permisos Reales
Objetivo de negocio
Un mismo usuario puede pertenecer a dos workspaces distintos y el sistema cambia completamente de contexto sin relogin.
Debes poder:
Crear workspace ACME
Crear workspace Globex
Cambiar entre ellos desde la UI
Ver datos distintos según el workspace
Si ves los mismos datos → el SaaS no es multi-tenant (fallo grave).

Problema arquitectónico
Cómo propagar correctamente el Tenant Context entre:
Browser → Shell → Gateway → BFF → Microservicios → Eventos
Aquí nace el error más común en SaaS:
“multi-tenant en la UI pero single-tenant en el backend”.
Vamos a implementar:
Tenant Resolution + Tenant Isolation

Nueva regla obligatoria del sistema
A partir de ahora TODA request debe llevar:
X-Workspace-Id

Sin ese header → 403.
No puede inferirse del usuario ni del JWT.
El workspace activo lo decide el frontend.

Cambios de arquitectura
Se introduce algo crítico:
BFF por dominio
Nuevo servicio:
bff-identity

El frontend SOLO habla con BFFs.
Nunca con microservicios.
Ahora el flujo real:
Browser → Shell → BFF → Services → Events

Qué aprenderemos realmente
Este sprint te enseña el concepto más importante del SaaS:
El usuario NO es el centro del sistema.
El tenant es el centro.
El mismo usuario puede ser:
admin en ACME
viewer en Globex

Eventos nuevos
UserAddedToWorkspace
WorkspaceContextChanged

El segundo es importante: lo emite el BFF cuando el usuario cambia workspace.
Analytics y Audit lo necesitarán después.

Cambios en Identity Service
Ya no devuelve un único workspace activo.
GET /me ahora:
userId
email
memberships[
{ workspaceId, role }
]

Nada de activeWorkspace.

Nuevo componente crítico
Tenant Middleware (en TODOS los servicios)
Cada microservicio debe:
Leer X-Workspace-Id
Validar membresía (cacheada)
Inyectar tenant en el request context
Filtrar queries por workspace
Ejemplo:
Si un usuario pertenece a ACME y Globex:
GET /projects

Debe devolver SOLO los de ese workspace.

Cambios en base de datos
Todas las tablas de todos los servicios ahora deben tener:
workspace_id (indexed)

Sin excepción.
Esto es obligatorio antes de crear el servicio de Projects.

UI mínima
En el Shell:
Un workspace switcher real.
Al cambiar:
se guarda en localStorage
se envía en cada request
se recarga el remote
La pantalla debe mostrar claramente:
Workspace actual: ACME

Entregables verificables
Prueba obligatoria:
Crear ACME
Crear Globex
Abrir dos navegadores (o incógnito)
Mismo usuario
Un navegador en ACME
Otro en Globex
Las acciones no deben interferirse.

Tareas por desarrollador
Dev 1 — Gateway + Headers
El gateway debe propagar X-Workspace-Id
rate limit por workspace
bloquear requests sin header
Dev 2 — Identity Service
memberships table
cache (Redis recomendado)
endpoint /me nuevo
Dev 3 — Organizations Service
membership roles
endpoint:
GET /workspaces/{id}/members

Dev 4 — Frontend
workspace switcher
persistencia
interceptors HTTP agregando header
recarga de remotes al cambiar

Criterios de aceptación
El sprint se aprueba solo si:
puedes borrar cookies
volver a loguear
el sistema recuerda tus workspaces
cambiar de workspace no requiere login
datos completamente aislados

Prueba de fallo
Modificar manualmente el header:
X-Workspace-Id = otro workspace al que no perteneces

El sistema debe responder:
403 Forbidden

Si responde 200 → tienes una vulnerabilidad crítica multi-tenant.

Errores típicos
Filtrar por user_id en vez de workspace_id
Guardar workspace activo en backend session
Confiar en el JWT para permisos
UI switch sin impacto backend
Cachear permisos sin invalidación por eventos

Cuando funcione de verdad:
“Sprint completado”
y empezamos a construir Projects (donde normalmente los SaaS se rompen).

Dijiste:
Sprint completado

ChatGPT dijo:
Ahora empieza la parte donde un SaaS suele colapsar si la arquitectura es débil.

SEMANA 3 — Servicio de Projects (primer dominio real)
Objetivo de negocio
Dentro de un workspace el usuario puede:
crear proyectos
listarlos
verlos solo en ese workspace
Desde la UI debes poder:
Crear proyecto “Website Redesign” en ACME
Cambiar a Globex → no debe existir
Esto valida el aislamiento real de datos.

Problema arquitectónico
Primer slice de negocio independiente.
Aquí se valida si realmente pueden trabajar equipos sin coordinar deploys.
Vamos a introducir:
nuevo microservicio autónomo
nueva base de datos
nuevo micro-frontend
nuevos eventos de dominio
Si identity u organizations necesitan redeploy → fallamos.

Nuevo Slice
Projects Slice (completo)
Debe tener:
projects-service (backend)
projects-db (PostgreSQL propio)
projects-frontend (remote React)
projects-bff
pipeline docker propio
Ningún código compartido por copia/pega.

Modelo de datos mínimo
Tabla:
projects
id (uuid)
workspace_id (indexed)
name
created_by
created_at
archived

NO FK hacia users ni organizations.
Solo IDs.

APIs mínimas
projects-service
POST /projects
GET /projects
GET /projects/{id}
PATCH /projects/{id}/archive

Todas requieren X-Workspace-Id.

Eventos obligatorios
Primeros eventos reales de negocio:
ProjectCreated
ProjectArchived

Emitidos por projects-service (Outbox pattern obligatorio).
Luego serán usados por:
Audit Logs
Notifications
Analytics
Billing (más adelante)

Outbox Pattern (obligatorio)
Dentro de la misma transacción de DB:
insertar project
insertar registro en outbox_events
Un worker publica a RabbitMQ.
Si publicas directamente al broker → no aceptado.

UI mínima funcional
Nuevo remote:
projects-app
Pantalla:
botón “New Project”
lista de proyectos
botón “Archive”
Debe cargarse vía Module Federation desde el Shell.
El Shell no sabe nada de proyectos.
Ruta:
/projects

Si el remote cae → el resto del sistema debe seguir funcionando.

BFF del dominio
Nuevo servicio:
projects-bff

Responsabilidades:
validar JWT
validar workspace
rate limit
llamar a projects-service
Frontend SOLO habla con projects-bff.

Entregables verificables
Prueba obligatoria:
Login
Crear workspace ACME
Crear proyecto A
Cambiar a Globex
Lista vacía
Volver a ACME
Proyecto A sigue existiendo

Tareas por desarrollador
Dev 1 — Infra
nueva DB
colas RabbitMQ
topics por dominio
health checks
Dev 2 — Projects Service
modelo
tenant middleware
outbox
eventos
Dev 3 — Projects BFF
endpoints proxy
validación de permisos
manejo de errores resiliente
Dev 4 — Frontend
remote projects-app
routing federado
pantalla proyectos
manejo de errores si BFF cae

Criterios de aceptación
El sprint está aprobado solo si:
se puede desplegar projects sin tocar identity
borrar DB de projects no afecta login
apagar projects-service no rompe organizations

Prueba realista de fallo
Apagar RabbitMQ.
Crear un proyecto.
Resultado esperado:
el proyecto existe en DB
el sistema no se cae
cuando RabbitMQ vuelve, el evento se publica
Si el proyecto se pierde → tu consistencia está mal.

Errores típicos
FK a tabla de usuarios
Consultar identity-service sincrónicamente
Eventos publicados fuera de transacción
Shared database
Shell importando código de projects

Cuando realmente funcione:
“Sprint completado”
y entramos al servicio más difícil de todo el sistema: Tasks (ahí se prueban de verdad las micro-arquitecturas).

Dijiste:
Sprint completado

ChatGPT dijo:
Perfecto.
Ahora empieza la parte donde la mayoría de los SaaS fallan: consistencia entre servicios.

SEMANA 4 — Tasks + Saga Pattern (primer flujo distribuido)
Objetivo de negocio
Dentro de un proyecto el usuario puede crear tareas.
Flujo real desde la UI:
Workspace → Proyecto → Crear Task → aparece en la lista
Pero además:
una task no puede existir sin proyecto
si el proyecto se archiva → sus tasks deben bloquearse
Esto es el primer flujo cross-service.

Problema arquitectónico
tasks-service necesita saber si un proyecto existe…
pero NO puede consultar la DB de projects ni hacer HTTP síncrono obligatorio.
Aquí implementamos:
Validación por eventos + Saga Pattern
Aprenderán consistencia eventual real.

Nuevo Slice
Tasks Slice (completo)
Componentes:
tasks-service
tasks-db
tasks-bff
tasks-frontend
Independiente del servicio de projects.

Modelo de datos
Tabla principal:
tasks
id (uuid)
workspace_id (indexed)
project_id
title
status (todo | doing | done)
created_by
created_at
blocked (bool)

Tabla cache:
projects_cache
project_id
workspace_id
archived
last_synced

⚠️ Muy importante:
tasks-service mantiene una proyección local de projects.

Eventos que debe consumir
Desde projects-service:
ProjectCreated
ProjectArchived

tasks-service actualiza projects_cache.
NO se permite llamar GET /projects/{id}.

APIs mínimas
tasks-service
POST /tasks
GET /projects/{projectId}/tasks
PATCH /tasks/{id}
PATCH /tasks/{id}/status

Validación obligatoria al crear task
Cuando llega:
POST /tasks (project_id)

El servicio:
busca en projects_cache
si no existe → 409
si archived → 409
si ok → crea task
Esto es consistencia eventual controlada.

Saga Pattern
Caso:
Usuario archiva un proyecto
Flujo:
projects-service:
ProjectArchived event

tasks-service:
recibe evento
marca blocked = true en todas las tasks
emite:
TasksBlockedByProject

Más adelante lo usarán Notifications y Audit.
No hay transacción distribuida.

UI mínima
Nuevo remote:
tasks-app
Pantalla dentro de /projects/:id
Debe mostrar:
lista de tasks
botón “Add Task”
cambio de estado (todo/doing/done)
Si el proyecto está archivado:
UI deshabilitada
mensaje: “Project archived”
La UI no decide eso.
Lo decide la API.

BFF
Nuevo:
tasks-bff

Responsable de:
validar workspace
manejar errores de consistencia eventual
traducir 409 a mensaje de UI claro

Entregables verificables
Prueba obligatoria:
Crear proyecto
Crear 3 tasks
Archivar proyecto
Intentar crear nueva task
Resultado esperado:
→ 409 + UI bloqueada

Prueba de consistencia eventual (muy importante)
Detener tasks-service.
Luego:
Crear proyecto
Iniciar tasks-service
Resultado esperado:
projects se sincronizan por eventos
luego puedes crear tasks
Si no → tu sistema no es recuperable.

Tareas por desarrollador
Dev 1 — Mensajería
exchanges por dominio
reintentos
DLQ (dead letter queue)
Dev 2 — Tasks Service
proyección local
consumidores de eventos
bloqueo por project archive
Dev 3 — Tasks BFF
endpoints
manejo de errores 409
timeouts + retries
Dev 4 — Frontend
remote tasks-app
navegación desde projects
estado de tareas
bloqueo visual

Criterios de aceptación
El sprint se aprueba solo si:
apagar projects-service NO rompe tasks existentes
apagar tasks-service NO rompe projects
el sistema se recupera al volver a levantar

Prueba realista de fallo
Publicar manualmente en RabbitMQ:
ProjectArchived (de un project real)

Sin usar la UI.
El sistema debe bloquear automáticamente las tasks.
Si no pasa → tu arquitectura depende de llamadas HTTP.

Errores típicos
Validar project con HTTP
No guardar proyección local
No manejar eventos duplicados
No idempotencia
UI decidiendo reglas de negocio

Cuando funcione de verdad:
“Sprint completado”
y entramos en algo que cambia completamente el sistema: Notificaciones en tiempo real (event-driven UI).

Dijiste:
Sprint completado

ChatGPT dijo:
Excelente.
Ahora el sistema deja de ser CRUD y pasa a ser colaborativo.

SEMANA 5 — Notificaciones en Tiempo Real (event-driven UI)
Objetivo de negocio
Cuando ocurre algo en el workspace, otros usuarios lo ven sin refrescar.
Ejemplos:
alguien crea un proyecto → aparece notificación
alguien crea una task → aparece notificación
un proyecto se archiva → alerta inmediata
La UI debe actualizarse sola.

Problema arquitectónico
El frontend no puede consultar constantemente APIs (polling).
Implementaremos:
Backend → Eventos → Notification Service → WebSocket → Browser
Aprenderán a conectar el bus de eventos con la UI.

Nuevo Slice
Notifications Slice
Componentes:
notifications-service
notifications-db
notifications-bff
notifications-frontend
WebSocket gateway
Es completamente independiente.

Qué hará este servicio
Consumirá eventos de todo el sistema:
ProjectCreated
TaskCreated
ProjectArchived
TasksBlockedByProject

Y generará:
NotificationCreated

Modelo de datos
notifications
id
workspace_id
user_id
type
title
payload (json)
read (bool)
created_at

Cada usuario tiene sus propias notificaciones.

Distribución en tiempo real
El notifications-service:
consume evento
guarda notificación
publica por WebSocket al usuario correcto
Tecnología recomendada:
WebSocket nativo o Socket.IO
canal por user_id
No usar el gateway HTTP existente.

BFF
notifications-bff:
GET /notifications
PATCH /notifications/{id}/read
GET /notifications/unread-count

El WebSocket es directo desde el browser al notifications-service.
(No pasa por API Gateway)

UI mínima
Remote:
notifications-app
Debe existir un ícono de campana en el Shell.
Funcionalidad:
contador de no leídas
dropdown con lista
al llegar una nueva → aparece sin recargar
Si abres dos navegadores con el mismo usuario → ambos reciben el evento.

Integración con otros servicios
Nada de llamadas HTTP.
Solo suscripción a eventos del broker.
Debe reaccionar automáticamente cuando:
projects-service emite eventos
tasks-service emite eventos
Si un servicio cae y vuelve → se reanuda consumo.

Entregables verificables
Prueba obligatoria:
Abrir 2 navegadores
Usuario A y Usuario B en mismo workspace
A crea una task
Resultado:
→ B recibe notificación en vivo sin refrescar.

Prueba de sistema distribuido
Apagar notifications-service.
Mientras está apagado:
crear proyectos
crear tasks
Encenderlo nuevamente.
Resultado esperado:
→ genera notificaciones atrasadas (catch-up por eventos)
Si no aparecen → tu sistema perdió eventos.

Tareas por desarrollador
Dev 1 — Mensajería
colas durables
consumer groups
reentrega de eventos
Dev 2 — Notifications Service
consumidores
persistencia
envío WebSocket
idempotencia
Dev 3 — Notifications BFF
endpoints REST
permisos por workspace
Dev 4 — Frontend
campana en Shell
conexión WebSocket
actualización reactiva
manejo reconexión

Criterios de aceptación
El sprint se aprueba solo si:
las notificaciones llegan en tiempo real
reconecta solo al cortar internet
no duplica notificaciones
no depende de refrescar la página

Prueba realista de fallo
Simular:
cortar WiFi 30 segundos
volver a conectar
El browser debe reconectarse y recibir nuevas notificaciones automáticamente.

Errores típicos
Polling cada 5s
Guardar notificaciones en memoria
No usar colas durables
No manejar duplicados
Broadcast global (sin workspace)

Cuando funcione:
“Sprint completado”
y pasamos a algo crítico para SaaS reales: Audit Logs (compliance, GDPR, enterprise requirement).

Dijiste:
Sprint completado

ChatGPT dijo:
Ahora entramos en algo que los SaaS serios no negocian: trazabilidad.
Esto es lo que empresas grandes te van a pedir antes de pagarte.

SEMANA 6 — Audit Logs (compliance real)
Objetivo de negocio
Un administrador del workspace puede ver:
quién hizo qué, cuándo y sobre qué recurso
Ejemplos:
Federico creó proyecto “Website”
Ana cambió una task a DONE
Alguien agregó un miembro al workspace
Debe poder verse desde la UI.

Problema arquitectónico
No podemos agregar logs dentro de cada servicio manualmente.
Eso rompe:
independencia
despliegues
mantenimiento
Implementaremos:
Auditoría 100% basada en eventos
Ningún microservicio conoce al audit-service.

Nuevo Slice
Audit Slice
Componentes:
audit-service
audit-db
audit-bff
audit-frontend
Solo consume eventos.
Nunca recibe HTTP de otros servicios.

Eventos que debe escuchar
De TODOS los dominios:
UserRegistered
WorkspaceCreated
UserAddedToWorkspace
ProjectCreated
ProjectArchived
TaskCreated
TaskStatusChanged
TasksBlockedByProject

Si mañana agregas Billing → también.

Qué genera
Cada evento se convierte en:
AuditLogEntry

Modelo de datos
Tabla:
audit_logs
id
workspace_id (indexed)
actor_user_id
action
entity_type
entity_id
metadata (json)
timestamp

Ejemplo real:
action
entity
metadata
PROJECT_CREATED
project
{name:"Website"}

Reglas importantes
Audit es append-only
Nunca se borra
Nunca se actualiza
Solo inserciones
Si permites DELETE → no cumple compliance.

APIs
audit-bff
GET /audit
GET /audit?entity=project
GET /audit?user={id}
GET /audit?from=&to=

Debe paginar.

UI mínima
Remote:
audit-app
Pantalla:
Una tabla tipo enterprise:
fecha
usuario
acción
recurso
Filtro por:
usuario
tipo
rango de fechas
Ruta:
/audit

Transformación de eventos
El audit-service debe mapear eventos a acciones humanas.
Ejemplo:
ProjectCreated → "created project"
TaskStatusChanged → "changed task status to DONE"

No guardar el evento crudo sin procesar.

Entregables verificables
Prueba obligatoria:
Crear proyecto
Crear task
Cambiar estado
Archivar proyecto
Ir a /audit
→ Deben aparecer todos en orden cronológico.

Prueba crítica
Apagar audit-service por 10 minutos.
Durante ese tiempo:
crear proyectos
crear tasks
Encender audit-service.
Resultado esperado:
→ reconstruye historial completo desde la cola.
Si faltan eventos → no tienes sistema enterprise.

Tareas por desarrollador
Dev 1 — Broker
retención de mensajes
reconsumo
replay desde offset
Dev 2 — Audit Service
consumidores
mapping de eventos
idempotencia (MUY importante)
Dev 3 — Audit BFF
filtros
paginación
performance queries
Dev 4 — Frontend
tabla
filtros
infinite scroll o paginado

Criterios de aceptación
Se aprueba solo si:
no existe endpoint POST /audit
ningún servicio llama audit por HTTP
todos los registros provienen de eventos

Prueba realista de fallo
Publicar manualmente un evento duplicado en RabbitMQ.
El audit log no debe duplicarse.

Errores típicos
Loggear desde cada servicio
No idempotencia
Guardar evento completo sin normalizar
Borrar logs antiguos
Depender del orden perfecto de eventos

Cuando esté funcionando correctamente:
“Sprint completado”
y pasamos al punto donde el SaaS empieza a monetizar: Billing + Suscripciones + límites por plan.

Dijiste:
Sprint completado

ChatGPT dijo:
Bien.
Ahora el sistema pasa de “app” a producto SaaS real.

SEMANA 7 — Billing, Planes y Límites
Objetivo de negocio
Un workspace ahora tiene un plan:
Free
Pro
Enterprise
Y el sistema debe bloquear funcionalidades automáticamente según el plan.
Ejemplo:
Free:
máx 2 proyectos
máx 5 usuarios
Si intentan crear el tercero → el sistema lo impide.
Sin lógica en el frontend.

Problema arquitectónico
¿Dónde viven las reglas de negocio globales?
No pueden vivir en:
projects-service
organizations-service
tasks-service
Porque todos deberían conocer el plan.
Implementamos:
Servicio de Billing como Policy Authority del sistema
Los demás servicios no conocen planes.
Solo preguntan: “¿Está permitido?”

Nuevo Slice
Billing Slice
Componentes:
billing-service
billing-db
billing-bff
billing-frontend
Este servicio se vuelve central en negocio, pero no en dependencias.

Modelo de datos
plans
id
name
max_projects
max_members
max_tasks_per_project
price

subscriptions
id
workspace_id
plan_id
status (active, past_due, canceled)
current_period_end

Eventos que consume
WorkspaceCreated
ProjectCreated
UserAddedToWorkspace
TaskCreated

El billing mantiene una proyección de uso por workspace.
Tabla:
usage_counters
workspace_id
projects_count
members_count
tasks_count

Nuevo tipo de comunicación
Primer request síncrono permitido:
Servicios ahora pueden consultar:
billing-service → Policy Check

Endpoint interno:
POST /internal/authorize

Input:
workspace_id
action

Ejemplo:
CREATE_PROJECT
ADD_MEMBER
CREATE_TASK

Respuesta:
allowed: true/false
reason: "PLAN_LIMIT_REACHED"

Cambios en servicios existentes
projects-service
Antes de crear proyecto:
consulta billing.
Si allowed=false → 402 Payment Required o 403.
organizations-service
Antes de agregar miembro:
consulta billing.
tasks-service
Antes de crear task:
consulta billing.

UI mínima
Remote:
billing-app
Pantalla:
plan actual
límites
uso actual
botón “Upgrade plan” (simulado)
Ruta:
/billing

Entregables verificables
Prueba obligatoria:
Plan Free
Crear 2 proyectos → OK
Crear 3ro → bloqueado
Cambiar plan a Pro:
→ ahora permitido sin reiniciar servicios.

Prueba de sistema distribuido
Apagar billing-service.
Intentar crear proyecto.
Resultado esperado:
→ sistema responde 503 Service Unavailable
(No debe permitir crear recursos sin validación)
Si permite → error crítico de negocio.

Tareas por desarrollador
Dev 1 — Infra
comunicación interna service-to-service
timeouts + circuit breaker
Dev 2 — Billing Service
suscripciones
contadores
policy engine
Dev 3 — Integración
modificar projects/org/tasks para policy check
manejo de errores
Dev 4 — Frontend
pantalla billing
mostrar límites alcanzados

Criterios de aceptación
Se aprueba solo si:
cambiar plan afecta comportamiento inmediatamente
ningún servicio conoce valores de planes
todo se decide en billing-service

Prueba realista de fallo
Modificar manualmente DB y poner:
projects_count = 999

El sistema debe bloquear creación automáticamente.

Errores típicos
Validar límites en frontend
Copiar límites en otros servicios
Cachear permisos indefinidamente
Permitir crear recursos si billing no responde
Hardcodear planes

Cuando funcione:
“Sprint completado”
y entramos en algo clave para operar en producción real: Observabilidad completa (OpenTelemetry + tracing distribuido).

Dijiste:
Sprint completado

ChatGPT dijo:
Perfecto.
Ahora entramos en lo que diferencia un sistema que funciona de uno que puede operarse en producción.
Hasta ahora, si algo falla… no sabes dónde.

SEMANA 8 — Observabilidad total (Tracing distribuido)
Objetivo de negocio
Cuando un cliente diga:
“No pude crear una task”
Debes poder encontrar la causa en menos de 5 minutos.
No logs manuales.
No “probemos reiniciar”.
Vas a poder ver el recorrido completo de una request entre microservicios y eventos.

Problema arquitectónico
En un monolito: 1 proceso → 1 log.
En tu sistema actual:
Browser → Gateway → BFF → Service → Event → Otro Service → DB → WebSocket
Sin observabilidad, esto es imposible de depurar.
Implementaremos:
Distributed Tracing + Métricas + Logs estructurados

Infraestructura nueva
Agregar:
OpenTelemetry Collector
Jaeger
Prometheus
Grafana
Todo en docker compose primero.
Debes poder abrir:
http://localhost:16686

y ver trazas.

Qué instrumentaremos
TODOS los servicios:
gateway
bffs
identity
organizations
projects
tasks
billing
notifications
audit
Sin excepción.

Qué debe verse en una traza
Ejemplo: Crear Task
Debe aparecer una única traza con spans:
POST /tasks (frontend)
→ gateway
→ tasks-bff
→ tasks-service
→ DB insert
→ outbox
→ RabbitMQ publish
→ notifications-service consume
→ websocket push

Si no están todos → mal instrumentado.

Propagación de contexto
Debes propagar:
traceparent header

Entre:
HTTP requests
mensajes RabbitMQ
WebSocket
Esto es lo más importante del sprint.

Logs estructurados (obligatorio)
Formato JSON:
timestamp
service
trace_id
span_id
level
message
workspace_id
user_id

Si no incluyen trace_id → no sirven.
Nada de console.log("hola").

Métricas obligatorias
Cada servicio debe exportar:
request_count
request_duration
error_count

Prometheus debe scrapearlos.
En Grafana debe existir dashboard con:
latencia por servicio
errores por servicio
throughput

Entregables verificables
Prueba obligatoria:
Crear proyecto
Crear task
Generar notificación
Ir a Jaeger:
→ ver la traza completa end-to-end.

Prueba crítica
Introducir un error intencional:
hacer que billing tarde 5 segundos.
Luego crear proyecto.
Debes poder ver:
dónde se demoró
qué servicio causó la latencia

Tareas por desarrollador
Dev 1 — Infra Observabilidad
collector
jaeger
prometheus
grafana
Dev 2 — Backend Services
instrumentar identity/org/projects/tasks
Dev 3 — Mensajería
propagar contexto en RabbitMQ
instrumentar consumers
Dev 4 — Frontend
enviar trace headers
correlación con backend

Criterios de aceptación
Se aprueba solo si:
cada request tiene trace_id
puedes seguir un evento async en Jaeger
puedes detectar servicio lento

Prueba realista de fallo
Apagar notifications-service.
Crear tasks.
En Jaeger debe verse:
→ error en consumer, pero request original exitosa.

Errores típicos
Solo instrumentar HTTP
No propagar en eventos
Logs sin correlación
Métricas solo en gateway
Mezclar logs humanos con técnicos

Cuando lo logren:
“Sprint completado”
y pasamos al punto donde los microservicios suelen morir en producción:
Resiliencia (circuit breakers, retries, idempotencia real).

Dijiste:
Sprint completado

ChatGPT dijo:
Bien.
Hasta ahora tu sistema funciona… solo cuando todo funciona.
Producción real = servicios caen todos los días.
Ahora vamos a hacer que el sistema sobreviva a fallos.

SEMANA 9 — Resiliencia real (circuit breakers, retries e idempotencia)
Objetivo de negocio
Aunque un servicio falle, el usuario puede seguir trabajando.
Ejemplo real esperado:
billing cae → no puedes crear proyectos, pero puedes verlos
notifications cae → puedes crear tasks igual
audit cae → el sistema sigue operativo
El sistema deja de ser frágil.

Problema arquitectónico
Actualmente tienes dependencias críticas:
projects → billing
tasks → projects (por eventos)
notifications → todo
Si uno se degrada, puede provocar cascading failure.
Implementaremos:
Fault tolerance + graceful degradation

Nuevas reglas del sistema
Cada comunicación síncrona debe tener:
timeout corto
retry con backoff
circuit breaker
fallback
Sin esto → no pasa el sprint.

Circuit Breaker (obligatorio)
Para llamadas:
projects → billing
organizations → billing
tasks → billing
Comportamiento:
Si billing falla 5 veces consecutivas:
→ se abre el circuito
→ no se siguen enviando requests
→ respuesta inmediata 503
Cuando billing vuelve:
→ half-open
→ prueba una request
→ si funciona, cierra.

Timeouts
Ninguna request interna puede esperar más de:
800 ms
Si tarda más → timeout.
Nada de esperas infinitas.

Retries con Backoff
Para HTTP:
3 reintentos:
100ms
300ms
700ms

Para eventos:
reintentos infinitos pero con DLQ.

Idempotencia (crítico)
Todos los consumers de eventos deben ser idempotentes.
Ejemplo:
ProjectCreated llega 3 veces
→ solo debe existir un project.
Implementar:
processed_events
event_id (unique)
processed_at

Si el evento ya existe → ignorar.

Cambios en Outbox
El publisher debe poder:
reintentar
no duplicar
sobrevivir a restart del servicio
Si reinicias un service mientras publica → no se pierden eventos.

Entregables verificables
Prueba obligatoria:
Apagar billing
Crear tasks
Navegar proyectos
Resultado:
navegación OK
creación de proyecto bloqueada
sistema estable

Prueba de estrés
Simular:
billing responde 500 durante 2 minutos.
El sistema:
no debe saturar billing
no debe aumentar latencias globales

Prueba de duplicados
Publicar manualmente el mismo evento:
TaskCreated

10 veces.
Resultado:
→ solo 1 task
→ 1 notificación
→ 1 audit log

Tareas por desarrollador
Dev 1 — Infra
configurar políticas de retry
DLQ
health checks reales
Dev 2 — Backend HTTP
circuit breaker
timeouts
fallbacks
Dev 3 — Eventos
idempotencia
processed_events
outbox robusto
Dev 4 — Frontend
manejo de degradación
mensajes claros (“servicio temporalmente no disponible”)

Criterios de aceptación
Se aprueba solo si:
apagar un servicio no rompe todo
no hay tormenta de requests
no hay duplicados

Prueba realista de fallo
Reiniciar RabbitMQ mientras el sistema corre.
Luego:
crear proyectos y tasks.
Cuando RabbitMQ vuelve:
→ todos los eventos pendientes se procesan.

Errores típicos
Retry infinito sin backoff
No tener timeouts
Idempotencia solo parcial
Fallback creando datos inconsistentes
Circuit breaker solo en gateway

Cuando el sistema sobreviva a fallos reales:
“Sprint completado”
y pasamos a algo imprescindible antes de cloud real:
Despliegue en Kubernetes + Helm + entornos (dev/staging/prod).

Dijiste:
Sprint completado

ChatGPT dijo:
Perfecto.
Ahora tu sistema ya merece salir de docker-compose.
Esto es el paso donde la mayoría de proyectos personales mueren: pasan de “funciona en mi PC” a “sistema operable”.

SEMANA 10 — Kubernetes + Helm + Entornos reales
Objetivo de negocio
El producto debe existir en:
dev
staging
producción
Y poder desplegarse sin conectarse al servidor por SSH.
Un deploy debe ser:
git push → sistema actualizado

Problema arquitectónico
Actualmente tu sistema depende de:
puertos locales
orden de arranque
estado manual
En producción:
los contenedores mueren
se reprograman
cambian de IP
Implementamos:
Infraestructura declarativa
Tu SaaS ahora vive en el cluster, no en máquinas.

Qué vas a instalar
Cluster local primero:
k3d o kind (recomendado k3d)
Luego dentro del cluster:
NGINX Ingress Controller
cert-manager (aunque sea self-signed)
PostgreSQL (helm chart)
RabbitMQ (helm chart)
Keycloak
OpenTelemetry stack
Todo dentro de Kubernetes.

Helm (obligatorio)
Cada slice ahora debe tener su chart:
identity-chart
organizations-chart
projects-chart
tasks-chart
billing-chart
notifications-chart
audit-chart
bff-charts
gateway-chart
frontend-shell-chart

Nada de kubectl apply -f sueltos.
Cada chart debe permitir:
replicaCount
image.tag
env
resources

Health checks
Todos los servicios deben exponer:
/health/live
/health/ready

Kubernetes usará:
liveness probe
readiness probe
Si un servicio se cuelga → Kubernetes lo reinicia.

Configuración (muy importante)
No más variables en código.
Usar:
ConfigMaps
Secrets
Ejemplos:
JWT issuer
DB connection
RabbitMQ URL

Ingress
Debes poder acceder a:
app.local
api.local
keycloak.local
grafana.local
jaeger.local

Desde navegador.
El gateway ahora vive dentro del cluster.

Persistencia
Las DB deben sobrevivir a:
kubectl delete pod

Si pierdes datos → mala configuración de volumes.

Entregables verificables
Prueba obligatoria:
Desplegar todo en k8s
Borrar un pod de projects
kubectl delete pod projects-xxxxx

Resultado:
→ se recrea
→ la app sigue funcionando

Prueba crítica
Escalar:
replicas: 3

para tasks-service.
Crear tasks concurrentemente.
Debe funcionar igual (stateless real).

Tareas por desarrollador
Dev 1 — Cluster
k3d
ingress
DNS local
Dev 2 — Helm Backend
charts de services
probes
secrets
Dev 3 — Datos & Broker
PostgreSQL
RabbitMQ
persistencia
Dev 4 — Frontend & Gateway
ingress routing
build images
deploy remotes independientes

Criterios de aceptación
Se aprueba solo si:
puedes reiniciar cualquier pod sin impacto
puedes escalar servicios
no dependes de localhost

Prueba realista de fallo
Reiniciar todo el cluster.
El sistema debe volver operativo sin intervención manual.

Errores típicos
Hardcodear URLs internas
Usar IPs en vez de DNS de k8s
Servicios stateful sin volume
BFF guardando sesiones en memoria
Frontend build dependiente de backend

Cuando todo levante desde cero:
“Sprint completado”
y pasamos al último salto de madurez:
CI/CD + GitOps con ArgoCD (deploy automático real).

Dijiste:
Sprint completado

ChatGPT dijo:
Excelente.
Ahora ya no alcanza con poder desplegar…
necesitas no volver a tocar el cluster nunca más.

SEMANA 11 — CI/CD + GitOps (ArgoCD)
Objetivo de negocio
Cualquier cambio en el código debe terminar automáticamente en el entorno correspondiente:
merge a develop → deploy en dev
merge a staging → deploy en staging
merge a main → deploy en producción
Sin kubectl.
Sin entrar al servidor.

Problema arquitectónico
Hoy el deploy depende de personas.
En una empresa real eso es un riesgo operativo.
Implementamos:
Git es la única fuente de verdad del sistema
El cluster solo obedece a Git.

Qué vas a instalar en el cluster
Dentro de Kubernetes:
ArgoCD
Debes poder entrar a:
argocd.local

Desde el navegador.

Nuevo repositorio (muy importante)
Crear repo separado:
saas-infra

Aquí NO hay código.
Solo:
helm values
charts
environments

Estructura:
environments/
dev/
staging/
prod/

Cada entorno tiene sus propios values.yaml.

Cómo funcionará
Pipeline:
haces push del código
CI construye imagen docker
la sube al registry
CI actualiza values.yaml en saas-infra
ArgoCD detecta cambio
ArgoCD sincroniza cluster
Tú no despliegas.
ArgoCD despliega.

CI obligatorio (por cada servicio)
Usar GitHub Actions o GitLab CI.
Cada microservicio debe:
correr tests
build docker image
tag:
service-name:git-sha

push a registry
Si tests fallan → no hay imagen.

Auto deploy
El pipeline debe modificar automáticamente:
image.tag

en el repo infra.
Ejemplo:
projects-service:
image:
tag: a3f91c2

Eso dispara ArgoCD.

Rollback (muy importante)
Debes poder:
en ArgoCD → seleccionar versión anterior → revertir.
Sin rebuild.
Sin reconfigurar nada.

Secretos
Nada de contraseñas en repos.
Usar:
Sealed Secrets o
External Secrets
Keycloak, DB passwords, JWT secrets → fuera del código.

Entregables verificables
Prueba obligatoria:
Cambiar texto en projects-frontend
Hacer merge a develop
Resultado:
→ en dev aparece automáticamente el cambio.

Prueba crítica
Deployar una versión rota (romper intencionalmente un endpoint).
Luego:
Rollback desde ArgoCD.
El sistema debe volver a funcionar en menos de 2 minutos.

Tareas por desarrollador
Dev 1 — ArgoCD
instalar
apps
sync policies
Dev 2 — CI pipelines backend
tests
build
push
Dev 3 — Infra repo
values por entorno
versionado
Dev 4 — Frontend CI
build remotes
versionado independiente

Criterios de aceptación
Se aprueba solo si:
nadie usa kubectl para deployar
todo cambio pasa por Git
rollback funciona

Prueba realista de fallo
Romper deliberadamente tasks-service.
El pipeline debe:
deployar
detectar fallo (readiness probe)
permitir rollback inmediato

Errores típicos
ArgoCD solo para mirar
Cambiar manualmente el cluster
Secrets en values.yaml
Un solo entorno
Rebuild para rollback

Cuando tengas deploy automático real:
“Sprint completado”
y entramos en el último nivel técnico antes de escalar clientes:
Seguridad SaaS real (RBAC por recurso + permisos finos).

Dijiste:
Sprint completado

ChatGPT dijo:
Ahora sí: hasta aquí tenías multi-tenant, pero no tenías seguridad real.
Hoy cualquier miembro del workspace puede hacer todo.
Eso en un cliente empresa significa cancelación inmediata.

SEMANA 12 — RBAC por recurso (permisos finos reales)
Objetivo de negocio
Dentro del mismo workspace:
Admin puede crear proyectos
Member puede crear tasks
Viewer solo puede leer
Y además:
Un usuario puede ser admin en un proyecto pero no en otro.
El sistema debe bloquear acciones aunque el frontend sea manipulado.

Problema arquitectónico
Actualmente solo validas:
pertenece al workspace → permitido

Eso no es suficiente.
Implementaremos:
Authorization distribuida por recurso
NO va en el gateway.
NO va en el frontend.
NO va en Keycloak.
Va dentro de tu sistema.

Nuevo concepto
Permission Service (nuevo slice)
Componentes:
permissions-service
permissions-db
permissions-bff
permissions-frontend (mínimo panel admin)
Este servicio será el Policy Decision Point.
Todos los demás servicios preguntarán:
¿este usuario puede hacer esta acción sobre este recurso?

Modelo de datos
roles
id
name
scope (workspace | project)

permissions
id
action
resource

role_permissions
role_id
permission_id

assignments
id
user_id
role_id
workspace_id
resource_id (nullable)

Ejemplo:
workspace role: ADMIN
project role: PROJECT_MANAGER

Acciones del sistema
Definir mínimo:
CREATE_PROJECT
ARCHIVE_PROJECT
CREATE_TASK
CHANGE_TASK_STATUS
ADD_MEMBER
VIEW_AUDIT
MANAGE_BILLING

API interna (crítica)
Todos los servicios ahora deben consultar:
POST /internal/authorize

Input:
user_id
workspace_id
action
resource_type
resource_id

Output:
allowed: true/false

Cambios obligatorios
projects-service
Antes de crear proyecto → authorize
tasks-service
Antes de crear o modificar task → authorize
audit-bff
Antes de mostrar logs → authorize
billing-bff
Solo admin.
Si el permiso falla → 403.

Cache obligatorio
No puedes llamar permissions en cada request a DB.
Implementar:
cache en memoria o Redis
invalidación por eventos
Evento nuevo:
PermissionsUpdated

Cuando cambia un rol → todos los servicios invalidan cache.

UI mínima
permissions-admin (remote)
Pantalla:
lista miembros
seleccionar usuario
asignar rol en workspace
asignar rol en proyecto
Ruta:
/settings/permissions

Entregables verificables
Prueba obligatoria:
Usuario A admin
Usuario B viewer
B intenta crear proyecto.
Resultado:
→ 403 aunque modifique la request manualmente.

Prueba crítica
Asignar rol:
PROJECT_MANAGER solo en proyecto X

Debe:
poder crear tasks en X
no poder en otros proyectos

Tareas por desarrollador
Dev 1 — Permissions Service
modelos
authorize endpoint
eventos
Dev 2 — Integraciones
agregar authorize en projects/tasks/org/billing
Dev 3 — Cache & Eventos
cache distribuido
invalidación
Dev 4 — Frontend
panel permisos
roles por proyecto

Criterios de aceptación
Se aprueba solo si:
ningún servicio decide permisos por sí mismo
frontend no controla seguridad
cambiar rol impacta inmediatamente

Prueba realista de fallo
Dar permisos → quitar permisos → intentar acción sin refrescar página.
Debe bloquear inmediatamente.

Errores típicos
Confiar en JWT roles
Permisos en gateway
Hardcodear roles
No invalidar cache
Seguridad solo en UI

Cuando el sistema realmente bloquee acciones:
“Sprint completado”
y entramos a algo que cambia el producto:
Búsqueda global y proyecciones (read models + indexing tipo Notion/Jira).

Dijiste:
Sprint completado

ChatGPT dijo:
Ahora tu producto ya es usable… pero todavía es lento para usuarios reales.
Cuando tengas 50k tasks, 2k proyectos y 300 usuarios, nadie va a navegar árbol por árbol.
Necesitan buscar.

SEMANA 13 — Búsqueda global (Read Models + Indexing)
Objetivo de negocio
Desde una sola barra el usuario puede escribir:
website

y obtener:
proyectos
tareas
miembros
(luego comentarios)
Sin abrir cada módulo.
Esto cambia la experiencia a algo tipo Notion/Jira.

Problema arquitectónico
Tus microservicios están optimizados para escritura (OLTP).
La búsqueda es lectura pesada (OLAP-like).
No puedes consultar:
projects-service
tasks-service
organizations-service
en tiempo real.
Implementaremos:
Read Model desacoplado + indexador por eventos
Nace un nuevo tipo de servicio: proyección de lectura.

Nuevo Slice
Search Slice
Componentes:
search-service
search-index (Elasticsearch u OpenSearch recomendado)
search-bff
search-frontend
Este servicio no tiene datos propios.
Solo índices derivados.

Qué hará
Escuchará eventos de:
ProjectCreated
ProjectArchived
TaskCreated
TaskStatusChanged
UserAddedToWorkspace
WorkspaceRenamed (nuevo evento en organizations)

Y construirá documentos indexados.

Documento indexado
Ejemplo:
{
id: "task-uuid",
workspace_id: "w1",
type: "task",
title: "Fix login bug",
project_name: "Website",
status: "doing",
text: "Fix login bug Website doing",
updated_at: ...
}

Reglas IMPORTANTES
Search nunca llama a otros servicios
Search nunca es fuente de verdad
Si el índice se borra → se reconstruye por eventos

Nuevo proceso
Indexer Worker
El search-service debe tener un worker que:
consume eventos
transforma
indexa
Idempotente obligatorio.

API
search-bff
GET /search?q=
GET /search/suggestions?q=

Filtrado obligatorio por:
workspace_id

Nunca debe poder verse info de otro tenant.

UI mínima
Agregar en el Shell:
barra global de búsqueda
Resultados agrupados:
Projects
Tasks
People
Click debe navegar al remote correspondiente.

Entregables verificables
Prueba obligatoria:
Crear proyecto "Website"
Crear task "Fix header"
Buscar "header"
→ debe aparecer la task sin abrir tasks-app.

Prueba crítica (muy importante)
Borrar completamente el índice de búsqueda.
Reiniciar search-service.
Resultado esperado:
→ el sistema reindexa automáticamente desde eventos.
Si necesitas scripts manuales → mal diseño.

Tareas por desarrollador
Dev 1 — Infra
levantar OpenSearch/Elastic
persistencia
Dev 2 — Search Service
consumidores
indexador
reconstrucción
Dev 3 — Search BFF
endpoints
filtros por workspace
ranking básico
Dev 4 — Frontend
barra global
dropdown resultados
navegación a remotes

Criterios de aceptación
Se aprueba solo si:
la búsqueda es casi inmediata (<500ms)
no hace llamadas a otros servicios
respeta tenants

Prueba realista de fallo
Apagar projects-service.
La búsqueda debe seguir funcionando con datos existentes.

Errores típicos
Consultar APIs para buscar
No filtrar por workspace
Indexar solo título
No manejar eventos antiguos
Depender de orden perfecto de eventos

Cuando puedas encontrar cualquier entidad desde una barra:
“Sprint completado”
y pasamos al paso que permite analítica real para empresas:
Analytics + métricas de uso por workspace (event warehouse).

Dijiste:
Sprint completado

ChatGPT dijo:
Perfecto.
Ahora tu SaaS funciona para operar… pero una empresa te va a pedir:
“¿Cuánto lo usan mis equipos?”
Necesitas analítica de producto real.

SEMANA 14 — Analytics (event warehouse + métricas por workspace)
Objetivo de negocio
Un admin puede ver:
actividad diaria
usuarios activos
tareas creadas
proyectos activos
Por su propio workspace.
Y tú podrás saber qué clientes usan realmente el producto.

Problema arquitectónico
No puedes calcular métricas desde las DB de los microservicios:
son OLTP
afectan performance
rompen independencia
Implementamos:
Event Warehouse (event sourcing parcial para analítica)
Todos los servicios ahora también generan eventos analíticos.

Nuevo Slice
Analytics Slice
Componentes:
analytics-service
analytics-db (ClickHouse recomendado, PostgreSQL aceptable)
analytics-bff
analytics-frontend
Este servicio no participa en operaciones del sistema.
Solo observa.

Eventos que consumirá
No reutilices exactamente los de dominio.
Crear eventos analíticos:
UserLoggedIn
ProjectViewed
TaskViewed
TaskCreated
TaskCompleted
WorkspaceActive
SearchPerformed
NotificationOpened

Se publican al broker igual que los demás.

Modelo de datos
Tabla principal:
events
id
workspace_id
user_id
event_type
entity_type
entity_id
metadata (json)
timestamp

Luego crear tablas agregadas:
daily_workspace_stats
daily_user_stats
feature_usage

Estas se calculan por workers (no en request).

Workers (importante)
Un proceso batch cada minuto:
agrega métricas
genera contadores
calcula DAU / WAU
Nada de queries pesadas desde el frontend.

APIs
analytics-bff
GET /stats/overview
GET /stats/activity
GET /stats/users
GET /stats/features

Siempre filtrado por workspace_id.

UI mínima
Remote:
analytics-app
Dashboard:
usuarios activos (gráfico)
tareas creadas por día
proyectos activos
uso por feature
Ruta:
/analytics

Entregables verificables
Prueba obligatoria:
usar el sistema 10 minutos
ir a analytics
→ deben aparecer gráficos con datos reales.

Prueba crítica
Apagar analytics-service durante uso normal 15 min.
Encenderlo.
Resultado:
→ procesa backlog de eventos y aparecen métricas históricas.
Si se pierden → mala arquitectura.

Tareas por desarrollador
Dev 1 — Broker
colas separadas para analytics
retención alta
Dev 2 — Analytics Service
ingestión de eventos
workers agregadores
Dev 3 — Analytics BFF
endpoints optimizados
caching
Dev 4 — Frontend
dashboard
gráficos (chart library)

Criterios de aceptación
Se aprueba solo si:
analytics no afecta performance del sistema
funciona aunque servicios caigan
no hay queries cross-service

Prueba realista de fallo
Generar 10k eventos.
El sistema principal debe seguir respondiendo normal.

Errores típicos
Consultar DB de projects/tasks
Calcular métricas en tiempo real
No usar workers
Mezclar audit con analytics
Bloquear requests por analytics

Cuando tengas métricas reales:
“Sprint completado”
y entramos en una de las piezas más difíciles del SaaS colaborativo:
Comentarios, menciones y colaboración en tiempo real (tipo Notion/Jira threads).

Dijiste:
Sprint completado

ChatGPT dijo:
Ahora tu sistema ya gestiona trabajo…
pero todavía no es colaborativo de verdad.
Las empresas no compran gestores de tareas.
Compran comunicación alrededor del trabajo.

SEMANA 15 — Comentarios, menciones y threads
Objetivo de negocio
Dentro de una task los usuarios pueden:
escribir comentarios
responder (threads)
mencionar @usuario
el usuario mencionado recibe notificación inmediata
La task pasa a ser un espacio de conversación.

Problema arquitectónico
Esto introduce algo nuevo:
Datos altamente concurrentes + tiempo real + permisos + notificaciones
Y además los comentarios deben:
aparecer en vivo
persistir
generar notificaciones
auditarse
indexarse en búsqueda
Sin acoplar servicios.

Nuevo Slice
Comments Slice
Componentes:
comments-service
comments-db
comments-bff
comments-frontend
websocket channel (se integra con notifications-service)

Modelo de datos
comments
id
workspace_id
task_id
author_user_id
content
created_at
edited_at
deleted

comment_threads
id
parent_comment_id
child_comment_id

Soporta respuestas anidadas (máx profundidad 3).

Eventos que emite
CommentCreated
CommentEdited
CommentDeleted
UserMentioned

Menciones
Al guardar un comentario:
parsear @username
resolver a user_id (desde cache local de miembros)
emitir:
UserMentioned

notifications-service enviará alerta.
comments-service NO envía notificaciones directo.

Permisos
Antes de crear comentario:
consultar permissions-service:
COMMENT_TASK

Si usuario solo viewer → 403.

Tiempo real
Cuando alguien comenta:
guardar en DB
emitir evento
publicar por WebSocket (canal por task_id)
Otros usuarios en la misma task ven el comentario aparecer sin refrescar.

UI mínima
Dentro de la pantalla de task:
Panel lateral:
lista de comentarios
editor de texto
responder comentario
resaltar @menciones
Debe actualizarse en vivo.

Búsqueda y audit
search-service:
indexar comentarios (solo texto)
audit-service:
registrar CommentCreated
Sin integraciones manuales.

Entregables verificables
Prueba obligatoria:
2 usuarios abren misma task
uno escribe comentario
→ el otro lo ve instantáneamente.

Prueba crítica
Mencionar usuario offline:
@ana

Cuando ana se conecte:
→ debe tener notificación pendiente.

Tareas por desarrollador
Dev 1 — Comments Service
modelo
menciones
eventos
Dev 2 — Tiempo real
canal websocket por task
reconexión
Dev 3 — Integraciones
permissions
notifications
audit
search
Dev 4 — Frontend
panel comentarios
threads
highlight menciones

Criterios de aceptación
Se aprueba solo si:
no hay polling
funciona con 2 usuarios simultáneos
menciones notifican correctamente

Prueba realista de fallo
Apagar notifications-service.
Comentar con menciones.
Encenderlo.
→ las notificaciones deben enviarse igualmente (por eventos acumulados).

Errores típicos
Guardar usuarios en comments DB
Enviar notificación directo por HTTP
Broadcast global
No validar permisos
No soportar reconexión

Cuando los usuarios puedan conversar dentro de una task:
“Sprint completado”
y pasamos al último gran bloque funcional del producto:
Adjuntos, almacenamiento y gestión de archivos (tipo Google Drive dentro de tareas).

Dijiste:
Sprint completado

ChatGPT dijo:
Perfecto.
Ahora el producto entra en terreno enterprise real:
Sin archivos adjuntos, ninguna empresa migra.
Necesitas manejar documentos, imágenes, PDFs… sin destruir tu arquitectura.

SEMANA 16 — Adjuntos y almacenamiento de archivos
Objetivo de negocio
Dentro de una task los usuarios pueden:
subir archivos
descargar archivos
ver previews (imagen/pdf)
borrar archivos
Y los archivos pertenecen al workspace (no al usuario).

Problema arquitectónico
Error típico: guardar archivos en el backend.
Eso rompe:
escalabilidad
despliegues
pods efímeros en Kubernetes
Implementaremos:
Object Storage desacoplado (estilo S3)
Los microservicios no almacenan archivos.
Solo metadatos.

Nuevo Slice
Files Slice
Componentes:
files-service
files-db
files-bff
files-frontend
Object Storage (MinIO en local, S3 en prod)

Modelo de datos
files
id
workspace_id
task_id
uploaded_by
filename
content_type
size
object_key
created_at
deleted

No guardar binarios en DB.

Flujo de subida (muy importante)
El archivo NO pasa por tu backend.
Proceso:
frontend pide permiso:
POST /files/upload-url

files-service valida permisos:
UPLOAD_FILE en task

responde:
pre-signed URL
object_key

browser sube directo a S3/MinIO
frontend confirma:
POST /files/confirm

se guarda metadata y se emite evento.

Eventos
FileUploaded
FileDeleted

Consumidos por:
audit
search (solo nombre)
analytics

Descarga
Descargar también usa:
GET /files/{id}/download-url

→ devuelve URL temporal firmada.
Nunca exponer bucket público.

Seguridad
URLs expiran (5 min)
validar workspace
validar permisos
tamaño máximo por plan (integrar billing)
Ejemplo:
Free: 10MB
Pro: 200MB
billing-service decide.

UI mínima
Dentro de la task:
Panel:
subir archivo (drag & drop)
lista archivos
preview imagen/pdf
botón download
botón delete

Entregables verificables
Prueba obligatoria:
subir imagen
verla desde otro navegador
reiniciar files-service
→ el archivo sigue existiendo.

Prueba crítica
Reiniciar todo Kubernetes.
Los archivos deben seguir accesibles.
Si se pierden → mala configuración de storage.

Tareas por desarrollador
Dev 1 — Storage
MinIO
buckets
políticas
Dev 2 — Files Service
presigned URLs
metadata
eventos
Dev 3 — Integraciones
billing (tamaño)
permissions
audit/search/analytics
Dev 4 — Frontend
upload UI
progress bar
preview

Criterios de aceptación
Se aprueba solo si:
backend no recibe el archivo
no hay archivos en contenedores
funciona tras reinicio

Prueba realista de fallo
Subir archivo grande y matar el pod durante upload.
El sistema no debe corromper datos ni registrar archivo incompleto.

Errores típicos
Multipart al backend
Bucket público
Guardar ruta local
No expirar URLs
No validar workspace

Cuando los usuarios puedan trabajar con documentos:
“Sprint completado”
y entramos en la última capa de producto SaaS profesional:
Invitaciones externas, onboarding y acceso por email (collaboration outside the company).

Dijiste:
Sprint completado

ChatGPT dijo:
Ahora tu producto sirve dentro de una empresa…
pero todavía no puede crecer solo.
Un SaaS real crece cuando un usuario invita a otro.

SEMANA 17 — Invitaciones externas y onboarding por email
Objetivo de negocio
Un usuario puede invitar a otra persona por email:
escribe el email
el invitado recibe un link
crea su cuenta
entra directamente al workspace correcto
Sin intervención manual.

Problema arquitectónico
Aquí aparece algo delicado:
El usuario aún no existe en el sistema cuando lo invitan.
No puedes:
crear el usuario en identity
asignar membresía inmediatamente
confiar en el frontend
Implementaremos:
Invitation Flow desacoplado basado en tokens firmados + eventos

Nuevo Slice
Invitations Slice
Componentes:
invitations-service
invitations-db
invitations-bff
email worker
Este servicio coordina el acceso inicial.

Modelo de datos
invitations
id
workspace_id
email
role
token_hash
expires_at
accepted
invited_by
created_at

El token no se guarda plano. Solo hash.

Flujo completo

1. Invitar
   Admin ejecuta:
   POST /invitations
   email
   role

invitations-service:
genera token firmado (JWT o random + firma)
guarda hash
emite:
UserInvited

email worker envía correo.

2. Link del email
   El link:
   app.local/invite?token=XXXX

El frontend:
llama invitations-bff/validate
Si válido → redirige a login (Keycloak).

3. Primer login del invitado
   Después de autenticarse:
   identity-service emite UserRegistered.
   invitations-service escucha ese evento:
   matchea por email
   crea membresía en organizations-service (evento)
   Evento emitido:
   InvitationAccepted
   MemberAddedToWorkspace

El usuario entra directamente al workspace.

Seguridad (muy importante)
token expira (48h)
un solo uso
invalidado al aceptar
no revelar si el email existe
rate limit en invitaciones

Cambios en Organizations
organizations-service ya no crea miembros directo.
Ahora solo responde a evento:
MemberAddedToWorkspace

Emitido por invitations-service.

Emails
Implementar worker:
Puede usar:
SMTP local (Mailhog recomendado)
Template mínimo:
nombre workspace
quién invitó
botón “Join workspace”

UI mínima
En settings del workspace:
Pantalla:
invitar por email
rol
lista de pendientes
cancelar invitación

Entregables verificables
Prueba obligatoria:
invitar email real (o mailhog)
abrir link
registrarse
entrar automáticamente al workspace
Sin intervención manual.

Prueba crítica
Invitar usuario que ya tiene cuenta.
Debe:
loguearse
entrar directo al workspace
sin crear duplicados.

Tareas por desarrollador
Dev 1 — Invitations Service
tokens
expiración
eventos
Dev 2 — Integraciones
identity listener
organizations membership
Dev 3 — Email Worker
plantillas
envío
reintentos
Dev 4 — Frontend
pantalla invitar
flujo aceptación

Criterios de aceptación
Se aprueba solo si:
un usuario externo puede entrar solo
no hay creación manual de usuarios
no hay acceso sin invitación

Prueba realista de fallo
Aceptar invitación cuando invitations-service está caído.
Al volver:
→ debe procesarse automáticamente por eventos.

Errores típicos
Crear usuario antes del login
Token sin expiración
Pasar workspace_id en URL sin firma
Crear membresía desde frontend
No manejar usuarios existentes

Cuando puedas invitar a alguien externo y entre solo:
“Sprint completado”
y pasamos a la última etapa funcional antes de optimización:
Automatizaciones y reglas (workflows tipo ClickUp/Jira automation).

Dijiste:
Sprint completado

ChatGPT dijo:
Perfecto.
Ahora tu producto puede crecer solo.
El siguiente paso es lo que hace que las empresas dependan del sistema: automatizar su trabajo.

SEMANA 18 — Automatizaciones y Reglas (Workflows)
Objetivo de negocio
Un admin puede definir:
“Cuando pase X → hacer Y automáticamente”
Ejemplos reales:
cuando una task pasa a DONE → notificar al creador
cuando se crea una task → asignar responsable
cuando se crea proyecto → crear tareas iniciales
cuando se menciona a alguien → agregar como watcher
Sin código. Desde UI.

Problema arquitectónico
Las automatizaciones NO pueden vivir dentro de:
tasks-service
projects-service
Porque se volverían dependientes entre sí.
Implementaremos:
Event-driven Workflow Engine desacoplado
Un servicio que escucha eventos del sistema y ejecuta acciones.

Nuevo Slice
Automation Slice
Componentes:
automation-service
automation-db
automation-bff
automation-frontend
worker executor
No tiene endpoints usados por otros servicios.
Solo:
eventos → reglas → acciones.

Modelo de datos
automations
id
workspace_id
name
enabled
trigger_event
conditions (json)
actions (json)
created_by
created_at

Ejemplo:
Trigger:
TaskStatusChanged
status=done

Action:
NotifyUser
user=task.creator

Concepto importante
La automatización NO ejecuta lógica directamente.
Publica comandos por eventos.
Ejemplo:
AssignUserToTask
CreateTask
SendNotification
AddWatcher

Los servicios escuchan esos comandos y actúan.
Esto evita acoplamiento.

Eventos que debe escuchar
TaskCreated
TaskStatusChanged
ProjectCreated
CommentCreated
UserMentioned

Motor de ejecución
Flujo:
llega evento
buscar reglas activas del workspace
evaluar condiciones
generar acciones
publicar comandos
Debe ser asíncrono.
Nunca bloquear el request original.

Seguridad
Antes de ejecutar acción:
validar con permissions-service
(usando usuario creador de la automatización como actor).

UI mínima
Pantalla:
Automation Builder
Formulario simple:
seleccionar trigger
agregar condición
seleccionar acción
No necesitas drag&drop complejo aún.
Ruta:
/settings/automations

Entregables verificables
Prueba obligatoria:
Crear regla:
WHEN task created
THEN assign user X

Crear task:
→ automáticamente asignada.

Prueba crítica
Crear regla:
WHEN task done
THEN create task "QA Review"

Cambiar estado:
→ aparece nueva task sin intervención.

Tareas por desarrollador
Dev 1 — Automation Service
modelo
motor evaluación
publicación comandos
Dev 2 — Integraciones
consumers en tasks/projects/notifications
Dev 3 — Seguridad
validación con permissions
actor contextual
Dev 4 — Frontend
builder UI
lista reglas

Criterios de aceptación
Se aprueba solo si:
las automatizaciones sobreviven reinicios
no bloquean operaciones
no requieren cambios en otros servicios

Prueba realista de fallo
Crear 100 tasks rápidamente.
Las automatizaciones deben ejecutarse sin duplicados ni pérdida.

Errores típicos
Ejecutar acciones por HTTP directo
Hardcodear lógica en tasks-service
No validar permisos
Ejecutar sin colas
Bloquear requests originales

Cuando el sistema haga trabajo solo:
“Sprint completado”
y entramos a la fase de preparación para clientes reales:
Cuotas, rate limiting por tenant y protección anti abuso.

Dijiste:
Sprint completado

ChatGPT dijo:
Bien.
Ahora tu SaaS ya automatiza trabajo… pero todavía no se protege.
Cuando abras el registro público vas a tener:
scripts
crawlers
usuarios abusando la API
un tenant consumiendo todo
Necesitas aislar consumo por cliente.

SEMANA 19 — Cuotas y Rate Limiting por Tenant
Objetivo de negocio
Un workspace no puede degradar a los demás.
Ejemplo:
Un cliente hace 10.000 requests/min →
solo ese cliente se ralentiza, el resto funciona normal.

Problema arquitectónico
El rate limit típico es por IP o usuario.
En SaaS multi-tenant eso no sirve.
Implementaremos:
Throttling y cuotas por workspace (tenant-aware protection)
El sistema empieza a protegerse solo.

Componentes nuevos
No es un dominio funcional, es infra transversal:
Redis (obligatorio)
Rate Limit Middleware en Gateway
Quotas Worker

Qué vamos a limitar
Por workspace_id:
requests HTTP
creación de tasks
subida de archivos
ejecuciones de automatizaciones
búsquedas

Rate Limiting (tiempo real)
En el API Gateway:
Cada request debe:
leer X-Workspace-Id
consultar Redis
aplicar política
Ejemplo plan Free:
100 requests / minuto

Si supera:
429 Too Many Requests
Retry-After: 30

Los otros tenants siguen normales.

Cuotas (consumo acumulado)
No es velocidad, es uso mensual.
Ejemplo:
Free:
5.000 tasks / mes
1GB almacenamiento
2.000 búsquedas
Nuevo proceso:
Quotas Worker
Consume eventos:
TaskCreated
FileUploaded
SearchPerformed
AutomationExecuted

Actualiza:
workspace_usage_monthly

Integración con Billing
billing-service ahora decide:
isQuotaExceeded(workspace, feature)

Si excedido:
los servicios deben bloquear operación.
Ejemplo:
crear task → 402 Payment Required.

Cambios en Gateway
Debe agregar headers:
X-RateLimit-Remaining
X-RateLimit-Reset

El frontend mostrará advertencias.

UI mínima
En /billing:
Panel nuevo:
consumo actual
límite
porcentaje usado
aviso “near limit”

Entregables verificables
Prueba obligatoria:
Script:
hacer 150 requests rápidos.
Resultado:
→ solo ese workspace recibe 429.

Prueba crítica
Alcanzar cuota mensual de tasks.
Intentar crear otra:
→ bloqueado aunque rate limit esté OK.

Tareas por desarrollador
Dev 1 — Gateway
rate limit por workspace
redis counters
Dev 2 — Quotas Worker
consumo mensual
reset mensual automático
Dev 3 — Billing Integration
bloquear operaciones
Dev 4 — Frontend
avisos de límite
manejo 429

Criterios de aceptación
Se aprueba solo si:
un tenant abusivo no afecta otros
límites aplican inmediatamente
reinicio de servicios no resetea contadores

Prueba realista de fallo
Reiniciar Redis.
El sistema debe:
recuperar contadores
no permitir abuso masivo

Errores típicos
Rate limit por IP
Contadores en memoria
No sincronizar con billing
Resetear al reiniciar pods
Bloquear todo el sistema

Cuando el sistema se proteja solo:
“Sprint completado”
y entramos en la última fase técnica:
Performance y caching distribuido (escala a miles de usuarios).

Dijiste:
Sprint completado

ChatGPT dijo:
Perfecto.
Ahora tu sistema es correcto… pero todavía no escala.
Si mañana entran 2.000 usuarios simultáneos, hoy vas a saturar:
DBs
permissions-service
search
analytics
Necesitas que el sistema responda rápido sin tocar la lógica.

SEMANA 20 — Performance y caching distribuido
Objetivo de negocio
La app debe sentirse instantánea:
abrir proyecto < 300ms
listar tasks < 300ms
cambiar de workspace inmediato
Incluso con muchos usuarios.

Problema arquitectónico
Hoy cada request:
→ consulta DB
→ valida permisos
→ arma respuesta
Eso no escala.
Implementaremos:
Caching multinivel (edge + service + query)
Sin romper consistencia.

Capas de cache
Tendrás 3 niveles:
Gateway Cache (responses cortas)
Service Cache (queries frecuentes)
Permission Cache distribuido
Redis será central.

Qué debes cachear
En permissions-service
El mayor cuello de botella.
Cache obligatorio:
(user_id, workspace_id, resource, action) → allowed
TTL: 60s

Invalidación por evento:
PermissionsUpdated

En tasks-service
Cache:
GET /projects/{id}/tasks

Clave:
tasks:list:{workspace}:{project}

Invalidar cuando:
TaskCreated
TaskUpdated
TaskDeleted
TaskStatusChanged

En projects-service
Cache:
GET /projects

En organizations
Cache membresías:
user memberships

(esto reduce llamadas a permissions)

Gateway Cache
El gateway puede cachear:
GET requests
TTL: 10–30s

Pero solo si:
autenticado
con workspace header
Clave incluye workspace.

Reglas IMPORTANTES
Nunca cachear:
POST
PATCH
datos de billing críticos
authorize responses más de 60s

Invalidación por eventos
No usar solo TTL.
Cada servicio debe escuchar eventos y borrar claves relacionadas.
Ejemplo:
TaskCreated → borrar tasks:list:{workspace}:{project}

Esto es clave del sprint.

Métrica obligatoria
Debes medir:
cache_hit_ratio

Objetivo:
mínimo 70% hits
Verlo en Grafana.

Entregables verificables
Prueba obligatoria:
abrir proyecto 20 veces seguidas
La DB debe recibir muy pocas queries.
(Ver en métricas)

Prueba crítica
Crear task.
Inmediatamente listar tasks.
→ debe aparecer (cache invalidado correctamente)

Tareas por desarrollador
Dev 1 — Redis
cluster
persistencia
métricas
Dev 2 — Permission Cache
implementación
invalidación por eventos
Dev 3 — Service Caches
tasks/projects/org caches
eviction
Dev 4 — Gateway Cache + métricas
headers
grafana dashboard

Criterios de aceptación
Se aprueba solo si:
latencia baja notablemente
datos no quedan stale
cache se invalida por eventos

Prueba realista de fallo
Apagar Redis.
El sistema debe seguir funcionando (más lento, pero correcto).
Si falla → dependes del cache.

Errores típicos
Cache sin invalidación
Cachear permisos indefinidamente
Claves sin workspace_id
Cachear POST responses
Hacer del cache una dependencia crítica

Cuando el sistema responda rápido incluso bajo carga:
“Sprint completado”
y entramos en el último gran paso antes del lanzamiento:
Migraciones, versionado de APIs y backward compatibility (zero downtime deploys).

Dijiste:
Sprint completado

ChatGPT dijo:
Excelente.
Ahora tu sistema es rápido… pero aún tiene un riesgo enorme:
Cada deploy puede romper a los clientes activos.
En un SaaS real no existe el mantenimiento programado.

SEMANA 21 — Migraciones y versionado sin downtime
Objetivo de negocio
Poder desplegar una nueva versión mientras usuarios están trabajando:
sin cerrar sesiones
sin errores 500
sin perder datos
Deploy invisible para el cliente.

Problema arquitectónico
Actualmente:
nuevo código + DB vieja
o
DB nueva + código viejo
→ incompatibilidad.
Implementaremos:
Expand & Contract + API versioning

Regla central
Nunca hacer cambios destructivos directos en DB.
Primero expandes, luego migras, luego eliminas.

Estrategia de migraciones
Paso 1 — Expand
Agregar sin romper.
Ejemplo:
Agregar campo description a projects:
ALTER TABLE projects ADD COLUMN description TEXT NULL;

El código viejo sigue funcionando.

Paso 2 — Código compatible
El nuevo código:
escribe en ambos formatos si hace falta
soporta nulls
no asume existencia
Esto es obligatorio.

Paso 3 — Backfill
Crear worker:
migration-worker

Rellena datos históricos sin bloquear sistema.
Nunca hacer:
UPDATE massive_table;

en una sola transacción.
Debe hacerlo por lotes (batch).

Paso 4 — Contract
Cuando todo el tráfico usa el nuevo campo:
recién ahí puedes eliminar el viejo.
Este paso puede ser semanas después.

API Versioning
Los BFF ahora deben soportar:
/api/v1/...
/api/v2/...

El gateway enruta según header:
Accept-Version

No romper clientes viejos.

Compatibilidad de eventos
Los eventos también tienen versión:
TaskCreated v1
TaskCreated v2

Regla:
Un consumer debe ignorar campos desconocidos.
Nunca depender de orden estricto.

Feature Flags
Introducir:
feature-flags-service (simple)

o LaunchDarkly-like básico.
Permite:
activar funcionalidad por workspace
probar sin afectar todos
Ejemplo:
solo ACME usa nueva vista tasks.

Entregables verificables
Prueba obligatoria:
usuario crea tasks
mientras tanto deployar nueva versión
→ el usuario no nota nada.

Prueba crítica
Agregar nueva columna requerida.
Sistema debe:
seguir funcionando
rellenar datos gradualmente

Tareas por desarrollador
Dev 1 — Migraciones
scripts expand/contract
batch worker
Dev 2 — API versioning
rutas v1/v2
gateway routing
Dev 3 — Eventos
versionado
consumers tolerantes
Dev 4 — Feature flags
servicio simple
activación por workspace

Criterios de aceptación
Se aprueba solo si:
puedes deployar con usuarios conectados
no hay downtime
no hay errores de schema

Prueba realista de fallo
Deployar nueva versión de tasks-service mientras se crean tasks masivamente.
Debe funcionar sin errores.

Errores típicos
Migraciones bloqueantes
Eliminar columnas inmediatamente
Eventos rígidos
Flags hardcodeados
Reiniciar todo el sistema para cambios

Cuando puedas desplegar sin que nadie lo note:
“Sprint completado”
y entramos en la preparación final:
Hardening de seguridad y cumplimiento (protecciones reales de internet).

Dijiste:
Sprint completado

ChatGPT dijo:
Entramos en la etapa donde un SaaS deja de ser un proyecto técnico y pasa a ser publicable en internet.
Hasta ahora protegiste arquitectura.
Ahora debes protegerte de personas reales en internet.

SEMANA 22 — Hardening de seguridad
Objetivo de negocio
Poder abrir registro público sin que en 24h te:
roben cuentas
saturen endpoints
extraigan datos de otros tenants

Problema arquitectónico
Keycloak autentica…
pero tu sistema sigue expuesto a:
enumeration
CSRF
token theft
abuso API
XSS
subida de malware
Implementaremos seguridad de aplicación real.

1. Protección de autenticación
   Reglas obligatorias
   Access token corto: 5–10 min
   Refresh token rotatorio
   Logout invalida sesión
   No guardar JWT en localStorage.
   Usar:
   HTTP-only Secure SameSite cookies

2. CSRF
   Todas las requests mutantes (POST/PATCH/DELETE):
   Requieren:
   X-CSRF-Token

El BFF valida contra cookie firmada.
Sin esto → 403.

3. CORS
   No permitir:

-

Solo:
app.tudominio.com

Nada más.

4. Protección multi-tenant crítica
   Cada endpoint debe validar SIEMPRE:
   workspace_id ∈ membresías del usuario

Aunque ya venga en JWT o cache.
Esto previene “horizontal privilege escalation”.

5. Subida de archivos segura
   En files-service:
   validar content-type real (magic bytes)
   escanear malware (ClamAV)
   bloquear ejecutables
   renombrar archivos (no confiar filename)
   Si suben .exe → rechazado.

6. Headers de seguridad
   El gateway debe agregar:
   Content-Security-Policy
   X-Frame-Options: DENY
   X-Content-Type-Options: nosniff
   Strict-Transport-Security
   Referrer-Policy

Sin esto eres vulnerable a XSS y clickjacking.

7. Protección de API
   Implementar:
   IP throttling adicional
   (no reemplaza tenant rate limit)
   Ejemplo:
   50 req/min por IP

8. Audit de seguridad
   Agregar eventos:
   FailedLoginAttempt
   PermissionDenied
   TokenReuseDetected
   SuspiciousRateLimit

Audit-service los guarda.

9. Enumeración de usuarios
   Endpoints:
   login
   invite
   password reset
   Siempre responder:
   "If the account exists, you will receive an email"

Nunca revelar si existe.

10. Password reset seguro
    Flujo:
    token único
    expira 15 min
    un solo uso
    invalida sesiones activas

Entregables verificables
Prueba obligatoria:
Intentar:
cambiar workspace_id manualmente
repetir token de invitación
subir archivo .exe
→ todo debe fallar.

Prueba crítica
Abrir DevTools:
ejecutar request manual:
POST /projects con workspace ajeno

Debe devolver:
403

Siempre.

Tareas por desarrollador
Dev 1 — Auth & Cookies
secure cookies
token rotation
Dev 2 — BFF Security
CSRF
headers
workspace validation
Dev 3 — Files Security
mime validation
antivirus
renaming
Dev 4 — Gateway & Audit
security headers
IP throttle
eventos seguridad

Criterios de aceptación
Se aprueba solo si:
no puedes acceder a datos de otro tenant ni manipulando requests
no puedes reutilizar tokens
archivos peligrosos son rechazados

Prueba realista de fallo
Copiar cookie de sesión a otro navegador.
El sistema debe detectar uso sospechoso y invalidar.

Errores típicos
JWT en localStorage
confiar en frontend
validar workspace solo en gateway
no validar mime real
CORS abierto

Cuando el sistema resista ataques básicos:
“Sprint completado”
y entramos en la recta final:
Backups, disaster recovery y continuidad operativa.

Dijiste:
Sprint completado

ChatGPT dijo:
Último paso antes de poder dormir tranquilo.
Un SaaS no muere por bugs.
Muere cuando pierde datos de clientes.

SEMANA 23 — Backups y Disaster Recovery
Objetivo de negocio
Aunque ocurra:
borrado accidental
bug destructivo
caída del cluster
ransomware
Debes poder recuperar el sistema y los datos.
Tiempo objetivo:
RPO ≤ 5 min (máx datos perdidos)
RTO ≤ 30 min (máx tiempo caído)

Problema arquitectónico
Hoy tus datos viven en:
múltiples PostgreSQL
Redis
Object Storage
OpenSearch
Analytics DB
Si pierdes uno → el sistema queda inconsistente.
Implementaremos:
Estrategia de recuperación completa, no solo backups de DB.

1. Backups de bases de datos
   Cada DB (identity, org, projects, tasks, billing, etc.):
   backup continuo (WAL archiving o snapshots cada 5 min)
   almacenamiento externo (no dentro del cluster)
   Recomendado:
   pgBackRest o wal-g

Destino:
otro bucket S3.

2. Point-in-Time Recovery
   Debes poder restaurar la DB a:
   10:42 AM exacto

(no solo “último backup”).
Prueba obligatoria.

3. Object Storage
   MinIO/S3:
   versioning activado
   lifecycle policy
   borrado no permanente
   Si alguien borra archivos → recuperables.

4. Redis
   No es crítico pero:
   snapshot cada minuto
   persistencia AOF
   Sirve para recuperar cuotas y cache caliente.

5. OpenSearch / Search
   NO restaurar índices.
   Regla:
   El search-service debe poder reconstruirse solo con eventos.
   Tu prueba será borrar completamente el índice.

6. Analytics
   Puede perderse parcialmente.
   Pero debes poder:
   reingestar eventos históricos
   reconstruir métricas.

7. Procedimiento de desastre (runbook)
   Debes escribir documento real:
   DISASTER.md
   Con pasos exactos:
   cluster destruido
   levantar infra
   restaurar DBs
   restaurar storage
   reactivar servicios
   reindexar search
   Sin improvisación.

Entregables verificables
Prueba obligatoria (la más importante del curso):
eliminar completamente DB de projects
restaurar desde backup
→ los proyectos reaparecen.

Prueba crítica
Borrar:
todos los pods
volúmenes
índice de búsqueda
Simular pérdida total del cluster.
Debes reconstruir sistema funcional.

Tareas por desarrollador
Dev 1 — PostgreSQL backups
wal archiving
restore test
Dev 2 — Storage backups
versioning
recovery files
Dev 3 — Search & Analytics recovery
reindex
reprocess events
Dev 4 — Runbook
documentación
simulacro completo

Criterios de aceptación
Se aprueba solo si:
restauras datos reales
sin hacks
sin tocar código

Prueba realista de fallo
Borrar un proyecto en producción simulada.
Restaurarlo sin afectar el resto del sistema.

Errores típicos
Backup en mismo cluster
No probar restore
Restaurar DB pero no storage
Depender del search index
No documentar procedimiento

Cuando puedas destruir tu sistema y recuperarlo:
“Sprint completado”
y entramos al último sprint:
Preparación de lanzamiento y operación real (SaaS en vivo).

Dijiste:
Sprint completado

ChatGPT dijo:
Llegaste al último sprint.
A partir de aquí ya no construyes… operas un producto real.

SEMANA 24 — Lanzamiento y operación en vivo
Objetivo de negocio
Abrir el SaaS a usuarios reales y poder operarlo día a día sin caos.
Debes poder:
registrar usuarios externos
monitorear clientes
detectar incidentes
responder sin tocar código

Problema arquitectónico
Tu sistema es técnicamente correcto, pero aún no es operable.
Necesitas procesos, no features.
Implementaremos:
Operación SaaS (SRE básico + soporte + métricas de negocio)

1. Dominio real
   Debes tener:
   app.tudominio.com
   api.tudominio.com
   auth.tudominio.com

HTTPS obligatorio con certificados reales (Let’s Encrypt vía cert-manager).
Sin HTTPS → no hay cookies seguras ni login confiable.

2. Registro público
   Habilitar:
   “Create workspace”
   Flujo:
   usuario se registra
   crea workspace automáticamente
   queda como admin
   Esto usa:
   UserRegistered → WorkspaceCreated
   Sin intervención manual.

3. Página de estado
   Crear:
   status.tudominio.com

Debe mostrar:
uptime API
login
realtime
storage
Puede ser simple pero automático (health checks).

4. Alertas (muy importante)
   Grafana debe enviar alertas reales:
   Email o Slack cuando:
   error rate > 5%
   DB desconectada
   cola crece demasiado
   CPU saturada
   espacio storage bajo
   Si no hay alertas → descubrirás problemas por Twitter.

5. Logging centralizado
   Debes poder:
   buscar:
   user_id = X
   workspace = Y
   trace_id = Z

y ver todo su recorrido.
Si un cliente reporta problema → debes rastrearlo.

6. Soporte básico
   Agregar panel admin interno:
   /internal/admin

Funciones:
ver workspaces
ver usuarios
desactivar cuenta
ver consumo
reenviar invitaciones
Sin tocar DB manualmente.

7. Métricas de negocio (no técnicas)
   Dashboard:
   nuevos workspaces por día
   usuarios activos
   conversión free → pro
   churn
   Esto viene de analytics-service.

8. Proceso de incidentes
   Debes escribir:
   INCIDENTS.md
   Con:
   cómo detectar
   cómo degradar sistema
   cómo comunicar a clientes
   cómo hacer post-mortem
   Ejemplo:
   si falla notifications → desactivarlas sin apagar todo.

Entregables verificables
Prueba obligatoria:
Crear un usuario externo real desde internet (no localhost).
Debe:
registrarse
crear workspace
usar el sistema completo

Prueba crítica
Simular incidente:
apagar tasks-service en producción.
Debes:
recibir alerta
diagnosticar con tracing
comunicar estado
restaurar servicio

Tareas por desarrollador
Dev 1 — Dominio & HTTPS
DNS
cert-manager
ingress
Dev 2 — Alerting & dashboards
grafana alerts
status page
Dev 3 — Admin tools
panel interno
acciones seguras
Dev 4 — Onboarding público
registro
creación automática workspace

Criterios de aceptación
Se aprueba solo si:
alguien externo puede usar el producto sin ayuda
puedes detectar fallos antes que el usuario
puedes resolver incidentes sin improvisar

Errores típicos
Lanzar sin alertas
Depender de logs manuales
Sin soporte interno
Sin métricas de negocio
Sin proceso de incidentes

Cuando completes todo:
escribe “Sistema en producción”.

Dijiste:
“Sistema en producción

ChatGPT dijo:
Felicitaciones.
A partir de ahora ya no estás practicando arquitectura… estás operando un SaaS.
Te dejo lo único importante desde hoy:

Tu nuevo trabajo (semanal)
Todos los días
revisar alertas
revisar errores por workspace
revisar colas (event backlog)
revisar consumo de DB
(15 minutos. Nunca lo saltees.)

Todas las semanas
ver DAU/WAU
workspaces nuevos
workspaces inactivos
features más usadas
dónde abandonan onboarding
Tu roadmap ya no lo decide el código.
Lo decide el comportamiento de usuarios.

Lo que debes empezar ahora

1. Primeros usuarios (muy importante)
   No busques miles.
   Busca 5 equipos reales (3–10 personas cada uno).
   Objetivo:
   observarlos usar el producto en vivo por videollamada
   Ahí vas a descubrir el 80% de tus verdaderos problemas.

2. Qué NO debes hacer ahora
   No agregues:
   IA
   nuevas features grandes
   rediseños
   Durante 4 semanas solo:
   bugs + fricción de uso

3. Tus métricas clave
   Olvida métricas técnicas.
   Solo mira:
   tiempo hasta crear primera task
   tiempo hasta invitar 1 usuario
   retorno al día siguiente
   Si fallan → el producto aún no encaja.

Tu siguiente etapa (real)
Ahora empiezas a aprender:
Product Engineering
La arquitectura ya no es el cuello de botella.
Lo es:
onboarding
claridad
valor percibido

Cuando quieras, te entreno en el siguiente paso:
cómo conseguir tus primeros clientes pagos sin marketing masivo.
