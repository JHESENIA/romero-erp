// ===== CONFIGURACIÓN DE TABLAS =====
const CONFIG = {
  accion: {
    titulo: "Acción",
    pk: "ID_ACCION",
    campos: [
      { key: "NOMBRE_ABREVIADO", label: "Nombre Abreviado", tipo: "text" },
      { key: "NOMBRE_ACCION",    label: "Nombre Acción",    tipo: "text" },
      { key: "CODIGO_A_E",       label: "Código A/E",       tipo: "text" },
      { key: "CODIGO_P_ACCION",  label: "Código P. Acción", tipo: "number" }
    ]
  },
  accion_especifica: {
    titulo: "Acción Específica",
    pk: "ID_AE",
    campos: [
      { key: "NOMBRE_ABREVIADO",  label: "Nombre Abreviado",   tipo: "text" },
      { key: "ACCION_ESPECIFICA", label: "Acción Específica",  tipo: "text" },
      { key: "CODIGO_A_E",        label: "Código A/E",         tipo: "text" }
    ]
  },
  actividad: {
    titulo: "Actividad",
    pk: "ID_ACTIVIDAD",
    campos: [
      { key: "NOMBRE_ACTIVIDAD",  label: "Nombre Actividad",  tipo: "text" },
      { key: "CODIGO_ACTIVIDAD",  label: "Código Actividad",  tipo: "text" },
      { key: "ID_TA",             label: "ID Tipo Agente",    tipo: "number" }
    ]
  },
  subaccion: {
    titulo: "Subacción",
    pk: "ID_SA",
    campos: [
      { key: "NOMBRE_ABREVIADO", label: "Nombre Abreviado",   tipo: "text" },
      { key: "SUB_ACCION_ESP",   label: "Sub Acción Esp.",    tipo: "text" },
      { key: "CONCAT",           label: "Concat",             tipo: "text" },
      { key: "CODIGO_S_A_E",     label: "Código S.A.E",       tipo: "text" },
      { key: "ID_AE",            label: "ID Acción Esp.",     tipo: "number" }
    ]
  },
  tipo_agente: {
    titulo: "Tipo Agente",
    pk: "ID_TA",
    campos: [
      { key: "ID_TA",     label: "ID Tipo Agente", tipo: "number" },
      { key: "NOMBRE_TA", label: "Nombre",         tipo: "text" }
    ]
  },
  tipo_transporte: {
    titulo: "Tipo Transporte",
    pk: "id_tt",
    campos: [
      { key: "NOMBRE_TRANSPORTE", label: "Nombre Transporte", tipo: "number" }
    ]
  },
  zona_distrito: {
    titulo: "Zona Distrito",
    pk: "id_zd",
    campos: [
      { key: "NOMBRE_DISTRITO", label: "Nombre Distrito",  tipo: "text" },
      { key: "id_zp",           label: "ID Provincia",     tipo: "number" }
    ]
  },
  zona_provincia: {
    titulo: "Zona Provincia",
    pk: "id_zp",
    campos: [
      { key: "NOMBRE_PROVINCIA", label: "Nombre Provincia", tipo: "text" }
    ]
  },
  detalle_registro: {
    titulo: "Detalle Registro",
    pk: "ID_REGISTRO",
    campos: [
      { key: "ID_ACCION",          label: "ID Acción",          tipo: "number" },
      { key: "ID_AE",              label: "ID Acción Esp.",      tipo: "number" },
      { key: "ID_SA",              label: "ID Subacción",        tipo: "number" },
      { key: "ID_TA",              label: "ID Tipo Agente",      tipo: "number" },
      { key: "id_tt",              label: "ID Tipo Transporte",  tipo: "number" },
      { key: "id_zd",              label: "ID Zona Distrito",    tipo: "number" },
      { key: "id_zp",              label: "ID Zona Provincia",   tipo: "number" },
      { key: "ID_ACTIVIDAD",       label: "ID Actividad",        tipo: "number" },
      { key: "NUM_SUPERVISORES",   label: "Núm. Supervisores",   tipo: "text" },
      { key: "EMPRESA_SUPERVISORA",label: "Empresa Supervisora", tipo: "text" },
      { key: "CALIDAD_ENTREGABLE", label: "Calidad Entregable",  tipo: "text" },
      { key: "NRO_EXPEDIENTE",     label: "Nro. Expediente",     tipo: "text" },
      { key: "CARTA_LINEA",        label: "Carta Línea",         tipo: "text" },
      { key: "OBSERVACIONES",      label: "Observaciones",       tipo: "text" },
      { key: "CONTRATO",           label: "Contrato",            tipo: "text" }
    ]
  }
};

// ===== ESTADO =====
let tablaActual = "accion";
let registros   = [];
let editId      = null;

// ===== ELEMENTOS =====
const tituloEl  = document.getElementById("tabla-titulo");
const subEl     = document.getElementById("tabla-sub");
const headEl    = document.getElementById("tabla-head");
const bodyEl    = document.getElementById("tabla-body");
const emptyEl   = document.getElementById("empty-state");
const overlay   = document.getElementById("modal-overlay");
const modalTit  = document.getElementById("modal-titulo");
const form      = document.getElementById("modal-form");
const buscador  = document.getElementById("buscador");
const toast     = document.getElementById("toast");

