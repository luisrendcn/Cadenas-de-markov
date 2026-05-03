const model = {
  apiBaseUrl: "",
  size: 3,
  iterations: 10,
  includeCosts: true,
  stateNames: ["Netflix", "Disney+", "Prime Video"],
  matrix: [
    [0.7, 0.2, 0.1],
    [0.25, 0.5, 0.25],
    [0.15, 0.25, 0.6]
  ],
  vector: [1, 0, 0],
  costs: [12, 9, 15],
  result: null,
  charts: {
    line: null,
    pie: null
  }
};

const palette = [
  "#168f82",
  "#d65d4a",
  "#b9861f",
  "#4d5fc4",
  "#4f9b58",
  "#c25284",
  "#2574a8",
  "#7c6a2f"
];

let elements = {};

function formatNumber(value, digits = 6) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0
  }).format(Number(value));
}

function formatPercent(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4,
    style: "percent"
  }).format(Number(value));
}

function parseNumericInput(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function resizeArray(source, size, filler) {
  return Array.from({ length: size }, (_, index) => (
    source[index] !== undefined ? source[index] : filler(index)
  ));
}

function resizeMatrix(source, size) {
  return Array.from({ length: size }, (_, row) => (
    Array.from({ length: size }, (_, column) => {
      if (source[row] && source[row][column] !== undefined) {
        return source[row][column];
      }

      return row === column ? 1 : 0;
    })
  ));
}

function setStatus(message, tone = "normal") {
  elements.statusMessage.textContent = message;
  elements.statusMessage.classList.toggle("warning", tone === "warning");
  elements.statusMessage.classList.toggle("error", tone === "error");
}

function updateCostVisibility() {
  elements.costEditorBlock.style.display = model.includeCosts ? "" : "none";
  elements.costResultsPanel.style.display = model.includeCosts && model.result && model.result.costs ? "" : "none";
}

function resizeModel(nextSize) {
  const size = Math.max(1, Math.floor(parseNumericInput(nextSize, model.size)));

  model.size = size;
  model.stateNames = resizeArray(model.stateNames, size, (index) => `State ${index + 1}`);
  model.matrix = resizeMatrix(model.matrix, size);
  model.vector = resizeArray(model.vector, size, (index) => (index === 0 ? 1 : 0));
  model.costs = resizeArray(model.costs, size, () => 0);
  model.result = null;

  renderEditors();
  renderHeatmap(model.matrix, model.stateNames);
  clearResults();
}

function renderEditors() {
  elements.sizeInput.value = model.size;
  elements.iterationsInput.value = model.iterations;
  elements.includeCostsInput.checked = model.includeCosts;

  renderStateNameEditor();
  renderMatrixEditor();
  renderVectorEditor();
  renderCostEditor();
  updateCostVisibility();
}

function renderStateNameEditor() {
  elements.stateNameEditor.innerHTML = "";

  model.stateNames.forEach((name, index) => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = name;
    input.placeholder = `State ${index + 1}`;
    input.dataset.index = String(index);
    input.addEventListener("input", (event) => {
      const cursor = Number(event.target.dataset.index);
      model.stateNames[cursor] = event.target.value || `State ${cursor + 1}`;
      updateStateLabels();
    });

    elements.stateNameEditor.appendChild(input);
  });
}

function renderMatrixEditor() {
  elements.matrixEditor.innerHTML = "";
  elements.matrixEditor.style.gridTemplateColumns = `104px repeat(${model.size}, 92px)`;

  const corner = document.createElement("div");
  corner.className = "matrix-label";
  corner.textContent = "From / To";
  elements.matrixEditor.appendChild(corner);

  model.stateNames.forEach((name, index) => {
    const label = document.createElement("div");
    label.className = "matrix-label";
    label.dataset.stateLabelIndex = String(index);
    label.textContent = name;
    elements.matrixEditor.appendChild(label);
  });

  model.matrix.forEach((row, rowIndex) => {
    const rowLabel = document.createElement("div");
    rowLabel.className = "matrix-label";
    rowLabel.dataset.stateLabelIndex = String(rowIndex);
    rowLabel.textContent = model.stateNames[rowIndex];
    elements.matrixEditor.appendChild(rowLabel);

    row.forEach((cell, columnIndex) => {
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.step = "0.01";
      input.value = cell;
      input.dataset.row = String(rowIndex);
      input.dataset.column = String(columnIndex);
      input.addEventListener("input", (event) => {
        const rowCursor = Number(event.target.dataset.row);
        const columnCursor = Number(event.target.dataset.column);
        model.matrix[rowCursor][columnCursor] = parseNumericInput(event.target.value);
        renderHeatmap(model.matrix, model.stateNames);
      });

      elements.matrixEditor.appendChild(input);
    });
  });
}

