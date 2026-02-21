// ============================================
// Controladores del recurso Usuario (User)
// Contiene la lógica de negocio para cada operación CRUD
// ============================================

import User from "../models/user.model.js";
import Session from "../models/session.model.js";
import createError from "http-errors";

/**
 * Listar todos los usuarios
 * GET /api/users
 * Devuelve un array JSON con todos los usuarios de la base de datos
 */
export const list = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

/**
 * Obtener el detalle de un usuario por su ID
 * GET /api/users/:id
 * Incluye los libros asociados al usuario mediante populate
 */
export const detail = async (req, res) => {
  // .populate("books") resuelve la relación virtual definida en el modelo User
  // y añade los libros asociados al usuario en la respuesta
  const user = await User.findById(req.params.id).populate("books");

  if (user === null) {
    throw createError(404, "User not found");
  } else {
    res.json(user);
  }
};

/**
 * Crear un nuevo usuario
 * POST /api/users
 * La contraseña se encripta automáticamente gracias al middleware pre-save del modelo
 */
export const create = async (req, res) => {
  const user = await User.create(req.body);

  res.status(201).json(user);
};

/**
 * Actualizar un usuario existente por su ID
 * PATCH /api/users/:id
 * Usa findById + save() en lugar de findByIdAndUpdate para activar
 * el middleware pre-save que encripta la contraseña si fue modificada
 */
export const update = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user == null) {
    throw createError(404, "User not found");
  }

  // Object.assign copia las propiedades del body al documento existente
  // preservando los campos que no se envían en la petición
  Object.assign(user, req.body);

  // .save() activa el middleware pre-save, lo que permite
  // re-encriptar la contraseña si fue actualizada
  await user.save();

  res.json(user);
};

/**
 * Eliminar un usuario por su ID
 * DELETE /api/users/:id
 * Devuelve código de estado 204 (Sin contenido) tras la eliminación exitosa
 */
export const remove = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (user == null) {
    res.status(404).json({ error: "User not found" });
  } else {
    res.status(204).end();
  }
};

export const login = async (req, res) => {
  if (!req.body.password || !req.body.email) {
    throw createError(400, "missing mail or password");
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw createError(401, "unauthorized");
  }

  const match = await user.checkPassword(req.body.password);

  if (!match) {
    throw createError(401, "unauthorized");
  }

  const session = await Session.create({
    user: user._id,
  });

  res.cookie("sessionId", session._id.toString(), {
    httpOnly: true, // La cookie no es accesible desde JavaScript del lado del cliente
    secure: process.env.NODE_ENV === "production", // Solo se envía en conexiones HTTPS en producción
  });

  res.end();
};

export const profile = async (req, res) => {
  res.json(req.session.user);
};

export const logout = async (req, res) => {
  await Session.findByIdAndDelete(req.session.id);

  res.status(204).end();
};

export const logoutAll = async (req, res) => {
  await Session.deleteMany({ user: req.session.user.id });

  res.status(204).end();
};