// ===== NAV =====
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    tablaActual = btn.dataset.tabla;
    buscador.value = "";
    cargar();
  });
});

// ===== CARGAR =====
async function cargar() {
  const cfg = CONFIG[tablaActual];
  tituloEl.textContent = cfg.titulo;
  subEl.textContent    = `${registros.length} registros`;

  try {
    const res = await fetch(`/api/${tablaActual}`);
    registros = await res.json();
  } catch {
    registros = [];
  }
  subEl.textContent = `${registros.length} registros`;
  renderTabla(registros);
}

// ===== RENDER TABLA =====
function renderTabla(data) {
  const cfg = CONFIG[tablaActual];

  // Head
  headEl.innerHTML = `<tr>
    <th>#</th>
    ${cfg.campos.map(c => `<th>${c.label}</th>`).join("")}
    <th>Acciones</th>
  </tr>`;

  // Body
  if (!data.length) {
    bodyEl.innerHTML = "";
    emptyEl.style.display = "block";
    return;
  }
  emptyEl.style.display = "none";

  bodyEl.innerHTML = data.map(row => {
    const id = row[cfg.pk];
    const celdas = cfg.campos.map(c =>
      `<td title="${row[c.key] ?? ""}">${row[c.key] ?? "<span style='color:#3a3a50'>—</span>"}</td>`
    ).join("");
    return `<tr>
      <td class="td-id">${id}</td>
      ${celdas}
      <td>
        <div class="td-acciones">
          <button class="btn-edit" onclick="abrirEditar(${id})">Editar</button>
          <button class="btn-del"  onclick="eliminar(${id})">Borrar</button>
        </div>
      </td>
    </tr>`;
  }).join("");
}

// ===== BUSCADOR =====
buscador.addEventListener("input", () => {
  const q = buscador.value.toLowerCase();
  const filtrado = registros.filter(r =>
    Object.values(r).some(v => String(v).toLowerCase().includes(q))
  );
  renderTabla(filtrado);
});

// ===== MODAL: NUEVO =====
document.getElementById("btn-nuevo").addEventListener("click", () => {
  editId = null;
  modalTit.textContent = `Nuevo · ${CONFIG[tablaActual].titulo}`;
  buildForm({});
  overlay.style.display = "flex";
});

// ===== MODAL: EDITAR =====
function abrirEditar(id) {
  const cfg = CONFIG[tablaActual];
  const row = registros.find(r => r[cfg.pk] === id);
  if (!row) return;
  editId = id;
  modalTit.textContent = `Editar · ${cfg.titulo} #${id}`;
  buildForm(row);
  overlay.style.display = "flex";
}

// ===== BUILD FORM =====
function buildForm(row) {
  const cfg = CONFIG[tablaActual];
  form.innerHTML = cfg.campos.map(c => `
    <div class="form-group">
      <label>${c.label}</label>
      <input
        type="${c.tipo}"
        name="${c.key}"
        value="${row[c.key] ?? ""}"
        placeholder="${c.label}"
      />
    </div>
  `).join("");
}

// ===== CERRAR MODAL =====
function cerrarModal() { overlay.style.display = "none"; }
document.getElementById("modal-close").addEventListener("click", cerrarModal);
document.getElementById("btn-cancel").addEventListener("click", cerrarModal);
overlay.addEventListener("click", e => { if (e.target === overlay) cerrarModal(); });

// ===== GUARDAR =====
document.getElementById("btn-save").addEventListener("click", async () => {
  const cfg    = CONFIG[tablaActual];
  const inputs = form.querySelectorAll("input, select");
  const body   = {};
  inputs.forEach(i => {
    body[i.name] = i.type === "number" ? (i.value === "" ? null : Number(i.value)) : i.value;
  });

  try {
    let res;
    if (editId === null) {
      res = await fetch(`/api/${tablaActual}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
    } else {
      res = await fetch(`/api/${tablaActual}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
    }
    const data = await res.json();
    if (data.ok) {
      cerrarModal();
      showToast(editId ? "Registro actualizado" : "Registro creado", "ok");
      cargar();
    } else {
      showToast("Error al guardar", "err");
    }
  } catch {
    showToast("Error de conexión", "err");
  }
});

// ===== ELIMINAR =====
async function eliminar(id) {
  if (!confirm(`¿Eliminar registro #${id}?`)) return;
  try {
    const res  = await fetch(`/api/${tablaActual}/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.ok) {
      showToast("Registro eliminado", "ok");
      cargar();
    } else {
      showToast("Error al eliminar", "err");
    }
  } catch {
    showToast("Error de conexión", "err");
  }
}

// ===== TOAST =====
let toastTimer;
function showToast(msg, tipo = "ok") {
  toast.textContent = msg;
  toast.className   = `toast show ${tipo}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = "toast"; }, 2800);
}
//===login====//
function mostrarRegistro() {
  const nombre = prompt("Nombre:");
  const email = prompt("Email:");
  const password = prompt("Password:");

  fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nombre, email, password })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message || "Registro completo");
  });
}
// ===== INIT =====
cargar();