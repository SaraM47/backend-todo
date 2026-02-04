import Fastify from "fastify"
import cors from "@fastify/cors"
import "dotenv/config"
import { connectDb } from "./db.js"
import { todoRoutes } from "./routes/todo.routes.js"

// Skapa Fastify-app med logger aktiverat
const app = Fastify({ logger: true })

// Starta servern genom att ansluta till databasen och registrera routes
async function start() {
  // Registrera CORS-plugin
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })

  // Hälsokontroll endpoint
  app.get("/health", async () => ({ ok: true }))

  // Rot-endpoint för att verifiera att API:t körs korrekt
  app.get("/", async () => ({
    message: "Todo API is running",
  }))

  // Registrera todo-routes
  await app.register(todoRoutes)

  // Starta servern
  const PORT = process.env.PORT || 5000
  await app.listen({
    port: PORT,
    host: "0.0.0.0",
  })

  // Anslut till MongoDB efter att servern är igång
  if (!process.env.MONGODB_URI) {
    app.log.error("Missing MONGODB_URI")
    return
  }

  try {
    await connectDb(process.env.MONGODB_URI)
    app.log.info("MongoDB connected")
  } catch (err) {
    app.log.error("MongoDB connection failed", err)
  }
}

start()
