// ============================================
// Archivo principal de la aplicación Express
// ============================================

// Importación de dependencias
import express from "express";
import morgan from "morgan";

// Importación de la configuración de la base de datos (se conecta a MongoDB al importar)
import "./config/db.config.js";

// Importación del enrutador principal con todas las rutas de la API
import router from "./config/routes.config.js";

// Creación de la instancia de Express
const app = express();

// Puerto del servidor: usa variable de entorno o 3000 por defecto
const PORT = process.env.PORT || 3000;

// Middleware: registro de peticiones HTTP en consola (formato desarrollo)
app.use(morgan("dev"));

// Middleware: permite recibir y parsear cuerpos de petición en formato JSON
app.use(express.json());

// Montar todas las rutas de la API bajo el prefijo /api
app.use("/api", router);

// Iniciar el servidor y escuchar en el puerto configurado
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
