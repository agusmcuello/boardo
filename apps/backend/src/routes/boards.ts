import { Router } from "express";
import pool from "../config/db";
import { verifyJWT } from "../middlewares/auth";

const router = Router();

// Obtener boards del usuario
router.get("/", verifyJWT, async (req, res) => {
  const userId = (req as any).user.id;
  const [rows] = await pool.query("SELECT * FROM boards WHERE owner_id = ?", [
    userId,
  ]);
  res.json(rows);
});

// Crear board
router.post("/", verifyJWT, async (req, res) => {
  const userId = (req as any).user.id;
  const { title } = req.body;

  const [result]: any = await pool.query(
    "INSERT INTO boards (title, owner_id) VALUES (?, ?)",
    [title, userId]
  );

  res.status(201).json({ id: result.insertId, title });
});

// Eliminar board
router.delete("/:id", verifyJWT, async (req, res) => {
  const userId = (req as any).user.id;
  const { id } = req.params;

  await pool.query("DELETE FROM boards WHERE id = ? AND owner_id = ?", [
    id,
    userId,
  ]);
  res.json({ success: true });
});

export default router;
