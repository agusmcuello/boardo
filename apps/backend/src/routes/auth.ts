import { Router } from "express";
import pool from "../config/db";

const router = Router();

router.get("/auth", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

export default router;
