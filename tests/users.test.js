import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import User from "../models/user.model.js";

describe("API de Users - CRUD completo", () => {
  // ============================================
  // CREATE - POST /api/users
  // ============================================
  describe("POST /api/users", () => {
    it("debería crear un usuario correctamente", async () => {
      // Given
      const newUser = {
        email: "juan@example.com",
        password: "password123",
        fullName: "Juan Pérez",
        bio: "Desarrollador de software",
        birthDate: "1990-05-15",
      };

      // When
      const response = await request(app)
        .post("/api/users")
        .send(newUser)
        .expect(201);

      // Then
      expect(response.body.email).toBe("juan@example.com");
      expect(response.body.fullName).toBe("Juan Pérez");
      expect(response.body.bio).toBe("Desarrollador de software");
      expect(response.body.id).toBeDefined();

      // Verificamos que realmente se guardó en la BDD
      const userInDB = await User.findById(response.body.id);
      expect(userInDB).not.toBeNull();
      expect(userInDB.email).toBe("juan@example.com");
      expect(userInDB.password).not.toBe(newUser.password);
      expect(userInDB.password.length > newUser.password.length).toBe(true);
    });

    it("debería crear un usuario sin bio (campo opcional)", async () => {
      const newUser = {
        email: "maria@example.com",
        password: "password456",
        fullName: "María García",
        birthDate: "1995-08-20",
      };

      const response = await request(app)
        .post("/api/users")
        .send(newUser)
        .expect(201);

      expect(response.body.email).toBe("maria@example.com");
      expect(response.body.fullName).toBe("María García");
      expect(response.body.bio).toBeUndefined();
    });

    it("debería devolver 400 si falta el email", async () => {
      const badUser = {
        password: "password123",
        fullName: "Usuario sin email",
        birthDate: "1990-01-01",
      };

      const response = await request(app)
        .post("/api/users")
        .send(badUser)
        .expect(400);

      expect(response.body.email.message).toBe("Path `email` is required.");
    });

    it("debería devolver 400 si el email tiene formato inválido", async () => {
      const badUser = {
        email: "correo-invalido",
        password: "password123",
        fullName: "Usuario Prueba",
        birthDate: "1990-01-01",
      };

      const response = await request(app)
        .post("/api/users")
        .send(badUser)
        .expect(400);

      expect(response.body.email.message).toContain("is invalid");
    });

    it("debería devolver 400 si falta la password", async () => {
      const badUser = {
        email: "usuario@example.com",
        fullName: "Usuario sin password",
        birthDate: "1990-01-01",
      };

      const response = await request(app)
        .post("/api/users")
        .send(badUser)
        .expect(400);

      expect(response.body.password.message).toBe(
        "Path `password` is required.",
      );
    });

    it("debería devolver 400 si la password es demasiado corta", async () => {
      const badUser = {
        email: "usuario@example.com",
        password: "1234", // menos de 5 caracteres
        fullName: "Usuario Prueba",
        birthDate: "1990-01-01",
      };

      const response = await request(app)
        .post("/api/users")
        .send(badUser)
        .expect(400);

      expect(response.body.password.message).toContain(
        "is shorter than the minimum",
      );
    });

    it("debería devolver 400 si falta el fullName", async () => {
      const badUser = {
        email: "usuario@example.com",
        password: "password123",
        birthDate: "1990-01-01",
      };

      const response = await request(app)
        .post("/api/users")
        .send(badUser)
        .expect(400);

      expect(response.body.fullName.message).toBe(
        "Path `fullName` is required.",
      );
    });

    it("debería devolver 400 si falta birthDate", async () => {
      const badUser = {
        email: "usuario@example.com",
        password: "password123",
        fullName: "Usuario Prueba",
      };

      const response = await request(app)
        .post("/api/users")
        .send(badUser)
        .expect(400);

      expect(response.body.birthDate.message).toBe(
        "Path `birthDate` is required.",
      );
    });

    it("debería devolver 400 si el usuario es menor de 18 años", async () => {
      const today = new Date();
      const underageDate = new Date(
        today.getFullYear() - 10,
        today.getMonth(),
        today.getDate(),
      );

      const badUser = {
        email: "menor@example.com",
        password: "password123",
        fullName: "Menor de Edad",
        birthDate: underageDate.toISOString(),
      };

      const response = await request(app)
        .post("/api/users")
        .send(badUser)
        .expect(400);

      expect(response.body.birthDate.message).toContain("Validator failed");
    });

    it.skip("debería devolver 400 si el email ya está registrado", async () => {
      const userData = {
        email: "duplicado@example.com",
        password: "password123",
        fullName: "Usuario Original",
        birthDate: "1990-01-01",
      };

      // Crear el primer usuario
      await request(app).post("/api/users").send(userData).expect(201);

      // Intentar crear otro usuario con el mismo email
      const response = await request(app)
        .post("/api/users")
        .send(userData)
        .expect(409);

      expect(response.body.message).toContain("duplicate");
    });
  });

  // ============================================
  // READ ALL - GET /api/users
  // ============================================
  describe("GET /api/users", () => {
    it("debería devolver un array vacío si no hay usuarios", async () => {
      await User.deleteMany();

      const response = await request(app).get("/api/users").expect(200);

      expect(response.body).toEqual([]);
    });

    it("debería devolver todos los usuarios existentes", async () => {
      // Primero creamos algunos usuarios directamente en la BDD
      await User.create({
        email: "user1@example.com",
        password: "password123",
        fullName: "Usuario 1",
        birthDate: "1990-01-01",
      });
      await User.create({
        email: "user2@example.com",
        password: "password123",
        fullName: "Usuario 2",
        birthDate: "1991-02-02",
      });
      await User.create({
        email: "user3@example.com",
        password: "password123",
        fullName: "Usuario 3",
        birthDate: "1992-03-03",
      });

      const response = await request(app).get("/api/users").expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body[0].email).toBe("user1@example.com");
      expect(response.body[2].fullName).toBe("Usuario 3");
    });
  });

  // ============================================
  // READ ONE - GET /api/users/:id
  // ============================================
  describe("GET /api/users/:id", () => {
    it("debería devolver un usuario por su ID", async () => {
      const user = await User.create({
        email: "detail@example.com",
        password: "password123",
        fullName: "Usuario Detalle",
        bio: "Mi biografía",
        birthDate: "1990-01-01",
      });

      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .expect(200);

      expect(response.body.email).toBe("detail@example.com");
      expect(response.body.fullName).toBe("Usuario Detalle");
      expect(response.body.bio).toBe("Mi biografía");
    });

    it("debería incluir los libros del usuario (populate)", async () => {
      const user = await User.create({
        email: "conlibros@example.com",
        password: "password123",
        fullName: "Usuario con Libros",
        birthDate: "1990-01-01",
      });

      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .expect(200);

      expect(response.body.books).toBeDefined();
      expect(Array.isArray(response.body.books)).toBe(true);
    });

    it("debería devolver 404 si el usuario no existe", async () => {
      const fakeId = "64f1a2b3c4d5e6f7a8b9c0d1"; // ID válido pero inexistente

      const response = await request(app)
        .get(`/api/users/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe("User not found");
    });
  });

  // ============================================
  // UPDATE - PATCH /api/users/:id
  // ============================================
  describe("PATCH /api/users/:id", () => {
    it("debería actualizar parcialmente un usuario existente", async () => {
      const user = await User.create({
        email: "original@example.com",
        password: "password123",
        fullName: "Nombre Original",
        bio: "Bio original",
        birthDate: "1990-01-01",
      });

      const updatedData = {
        fullName: "Nombre Actualizado",
        bio: "Bio actualizada",
      };

      const response = await request(app)
        .patch(`/api/users/${user._id}`)
        .send(updatedData)
        .expect(200);

      // Verificamos la respuesta
      expect(response.body.fullName).toBe("Nombre Actualizado");
      expect(response.body.bio).toBe("Bio actualizada");
      expect(response.body.email).toBe("original@example.com"); // No debe cambiar

      // Verificamos que se actualizó en la BDD
      const userInDB = await User.findById(user._id);
      expect(userInDB.fullName).toBe("Nombre Actualizado");
    });

    it("debería actualizar la password", async () => {
      const user = await User.create({
        email: "changepass@example.com",
        password: "password123",
        fullName: "Usuario Cambio",
        birthDate: "1990-01-01",
      });

      const updatedData = {
        password: "newPassword456",
      };

      const response = await request(app)
        .patch(`/api/users/${user._id}`)
        .send(updatedData)
        .expect(200);

      // Verificamos que se actualizó en la BDD
      const userInDB = await User.findById(user._id);
      expect(userInDB.password).not.toBe("password123");
    });

    it("debería devolver 404 si el usuario a actualizar no existe", async () => {
      const fakeId = "64f1a2b3c4d5e6f7a8b9c0d1";

      const response = await request(app)
        .patch(`/api/users/${fakeId}`)
        .send({ fullName: "No importa" })
        .expect(404);

      expect(response.body.message).toBe("User not found");
    });

    it("debería devolver 400 si se intenta actualizar con email inválido", async () => {
      const user = await User.create({
        email: "valido@example.com",
        password: "password123",
        fullName: "Usuario",
        birthDate: "1990-01-01",
      });

      const updatedData = {
        email: "email-invalido",
      };

      const response = await request(app)
        .patch(`/api/users/${user._id}`)
        .send(updatedData)
        .expect(400);

      expect(response.body.email.message).toContain("is invalid");
    });

    it("debería devolver 400 si se intenta actualizar con password demasiado corta", async () => {
      const user = await User.create({
        email: "usuario@example.com",
        password: "password123",
        fullName: "Usuario",
        birthDate: "1990-01-01",
      });

      const updatedData = {
        password: "123", // menos de 5 caracteres
      };

      const response = await request(app)
        .patch(`/api/users/${user._id}`)
        .send(updatedData)
        .expect(400);

      expect(response.body.password.message).toContain(
        "is shorter than the minimum",
      );
    });
  });

  // ============================================
  // DELETE - DELETE /api/users/:id
  // ============================================
  describe("DELETE /api/users/:id", () => {
    it("debería eliminar un usuario existente", async () => {
      const user = await User.create({
        email: "borrar@example.com",
        password: "password123",
        fullName: "Usuario a Borrar",
        birthDate: "1990-01-01",
      });

      await request(app).delete(`/api/users/${user._id}`).expect(204); // 204 No Content

      // Verificamos que realmente se eliminó de la BDD
      const userInDB = await User.findById(user._id);
      expect(userInDB).toBeNull();
    });

    it("debería devolver 404 si el usuario a eliminar no existe", async () => {
      const fakeId = "64f1a2b3c4d5e6f7a8b9c0d1";

      const response = await request(app)
        .delete(`/api/users/${fakeId}`)
        .expect(404);

      expect(response.body.error).toBe("User not found");
    });
  });

  // ============================================
  // INTEGRACIÓN - Flujo completo CRUD
  // ============================================
  describe("Flujo completo CRUD", () => {
    it("debería crear, leer, actualizar y eliminar un usuario", async () => {
      // 1. CREATE
      const newUser = {
        email: "flujo@example.com",
        password: "password123",
        fullName: "Usuario Flujo",
        bio: "Biografía inicial",
        birthDate: "1990-01-01",
      };

      const createResponse = await request(app)
        .post("/api/users")
        .send(newUser)
        .expect(201);

      const userId = createResponse.body.id;
      expect(userId).toBeDefined();

      // 2. READ ONE
      const readResponse = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(readResponse.body.email).toBe("flujo@example.com");
      expect(readResponse.body.fullName).toBe("Usuario Flujo");

      // 3. UPDATE
      const updateData = {
        fullName: "Usuario Flujo Actualizado",
        bio: "Biografía actualizada",
      };

      const updateResponse = await request(app)
        .patch(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(updateResponse.body.fullName).toBe("Usuario Flujo Actualizado");
      expect(updateResponse.body.bio).toBe("Biografía actualizada");

      // 4. DELETE
      await request(app).delete(`/api/users/${userId}`).expect(204);

      // 5. Verificar que ya no existe
      await request(app).get(`/api/users/${userId}`).expect(404);
    });
  });

  describe("User login", () => {
    beforeAll(async () => {
      await User.create({
        email: "juan1@example.com",
        password: "password123",
        fullName: "Juan Pérez",
        bio: "Desarrollador de software",
        birthDate: "1990-05-15",
      });
    });

    it("happy case", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send({
          email: "juan1@example.com",
          password: "password123",
        })
        .expect(200);

      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("401 if user does not exist", async () => {
      await request(app)
        .post("/api/users/login")
        .send({
          email: "juanDoesNotExist@example.com",
          password: "password123",
        })
        .expect(401);
    });

    it("401 if wrong password", async () => {
      await request(app)
        .post("/api/users/login")
        .send({
          email: "juan1@example.com",
          password: "WRONG",
        })
        .expect(401);
    });
  });
});
