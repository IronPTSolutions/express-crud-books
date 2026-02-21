// ============================================
// Configuración de la conexión a la base de datos MongoDB
// ============================================

import mongoose from "mongoose";

// URI de conexión: usa variable de entorno o conexión local por defecto
// Se usa "let" en lugar de "const" porque el URI puede modificarse para tests
let MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/booksdb";

// En entorno de test se usa una base de datos separada (booksdb_test)
// para no afectar los datos de desarrollo durante la ejecución de tests
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
