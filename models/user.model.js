// ============================================
// Modelo de datos: Usuario (User)
// Define la estructura del documento en MongoDB
// ============================================

import mongoose from "mongoose";

// Definición del esquema de un libro con sus campos y validaciones
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      match: /^\S+@\S+\.\S+$/, // Validación de formato de correo electrónico
      unique: true, // El correo electrónico debe ser único en la colección
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
    },
    fullName: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    birthDate: {
      type: Date,
      required: true,
      validate: function (value) {
        const now = Date.now();
        const valueMilliseconds = value.getTime();

        // validate older than 18 years
        const eighteenYearsInMilliseconds = 18 * 365.25 * 24 * 60 * 60 * 1000;
        return valueMilliseconds <= now - eighteenYearsInMilliseconds;
      },
    },
  },
  {
    timestamps: true, // Añade automáticamente campos createdAt y updatedAt
    versionKey: false, // Desactiva el campo __v de versionado de Mongoose
    toJSON: {
      virtuals: true, // Include virtuals fields on JSON
    },
  },
);

userSchema.virtual("books", {
  ref: "Book", // El modelo al que se refiere (nombre del modelo)
  localField: "_id", // El campo local que se usará para la relación
  foreignField: "user", // El campo en el modelo Book que referencia al User
});

// Creación del modelo "User" a partir del esquema definido
const User = mongoose.model("User", userSchema);

export default User;
