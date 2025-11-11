import dotenv from "dotenv";
import path from "path";
import { verifyJWT } from "./middlewares/auth";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import healthRoutes from "./routes/health";
import authRoutes from "./routes/auth";
import boardsRoutes from "./routes/boards";
import listsRoutes from "./routes/lists";
import tasksRoutes from "./routes/tasks";

const app = express();

app.use(
  cors({
    origin: ["https://boardo-frontend.vercel.app", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

console.log("Loaded ENV:", {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PASSWORD,
  db: process.env.DATABASE_NAME,
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/protected", verifyJWT, (req, res) => {
  res.json({ message: "You are authorized!", user: (req as any).user });
});

// ✅ Rutas reales
app.use("/api/auth", authRoutes);
app.use("/health", healthRoutes);
app.use("/api/boards", boardsRoutes);
app.use("/api/lists", listsRoutes);
app.use("/api/tasks", tasksRoutes);

// ✅ Fallback seguro compatible con Express 5
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});
