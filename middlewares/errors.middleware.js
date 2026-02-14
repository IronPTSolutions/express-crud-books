// ============================================
// Middleware de gestión de errores
// Intercepta los errores lanzados en la aplicación
// y devuelve respuestas HTTP apropiadas al cliente
// ============================================

export function errorHandler(err, req, res, next) {
  // Error de validación de Mongoose (campos obligatorios, formatos incorrectos, etc.)
  // Devuelve 400 Bad Request con el detalle de los errores de validación
  if (err.name === "ValidationError") {
    res.status(400).json(err.errors);
    return;
  }

  // Error lanzado por la libreria create-error. Ya tiene status definido
  if (err.status) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  // Error de cast de Mongoose (ID con formato inválido, por ejemplo un ObjectId mal formado)
  // Devuelve 404 Not Found ya que el recurso no puede ser localizado
  if (err.name === "CastError") {
    res.status(404).json({ message: "Resource not found" });
    return;
  }

  // Error de clave duplicada en MongoDB (código E11000)
  // Se produce al intentar crear un recurso con un valor único que ya existe (ej: isbn duplicado)
  // Devuelve 409 Conflict
  if (err.message?.includes("E11000")) {
    res.status(409).json({ message: "Resource already exist" });
    return;
  }

  // Cualquier otro error no contemplado anteriormente
  // Devuelve 500 Internal Server Error como respuesta genérica
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}
