// ============================================
// Configuración de la conexión a la base de datos MongoDB
// ============================================

import mongoose from "mongoose";

// URI de conexión: usa variable de entorno o conexión local por defecto
let MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/booksdb";

if (process.env.NODE_ENV === "test") {
  MONGODB_URI += "_test";
}

// Conexión a MongoDB usando Mongoose
mongoose
  .connect(MONGODB_URI)
  .then((db) => {
    // Conexión exitosa: muestra el host de la base de datos
    console.log(`MongoDB connected: ${db.connection.host}`);
  })
  .catch((error) => {
    // Error de conexión: muestra el error en consola
    console.error(`error MongoDB`, error);
  });
