// ============================================
// Modelo de datos: Libro (Book)
// Define la estructura del documento en MongoDB
// ============================================

import mongoose from "mongoose";

// Definición del esquema de un libro con sus campos y validaciones
const bookSchema = new mongoose.Schema(
  {
    // Título del libro (obligatorio)
    title: {
      type: String,
      required: true,
      trim: true, // Elimina espacios en blanco al inicio y al final
    },
    // Autor del libro (obligatorio)
    author: {
      type: String,
      required: true,
      trim: true,
    },
    // Año de publicación (opcional)
    publishedYear: {
      type: Number,
    },
    // Género literario (opcional)
    genre: {
      type: String,
      trim: true,
    },
    // Resumen o sinopsis del libro (opcional)
    summary: {
      type: String,
      trim: true,
    },
    // Código ISBN del libro (opcional, único)
    isbn: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true, // Añade automáticamente campos createdAt y updatedAt
    versionKey: false, // Desactiva el campo __v de versionado de Mongoose
  },
);

// Creación del modelo "Book" a partir del esquema definido
const Book = mongoose.model("Book", bookSchema);

export default Book;
