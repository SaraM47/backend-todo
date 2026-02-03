import { z } from "zod"
import { TodoModel } from "../models/Todo.js"

// Lägger upp valideringsscheman med Zod för olika operationer
const createTodoSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().max(200).optional().or(z.literal("")),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "DONE"]).optional(),
})

/// PATCH = partiell uppdatering
const updateTodoSchema = z.object({
  title: z.string().trim().min(3).optional(),
  description: z.string().trim().max(200).optional().or(z.literal("")),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "DONE"]).optional(),
})

/* PUT = ersätter hela todo */
const replaceTodoSchema = z.object({
  title: z.string().trim().min(3),
  description: z.string().trim().max(200).optional().or(z.literal("")),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "DONE"]),
})

// CRUD-funktioner för Todo-modellen
// READ = hämta alla todos
export async function getTodos() {
  return await TodoModel.find().sort({ createdAt: -1 })
}

// CREATE = skapa ny todo
export async function createTodo(data) {
  const parsed = createTodoSchema.safeParse(data)
  if (!parsed.success) {
    throw {
      status: 400,
      message: "Validation error",
      issues: parsed.error.issues,
    }
  }

  const { title, description, status } = parsed.data

  return await TodoModel.create({
    title,
    description: description || undefined,
    status: status ?? "NOT_STARTED",
  })
}

/* PATCH = partiell uppdatering */
export async function updateTodo(id, data) {
  const parsed = updateTodoSchema.safeParse(data)
  if (!parsed.success) {
    throw {
      status: 400,
      message: "Validation error",
      issues: parsed.error.issues,
    }
  }

  // Gör en kopia av de uppdaterade fälten
  const update = { ...parsed.data }
  if (update.description === "") update.description = undefined

  const todo = await TodoModel.findByIdAndUpdate(id, update, { new: true })
  if (!todo) {
    throw { status: 404, message: "Todo not found" }
  }

  return todo
}

/* PUT = full ersättning */
export async function replaceTodo(id, data) {
  const parsed = replaceTodoSchema.safeParse(data)
  if (!parsed.success) {
    throw {
      status: 400,
      message: "Validation error",
      issues: parsed.error.issues,
    }
  }

  const { title, description, status } = parsed.data

  const todo = await TodoModel.findByIdAndUpdate(
    id,
    {
      title,
      description: description || undefined,
      status,
    },
    {
      new: true,
      overwrite: true,
    }
  )

  if (!todo) {
    throw { status: 404, message: "Todo not found" }
  }

  return todo
}

// DELETE = ta bort todo
export async function deleteTodo(id) {
  const todo = await TodoModel.findByIdAndDelete(id)
  if (!todo) {
    throw { status: 404, message: "Todo not found" }
  }
}
