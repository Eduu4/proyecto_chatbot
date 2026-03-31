const materiaSelect = document.getElementById('materia');
const nivelSelect = document.getElementById('nivel');
const cantidadInput = document.getElementById('cantidad');
const startBtn = document.getElementById('startBtn');
const configPanel = document.getElementById('config');
const quizPanel = document.getElementById('quiz');
const resultadoPanel = document.getElementById('resultado');
const preguntaEl = document.getElementById('pregunta');
const opcionesEl = document.getElementById('opciones');
const siguienteBtn = document.getElementById('siguiente');
const contadorEl = document.getElementById('contador');
const totalEl = document.getElementById('total');
const barraProgreso = document.getElementById('barraProgreso');
const indicadorNivel = document.getElementById('indicadorNivel');
const subjectNameEl = document.getElementById('subjectName');
const subjectDescriptionEl = document.getElementById('subjectDescription');
const puntajeEl = document.getElementById('puntaje');
const aciertosEl = document.getElementById('aciertos');
const erroresEl = document.getElementById('errores');
const accuracyEl = document.getElementById('accuracy');
const reiniciarBtn = document.getElementById('reiniciar');
const volverBtn = document.getElementById('volver');

let preguntas = [];
let indice = 0;
let puntaje = 0;
let respuestasIncorrectas = 0;

const materiasInfo = {
  matematicas: {
    nombre: 'Matemáticas',
    descripcion: 'Ejercita operaciones, lógica y conceptos numéricos para reforzar tu razonamiento matemático.'
  },
  historia: {
    nombre: 'Historia',
    descripcion: 'Repasa fechas, personajes y eventos clave con preguntas pensadas para cada nivel.'
  },
  programacion: {
    nombre: 'Programación',
    descripcion: 'Pon a prueba tus conocimientos en código, algoritmos y conceptos básicos de desarrollo.'
  },
  biologia: {
    nombre: 'Biología',
    descripcion: 'Aprende sobre seres vivos, procesos y conceptos naturales de forma dinámica.'
  },
  ingles: {
    nombre: 'Inglés',
    descripcion: 'Mejora vocabulario y gramática con preguntas sencillas de comprensión y uso.'
  }
};

startBtn.addEventListener('click', iniciarQuiz);
materiaSelect.addEventListener('change', actualizarInfo);
nivelSelect.addEventListener('change', actualizarInfo);
siguienteBtn.addEventListener('click', siguientePregunta);
reiniciarBtn.addEventListener('click', reiniciar);
volverBtn.addEventListener('click', volverAlInicio);
window.addEventListener('DOMContentLoaded', actualizarInfo);

function actualizarInfo() {
  const materia = materiaSelect.value;
  const info = materiasInfo[materia];

  if (info) {
    subjectNameEl.textContent = info.nombre;
    subjectDescriptionEl.textContent = info.descripcion;
  }
}

async function iniciarQuiz() {
  const materia = materiaSelect.value;
  const nivel = nivelSelect.value;
  const cantidad = Number(cantidadInput.value) || 5;

  if (cantidad < 3 || cantidad > 10) {
    alert('Elige entre 3 y 10 preguntas.');
    return;
  }

  try {
    const res = await fetch(`preguntas/${materia}.json`);
    const data = await res.json();

    preguntas = mezclar(data.filter(p => p.nivel === nivel)).slice(0, cantidad);
  } catch (error) {
    console.error(error);
    alert('Error cargando las preguntas. Intenta nuevamente.');
    return;
  }

  if (preguntas.length === 0) {
    alert('No hay preguntas disponibles para este nivel.');
    return;
  }

  indice = 0;
  puntaje = 0;
  respuestasIncorrectas = 0;
  totalEl.textContent = preguntas.length;
  indicadorNivel.textContent = nivel.charAt(0).toUpperCase() + nivel.slice(1);

  configPanel.classList.add('hidden');
  resultadoPanel.classList.add('hidden');
  quizPanel.classList.remove('hidden');

  cargarPregunta();
}

function cargarPregunta() {
  const actual = preguntas[indice];
  preguntaEl.textContent = actual.pregunta;
  opcionesEl.innerHTML = '';
  contadorEl.textContent = indice + 1;
  barraProgreso.style.width = `${((indice + 1) / preguntas.length) * 100}%`;
  siguienteBtn.disabled = true;

  actual.opciones.forEach((opcion, i) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = opcion;
    boton.addEventListener('click', () => seleccionarRespuesta(i));
    opcionesEl.appendChild(boton);
  });
}

function seleccionarRespuesta(indiceSeleccionado) {
  const correcta = preguntas[indice].correcta;
  const botones = opcionesEl.querySelectorAll('button');
  botones.forEach((boton, index) => {
    boton.disabled = true;
    if (index === correcta) {
      boton.classList.add('correcta');
    }
    if (index === indiceSeleccionado && index !== correcta) {
      boton.classList.add('incorrecta');
    }
  });

  if (indiceSeleccionado === correcta) {
    puntaje += 1;
  } else {
    respuestasIncorrectas += 1;
  }

  siguienteBtn.disabled = false;
}

function siguientePregunta() {
  indice += 1;
  if (indice < preguntas.length) {
    cargarPregunta();
  } else {
    mostrarResultado();
  }
}

function mostrarResultado() {
  quizPanel.classList.add('hidden');
  resultadoPanel.classList.remove('hidden');

  puntajeEl.textContent = `Acertaste ${puntaje} de ${preguntas.length} preguntas. ¡Buen trabajo!`;
  aciertosEl.textContent = puntaje;
  erroresEl.textContent = respuestasIncorrectas;
  const precision = Math.round((puntaje / preguntas.length) * 100);
  accuracyEl.textContent = `${precision}%`;
}

function reiniciar() {
  if (!configPanel.classList.contains('hidden')) {
    iniciarQuiz();
    return;
  }
  indice = 0;
  puntaje = 0;
  respuestasIncorrectas = 0;
  cargarPregunta();
}

function volverAlInicio() {
  resultadoPanel.classList.add('hidden');
  quizPanel.classList.add('hidden');
  configPanel.classList.remove('hidden');
}

function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
