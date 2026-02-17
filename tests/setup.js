import { beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";

import "../config/db.config";

// Antes de los tests: drop la BDD completa
beforeAll(async () => {
  await mongoose.connection.dropDatabase();
});

// Después de todos los tests del fichero: cerrar la conexión
afterAll(async () => {
  await mongoose.connection.close();
});
