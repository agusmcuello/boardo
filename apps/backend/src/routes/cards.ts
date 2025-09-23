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

router.get("/list/:listId", verifyJWT, async (req, res) => {
  const { listId } = req.params;
  const [rows] = await pool.query(
    "SELECT * FROM cards WHERE list_id = ? ORDER BY position",
    [listId]
  );
  res.json(rows);
});

router.post("/", verifyJWT, async (req, res) => {
  const { listId, title, description, position, assignee_id, priority } =
    req.body;
  try {
    const [result]: any = await pool.query(
      "INSERT INTO cards (list_id, title, description, position, assignee_id, priority, status, created_by) VALUES (?, ?, ?, ?, ?, ?, 'TODO', ?)",
      [
        listId,
        title,
        description || "",
        position || 0,
        assignee_id || null,
        priority || "MEDIUM",
        (req as any).user.id,
      ]
    );
    res.status(201).json({ id: result.insertId, title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating card" });
  }
});

router.get("/user/me", verifyJWT, async (req, res) => {
  const userId = (req as any).user.id;
  const [rows] = await pool.query(
    "SELECT * FROM cards WHERE created_by = ? OR assignee_id = ?",
    [userId, userId]
  );
  res.json(rows);
});

// GET /api/cards/user
router.get("/user", verifyJWT, async (req, res) => {
  const userId = (req as any).user.id;
  try {
    // retornar cards asignadas al user (o creadas por él si prefieres)
    const [rows] = await pool.query(
      `SELECT c.*, l.board_id, b.title AS board_title
       FROM cards c
       JOIN lists l ON c.list_id = l.id
       LEFT JOIN boards b ON l.board_id = b.id
       WHERE c.assignee_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching user cards" });
  }
});

export default router;
