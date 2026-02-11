# SaaS 24 Weeks - Multi-Tenant Platform

Este proyecto es una plataforma SaaS multi-tenant construida con una arquitectura de microservicios usando NestJS, Docker y Traefik.

## 🚀 Requisitos Previos

Asegúrate de tener instalado:

- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop/)
- [Node.js (v20+)](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

---

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio e instalar dependencias

Para cada servicio, debes instalar sus dependencias locales:

```bash
# Servicio de Identidad
cd services/identity
npm install

# Servicio de Organizaciones
cd ../organizations
npm install
```

### 2. Levantar la Infraestructura

Usa Docker Compose para levantar las bases de datos, el broker de mensajería y el gateway:

```bash
docker-compose up -d
```

Esto levantará:

- **identity-db**: PostgreSQL (Puerto 5432)
- **organizations-db**: PostgreSQL (Puerto 5433)
- **rabbitmq**: Puerto 5672 (AMQP) y 15672 (Management Portal)
- **traefik**: Puerto 80 (Gateway) y 8080 (Dashboard)
- **keycloak**: Puerto 8081

### 3. Configurar Variables de Entorno

Asegúrate de que cada servicio tenga su archivo `.env` configurado. Puedes guiarte por los archivos `.env.example` en cada carpeta de servicio.

---

## 🏃 Cómo Ejecutar los Servicios

Puedes correr los servicios en modo desarrollo de forma independiente:

### Identity Service

```bash
cd services/identity
npm run start:dev
```

_Corre en: http://localhost:3001_

### Organizations Service

```bash
cd services/organizations
npm run start:dev
```

_Corre en: http://localhost:3002_

---

## 🧪 Cómo Testear la Aplicación

### Puertos Útiles

| Componente                | Dirección                                                                    |
| :------------------------ | :--------------------------------------------------------------------------- |
| **API Gateway (Traefik)** | [http://localhost](http://localhost)                                         |
| **Identity Service**      | [http://localhost:3001](http://localhost:3001)                               |
| **Organizations Service** | [http://localhost:3002](http://localhost:3002)                               |
| **RabbitMQ Management**   | [http://localhost:15672](http://localhost:15672) (User/Pass: saas / saas123) |
| **Traefik Dashboard**     | [http://localhost:8080](http://localhost:8080)                               |

### Pasos de Prueba Sugeridos

1. **Verificar Infraestructura**: Revisa en Docker Desktop o con `docker ps` que todos los contenedores estén en estado `Healthy`.
2. **Logs de Servicios**: Observa la consola para verificar que Identity y Organizations se conecten con éxito a sus respectivas bases de datos y a RabbitMQ.
3. **Comunicación**: Cuando se crea un usuario en el `Identity Service`, este emite un evento a RabbitMQ que es escuchado por el `Organizations Service` para las configuraciones iniciales.

---

## 📁 Estructura del Proyecto

- `services/`: Contiene los microservicios de la plataforma.
- `docker-compose.yml`: Definición de toda la infraestructura necesaria.
- `docs/`: Documentación del proyecto (proposals, tasks, analysis).
