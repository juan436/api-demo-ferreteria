# Ferretería — API (demo)

Backend del ambiente de **demostración** del sistema de gestión de compras para una ferretería: proveedores, sucursales y órdenes de compra. **NestJS + MongoDB (Mongoose)**.

Es una build simplificada, pensada para mostrar el sistema sin tocar datos reales. El frontend está en [`mvp-ferreteria`](https://github.com/juan436/mvp-ferreteria).

---

## Módulos

| Módulo | Responsabilidad |
|---|---|
| `auth` | Login con JWT (`passport-jwt` + `passport-local`), hash con bcrypt |
| `users` | Cuentas y roles |
| `providers` | Proveedores, con búsqueda |
| `branches` | Sucursales |
| `orders` | Órdenes de compra |
| `mail` | Envío de la orden al proveedor (`@nestjs-modules/mailer` + Handlebars, adjunto Excel con `exceljs`) |
| `admin` | Operaciones de administración |
| `seed` | Carga de datos iniciales |

---

## Decisión de diseño: las órdenes son inmutables

`orders` expone **crear, listar y eliminar — no actualizar**. Una orden de compra emitida no se edita: si está mal, se elimina y se crea de nuevo. Esto mantiene el historial de lo que realmente se envió a cada proveedor sin versiones intermedias ambiguas.

```
GET    /orders                      listar
GET    /orders/:id                  detalle
POST   /orders                      crear
DELETE /orders/:id                  eliminar
GET    /orders/by-provider/:id      órdenes de un proveedor
GET    /orders/by-sucursal/:id      órdenes de una sucursal
```

Proveedores y sucursales sí tienen CRUD completo.

---

## Correr en local

Requisitos: Node 20, MongoDB, npm.

```bash
npm install
cp env.example .env          # completar valores
npm run seed                  # datos iniciales
npm run start:dev             # http://localhost:3001
```

### Variables de entorno

| Variable | Descripción |
|---|---|
| `MONGODB_URI` | Conexión a MongoDB |
| `PORT` | Puerto HTTP |
| `JWT_SECRET` | Secreto de firma del JWT |
| `JWT_EXPIRATION` | Vida del token (ej. `7d`) |

Mailer: credenciales SMTP en el `env.example`.

---

## Autenticación

JWT en el header: `Authorization: Bearer <token>`.

---

## Despliegue

Se empaqueta con el `Dockerfile` incluido (build en capas para cachear dependencias) y corre como contenedor detrás de un reverse proxy con TLS.

---

## Forma de trabajo

- **NestJS modular:** un módulo por dominio con `controller` / `service` / `schema` / `dto`; DTOs validados con `class-validator`.
- Commits en Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`). Rama `main`.
- Este ambiente comparte linaje de código con el sistema en producción del cliente; es una snapshot anterior y más simple, mantenida por separado.
