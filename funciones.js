"use strict";

const CLAVE = "burnout_ultimo_nivel";               // localStorage: solo el último nivel (sin respuestas ni datos personales)
const OPCIONES = ["Nunca", "A veces", "Frecuentemente", "Siempre"]; // valen 0, 1, 2, 3
const TEXTOS = {                                    // editable: mensaje por nivel
  Bajo: "Tus respuestas sugieren pocas señales de burnout. Sigue cuidando tus descansos y hábitos.",
  Medio: "Hay señales de desgaste. Es buen momento para frenar un poco y buscar apoyo.",
  Alto: "Tus respuestas muestran varias señales importantes. Te recomendamos conversar pronto con un profesional."
};
let datos = null;                                   // se llena con fetch("datos.json")
const $ = (id) => document.getElementById(id);


function mostrarPagina(id) {
  document.querySelectorAll(".pagina").forEach((s) => s.classList.toggle("d-none", s.id !== id));
  document.querySelectorAll(".navbar .nav-link, .navbar .btn").forEach((a) => {
    const activo = a.dataset.pagina === id;
    a.classList.toggle("active", activo);
    activo ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
  });
  if (id === "test") reiniciarTest();
  const menu = $("menu");
  if (menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  window.scrollTo(0, 0);
}
document.addEventListener("click", (e) => {
  const destino = e.target.closest("[data-pagina]");
  if (destino) { e.preventDefault(); mostrarPagina(destino.dataset.pagina); }
});


async function cargarDatos() {
  try {
    const respuesta = await fetch("datos.json");
    if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
    datos = await respuesta.json();
    crearFormulario();
    const guardado = leerGuardado();
    if (guardado) mostrarResultado(guardado);       // al recargar, muestra el último resultado
  } catch (error) {
    console.error("No se pudo cargar datos.json:", error);
    $("aviso-carga").classList.remove("d-none");
  }
}


function crearFormulario() {
  $("preguntas").innerHTML = datos.preguntas.map((texto, i) => `
    <fieldset class="card card-body" id="p${i}">
      <legend class="fs-6 fw-semibold">${i + 1}. ${texto}</legend>
      <div class="row row-cols-2 row-cols-md-4 g-2">
        ${OPCIONES.map((op, v) => `
          <div class="col">
            <input class="btn-check" type="radio" name="p${i}" id="p${i}o${v}" value="${v}" required>
            <label class="btn btn-outline-success w-100" for="p${i}o${v}">${op}</label>
          </div>`).join("")}
      </div>
      <p class="d-none fw-semibold mt-2 mb-0" id="f${i}">Falta responder esta pregunta.</p>
    </fieldset>`).join("");
}


function marcarFalta(i, falta) {
  $("p" + i).classList.toggle("border-dark", falta);
  $("p" + i).classList.toggle("border-3", falta);
  $("f" + i).classList.toggle("d-none", !falta);
}

function reiniciarTest() {
  $("test-intro").classList.remove("d-none");
  $("form-test").classList.add("d-none");
  $("form-test").reset();
  $("aviso-faltan").classList.add("d-none");
  if (datos) datos.preguntas.forEach((_, i) => marcarFalta(i, false));
  actualizarProgreso();
}

function actualizarProgreso() {
  const total = datos ? datos.preguntas.length : 15;
  const hechas = $("form-test").querySelectorAll("input:checked").length;
  $("barra").style.width = (hechas / total) * 100 + "%";
  $("barra").parentElement.setAttribute("aria-valuenow", hechas);
}

$("btn-comenzar").addEventListener("click", () => {
  if (!datos) return;
  $("test-intro").classList.add("d-none");
  $("form-test").classList.remove("d-none");
  window.scrollTo(0, 0);
});
$("form-test").addEventListener("change", actualizarProgreso);


$("form-test").addEventListener("submit", (e) => {
  e.preventDefault();
  let puntaje = 0, primera = null;
  datos.preguntas.forEach((_, i) => {
    const marcada = $("form-test").querySelector(`input[name="p${i}"]:checked`);
    marcarFalta(i, !marcada);
    if (marcada) puntaje += Number(marcada.value);
    else if (!primera) primera = i;
  });
  $("aviso-faltan").classList.toggle("d-none", primera === null);
  if (primera !== null) {                           // RF-08: avisar si falta una respuesta
    $("p" + primera).scrollIntoView({ block: "center" });
    $("p" + primera).querySelector("input").focus();
    return;
  }
  const nivel = puntaje <= 15 ? "Bajo" : puntaje <= 30 ? "Medio" : "Alto"; // máx. 45 puntos
  try { localStorage.setItem(CLAVE, JSON.stringify({ nivel })); } catch (err) { console.warn(err); }
  mostrarResultado({ nivel });
});


function enlaceContacto(c) {
  if (c.includes("@")) return `<a href="mailto:${c}">${c}</a>`;
  if (/^[+*\d]/.test(c)) return `<a href="tel:${c.replace(/\s/g, "")}">${c}</a>`;
  return `<a href="https://${c}" target="_blank" rel="noopener">${c}</a>`;
}

function mostrarResultado(r) {
  $("nivel").textContent = r.nivel;
  $("nivel-texto").textContent = TEXTOS[r.nivel];
  $("nivel-fecha").textContent = "Este nivel queda guardado solo en tu navegador (no tus respuestas). Puedes borrarlo cuando quieras.";
  // OBJ-04: recursos acordes al nivel (cada recurso lista sus niveles); si hubiera menos de 3, se completan
  const acordes = datos.recursos.filter((x) => x.nivel.includes(r.nivel)).sort((a, b) => a.nivel.length - b.nivel.length);
  const lista = acordes.length >= 3 ? acordes : [...acordes, ...datos.recursos.filter((x) => !acordes.includes(x))];
  $("recursos").innerHTML = lista.map((rec) => `
    <div class="col"><article class="card h-100"><div class="card-body">
      <h3 class="h5 card-title">${rec.nombre}</h3>
      <p class="card-text text-body-secondary mb-1">${rec.tipo} · ${rec.horario}</p>
      <p class="card-text mb-0"><strong>Contacto:</strong> ${enlaceContacto(rec.contacto)}</p>
    </div></article></div>`).join("");
  mostrarPagina("resultados");
}

function leerGuardado() {
  try {
    const g = JSON.parse(localStorage.getItem(CLAVE));
    return g && TEXTOS[g.nivel] ? g : null;
  } catch (err) { return null; }
}

$("btn-borrar").addEventListener("click", () => {
  try { localStorage.removeItem(CLAVE); } catch (err) { console.warn(err); }
  mostrarPagina("inicio");
});


mostrarPagina("inicio");
cargarDatos();
