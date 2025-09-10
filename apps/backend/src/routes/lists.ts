import { Router } from "express";
import pool from "../config/db";
import { verifyJWT } from "../middlewares/auth";

const router = Router();

// Obtener listas de un board
router.get("/:boardId", verifyJWT, async (req, res) => {
  const { boardId } = req.params;
  const [rows] = await pool.query("SELECT * FROM lists WHERE board_id = ?", [
    boardId,
  ]);
  res.json(rows);
});

// Crear lista
router.post("/", verifyJWT, async (req, res) => {
  const { boardId, title, position } = req.body;
  const [result]: any = await pool.query(
    "INSERT INTO lists (board_id, title, position) VALUES (?, ?, ?)",
    [boardId, title, position]
  );
  res.status(201).json({ id: result.insertId, title });
});

export default router;
