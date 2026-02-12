# 📚 Express CRUD Books

API REST para gestionar una colección de libros, construida con **Express 5** y **MongoDB** (Mongoose).

## Descripción

Este proyecto implementa un CRUD (Crear, Leer, Actualizar, Eliminar) completo para un recurso de **Libros**. Proporciona una API RESTful con endpoints para gestionar libros almacenados en una base de datos MongoDB.

## Tecnologías

| Tecnología   | Versión | Descripción                               |
| ------------ | ------- | ----------------------------------------- |
| **Node.js**  | ≥ 18    | Entorno de ejecución JavaScript           |
| **Express**  | 5.x     | Framework web para Node.js                |
| **MongoDB**  | -       | Base de datos NoSQL                       |
| **Mongoose** | 8.x     | ODM (Object Document Mapper) para MongoDB |
| **Morgan**   | 1.x     | Middleware de logging de peticiones HTTP  |
| **Faker.js** | 9.x     | Generación de datos ficticios (dev)       |

## Estructura del Proyecto

```
express-crud-books/
├── app.js                          # Punto de entrada de la aplicación
├── package.json                    # Dependencias y scripts del proyecto
├── books-api.postman_collection.json  # Colección de Postman para probar la API
├── bin/
│   └── seeds.js                    # Script para poblar la BD con datos ficticios
├── config/
│   ├── db.config.js                # Configuración de conexión a MongoDB
│   └── routes.config.js            # Definición de las rutas de la API
├── controllers/
│   └── book.controllers.js         # Lógica de negocio (controladores CRUD)
└── models/
    └── book.model.js               # Esquema y modelo de datos del Libro
```

## Requisitos Previos

- **Node.js** (versión 18 o superior)
- **MongoDB** (ejecutándose en local o URI de conexión remota)

## Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone <url-del-repositorio>
   cd express-crud-books
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar la base de datos (opcional):**

   Por defecto, la aplicación se conecta a `mongodb://127.0.0.1:27017/booksdb`. Para cambiar la URI de conexión, establece la variable de entorno:

   ```bash
   export MONGODB_URI="mongodb://tu-host:puerto/tu-base-de-datos"
   ```

## Uso

### Iniciar el servidor en modo desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000` con recarga automática al detectar cambios en el código.

### Poblar la base de datos con datos de prueba

```bash
npm run seed
```

Este comando genera **1000 libros** ficticios utilizando Faker.js. **Nota:** elimina todos los datos existentes antes de crear los nuevos.

## Endpoints de la API

Todos los endpoints están bajo el prefijo `/api`.

| Método   | Ruta             | Descripción                      |
| -------- | ---------------- | -------------------------------- |
| `GET`    | `/api/books`     | Listar todos los libros          |
| `GET`    | `/api/books/:id` | Obtener un libro por su ID       |
| `POST`   | `/api/books`     | Crear un nuevo libro             |
| `PATCH`  | `/api/books/:id` | Actualizar parcialmente un libro |
| `DELETE` | `/api/books/:id` | Eliminar un libro                |

### Ejemplos de uso con cURL

#### Listar todos los libros

```bash
curl http://localhost:3000/api/books
```

#### Obtener un libro por ID

```bash
curl http://localhost:3000/api/books/<id>
```

#### Crear un nuevo libro

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cien años de soledad",
    "author": "Gabriel García Márquez",
    "publishedYear": 1967,
    "genre": "Realismo mágico",
    "summary": "La historia de la familia Buendía en el pueblo ficticio de Macondo."
  }'
```

#### Actualizar un libro

```bash
curl -X PATCH http://localhost:3000/api/books/<id> \
  -H "Content-Type: application/json" \
  -d '{ "publishedYear": 1968 }'
```

#### Eliminar un libro

```bash
curl -X DELETE http://localhost:3000/api/books/<id>
```

## Modelo de Datos

Cada libro tiene la siguiente estructura:

| Campo           | Tipo   | Obligatorio | Descripción                                |
| --------------- | ------ | ----------- | ------------------------------------------ |
| `title`         | String | ✅          | Título del libro                           |
| `author`        | String | ✅          | Nombre del autor                           |
| `publishedYear` | Number | ❌          | Año de publicación                         |
| `genre`         | String | ❌          | Género literario                           |
| `summary`       | String | ❌          | Resumen o sinopsis                         |
| `createdAt`     | Date   | Auto        | Fecha de creación (automático)             |
| `updatedAt`     | Date   | Auto        | Fecha de última actualización (automático) |

## Colección de Postman

El proyecto incluye el archivo `books-api.postman_collection.json` con todas las peticiones preconfiguradas para probar la API desde Postman. Impórtalo directamente en Postman para empezar a probar.

## Scripts Disponibles

| Comando        | Descripción                                                  |
| -------------- | ------------------------------------------------------------ |
| `npm run dev`  | Inicia el servidor en modo desarrollo con recarga automática |
| `npm run seed` | Puebla la base de datos con 1000 libros ficticios            |
