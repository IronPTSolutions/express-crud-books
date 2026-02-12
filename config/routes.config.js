// ============================================
// Configuración de rutas de la API
// Define los endpoints REST para el recurso Libro
// ============================================

import { Router } from "express";
import * as books from "../controllers/book.controllers.js";

// Creación del enrutador de Express
const router = Router();

// --- Rutas del recurso Libro (Book) ---

router.get("/books", books.list); // Listar todos los libros
router.post("/books", books.create); // Crear un nuevo libro
router.get("/books/:id", books.detail); // Obtener detalle de un libro por ID
router.patch("/books/:id", books.update); // Actualizar parcialmente un libro por ID
router.delete("/books/:id", books.remove); // Eliminar un libro por ID

export default router;
