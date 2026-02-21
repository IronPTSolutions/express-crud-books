import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Permite usar .populate("user") para obtener los datos completos del usuario
    },
  },
  {
    timestamps: true, // Añade automáticamente campos createdAt y updatedAt
    versionKey: false, // Desactiva el campo __v de versionado de Mongoose
    // Configuración de serialización JSON del documento
    toJSON: {
      virtuals: true, // Incluye campos virtuales (como "id") en la salida JSON
      // Función de transformación para limpiar el JSON de salida
      transform: function (doc, ret) {
        delete ret._id; // Elimina el _id nativo de MongoDB (se usa el virtual "id" en su lugar)
      },
    },
  },
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
