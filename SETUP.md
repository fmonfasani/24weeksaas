# Guía de Instalación y Configuración - SaaS 24 Weeks

Esta guía detalla los requisitos y pasos necesarios para levantar el entorno de desarrollo del servicio de identidad (`services/identity`).

## 1. Requisitos Previos (Dependencias del Sistema)

Necesitas tener instalado lo siguiente en tu sistema:

- **Node.js**: Versión LTS recomendada (v18 o v20).
  - Verificar: `node -v`
- **Docker Desktop**: Para levantar las bases de datos y servicios auxiliares.
  - Verificar: `docker -v` y `docker-compose -v`
- **Gestor de Paquetes**: `npm` (viene con Node) o `pnpm` (recomendado).

## 2. Configuración del Entorno (Infraestructura)

El proyecto utiliza Docker Compose para manejar las bases de datos (PostgreSQL) y el sistema de mensajería (RabbitMQ).

1.  **Levantar la infraestructura**:
    Ejecuta el siguiente comando desde la raíz del proyecto (`f:\Software Developer\Porfolio\SaaS 24 Weeks`):

    ```bash
    docker-compose up -d
    ```

    Esto iniciará:
    - `saas-identity-db` (Postgres, puerto 5432)
    - `saas-organizations-db` (Postgres, puerto 5433)
    - `saas-rabbitmq` (RabbitMQ, puertos 5672/15672)
    - `saas-keycloak` & `saas-keycloak-db` (Gestión de Identidad, puerto 8081)

2.  **Verificar estado**:
    ```bash
    docker-compose ps
    ```
    Todos los contenedores deberían estar en estado `Up`.

## 3. Configuración del Servicio de Identidad

1.  **Navegar al directorio**:

    ```bash
    cd services/identity
    ```

2.  **Instalar dependencias**:

    ```bash
    npm install
    # O si usas pnpm
    pnpm install
    ```

3.  **Configurar Variables de Entorno**:
    Copia el archivo de ejemplo:

    ```bash
    copy .env.example .env
    ```

    _(En macOS/Linux usa `cp .env.example .env`)_

    Las configuraciones por defecto en `.env.example` ya están alineadas con el `docker-compose.yml`:
    - **DB**: `localhost:5432`, user: `identity_user`, pass: `identity_pass`
    - **RabbitMQ**: `localhost:5672`, user: `saas`, pass: `saas123`

## 4. Configuración del Servicio de Organizaciones

El servicio `services/organizations` ha sido creado.

1.  **Navegar al directorio**:

    ```bash
    cd services/organizations
    ```

2.  **Instalar dependencias**:
    Si la instalación automática falló o quedó incompleta, ejecuta:

    ```bash
    npm install
    npm install @nestjs/typeorm typeorm pg amqplib @nestjs/config class-validator class-transformer
    ```

3.  **Configurar Variables de Entorno**:
    Crea un archivo `.env` en `services/organizations/` con:
    ```env
    PORT=3002
    DB_HOST=localhost
    DB_PORT=5433
    DB_USER=org_user
    DB_PASSWORD=org_pass
    DB_NAME=organizations
    RABBITMQ_URL=amqp://saas:saas123@localhost:5672
    NODE_ENV=development
    ```

## 5. Ejecución General

Para iniciar el servicio en modo desarrollo:

```bash
npm run start:dev
```

El servicio debería iniciar en el puerto **3001** (según `.env`).

## 5. Verificación "Todo bien"

Para chequear que todo funciona correctamente:

1.  **Base de Datos**: El log de la consola no debería mostrar errores de conexión a TypeORM/Postgres.
2.  **RabbitMQ**: El log no debería mostrar errores de conexión a RabbitMQ.
3.  **Endpoints**: Puedes probar el health check (si existe) o simplemente ver que la aplicación levante sin excepciones.

## Resumen de Dependencias Detectadas

- **Backend Framework**: NestJS v10
- **Base de Datos**: PostgreSQL 16 (vía Docker)
- **Mensajería**: RabbitMQ 3.12 (vía Docker)
- **Auth**: Passport + JWT
- **Validación**: class-validator

## 6. Scripts de Python (Opcional)

En la raíz del proyecto hay scripts de Python (`extract_docx.py`, etc.) que parecen ser utilidades para extraer texto de documentos `.docx`.

- **Requisito**: Python instalado (cualquier versión reciente, ej. 3.x).
- **Tu Versión**: Se detectó **Python 3.13.5** en tu sistema (ejecutable como `py`).
- **Dependencias**: No requieren instalar librerías externas (usan librerías estándar como `zipfile` y `xml`).
- **Uso**: Si necesitas correrlos, simplemente ejecuta:
  ```bash
  py extract_docx.py
  ```
  _(Nota: Estos scripts buscan un archivo `24-SaaS-Week.docx` en la raíz)._
