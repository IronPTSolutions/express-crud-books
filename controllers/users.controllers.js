import User from "../models/user.model.js";
import createError from "http-errors";

export const list = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const detail = async (req, res) => {
  const user = await User.findById(req.params.id).populate("books");

  if (user === null) {
    throw createError(404, "User not found");
  } else {
    res.json(user);
  }
};

export const create = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
};

export const update = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Devuelve el documento actualizado en lugar del original
    runValidators: true, // Ejecuta las validaciones del esquema al actualizar
  });

  if (user == null) {
    res.status(404).json({ error: "User not found" });
  } else {
    res.json(user);
  }
};

export const remove = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (user == null) {
    res.status(404).json({ error: "User not found" });
  } else {
    res.status(204).end();
  }
};
