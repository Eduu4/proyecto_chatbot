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
const chatToggleBtn = document.getElementById('chatToggle');
const chatDrawer = document.getElementById('chatDrawer');
const chatCloseBtn = document.getElementById('chatClose');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

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
chatToggleBtn.addEventListener('click', toggleChatDrawer);
chatCloseBtn.addEventListener('click', closeChatDrawer);
chatForm.addEventListener('submit', handleChatSubmit);
window.addEventListener('DOMContentLoaded', () => {
  actualizarInfo();
  mostrarMensajeInicialChat();
});

const respuestasFAQ = [
  // Preguntas sobre el Quiz
  { 
    palabras: ['como', 'como funciona', 'funciona', 'como usar', 'como empiezo', 'como inicio'],
    categoria: 'uso',
    respuesta: '📖 Así funciona:\n1. Selecciona una materia (Matemáticas, Historia, Programación, Biología o Inglés)\n2. Elige tu nivel (Básico, Intermedio o Avanzado)\n3. Define cuántas preguntas quieres responder (1-10)\n4. ¡Haz clic en "Iniciar Quiz" y responde lo más rápido que puedas!'
  },
  { 
    palabras: ['cuales', 'materias', 'temas', 'asignaturas', 'que puedo practicar'],
    categoria: 'contenido',
    respuesta: '📚 Puedes practicar en estas 5 materias:\n• Matemáticas\n• Historia\n• Programación\n• Biología\n• Inglés\n\nCada materia tiene preguntas en 3 niveles de dificultad.'
  },
  { 
    palabras: ['nivel', 'niveles', 'basico', 'intermedio', 'avanzado', 'dificultad'],
    categoria: 'niveles',
    respuesta: '⚙️ Disponemos de 3 niveles de dificultad:\n• Básico: Conceptos fundamentales\n• Intermedio: Conocimiento más profundo\n• Avanzado: Desafíos para expertos\n\nElige según tu experiencia en el tema.'
  },
  { 
    palabras: ['resultado', 'resultados', 'puntaje', 'calificacion', 'score', 'puntuacion'],
    categoria: 'resultados',
    respuesta: '📊 Al terminar el quiz recibirás:\n• Número de aciertos y errores\n• Porcentaje de precisión\n• Opción de reintentar o cambiar de materia\n\n¡Los resultados se muestran al instante!'
  },
  { 
    palabras: ['cuantas', 'preguntas', 'cantidad', 'maximas', 'limite'],
    categoria: 'contenido',
    respuesta: '📝 Puedes elegir entre 1 y 10 preguntas por quiz. Si seleccionas una cantidad mayor a las disponibles en ese nivel, se te mostrará un aviso.'
  },
  { 
    palabras: ['diferencia', 'distinto', 'varia', 'cambia', 'cada vez'],
    categoria: 'uso',
    respuesta: '🔄 Las preguntas se mezclan aleatoriamente cada vez que inicias un quiz. ¡Nunca tendrás el mismo orden!'
  },
  { 
    palabras: ['tiempo', 'limite', 'duracion', 'cuanto tiempo'],
    categoria: 'uso',
    respuesta: '⏱️ No hay límite de tiempo. Responde a tu propio ritmo. El quiz mide tu precisión, no tu velocidad.'
  },
  { 
    palabras: ['calificacion', 'pasar', 'aprobado', 'desaprobado', 'minimo'],
    categoria: 'resultados',
    respuesta: '✅ No hay calificación mínima obligatoria. El objetivo es practicar y aprender. Tu resultado es personal y solo sirve como referencia de tu desempeño.'
  },
  // Preguntas generales
  { 
    palabras: ['que es', 'que', 'quién', 'cual es el objetivo', 'proposito'],
    categoria: 'general',
    respuesta: '🎯 Quiz Pro es una plataforma de práctica educativa interactiva. Diseñada para reforzar conocimientos en 5 materias diferentes con preguntas dinámicas y feedback inmediato.'
  },
  { 
    palabras: ['contacto', 'soporte', 'ayuda', 'problema', 'error', 'no funciona', 'bug'],
    categoria: 'soporte',
    respuesta: '💬 Si tienes problemas o sugerencias:\n📧 Email: soporte@quizpro.com\n📞 Teléfono: 0987654321\n🕐 Horarios: Lunes a viernes 9:00-18:00\n\n¿Hay algo específico que no funcione?'
  },
  { 
    palabras: ['gratis', 'costo', 'precio', 'pago', 'premium'],
    categoria: 'general',
    respuesta: '💰 Este quiz es completamente gratuito. Diseñado como herramienta educativa sin costo de acceso.'
  }
];

// Función para escalar a soporte
const respuestasEscalacion = {
  soporte: '💬 Parece que necesitas más ayuda de la que puedo proporcionar. Te recomiendo contactar con nuestro equipo de soporte:\n📧 soporte@quizpro.com\n📞 +34 900 123 456\n\n¿Hay algo más en lo que pueda ayudarte?',
  problema: '⚠️ Si algo no está funcionando correctamente, por favor contacta con nuestro equipo técnico:\n📧 soporte@quizpro.com\n📞 +34 900 123 456\n\nDescribe el problema para que podamos ayudarte mejor.'
};

function normalizeTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos más robustamente
    .replace(/[.,!?¿¡;:()[\]{}]/g, ' ') // Símbolos de puntuación
    .replace(/\s+/g, ' ')
    .trim();
}

function toggleChatDrawer() {
  chatDrawer.classList.toggle('open');
  const abierto = chatDrawer.classList.contains('open');
  chatDrawer.setAttribute('aria-hidden', abierto ? 'false' : 'true');
  if (abierto) {
    chatInput.focus();
  }
}

function closeChatDrawer() {
  chatDrawer.classList.remove('open');
  chatDrawer.setAttribute('aria-hidden', 'true');
}

function mostrarMensajeInicialChat() {
  addChatMessage('👋 ¡Hola! Soy tu asistente de Quiz Pro. Puedo ayudarte con:\n\n📖 Cómo usar el quiz\n📚 Materias disponibles\n⚙️ Niveles de dificultad\n📊 Resultados\n💬 Soporte técnico\n\n¿Con qué necesitas ayuda?', 'bot');
}

function handleChatSubmit(event) {
  event.preventDefault();
  const texto = chatInput.value.trim();
  if (!texto) return;
  addChatMessage(texto, 'user');
  chatInput.value = '';
  setTimeout(() => {
    const respuesta = generarRespuestaChat(texto);
    addChatMessage(respuesta, 'bot');
  }, 300);
}

function generarRespuestaChat(texto) {
  const textoNormalizado = normalizeTexto(texto);
  
  // Búsqueda exacta y flexible
  let mejorCoincidencia = null;
  let puntajeMejor = 0;

  for (const item of respuestasFAQ) {
    for (const palabra of item.palabras) {
      const palabraNormalizada = normalizeTexto(palabra);
      if (textoNormalizado.includes(palabraNormalizada)) {
        mejorCoincidencia = item;
        puntajeMejor = 2; // Coincidencia fuerte
        break;
      }
    }
    if (puntajeMejor === 2) break;
  }

  // Si no hay coincidencia exacta, buscar palabras parciales
  if (!mejorCoincidencia) {
    for (const item of respuestasFAQ) {
      for (const palabra of item.palabras) {
        const palabraNormalizada = normalizeTexto(palabra);
        if (palabraNormalizada.length > 3 && textoNormalizado.includes(palabraNormalizada.substring(0, 3))) {
          if (puntajeMejor < 1) {
            mejorCoincidencia = item;
            puntajeMejor = 1; // Coincidencia débil
          }
        }
      }
    }
  }

  // Si encontramos coincidencia, retornamos la respuesta
  if (mejorCoincidencia) {
    return mejorCoincidencia.respuesta;
  }

  // Detectar si el usuario necesita soporte técnico
  const textoSoporte = ['error', 'no funciona', 'bug', 'problema', 'falla', 'crash'];
  if (textoSoporte.some(t => textoNormalizado.includes(t))) {
    return respuestasEscalacion.problema;
  }

  // Respuesta por defecto con sugerencias
  const sugerencias = [
    '💡 Prueba preguntando: "¿Cómo funciona el quiz?"',
    '💡 Prueba preguntando: "¿Qué materias hay disponibles?"',
    '💡 Prueba preguntando: "¿Cuáles son los niveles?"',
    '💡 Prueba preguntando: "¿Cómo veo mis resultados?"',
    '💡 Prueba preguntando: "¿Hay límite de tiempo?"'
  ];

  const sugerenciaAleatoria = sugerencias[Math.floor(Math.random() * sugerencias.length)];
  
  return `❓ No estoy completamente seguro de lo que preguntás. ¿Podrías reformular tu pregunta de forma más clara?\n\n${sugerenciaAleatoria}\n\nSi necesitas hablar con un especialista, usa la opción de soporte técnico.`;
}

function addChatMessage(texto, tipo) {
  const mensaje = document.createElement('div');
  mensaje.className = `chat-message ${tipo}`;
  mensaje.textContent = texto;
  chatMessages.appendChild(mensaje);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

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
  let cantidadDeseada = Number(cantidadInput.value);
  if (!Number.isInteger(cantidadDeseada) || cantidadDeseada < 1) {
    cantidadDeseada = 1;
  }
  if (cantidadDeseada > 10) {
    cantidadDeseada = 10;
  }

  try {
    const res = await fetch(`preguntas/${materia}.json`);
    const data = await res.json();
    const preguntasNivel = mezclar(data.filter(p => p.nivel === nivel));

    if (preguntasNivel.length === 0) {
      alert('No hay preguntas disponibles para este nivel.');
      return;
    }

    if (cantidadDeseada > preguntasNivel.length) {
      alert(`Solo hay ${preguntasNivel.length} preguntas disponibles para ${nivel}. Se cargarán todas.`);
    }

    const cantidad = Math.min(cantidadDeseada, preguntasNivel.length);
    preguntas = preguntasNivel.slice(0, cantidad);
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
