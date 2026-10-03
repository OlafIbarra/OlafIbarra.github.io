document.documentElement.classList.add('js');

// 1. Nombre del hero: cada letra sube con un pequeño retraso
const nm = document.getElementById('nombre');
nm.setAttribute('aria-label', nm.textContent);
let k = 0;
nm.innerHTML = nm.textContent.split(' ').map(w =>
  `<span class="w" aria-hidden="true">${[...w].map(c => `<span style="--i:${k++}">${c}</span>`).join('')}</span>`).join(' ');

// 2. Íconos de tecnologías (Devicon). Si un ícono no existe, se omite.
const base = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';
document.querySelectorAll('[data-i]').forEach(el => {
  const n = el.dataset.i, img = new Image();
  img.alt = ''; img.src = `${base}${n}/${n}-original.svg`;
  img.onerror = () => {
    img.onerror = () => img.remove();
    img.src = `${base}${n}/${n}-plain.svg`;
  };
  el.prepend(img);
});

// 3. Galerías: lee la carpeta, cantidad y extensión desde el HTML
const lb = document.getElementById('lb'), lbImg = lb.querySelector('img');
document.querySelectorAll('.strip').forEach(s => {
  const { f, n, e } = s.dataset;
  for (let i = 1; i <= n; i++) {
    const img = new Image();
    img.loading = 'lazy';
    img.alt = `Captura ${i} del proyecto ${f}`;
    img.src = `img/${f}/${i}.${e}`;
    img.onerror = () => img.remove();
    img.onclick = () => { lbImg.src = img.src; lbImg.alt = img.alt; lb.showModal(); };
    s.append(img);
  }
});
lb.addEventListener('click', () => lb.close());

// 4. Power BI: pestañas con las 7 páginas del dashboard
const pages = [
  ['Panorama general', '¿Cómo está el desempeño general de las operaciones aéreas?',
    ['Total de vuelos', 'Distancia total recorrida', '% de vuelos cancelados', '% de vuelos desviados', '% de puntualidad'],
    ['Línea: evolución de vuelos por mes', 'Dona: vuelos por estado', 'Mapa: aeropuertos con más retrasos']],
  ['Retrasos aerolínea', '¿Qué tan puntual es la operación y qué factores generan los retrasos?',
    ['Retraso promedio', 'Minutos totales de retraso', 'Porcentaje de retrasos', 'Aerolínea con más retrasos', 'Vuelos retrasados'],
    ['Dona: retraso por franja horaria', 'Dispersión: total de vuelos, retraso promedio y vuelos a tiempo', 'Matriz: aerolínea, tipo de retraso y minutos']],
  ['Cancelaciones', '¿Qué está provocando que los vuelos se cancelen?',
    ['Total de cancelaciones', '% de cancelaciones', 'Principal motivo', 'Aerolínea con más cancelaciones'],
    ['Dona: cancelaciones por motivo', 'Dispersión: vuelos totales, cancelados y desviados', 'Línea con previsión: cancelaciones por mes']],
  ['Análisis de rutas', '¿Qué rutas tienen más actividad y cómo es su desempeño operativo?',
    ['Total de rutas', 'Millas recorridas', 'Tiempo promedio en el aire', 'Promedio de vuelos por aeropuerto', 'Aeropuerto con más vuelos'],
    ['Mapa: vuelos por estado', 'Líneas: distancia, puntualidad y desvíos por mes', 'Barras apiladas: vuelos por aerolínea']],
  ['Retrasos en aeropuertos', '¿Qué aeropuertos tienen más retrasos y cómo afectan la puntualidad?',
    ['Total de aeropuertos', '% de puntualidad', 'Aeropuerto con mayor retraso', 'Principal motivo de retraso', '% de retrasados'],
    ['Barras: puntualidad por aeropuerto', 'Línea con previsión: vuelos retrasados por mes', 'Dispersión: vuelos, retraso promedio y vuelos a tiempo']],
  ['Cancelaciones en aeropuertos', '¿Qué aeropuertos tienen más cancelaciones y cuáles requieren atención?',
    ['Total de vuelos cancelados', '% de vuelos cancelados', 'Aeropuerto con más cancelaciones', 'Principal motivo de cancelación'],
    ['Barras agrupadas: cancelados por estado', 'Columnas apiladas: cancelaciones por aeropuerto', 'Dona: cancelaciones por motivo']],
  ['Resumen ejecutivo', '¿Cuál es el estado general de la operación aérea según los indicadores del Data Warehouse?',
    ['Total de vuelos', 'Vuelos desviados', 'Vuelos cancelados', 'Vuelos retrasados', 'Millas recorridas'],
    ['Mapa: vuelos por estado', 'Dona: cancelados por motivo', 'Líneas: distancia, puntualidad y desvíos por mes', 'Dona: minutos y promedio de retraso por franja']]
];
const tabs = document.getElementById('tabs'), panel = document.getElementById('panel');
const li = a => a.map(x => `<li>${x}</li>`).join('');
function show(i) {
  const [t, q, k, v] = pages[i];
  tabs.querySelectorAll('button').forEach((b, j) => b.setAttribute('aria-selected', j === i));
  panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
  panel.innerHTML = `<h3>Página ${i + 1}. ${t}</h3><p class="q">${q}</p>
    <div class="cols"><div><h4>Indicadores</h4><ul>${li(k)}</ul></div>
    <div><h4>Visualizaciones</h4><ul>${li(v)}</ul></div></div>`;
}
pages.forEach((p, i) => {
  const b = document.createElement('button');
  b.role = 'tab'; b.textContent = `${i + 1}. ${p[0]}`;
  b.onclick = () => show(i);
  tabs.append(b);
});
show(0);

// 5. Aparición suave al hacer scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

// 6. Menú lateral: marca la sección visible
const links = [...document.querySelectorAll('#nav a')];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id));
}), { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section').forEach(s => spy.observe(s));

// 7. Brillo suave que sigue al cursor
addEventListener('pointermove', e => {
  document.documentElement.style.setProperty('--x', e.clientX + 'px');
  document.documentElement.style.setProperty('--y', e.clientY + 'px');
});
