import mongoose from "mongoose"

// Definiera Todo-schema med valideringar
const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 200,
      trim: true,
    },
    status: {
      type: String,
      enum: ["NOT_STARTED", "IN_PROGRESS", "DONE"],
      required: true,
      default: "NOT_STARTED",
    },
  },
  {
    timestamps: true,
  },
)

// Exportera Todo-modellen
export const TodoModel = mongoose.model("Todo", TodoSchema)
