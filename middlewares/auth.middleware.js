// ============================================
// Middleware de autenticación
// Verifica que cada petición incluya una sesión válida
// ============================================

import createError from "http-errors";
import Session from "../models/session.model.js";

/**
 * Middleware que comprueba la autenticación del usuario.
 * Extrae el sessionId de las cookies, busca la sesión en la base de datos
 * y adjunta la sesión (con el usuario populado) a req.session.
 * Las rutas de registro y login están exentas de autenticación.
 */
export async function checkAuth(req, res, next) {
  // Permitir el registro de usuarios sin autenticación
  if (req.method === "POST" && req.path == "/api/users") {
    next();
    return;
  }

  // Permitir el login sin autenticación
  if (req.method === "POST" && req.path == "/api/users/login") {
    next();
    return;
  }

  // Extraer el sessionId de la cookie mediante expresión regular
  const sessionId = req.headers.cookie?.match(/sessionId=([^;]+)/)?.[1];

  // Si no hay cookie de sesión, rechazar la petición
  if (!sessionId) {
    throw createError(401, "unauthorized");
  }

  // Buscar la sesión en la base de datos y popular los datos del usuario
  const session = await Session.findById(sessionId).populate("user");

  // Si la sesión no existe o ha sido invalidada, rechazar la petición
  if (!session) {
    throw createError(401, "unauthorized");
  }

  // Adjuntar la sesión al objeto request para uso en los controladores
  req.session = session;

  next();
}
