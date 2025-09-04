import { Router } from "express";
import pool from "../config/db";

const router = Router();

router.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (e: any) {
    console.error("❌ DB connection error:", e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

export default router;
