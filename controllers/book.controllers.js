// ============================================
// Controladores del recurso Libro (Book)
// Contiene la lógica de negocio para cada operación CRUD
// ============================================

import Book from "../models/book.model.js";

/**
 * Listar todos los libros
 * GET /api/books
 * Devuelve un array JSON con todos los libros de la base de datos
 */
export const list = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};

/**
 * Obtener el detalle de un libro por su ID
 * GET /api/books/:id
 * Devuelve un objeto JSON con los datos del libro solicitado
 */
export const detail = async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.json(book);
};

/**
 * Crear un nuevo libro
 * POST /api/books
 * Recibe los datos del libro en el cuerpo de la petición
 * Devuelve el libro creado con código de estado 201 (Creado)
 */
export const create = async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json(book);
};

/**
 * Actualizar un libro existente por su ID
 * PATCH /api/books/:id
 * Recibe los campos a actualizar en el cuerpo de la petición
 * Devuelve el libro actualizado (new: true) con validaciones activas
 */
export const update = async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Devuelve el documento actualizado en lugar del original
    runValidators: true, // Ejecuta las validaciones del esquema al actualizar
  });

  res.json(book);
};

/**
 * Eliminar un libro por su ID
 * DELETE /api/books/:id
 * Devuelve código de estado 204 (Sin contenido) tras la eliminación exitosa
 */
export const remove = async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
