// ============================================
// Script de semillas (seeds)
// Puebla la base de datos con 1000 libros ficticios
// usando la librería Faker para generar datos aleatorios
// Ejecutar con: npm run seed
// ============================================

import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

// Importar configuración de la base de datos (inicia la conexión)
import "../config/db.config.js";

// Importar el modelo de Libro
import Book from "../models/book.model.js";

/**
 * Función principal de semillas
 * 1. Elimina todos los datos existentes en la base de datos
 * 2. Crea 1000 libros con datos aleatorios
 * 3. Cierra la conexión a la base de datos
 */
async function seed() {
  console.log("Seeding the database...");

  // Paso 1: Eliminar toda la base de datos para empezar desde cero
  console.log("drop database...");
  await mongoose.connection.dropDatabase();
  console.log("drop database... [OK]");

  // Paso 2: Crear 1000 libros con datos generados por Faker
  console.log("seeding books...");
  for (let i = 0; i < 1000; i++) {
    const book = await Book.create({
      title: faker.book.title(), // Título aleatorio
      author: faker.book.author(), // Autor aleatorio
      publishedYear: faker.number.int({ min: 1500, max: 2026 }), // Año entre 1500 y 2026
      genre: faker.book.genre(), // Género literario aleatorio
      summary: faker.lorem.paragraph(), // Resumen con texto lorem ipsum
    });
    console.log(book.title);
  }
  console.log("seeding books... [OK]");

  // Paso 3: Cerrar la conexión a MongoDB
  console.log("close connection...");
  await mongoose.connection.close();
  console.log("close connection... [OK]");
}

// Ejecutar la función de semillas
seed();
