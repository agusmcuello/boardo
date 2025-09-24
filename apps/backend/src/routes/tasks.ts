import { Router } from "express";
import pool from "../config/db";
import { verifyJWT } from "../middlewares/auth";

const router = Router();

// ✅ Primero los específicos
router.get("/user/mine", verifyJWT, async (req, res) => {
  const userId = (req as any).user.id;
  const [rows] = await pool.query(
    "SELECT * FROM cards WHERE created_by = ? OR assignee_id = ?",
    [userId, userId]
  );
  res.json(rows);
});

router.get("/user", verifyJWT, async (req, res) => {
  const userId = (req as any).user.id;
  try {
    const [rows] = await pool.query(
      `SELECT 
        c.id, 
        c.title, 
        c.description, 
        c.list_id AS listId, 
        c.priority, 
        c.position, 
        c.created_by AS createdBy, 
        c.assignee_id AS assigneeId, 
        l.board_id AS boardId, 
        b.title AS boardTitle
       FROM cards c
       JOIN lists l ON c.list_id = l.id
       LEFT JOIN boards b ON l.board_id = b.id
       WHERE c.assignee_id = ? OR c.created_by = ?`,
      [userId, userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching user tasks" });
  }
});

// ✅ Luego el de listas
router.get("/list/:listId", verifyJWT, async (req, res) => {
  const { listId } = req.params;
  const [rows] = await pool.query(
    "SELECT * FROM cards WHERE list_id = ? ORDER BY position",
    [listId]
  );
  res.json(rows);
});

// 🚨 Por último el genérico
router.get("/:listId", verifyJWT, async (req, res) => {
  const { listId } = req.params;
  const [rows] = await pool.query("SELECT * FROM cards WHERE list_id = ?", [
    listId,
  ]);
  res.json(rows);
});

export default router;
