import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

// ✅ Registro
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verificar si ya existe el usuario
    const [existing] = (await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    )) as any;

    if (existing.length > 0) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar en DB
    await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (err) {
    console.error("❌ Error en /register:", err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario
    const [rows] = (await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = ?",
      [email]
    )) as any;

    if (rows.length === 0) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const user = rows[0];

    // Comparar contraseñas
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Generar JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login exitoso",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ Error en /login:", err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

export default router;
