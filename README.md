# ferreteria Backend API

Backend API para ferreteria MVP construido con NestJS y MongoDB.

![License](https://img.shields.io/badge/License-MIT-green.svg)

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm >= 9.0.0

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar MongoDB local (si no está corriendo)
mongod

# Sembrar datos iniciales
npm run seed

# Iniciar en modo desarrollo
npm run start:dev
```

### Variables de Entorno

Crear archivo `.env` en la raíz con:

```env
MONGODB_URI=mongodb://localhost:27017/ferreteria
PORT=3001
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRATION=7d
```

## 📚 Estructura del Proyecto

```
src/
├── auth/           # Autenticación y autorización
├── users/          # Módulo de usuarios
├── providers/      # Módulo de proveedores
├── sucursales/     # Módulo de sucursales
├── orders/         # Módulo de órdenes
├── seed/           # Scripts para sembrar datos
├── common/         # Utilidades compartidas
├── app.module.ts   # Módulo principal
└── main.ts         # Punto de entrada
```

## 🛠️ Scripts Disponibles

```bash
npm run start:dev    # Desarrollo con hot-reload
npm run start:prod   # Producción
npm run build        # Compilar
npm run seed         # Sembrar datos iniciales
npm run lint         # Linter
npm run format       # Formatear código
```

## 📡 Endpoints API

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `GET /auth/profile` - Obtener perfil (requiere token)

### Usuarios
- `GET /users` - Listar usuarios
- `GET /users/:id` - Obtener usuario
- `POST /users` - Crear usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Proveedores
- `GET /providers` - Listar proveedores
- `GET /providers/:id` - Obtener proveedor
- `POST /providers` - Crear proveedor
- `PATCH /providers/:id` - Actualizar proveedor
- `DELETE /providers/:id` - Eliminar proveedor
- `GET /providers/search` - Buscar proveedores

### Sucursales
- `GET /sucursales` - Listar sucursales
- `GET /sucursales/:id` - Obtener sucursal
- `POST /sucursales` - Crear sucursal
- `PATCH /sucursales/:id` - Actualizar sucursal
- `DELETE /sucursales/:id` - Eliminar sucursal

### Órdenes (Solo lectura, creación y eliminación - NO SE PUEDEN MODIFICAR)
- `GET /orders` - Listar órdenes
- `GET /orders/:id` - Obtener orden
- `POST /orders` - Crear orden
- `DELETE /orders/:id` - Eliminar orden
- `GET /orders/by-provider/:providerId` - Órdenes por proveedor
- `GET /orders/by-sucursal/:sucursalId` - Órdenes por sucursal

## 🔐 Autenticación

La API usa JWT (JSON Web Tokens) para autenticación. Para endpoints protegidos, incluir el token en el header:

```
Authorization: Bearer <tu_token_jwt>
```
