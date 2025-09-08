import dotenv from "dotenv";
import path from "path";
import { verifyJWT } from "./middlewares/auth";

// 👇 fuerza a cargar el .env que está en apps/backend/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import healthRoutes from "./routes/health";
import authRoutes from "./routes/auth";

const app = express();
const allowedOrigins = ["http://localhost:3000"];
app.use(cors({ origin: allowedOrigins }));
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

app.use("/auth", authRoutes);
app.use("/health", healthRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});
