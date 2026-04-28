const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

// ================= APP =================
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// ================= DB =================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "60466603", // 👈 deja vacío por ahora
  database: "db_romero"
});

db.connect(err => {
  if (err) {
    console.log("❌ Error DB:", err.message);
    return;
  }
  console.log("DB OK ✔");
});

// ================= TABLAS =================
const tablas = {
  accion: "ID_ACCION",
  actividad: "ID_ACTIVIDAD",
  subaccion: "ID_SA",
  tipo_agente: "ID_TA",
  tipo_transporte: "id_tt",
  zona_distrito: "id_zd",
  zona_provincia: "id_zp"
};

// ================= CRUD =================

// LISTAR
app.get("/api/:tabla", (req, res) => {
  const tabla = req.params.tabla;

  if (!tablas[tabla]) return res.send("Tabla inválida");

  db.query(`SELECT * FROM ${tabla}`, (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

// CREAR
app.post("/api/:tabla", (req, res) => {
  const tabla = req.params.tabla;

  if (!tablas[tabla]) return res.send("Tabla inválida");

  db.query(`INSERT INTO ${tabla} SET ?`, req.body, err => {
    if (err) return res.send(err);
    res.json({ ok: true });
  });
});

// EDITAR
app.put("/api/:tabla/:id", (req, res) => {
  const tabla = req.params.tabla;
  const idField = tablas[tabla];

  db.query(
    `UPDATE ${tabla} SET ? WHERE ${idField}=?`,
    [req.body, req.params.id],
    err => {
      if (err) return res.send(err);
      res.json({ ok: true });
    }
  );
});

// ELIMINAR
app.delete("/api/:tabla/:id", (req, res) => {
  const tabla = req.params.tabla;
  const idField = tablas[tabla];

  db.query(
    `DELETE FROM ${tabla} WHERE ${idField}=?`,
    [req.params.id],
    err => {
      if (err) return res.send(err);
      res.json({ ok: true });
    }
  );
});

// ================= START =================
app.listen(3000, () => {
  console.log("🚀 http://localhost:3000");
});