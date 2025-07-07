let casos = [];
let valores = [];

const sliders = [
  document.getElementById("slider1"),
  document.getElementById("slider2"),
  document.getElementById("slider3"),
  document.getElementById("slider4")
];

const labels = [
  document.getElementById("val1"),
  document.getElementById("val2"),
  document.getElementById("val3"),
  document.getElementById("val4")
];

const ecuacionTexto = document.getElementById("ecuacion");
const resultadoSpan = document.getElementById("resultado");
const addPointBtn = document.getElementById("add-point");
const downloadBtn = document.getElementById("download");

// Actualizar valores visibles
sliders.forEach((slider, i) => {
  slider.addEventListener("input", () => {
    labels[i].textContent = slider.value;
  });
});

// Cálculo del índice según fórmula
function calcularIndice(conocimiento, sanciones, accesoProgramas, inspecciones) {
  return (
    9.656 -
    0.0452 * conocimiento +
    0.0251 * sanciones +
    0.0405 * accesoProgramas -
    0.0155 * inspecciones
  );
}

// Color por rango
function colorPorIndice(indice) {
  if (indice <= 3) return "#28a745";
  if (indice <= 6) return "#a8c838";
  if (indice <= 9) return "#ffc107";
  if (indice <= 12) return "#e85d04";
  return "#8b0000";
}

// Agregar punto
addPointBtn.addEventListener("click", () => {
  const val = sliders.map(s => parseFloat(s.value));
  const indice = calcularIndice(...val);

  // Guardar caso
  casos.push(`Caso ${casos.length + 1}`);
  valores.push(indice);

  // Mostrar ecuación evaluada
  ecuacionTexto.textContent =
    `9.656 - 0.0452×${val[0]} + 0.0251×${val[1]} + 0.0405×${val[2]} - 0.0155×${val[3]}`;
  resultadoSpan.textContent = indice.toFixed(4);

  // Actualizar gráfica
  const trace = {
    x: casos,
    y: valores,
    type: "scatter",
    mode: "lines+markers",
    line: { shape: "hv", color: "#999" },
    marker: {
      size: 12,
      color: valores.map(v => colorPorIndice(v))
    }
  };

  const layout = {
    title: "Índice de mala gestión por caso",
    xaxis: { title: "Casos" },
    yaxis: { title: "Índice", range: [0, 15] }
  };

  Plotly.newPlot("plot", [trace], layout);
});

// Descargar como Excel (CSV)
downloadBtn.addEventListener("click", () => {
  let csv = "Caso,Conocimiento,Sanciones,Acceso,Inspecciones,Índice\n";
  for (let i = 0; i < casos.length; i++) {
    const val = sliders.map(s => parseFloat(s.value));
    const indice = valores[i];
    csv += `${casos[i]},${val.join(",")},${indice.toFixed(4)}\n`;
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "historial_RCD.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Tema claro/oscuro
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
