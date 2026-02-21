// ============================================
// Configuración de rutas de la API
// Define los endpoints REST para el recurso Libro
// ============================================

import { Router } from "express";
import * as books from "../controllers/book.controllers.js";
// Importación de los controladores de usuarios para manejar las peticiones CRUD
import * as users from "../controllers/users.controllers.js";
// Librería para crear errores HTTP estandarizados con código de estado
import createHttpError from "http-errors";

// Creación del enrutador de Express
const router = Router();

// --- Rutas del recurso Libro (Book) ---

router.get("/books", books.list); // Listar todos los libros
router.post("/books", books.create); // Crear un nuevo libro
router.get("/books/:id", books.detail); // Obtener detalle de un libro por ID
router.patch("/books/:id", books.update); // Actualizar parcialmente un libro por ID
router.delete("/books/:id", books.remove); // Eliminar un libro por ID

// --- Rutas del recurso Usuario (User) ---

router.get("/users", users.list); // Listar todos los usuarios
router.post("/users", users.create); // Crear un nuevo usuario
router.get("/users/:id", users.detail); // Obtener detalle de un usuario por ID
router.patch("/users/:id", users.update); // Actualizar parcialmente un usuario por ID
router.delete("/users/:id", users.remove); // Eliminar un usuario por ID

// Middleware "catch-all" para rutas no definidas
// Si ninguna ruta anterior coincide con la petición,
// se lanza un error HTTP 404 indicando que la ruta no existe
router.use((req, res) => {
  throw new createHttpError(404, "Route Not Found");
});

export default router;
