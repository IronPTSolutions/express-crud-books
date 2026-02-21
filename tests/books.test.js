import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";
import Book from "../models/book.model.js";

describe("API de Books - CRUD completo", () => {
  // ============================================
  // CREATE - POST /api/books
  // ============================================
  describe("POST /api/books", () => {
    it("debería crear un libro correctamente", async () => {
      // Given
      const newBook = {
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        publishedYear: 1967,
        genre: "Realismo mágico",
        isbn: "isbn",
        summary: "La historia de la familia Buendía en Macondo.",
      };

      // When
      const response = await request(app)
        .post("/api/books")
        .send(newBook)
        .expect(201);

      // Verificamos la respuesta
      // Then
      expect(response.body.title).toBe("Cien años de soledad");
      expect(response.body.author).toBe("Gabriel García Márquez");
      expect(response.body.publishedYear).toBe(1967);
      expect(response.body.id).toBeDefined();

      // Verificamos que realmente se guardó en la BDD
      const bookInDB = await Book.findById(response.body.id);
      expect(bookInDB).not.toBeNull();
      expect(bookInDB.title).toBe("Cien años de soledad");
    });

    it("debería devolver 400 si falta el título", async () => {
      const badBook = {
        author: "Autor sin título",
      };

      const response = await request(app)
        .post("/api/books")
        .send(badBook)
        .expect(400);

      expect(response.body.title.message).toBe("Path `title` is required.");
    });

    it("debería devolver 400 si falta el autor", async () => {
      const badBook = {
        title: "Título sin autor",
      };

      const response = await request(app)
        .post("/api/books")
        .send(badBook)
        .expect(400);

      expect(response.body.author.message).toBe("Path `author` is required.");
    });
  });

  // ============================================
  // READ ALL - GET /api/books
  // ============================================
  describe("GET /api/books", () => {
    it("debería devolver un array vacío si no hay libros", async () => {
      await Book.deleteMany();

      const response = await request(app).get("/api/books").expect(200);

      expect(response.body).toEqual([]);
    });

    it("debería devolver todos los libros existentes", async () => {
      // Primero creamos algunos libros directamente en la BDD
      await Book.create({ title: "Libro 1", author: "Autor 1", isbn: "1" });
      await Book.create({ title: "Libro 2", author: "Autor 2", isbn: "2" });
      await Book.create({ title: "Libro 3", author: "Autor 3", isbn: "3" });

      const response = await request(app).get("/api/books").expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body[0].title).toBe("Libro 1");
      expect(response.body[2].title).toBe("Libro 3");
    });
  });

  // ============================================
  // READ ONE - GET /api/books/:id
  // ============================================
  describe("GET /api/books/:id", () => {
    it("debería devolver un libro por su ID", async () => {
      const book = await Book.create({
        title: "1984",
        author: "George Orwell",
        publishedYear: 1949,
        genre: "Distopía",
        isbn: "1",
      });

      const response = await request(app)
        .get(`/api/books/${book.id}`)
        .expect(200);

      expect(response.body.title).toBe("1984");
      expect(response.body.author).toBe("George Orwell");
    });

    it("debería devolver 404 si el libro no existe", async () => {
      const fakeId = "64f1a2b3c4d5e6f7a8b9c0d1"; // ID válido pero inexistente

      const response = await request(app)
        .get(`/api/books/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe("Book not found");
    });

    it("debería devolver 404 si el ID de libro es incorrecto", async () => {
      const fakeId = "1"; // ID válido pero inexistente

      const response = await request(app)
        .get(`/api/books/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe("Resource not found");
    });
  });

  // ============================================
  // UPDATE - PATCH /api/books/:id
  // ============================================
  describe("PATCH /api/books/:id", () => {
    it("debería actualizar parcialmente un libro existente", async () => {
      const book = await Book.create({
        title: "Título original",
        author: "Autor original",
        isbn: "1",
        publishedYear: 2000,
      });

      const updatedData = {
        title: "Título actualizado",
        publishedYear: 2024,
      };

      const response = await request(app)
        .patch(`/api/books/${book._id}`)
        .send(updatedData)
        .expect(200);

      // Verificamos la respuesta
      expect(response.body.title).toBe("Título actualizado");
      expect(response.body.publishedYear).toBe(2024);
      expect(response.body.author).toBe("Autor original"); // No debe cambiar

      // Verificamos que se actualizó en la BDD
      const bookInDB = await Book.findById(book._id);
      expect(bookInDB.title).toBe("Título actualizado");
    });

    it("debería devolver 404 si el libro a actualizar no existe", async () => {
      const fakeId = "64f1a2b3c4d5e6f7a8b9c0d1";

      const response = await request(app)
        .patch(`/api/books/${fakeId}`)
        .send({ title: "No importa" })
        .expect(404);

      expect(response.body.message).toBe("Book not found");
    });
  });

  // ============================================
  // DELETE - DELETE /api/books/:id
  // ============================================
  describe("DELETE /api/books/:id", () => {
    it("debería eliminar un libro existente", async () => {
      const book = await Book.create({
        title: "Libro a borrar",
        author: "Autor",
        isbn: "1",
      });

      await request(app).delete(`/api/books/${book._id}`).expect(204); // 204 No Content

      // Verificamos que realmente se eliminó de la BDD
      const bookInDB = await Book.findById(book._id);
      expect(bookInDB).toBeNull();
    });

    it("debería devolver 404 si el libro a eliminar no existe", async () => {
      const fakeId = "64f1a2b3c4d5e6f7a8b9c0d1";

      const response = await request(app)
        .delete(`/api/books/${fakeId}`)
        .expect(404);

      expect(response.body.error).toBe("Book not found");
    });
  });

  // ============================================
  // INTEGRACIÓN - Flujo completo CRUD
  // ============================================
  describe("Flujo completo CRUD", () => {
    it("debería crear, leer, actualizar y eliminar un libro", async () => {
      // 1. CREATE
      const createRes = await request(app)
        .post("/api/books")
        .send({
          title: "Test Book",
          author: "Test Author",
          publishedYear: 2024,
          isbn: "1",
          genre: "Tecnología",
          summary: "Un libro de prueba",
        })
        .expect(201);

      const bookId = createRes.body.id;

      // 2. READ - Verificar que existe
      const readRes = await request(app)
        .get(`/api/books/${bookId}`)
        .expect(200);

      expect(readRes.body.title).toBe("Test Book");

      // 3. UPDATE (PATCH)
      const updateRes = await request(app)
        .patch(`/api/books/${bookId}`)
        .send({ title: "Updated Book" })
        .expect(200);

      expect(updateRes.body.title).toBe("Updated Book");
      expect(updateRes.body.author).toBe("Test Author"); // No debe cambiar

      // 4. DELETE
      await request(app).delete(`/api/books/${bookId}`).expect(204);

      // 5. Verificar que ya no existe
      await request(app).get(`/api/books/${bookId}`).expect(404);
    });
  });

  it("Generic 404", async () => {
    const response = await request(app).get("/api/lalala").expect(404);

    expect(response.body.message).toBe("Route Not Found");
  });
});
