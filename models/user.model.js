// ============================================
// Modelo de datos: Usuario (User)
// Define la estructura del documento en MongoDB
// ============================================
import mongoose from "mongoose";
// bcrypt: librería para encriptar contraseñas de forma segura mediante hashing
import bcrypt from "bcrypt";

// Definición del esquema de usuario con sus campos y validaciones
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      match: /^\S+@\S+\.\S+$/, // Validación de formato de correo electrónico
      unique: true, // El correo electrónico debe ser único en la colección
    },
    // Contraseña del usuario (se encriptará antes de guardar mediante el middleware pre-save)
    password: {
      type: String,
      required: true,
      minLength: 5, // Longitud mínima de 5 caracteres para mayor seguridad
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
      // Función de transformación que modifica el JSON de salida
      // para ocultar campos sensibles o internos al enviar la respuesta
      transform: function (doc, ret) {
        delete ret.password; // Elimina la contraseña hasheada del JSON por seguridad
        delete ret._id; // Elimina el _id nativo de MongoDB (se usa el virtual "id" en su lugar)
      },
    },
  },
);

userSchema.virtual("books", {
  ref: "Book", // El modelo al que se refiere (nombre del modelo)
  localField: "_id", // El campo local que se usará para la relación
  foreignField: "user", // El campo en el modelo Book que referencia al User
});

// Middleware pre-save: se ejecuta automáticamente antes de cada operación .save()
// Encripta la contraseña solo si ha sido modificada (creación o actualización)
// Esto garantiza que la contraseña nunca se almacene en texto plano en la BD
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // bcrypt.hash genera un hash seguro con salt de 10 rondas
    this.password = await bcrypt.hash(this.password, 10);
  }

  next(); // Continúa con la operación de guardado
});

// Creación del modelo "User" a partir del esquema definido
const User = mongoose.model("User", userSchema);

export default User;
