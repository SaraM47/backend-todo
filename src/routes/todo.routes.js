import {
    getTodos,
    createTodo,
    updateTodo,
    replaceTodo,
    deleteTodo,
  } from "../controllers/todo.controller.js"
  
  export async function todoRoutes(app) {
    /* READ: hämta alla todos */
    app.get("/todos", async (_req, reply) => {
      try {
        return await getTodos()
      } catch {
        reply.code(500).send({ message: "Failed to fetch todos" })
      }
    })
  
    /* CREATE: skapa ny todo */
    app.post("/todos", async (req, reply) => {
      try {
        const todo = await createTodo(req.body)
        reply.code(201).send(todo)
      } catch (err) {
        reply
          .code(err.status || 500)
          .send({ message: err.message, issues: err.issues })
      }
    })
  
    /* UPDATE (PATCH): partiell uppdatering */
    app.patch("/todos/:id", async (req, reply) => {
      try {
        const { id } = req.params
        return await updateTodo(id, req.body)
      } catch (err) {
        reply
          .code(err.status || 500)
          .send({ message: err.message, issues: err.issues })
      }
    })
  
    /* UPDATE (PUT): ersätt hela todo */
    app.put("/todos/:id", async (req, reply) => {
      try {
        const { id } = req.params
        return await replaceTodo(id, req.body)
      } catch (err) {
        reply
          .code(err.status || 500)
          .send({ message: err.message, issues: err.issues })
      }
    })
  
    /* DELETE: ta bort todo */
    app.delete("/todos/:id", async (req, reply) => {
      try {
        const { id } = req.params
        await deleteTodo(id)
        reply.code(204).send()
      } catch (err) {
        reply.code(err.status || 500).send({ message: err.message })
      }
    })
  }
  