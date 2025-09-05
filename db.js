// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false
  }
});

export async function getPlant(id) {
  const [rows] = await pool.query("SELECT * FROM plantas WHERE usuario_id = ?", [id]);
  return rows;
}

export async function getUser(telefone) {
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE telefone = ?", [telefone]);
  return rows.length > 0 ? rows[0] : null;
}

export async function getPlants() {
  const [rows] = await pool.query("SELECT * FROM plantas");
  return rows;
}

export async function createPlant(usuarioId, horarios, foto_url) {
  const [result] = await pool.query(
    "INSERT INTO plantas (usuario_id, horarios, foto_url) VALUES (?, ?, ?)",
    [usuarioId, horarios, foto_url]
  );
  return getPlant(result.insertId);
}

export async function createUser(telefone, senha_hash) {
  const [result] = await pool.query(
    "INSERT INTO usuarios (telefone, senha_hash) VALUES (?, ?)",
    [telefone, senha_hash]
  );
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [result.insertId]);
  return rows[0];
}

 export async function deletePlant(id) {
  const [result] = await pool.query("delete from planta where id=?", [id]);
  return result;
}


export async function findUser(telefone, senha) {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE telefone = ? AND senha_hash = ?",
    [telefone, senha]
  );
  return rows.length > 0 ? rows[0].id : null;
}

