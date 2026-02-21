import createError from "http-errors";
import Session from "../models/session.model.js";

export async function checkAuth(req, res, next) {
  if (req.method === "POST" && req.path == "/api/users") {
    next();
    return;
  }

  if (req.method === "POST" && req.path == "/api/users/login") {
    next();
    return;
  }

  const sessionId = req.headers.cookie?.match(/sessionId=([^;]+)/)?.[1];

  if (!sessionId) {
    throw createError(401, "unauthorized");
  }

  const session = await Session.findById(sessionId).populate("user");

  if (!session) {
    throw createError(401, "unauthorized");
  }

  req.session = session;

  next();
}
