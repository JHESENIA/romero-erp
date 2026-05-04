const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= FRONTEND =================
app.use(express.static(path.join(__dirname, "../fronted")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../fronted/login.html"));
});
app.get("/",(req,res) =>{
  res.sendFile(path.join(__dirname, "../service/auth.service.js"));
});


// ================= DB =================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_romero"
});

db.connect(err => {
  if (err) {
    console.log("❌ Error DB:", err.message);
    return;
  }
  console.log("DB OK ✔");
});

// ================= CRUD DINÁMICO =================
const tablas = {
  accion: "ID_ACCION",
  actividad: "ID_ACTIVIDAD",
  subaccion: "ID_SA",
  tipo_agente: "ID_TA",
  tipo_transporte: "id_tt",
  zona_distrito: "id_zd",
  zona_provincia: "id_zp"
};

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

// ================= LOGIN =================
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) return res.status(500).json({ success: false });

      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Credenciales incorrectas"
        });
      }

      res.json({
        success: true,
        token: "fake-token",
        usuario: results[0]
      });
    }
  );
});

// ================= REGISTER =================
app.post("/api/auth/register", (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Completa todos los campos"
    });
  }

  db.query(
    "SELECT id FROM usuarios WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ success: false });

      if (results.length > 0) {
        return res.status(400).json({
          success: false,
          message: "El correo ya existe"
        });
      }

      db.query(
        "INSERT INTO usuarios (nombre, email, password, rol, estado) VALUES (?, ?, ?, 'ADMIN', 1)",
        [nombre, email, password],
        (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ success: false });
          }

          res.json({
            success: true,
            message: "Usuario registrado"
          });
        }
      );
    }
  );
});
// ================= REGISTER =================
app.post("/api/auth/register", (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.json({
      success: false,
      message: "Todos los campos son obligatorios"
    });
  }

  // verificar si ya existe
  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err });

      if (result.length > 0) {
        return res.json({
          success: false,
          message: "El usuario ya existe"
        });
      }

      // insertar usuario
      db.query(
        "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
        [nombre, email, password],
        (err) => {
          if (err) return res.status(500).json({ success: false, message: err });

          res.json({
            success: true,
            message: "Usuario registrado correctamente"
          });
        }
      );
    }
  );
});

// ================= START =================
app.listen(3000, () => {
  console.log("🚀 http://localhost:3000");
});