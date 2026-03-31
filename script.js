let preguntas = [];
let indice = 0;
let puntaje = 0;

const preguntaEl = document.getElementById("pregunta");
const opcionesEl = document.getElementById("opciones");
const siguienteBtn = document.getElementById("siguiente");

// 🚀 INICIAR QUIZ
async function iniciarQuiz() {
  const materia = document.getElementById("materia").value;
  const nivel = document.getElementById("nivel").value;

  const res = await fetch(`preguntas/${materia}.json`);
  const data = await res.json();

  // ✅ FILTRAR + MEZCLAR + LIMITAR (5 preguntas)
  preguntas = mezclar(data.filter(p => p.nivel === nivel)).slice(0, 5);

  if (preguntas.length === 0) {
    alert("No hay preguntas para este nivel");
    return;
  }

  indice = 0;
  puntaje = 0;

  document.getElementById("config").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");

  cargarPregunta();
}

// 📌 CARGAR PREGUNTA
function cargarPregunta() {
  const actual = preguntas[indice];
  preguntaEl.textContent = actual.pregunta;
  opcionesEl.innerHTML = "";

  actual.opciones.forEach((opcion, i) => {
    const btn = document.createElement("button");
    btn.textContent = opcion;
    btn.onclick = () => seleccionar(i);
    opcionesEl.appendChild(btn);
  });
}

// 📌 RESPUESTA
function seleccionar(i) {
  const correcta = preguntas[indice].correcta;
  const botones = opcionesEl.children;

  for (let j = 0; j < botones.length; j++) {
    botones[j].disabled = true;

    if (j === correcta) botones[j].classList.add("correcta");
    if (j === i && j !== correcta) botones[j].classList.add("incorrecta");
  }

  if (i === correcta) puntaje++;
}

// 📌 SIGUIENTE
siguienteBtn.onclick = () => {
  indice++;

  if (indice < preguntas.length) {
    cargarPregunta();
  } else {
    mostrarResultado();
  }
};

// 📌 RESULTADO
function mostrarResultado() {
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("resultado").classList.remove("hidden");

  document.getElementById("puntaje").textContent =
    `Acertaste ${puntaje} de ${preguntas.length}`;
}

// 🔁 REINICIAR
function reiniciar() {
  document.getElementById("resultado").classList.add("hidden");
  document.getElementById("config").classList.remove("hidden");
}

// 🔀 MEZCLAR (Fisher-Yates - versión PRO)
function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}