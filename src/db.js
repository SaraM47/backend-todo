import mongoose from "mongoose"

// Funktion för att ansluta till MongoDB
export async function connectDb(uri) {
  mongoose.set("strictQuery", true)
  await mongoose.connect(uri)
  console.log("MongoDB connected")
}