function renderVectorEditor() {
  renderNamedNumberInputs(elements.vectorEditor, model.vector, "v0", (index, value) => {
    model.vector[index] = value;
  });
}

function renderCostEditor() {
  renderNamedNumberInputs(elements.costEditor, model.costs, "c", (index, value) => {
    model.costs[index] = value;
  });
}

function renderNamedNumberInputs(container, values, prefix, onChange) {
  container.innerHTML = "";

  values.forEach((value, index) => {
    const field = document.createElement("label");
    field.className = "vector-field";

    const label = document.createElement("span");
    label.dataset.stateLabelIndex = String(index);
    label.textContent = `${prefix} - ${model.stateNames[index]}`;

    const input = document.createElement("input");
    input.type = "number";
    input.step = "0.01";
    input.value = value;
    input.dataset.index = String(index);
    input.addEventListener("input", (event) => {
      onChange(Number(event.target.dataset.index), parseNumericInput(event.target.value));
    });

    field.append(label, input);
    container.appendChild(field);
  });
}

function updateStateLabels() {
  document.querySelectorAll("[data-state-label-index]").forEach((node) => {
    const index = Number(node.dataset.stateLabelIndex);

    if (node.tagName === "SPAN") {
      const prefix = node.textContent.split(" - ")[0];
      node.textContent = `${prefix} - ${model.stateNames[index]}`;
      return;
    }

    node.textContent = model.stateNames[index];
  });

  renderHeatmap(model.matrix, model.stateNames);
}

function normalizeRows() {
  model.matrix = model.matrix.map((row, rowIndex) => {
    const total = row.reduce((sum, value) => sum + Number(value), 0);

    if (total <= 0) {
      return row.map((_, columnIndex) => (rowIndex === columnIndex ? 1 : 0));
    }

    return row.map((value) => Number((value / total).toFixed(6)));
  });

  renderMatrixEditor();
  renderHeatmap(model.matrix, model.stateNames);
}

function loadExample() {
  model.size = 3;
  model.iterations = 10;
  model.includeCosts = true;
  model.stateNames = ["Netflix", "Disney+", "Prime Video"];
  model.matrix = [
    [0.7, 0.2, 0.1],
    [0.25, 0.5, 0.25],
    [0.15, 0.25, 0.6]
  ];
  model.vector = [1, 0, 0];
  model.costs = [12, 9, 15];
  model.result = null;

  renderEditors();
  renderHeatmap(model.matrix, model.stateNames);
  computeAll();
}

function collectPayload() {
  model.iterations = Math.max(1, Math.floor(parseNumericInput(elements.iterationsInput.value, 10)));

  const payload = {
    matrix: model.matrix,
    vector: model.vector,
    iterations: model.iterations,
    stateNames: model.stateNames
  };

  if (model.includeCosts) {
    payload.costs = model.costs;
  }

  return payload;
}

