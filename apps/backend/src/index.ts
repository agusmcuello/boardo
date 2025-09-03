import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

const app = express();
const allowedOrigins = ["http://localhost:3000"]; // Next.js dev
app.use(cors({ origin: allowedOrigins }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});
