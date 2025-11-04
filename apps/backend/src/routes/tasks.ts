import { Router } from "express";
import pool from "../config/db";
import { verifyJWT } from "../middlewares/auth";

const router = Router();

// ✅ Obtener las task del user
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
        l.title AS listTitle
       FROM cards c
       JOIN lists l ON c.list_id = l.id
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

// PUT /api/tasks/:id
router.put("/:id", verifyJWT, async (req, res) => {
  const taskId = Number(req.params.id);
  const { listId, position } = req.body;
  const userId = (req as any).user.id;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) obtener la task actual
    const [currRows]: any = await conn.query(
      "SELECT list_id, position FROM cards WHERE id = ?",
      [taskId]
    );
    if (!currRows || currRows.length === 0) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ error: "Card not found" });
    }
    const current = currRows[0];

    // 2) si la columna cambió: remove from source and shift positions
    if (current.list_id !== listId) {
      // Decrement positions in source list after the current.position
      await conn.query(
        "UPDATE cards SET position = position - 1 WHERE list_id = ? AND position > ?",
        [current.list_id, current.position]
      );

      // Increment positions in target list for positions >= desired position
      await conn.query(
        "UPDATE cards SET position = position + 1 WHERE list_id = ? AND position >= ?",
        [listId, position]
      );

      // Finally update the moved task
      await conn.query(
        "UPDATE cards SET list_id = ?, position = ? WHERE id = ?",
        [listId, position, taskId]
      );
    } else {
      // Reordering within same list
      if (position > current.position) {
        // shift up intermediate tasks down by 1
        await conn.query(
          "UPDATE cards SET position = position - 1 WHERE list_id = ? AND position > ? AND position <= ?",
          [listId, current.position, position]
        );
      } else if (position < current.position) {
        // shift down intermediate tasks up by 1
        await conn.query(
          "UPDATE cards SET position = position + 1 WHERE list_id = ? AND position >= ? AND position < ?",
          [listId, position, current.position]
        );
      }
      // set moved task pos
      await conn.query("UPDATE cards SET position = ? WHERE id = ?", [
        position,
        taskId,
      ]);
    }

    // Opcional: renumerar secuencialmente si querés (evita overflow/colisiones)
    // fetch and renumber
    // const [rows] = await conn.query("SELECT id FROM cards WHERE list_id = ? ORDER BY position", [listId]);
    // for (let i = 0; i < rows.length; i++) { await conn.query("UPDATE cards SET position = ? WHERE id = ?", [i+1, rows[i].id]); }

    await conn.commit();
    conn.release();

    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error("Error moving task:", err);
    res.status(500).json({ error: "Error moving task" });
  }
});

// Crear task (POST /api/task)
router.post("/", verifyJWT, async (req, res) => {
  const userId = (req as any).user.id;
  const {
    listId, // number (id de la lista/columna)
    title,
    description = "",
    position,
    assignee_id = null,
    priority = "MEDIUM",
  } = req.body;

  if (!listId || !title) {
    return res.status(400).json({ error: "listId y title son obligatorios" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // si no envían position, calculamos el siguiente (max + 1)
    let finalPosition = Number(position) || null;
    if (!finalPosition) {
      const [rows]: any = await conn.query(
        "SELECT COALESCE(MAX(position), 0) AS maxPos FROM cards WHERE list_id = ?",
        [listId]
      );
      const maxPos = rows && rows[0] ? Number(rows[0].maxPos) : 0;
      finalPosition = maxPos + 1;
    } else {
      // si envían position, shift de posiciones >= position en la lista objetivo
      await conn.query(
        "UPDATE cards SET position = position + 1 WHERE list_id = ? AND position >= ?",
        [listId, finalPosition]
      );
    }

    const [result]: any = await conn.query(
      `INSERT INTO cards
        (list_id, title, description, position, priority, assignee_id, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [listId, title, description, finalPosition, priority, assignee_id, userId]
    );

    // devolver la fila completa creada (sel después del insert)
    const [createdRows]: any = await conn.query(
      "SELECT c.*, l.title AS listTitle FROM cards c JOIN lists l ON c.list_id = l.id WHERE c.id = ?",
      [result.insertId]
    );

    await conn.commit();
    conn.release();

    res.status(201).json(createdRows[0]);
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error("Error creating card:", err);
    res.status(500).json({ error: "Error creating card" });
  }
});

// apps/backend/src/routes/tasks.ts
router.delete("/:id", verifyJWT, async (req, res) => {
  const taskId = Number(req.params.id);
  const userId = (req as any).user.id;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) obtener la task actual (list_id y position y created_by/assignee)
    const [rows]: any = await conn.query(
      "SELECT list_id, position, created_by, assignee_id FROM cards WHERE id = ?",
      [taskId]
    );
    if (!rows || rows.length === 0) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ error: "Card not found" });
    }
    const task = rows[0];

    // 2) comprobar permisos: solo creator o assignee (ajusta si lo querés distinto)
    if (task.created_by !== userId && task.assignee_id !== userId) {
      await conn.rollback();
      conn.release();
      return res
        .status(403)
        .json({ error: "No tienes permiso para eliminar esta tarea" });
    }

    // 3) borrar la task
    await conn.query("DELETE FROM cards WHERE id = ?", [taskId]);

    // 4) compactar posiciones: decrementar los position > deleted.position en la misma lista
    await conn.query(
      "UPDATE cards SET position = position - 1 WHERE list_id = ? AND position > ?",
      [task.list_id, task.position]
    );

    await conn.commit();
    conn.release();
    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error("Error deleting card:", err);
    res.status(500).json({ error: "Error deleting card" });
  }
});

export default router;
