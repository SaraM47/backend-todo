import Fastify from "fastify"
import cors from "@fastify/cors"
import "dotenv/config"
import { connectDb } from "./db.js"
import { todoRoutes } from "./routes/todo.routes.js"

// Skapa Fastify-app med logger aktiverat
const app = Fastify({ logger: true })

// Starta servern genom att ansluta till databasen och registrera routes
async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI")
  }

  // Registrera CORS-plugin
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })

  // Anslut till MongoDB
  await connectDb(process.env.MONGODB_URI)

  // Hälsokontroll endpoint
  app.get("/health", async () => ({ ok: true }))

  // Registrera todo-routes
  await app.register(todoRoutes)

  // Starta servern
  await app.listen({
    port: process.env.PORT || 5000,
    host: "0.0.0.0",
  })
}

start()
