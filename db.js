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
  const [result] = await pool.query("DELETE FROM plantas WHERE id = ?", [id]);
  return result;
}



export async function findUser(telefone, senha_hash) {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE telefone = ? AND senha_hash = ?",
    [telefone, senha_hash]
  );
  return rows.length > 0 ? rows[0].id : null;
}

export async function updateArduino(cod_ard, usuario_id, horarios) {
  const [result] = await pool.query(
    `UPDATE arduino
     SET usuario_id = ?, horarios = ?
     WHERE cod_ard = ?`,
    [usuario_id, horarios, cod_ard]
  );
  return result.affectedRows > 0;
}


export async function getArduinoByUser(usuario_id) {
  const [rows] = await pool.query(
    "SELECT * FROM arduino WHERE usuario_id = ?",
    [usuario_id]
  );
  return rows;
}

export async function getArduino(cod_ard) {
  const [rows] = await pool.query(
    "SELECT * FROM arduino WHERE cod_ard = ?",
    [cod_ard]
  );
  return rows;
}


