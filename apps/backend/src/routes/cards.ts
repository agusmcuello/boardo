import { Router } from "express";
import pool from "../config/db";
import { verifyJWT } from "../middlewares/auth";

const router = Router();

// Obtener cards de una lista
router.get("/:listId", verifyJWT, async (req, res) => {
  const { listId } = req.params;
  const [rows] = await pool.query("SELECT * FROM cards WHERE list_id = ?", [
    listId,
  ]);
  res.json(rows);
});

// Crear card
router.post("/", verifyJWT, async (req, res) => {
  const { listId, title, description, position } = req.body;
  const [result]: any = await pool.query(
    "INSERT INTO cards (list_id, title, description, position) VALUES (?, ?, ?, ?)",
    [listId, title, description, position]
  );
  res.status(201).json({ id: result.insertId, title });
});

export default router;
