# 🛠️ BBDD Node API

Este proyecto es una **API RESTful** construida con **Node.js**, **Express**, **Sequelize**, **MySQL** y **Redis**. Permite gestionar productos, con persistencia en base de datos relacional y uso de cache para mejorar el rendimiento. Es la resolución a la actividad **Interacción con Bases de Datos en Node.js** de la asignatura Desarrollo Avanzado de Backend y APIs del Máster de Desarrollo Web de la UEM.

## 🚀 Características

- CRUD completo para Productos
- Base de datos MySQL usando Sequelize ORM
- Caché con Redis en endpoints críticos (`GET /productos` y `GET /productos/:id`)
- Invalidación automática del cache tras creación, actualización o eliminación
- Código estructurado y con manejo robusto de errores

## 📦 Tecnologías utilizadas

- Node.js
- Express
- Sequelize
- MySQL
- Redis
- dotenv (configuración de entorno)


## 📁 Estructura del proyecto

```
bbdd-node/
├── models/
│   ├── Product.js          # Modelo de producto
│   └── index.js            # Inicializa Sequelize
├── routes/
│   └── products.js         # Rutas de productos (Operaciones CRUD)
├── redis.js                # Cliente Redis configurado
├── index.js                # Punto de entrada principal
├── .env.example            # Variables de entorno de ejemplo
├── .gitignore              # Archivos ignorados por Git
├── package.json            # Configuración del proyecto
├── package-lock.json       # Lock de dependencias
└── README.md               # Documentación del proyecto
```

---

## ⚙️ Instalación y configuración

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/anggierz/bbdd-node.git
   cd bbdd-node
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar archivo `.env`**
   Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido (el .env será proporcionado al profesor de la asignatura):

   ```env
    PORT=tu_puerto_local
    DB_HOST=localhost
    DB_USER=tu_usuario
    DB_PASS=tu_contraseña
    DB_NAME=tu_base_de_datos
    REDIS_EXPIRE_SECONDS=tiempo_de_vida_cache
   ```

4. **Crear base de datos en MySQL**
   Asegúrate de crear la base de datos definida en `DB_NAME`.

5. **Ejecutar migraciones (si aplican) o sincronizar**
   En el código puedes usar `sequelize.sync()` para crear las tablas automáticamente.

6. **Ejecutar el servidor**

   ```bash
   npm run start
   ```

---

## 🧪 Endpoints disponibles

### `GET /productos`

Devuelve todos los productos (usando Redis como caché por 30 minutos).

### `GET /productos/:id`

Devuelve un solo producto por ID (también cacheado).

### `POST /productos`

Crea un nuevo producto. Invalida la caché general.

### `PUT /productos/:id`

Actualiza un producto. Actualiza la caché del recurso y la lista.

### `DELETE /productos/:id`

Elimina un producto. Invalida la caché asociada.

## 🧠 Consideraciones

- Redis se usa para reducir las consultas costosas a MySQL.
- REDIS_EXPIRE_SECONDS (tiempo de vida) de los datos en caché: `1800 segundos` (30 minutos).
- Al modificar un recurso (crear, actualizar o eliminar), se invalida automáticamente su caché correspondiente.


## ✅ Requisitos previos

- Node.js ≥ 18
- MySQL
- Redis
- npm