async function computeAll() {
  setStatus("Computing");
  elements.computeButton.disabled = true;

  try {
    const response = await fetch(`${model.apiBaseUrl}/compute/all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(collectPayload())
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "The API could not compute this model.");
    }

    model.result = data;
    renderResults(data);

    if (data.warnings.length > 0) {
      setStatus(`${data.warnings.length} warning${data.warnings.length === 1 ? "" : "s"}`, "warning");
    } else {
      setStatus("Computed");
    }
  } catch (error) {
    model.result = null;
    clearResults();
    setStatus(error.message, "error");
  } finally {
    elements.computeButton.disabled = false;
  }
}

function clearResults() {
  elements.evolutionTable.innerHTML = "";
  elements.powerTable.innerHTML = "";
  elements.powerSelect.innerHTML = "";
  elements.stationaryList.innerHTML = "";
  elements.costSummary.innerHTML = "";
  elements.costTable.innerHTML = "";
  destroyCharts();
  updateCostVisibility();
}

function renderResults(result) {
  renderEvolutionTable(result);
  renderStationary(result);
  renderHeatmap(result.input.matrix, result.input.stateNames);
  renderCharts(result);
  renderPowerControls(result);
  renderCosts(result);
  updateCostVisibility();
}

function renderEvolutionTable(result) {
  const names = result.input.stateNames;
  const hasCosts = Boolean(result.costs);
  const header = ["Step", ...names, hasCosts ? "Expected value" : null].filter(Boolean);

  elements.evolutionTable.innerHTML = "";
  elements.evolutionTable.appendChild(createTableHead(header));

  const body = document.createElement("tbody");

  result.evolution.steps.forEach((entry) => {
    const row = document.createElement("tr");
    appendCell(row, `n=${entry.step}`);

    entry.vector.forEach((value) => appendCell(row, formatNumber(value)));

    if (hasCosts) {
      const costEntry = result.costs.byStep.find((item) => item.step === entry.step);
      appendCell(row, formatNumber(costEntry.expectedValue));
    }

    body.appendChild(row);
  });

  elements.evolutionTable.appendChild(body);
}

function renderStationary(result) {
  elements.stationaryList.innerHTML = "";

  result.stationary.distribution.forEach((value, index) => {
    const row = document.createElement("div");
    row.className = "stationary-row";

    const label = document.createElement("span");
    label.textContent = result.input.stateNames[index];

    const number = document.createElement("strong");
    number.textContent = formatPercent(value);

    row.append(label, number);
    elements.stationaryList.appendChild(row);
  });
}

function renderHeatmap(matrix, names) {
  elements.heatmap.innerHTML = "";
  const size = matrix.length;
  const maxValue = Math.max(1, ...matrix.flat().map(Number));
  elements.heatmap.style.gridTemplateColumns = `104px repeat(${size}, 92px)`;

  const corner = document.createElement("div");
  corner.className = "heatmap-label";
  corner.textContent = "From / To";
  elements.heatmap.appendChild(corner);

  names.forEach((name) => {
    const label = document.createElement("div");
    label.className = "heatmap-label";
    label.textContent = name;
    elements.heatmap.appendChild(label);
  });

  matrix.forEach((row, rowIndex) => {
    const rowLabel = document.createElement("div");
    rowLabel.className = "heatmap-label";
    rowLabel.textContent = names[rowIndex];
    elements.heatmap.appendChild(rowLabel);

    row.forEach((value) => {
      const intensity = Math.max(0.1, Math.min(0.92, Number(value) / maxValue));
      const cell = document.createElement("div");
      cell.className = "heatmap-cell";
      cell.style.background = `rgba(22, 143, 130, ${0.18 + intensity * 0.68})`;
      cell.textContent = formatNumber(value, 4);
      elements.heatmap.appendChild(cell);
    });
  });
}

function renderCharts(result) {
  destroyCharts();

  const lineContext = elements.lineChart.getContext("2d");
  const pieContext = elements.stationaryChart.getContext("2d");
  const labels = result.evolution.steps.map((entry) => `n=${entry.step}`);

  model.charts.line = new Chart(lineContext, {
    type: "line",
    data: {
      labels,
      datasets: result.input.stateNames.map((name, index) => ({
        label: name,
        data: result.evolution.steps.map((entry) => entry.vector[index]),
        borderColor: palette[index % palette.length],
        backgroundColor: `${palette[index % palette.length]}22`,
        borderWidth: 3,
        pointRadius: 3,
        tension: 0.28
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index"
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: 1
        }
      },
      plugins: {
        legend: {
          labels: {
            boxWidth: 12,
            usePointStyle: true
          }
        }
      }
    }
  });

  model.charts.pie = new Chart(pieContext, {
    type: "pie",
    data: {
      labels: result.input.stateNames,
      datasets: [{
        data: result.stationary.distribution,
        backgroundColor: result.input.stateNames.map((_, index) => palette[index % palette.length]),
        borderColor: "#ffffff",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            usePointStyle: true
          }
        }
      }
    }
  });
}

function destroyCharts() {
  Object.values(model.charts).forEach((chart) => {
    if (chart) {
      chart.destroy();
    }
  });

  model.charts.line = null;
  model.charts.pie = null;
}

function renderPowerControls(result) {
  elements.powerSelect.innerHTML = "";

  result.powers.forEach((entry) => {
    const option = document.createElement("option");
    option.value = String(entry.step);
    option.textContent = `P^${entry.step}`;
    elements.powerSelect.appendChild(option);
  });

  elements.powerSelect.value = "1";
  elements.powerSelect.onchange = () => {
    const step = Number(elements.powerSelect.value);
    const entry = result.powers.find((item) => item.step === step);
    renderPowerTable(entry, result.input.stateNames);
  };

  renderPowerTable(result.powers[0], result.input.stateNames);
}

function renderPowerTable(entry, names) {
  if (!entry) {
    elements.powerTable.innerHTML = "";
    return;
  }

  elements.powerTable.innerHTML = "";
  elements.powerTable.appendChild(createTableHead(["From / To", ...names]));

  const body = document.createElement("tbody");

  entry.matrix.forEach((rowValues, rowIndex) => {
    const row = document.createElement("tr");
    appendCell(row, names[rowIndex]);
    rowValues.forEach((value) => appendCell(row, formatNumber(value)));
    body.appendChild(row);
  });

  elements.powerTable.appendChild(body);
}

function renderCosts(result) {
  elements.costSummary.innerHTML = "";
  elements.costTable.innerHTML = "";

  if (!result.costs) {
    return;
  }

  [
    ["Cumulative", result.costs.cumulativeExpectedValue],
    ["Final step", result.costs.finalStepExpectedValue],
    ["Steady state", result.costs.stationaryExpectedValue]
  ].forEach(([labelText, value]) => {
    const item = document.createElement("div");
    item.className = "summary-item";

    const label = document.createElement("span");
    label.textContent = labelText;

    const number = document.createElement("strong");
    number.textContent = formatNumber(value);

    item.append(label, number);
    elements.costSummary.appendChild(item);
  });

  elements.costTable.appendChild(createTableHead(["Step", "Expected value"]));

  const body = document.createElement("tbody");
  result.costs.byStep.forEach((entry) => {
    const row = document.createElement("tr");
    appendCell(row, `n=${entry.step}`);
    appendCell(row, formatNumber(entry.expectedValue));
    body.appendChild(row);
  });

  elements.costTable.appendChild(body);
}

function createTableHead(labels) {
  const head = document.createElement("thead");
  const row = document.createElement("tr");

  labels.forEach((label) => {
    const cell = document.createElement("th");
    cell.textContent = label;
    row.appendChild(cell);
  });

  head.appendChild(row);
  return head;
}

function appendCell(row, value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  row.appendChild(cell);
}

function csvEscape(value) {
  const text = String(value ?? "");

  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }

  return text;
}

function toCsvRow(values) {
  return values.map(csvEscape).join(",");
}

function buildCsvReport(result) {
  const rows = [];
  const names = result.input.stateNames;

  rows.push(toCsvRow(["Markov Chain Desktop Suite"]));
  rows.push("");
  rows.push(toCsvRow(["Transition matrix"]));
  rows.push(toCsvRow(["From / To", ...names]));
  result.input.matrix.forEach((row, index) => rows.push(toCsvRow([names[index], ...row])));
  rows.push("");

  rows.push(toCsvRow(["Initial vector", ...result.input.vector]));
  if (result.input.costs) {
    rows.push(toCsvRow(["Costs or revenues", ...result.input.costs]));
  }
  rows.push("");

  rows.push(toCsvRow(["Evolution"]));
  rows.push(toCsvRow(["Step", ...names, result.costs ? "Expected value" : null].filter(Boolean)));
  result.evolution.steps.forEach((entry) => {
    const expected = result.costs
      ? result.costs.byStep.find((item) => item.step === entry.step).expectedValue
      : null;
    rows.push(toCsvRow(["n=" + entry.step, ...entry.vector, expected].filter((value) => value !== null)));
  });
  rows.push("");

  rows.push(toCsvRow(["Stationary distribution", result.stationary.method, `residual=${result.stationary.residual}`]));
  rows.push(toCsvRow(names));
  rows.push(toCsvRow(result.stationary.distribution));
  rows.push("");

  if (result.costs) {
    rows.push(toCsvRow(["Cost and revenue totals"]));
    rows.push(toCsvRow(["Cumulative", result.costs.cumulativeExpectedValue]));
    rows.push(toCsvRow(["Final step", result.costs.finalStepExpectedValue]));
    rows.push(toCsvRow(["Steady state", result.costs.stationaryExpectedValue]));
    rows.push("");
  }

  rows.push(toCsvRow(["Matrix powers"]));
  result.powers.forEach((entry) => {
    rows.push(toCsvRow([`P^${entry.step}`]));
    rows.push(toCsvRow(["From / To", ...names]));
    entry.matrix.forEach((row, index) => rows.push(toCsvRow([names[index], ...row])));
    rows.push("");
  });

  return rows.join("\n");
}

async function exportCsv() {
  if (!model.result) {
    await computeAll();
  }

  if (!model.result) {
    return;
  }

  const outcome = await window.markovDesktop.exportCsv(buildCsvReport(model.result));

  if (outcome && !outcome.canceled) {
    setStatus("CSV exported");
  }
}

async function exportPdf() {
  if (!model.result) {
    await computeAll();
  }

  const outcome = await window.markovDesktop.exportPdf();

  if (outcome && !outcome.canceled) {
    setStatus("PDF exported");
  }
}

function bindEvents() {
  elements.sizeInput.addEventListener("change", (event) => resizeModel(event.target.value));
  elements.iterationsInput.addEventListener("change", (event) => {
    model.iterations = Math.max(1, Math.floor(parseNumericInput(event.target.value, 10)));
    event.target.value = model.iterations;
  });
  elements.includeCostsInput.addEventListener("change", (event) => {
    model.includeCosts = event.target.checked;
    updateCostVisibility();
  });
  elements.increaseSizeButton.addEventListener("click", () => resizeModel(model.size + 1));
  elements.decreaseSizeButton.addEventListener("click", () => resizeModel(model.size - 1));
  elements.normalizeButton.addEventListener("click", normalizeRows);
  elements.exampleButton.addEventListener("click", loadExample);
  elements.computeButton.addEventListener("click", computeAll);
  elements.csvButton.addEventListener("click", exportCsv);
  elements.pdfButton.addEventListener("click", exportPdf);
}

function cacheElements() {
  elements = {
    apiStatus: document.getElementById("apiStatus"),
    computeButton: document.getElementById("computeButton"),
    costEditor: document.getElementById("costEditor"),
    costEditorBlock: document.getElementById("costEditorBlock"),
    costResultsPanel: document.getElementById("costResultsPanel"),
    costSummary: document.getElementById("costSummary"),
    costTable: document.getElementById("costTable"),
    csvButton: document.getElementById("csvButton"),
    decreaseSizeButton: document.getElementById("decreaseSizeButton"),
    evolutionTable: document.getElementById("evolutionTable"),
    exampleButton: document.getElementById("exampleButton"),
    heatmap: document.getElementById("heatmap"),
    includeCostsInput: document.getElementById("includeCostsInput"),
    increaseSizeButton: document.getElementById("increaseSizeButton"),
    iterationsInput: document.getElementById("iterationsInput"),
    lineChart: document.getElementById("lineChart"),
    matrixEditor: document.getElementById("matrixEditor"),
    normalizeButton: document.getElementById("normalizeButton"),
    pdfButton: document.getElementById("pdfButton"),
    powerSelect: document.getElementById("powerSelect"),
    powerTable: document.getElementById("powerTable"),
    sizeInput: document.getElementById("sizeInput"),
    stationaryChart: document.getElementById("stationaryChart"),
    stationaryList: document.getElementById("stationaryList"),
    stateNameEditor: document.getElementById("stateNameEditor"),
    statusMessage: document.getElementById("statusMessage"),
    vectorEditor: document.getElementById("vectorEditor")
  };
}

async function initialize() {
  cacheElements();
  bindEvents();
  renderEditors();
  renderHeatmap(model.matrix, model.stateNames);

  try {
    model.apiBaseUrl = await window.markovDesktop.getApiUrl();
    elements.apiStatus.textContent = model.apiBaseUrl;
    await computeAll();
  } catch (error) {
    setStatus(error.message, "error");
    elements.apiStatus.textContent = "API unavailable";
  }
}

window.addEventListener("DOMContentLoaded", initialize);
