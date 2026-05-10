const sections = [
  "inicio",
  "introduccion",
  "problema",
  "solucion",
  "dofa",
  "pestel",
  "canvas",
  "inversion",
  "riesgos",
  "plan",
  "conclusiones"
];

const pestelContent = {
  politicos: {
    title: "Factores Políticos",
    text: "El proyecto se desarrolla en un entorno educativo regulado por políticas institucionales y normativas del sector educativo. Las decisiones del gobierno en materia de educación superior, así como las políticas internas de la universidad, pueden influir en la adopción de herramientas tecnológicas, la implementación de programas de bienestar estudiantil, y la priorización de recursos para proyectos de innovación académica. La alineación con las políticas institucionales y los lineamientos del Ministerio de Educación es clave para la sostenibilidad del proyecto."
  },
  economicos: {
    title: "Factores Económicos",
    text: "El acceso a recursos financieros por parte de los estudiantes y de la institución puede afectar la implementación de la plataforma. Aspectos relevantes incluyen el presupuesto universitario destinado a tecnologías educativas, la capacidad de inversión en infraestructura tecnológica y licencias, y posibles modelos de financiación (suscripción institucional, patrocinios, alianzas). La viabilidad económica del proyecto dependerá de un uso eficiente de los recursos y de la claridad en la propuesta de valor para la universidad."
  },
  sociales: {
    title: "Factores Sociales",
    text: "El proyecto responde directamente a problemáticas sociales como estrés académico y desgaste emocional, falta de comunicación efectiva en equipos de trabajo, y deterioro del bienestar emocional y de la motivación. También considera hábitos de estudio de los estudiantes, cultura de trabajo en equipo dentro de la universidad, y disposición de los estudiantes para adoptar nuevas dinámicas colaborativas y herramientas digitales."
  },
  tecnologicos: {
    title: "Factores Tecnológicos",
    text: "La disponibilidad de herramientas digitales, el acceso a internet y el nivel de alfabetización tecnológica de los estudiantes son factores clave para el éxito de la plataforma. Incluye el uso de software de gestión de tareas y proyectos, integración con plataformas educativas existentes, y acceso desde dispositivos móviles y computadores. Estos elementos representan una oportunidad para mejorar la productividad académica mediante soluciones tecnológicas accesibles y usables."
  },
  ecologicos: {
    title: "Factores Ecológicos",
    text: "Aunque el impacto ambiental del proyecto es bajo, el uso de una plataforma digital contribuye a la reducción del consumo de papel, disminución de impresiones físicas de documentos y cronogramas, y promoción de prácticas más sostenibles dentro del entorno académico."
  },
  legales: {
    title: "Factores Legales",
    text: "El desarrollo del proyecto debe cumplir con normativas relacionadas con la protección de datos personales, regulaciones sobre el uso de plataformas digitales en contextos educativos, y políticas institucionales de la universidad sobre privacidad y seguridad de la información. Es fundamental garantizar la confidencialidad, integridad y disponibilidad de los datos de los usuarios."
  }
};

const canvasBlocks = [
  {
    key: "socios",
    title: "Socios clave",
    items: ["Universidades", "Desarrolladores", "Comunidades estudiantiles"]
  },
  {
    key: "actividades",
    title: "Actividades clave",
    items: ["Desarrollo de software", "Mantenimiento y actualizaciones", "Desarrollo de habilidades blandas"]
  },
  {
    key: "valor",
    title: "Propuesta de valor",
    className: "value",
    items: ["Mejor comunicación en equipos académicos", "Claridad de roles y responsabilidades", "Seguimiento estructurado de tareas"]
  },
  {
    key: "relaciones",
    title: "Relaciones con los clientes",
    items: ["Soporte digital", "Tutoriales y materiales de uso", "Uso intuitivo de la plataforma"]
  },
  {
    key: "segmento",
    title: "Segmento de clientes",
    items: ["Estudiantes universitarios", "Equipos de trabajo académicos", "Docentes interesados"]
  },
  {
    key: "recursos",
    title: "Recursos clave",
    items: ["Plataforma tecnológica", "Base de usuarios", "Equipo de soporte técnico", "Contenidos de formación"]
  },
  {
    key: "canales",
    title: "Canales",
    items: ["Aplicación web", "Plataformas educativas", "Redes sociales internas", "Comunicación universitaria"]
  },
  {
    key: "costos",
    title: "Estructura de costos",
    className: "costs",
    items: ["Desarrollo de software", "Infraestructura tecnológica", "Soporte técnico", "Marketing y difusión"]
  },
  {
    key: "ingresos",
    title: "Flujo de ingresos",
    className: "income",
    items: ["Suscripción institucional", "Anuncios (versiones gratuitas)", "Versión premium", "Convenios institucionales"]
  }
];

const investmentRows = [
  {
    rubro: "Desarrollo de la plataforma tecnológica",
    monto: "$8.000.000",
    value: 8000000,
    justificacion: "Diseño, programación, pruebas, arquitectura inicial y despliegue del sistema."
  },
  {
    rubro: "Infraestructura y hosting",
    monto: "$3.000.000",
    value: 3000000,
    justificacion: "Servidores, dominios, bases de datos, almacenamiento y servicios en la nube."
  },
  {
    rubro: "Capacitación en habilidades blandas",
    monto: "$3.500.000",
    value: 3500000,
    justificacion: "Diseño e implementación de talleres, módulos formativos y material pedagógico."
  },
  {
    rubro: "Soporte técnico y mantenimiento inicial",
    monto: "$2.000.000",
    value: 2000000,
    justificacion: "Corrección de errores, ajustes, acompañamiento a usuarios y optimización."
  },
  {
    rubro: "Marketing interno y comunicación",
    monto: "$1.500.000",
    value: 1500000,
    justificacion: "Campañas de difusión, material gráfico, activaciones y comunicación institucional."
  },
  {
    rubro: "Evaluación y medición de impacto",
    monto: "$2.000.000",
    value: 2000000,
    justificacion: "Encuestas, análisis de datos, métricas de uso, reportes y retroalimentación."
  },
  {
    rubro: "TOTAL",
    monto: "$20.000.000",
    value: 20000000,
    justificacion: "Inversión total para los primeros 6 meses del proyecto"
  }
];

const risks = [
  {
    risk: "Baja adopción de la plataforma por parte de los estudiantes",
    origin: "Debilidad (D1) / Social",
    mitigation: "Campañas de sensibilización, tutoriales claros, acompañamiento inicial y soporte cercano."
  },
  {
    risk: "Resistencia a la capacitación en habilidades blandas",
    origin: "Debilidad (D2) / Social",
    mitigation: "Ofrecer microcursos breves, gamificación, certificaciones internas y reconocimiento."
  },
  {
    risk: "Competencia de herramientas genéricas de gestión",
    origin: "Amenaza (A1) / Tecnológico",
    mitigation: "Diferenciarse por el enfoque integral (técnico + humano) y la adaptación al contexto local."
  },
  {
    risk: "Baja participación sostenida en procesos voluntarios",
    origin: "Amenaza (A2) / Social",
    mitigation: "Integrar el uso de la plataforma a actividades curriculares y proyectos de aula."
  },
  {
    risk: "Limitaciones presupuestales de la institución",
    origin: "Económico",
    mitigation: "Proponer fases de implementación y modelos de costos escalonados."
  }
];

const workPlan = [
  {
    month: "1",
    activity: "Ajuste de requerimientos, diseño funcional y técnico de la plataforma, definición de roles y alcance del piloto."
  },
  {
    month: "2",
    activity: "Desarrollo del módulo de gestión de tareas y roles, diseño de interfaz y pruebas internas."
  },
  {
    month: "3",
    activity: "Desarrollo del módulo de comunicación y seguimiento, integración con sistemas existentes (si aplica)."
  },
  {
    month: "4",
    activity: "Diseño e implementación de los primeros talleres de habilidades blandas, pruebas piloto con grupos reducidos."
  },
  {
    month: "5",
    activity: "Implementación del piloto con equipos académicos seleccionados, acompañamiento y soporte técnico."
  },
  {
    month: "6",
    activity: "Recolección de datos (uso, satisfacción, impacto), ajustes a la plataforma y preparación de informe de resultados."
  }
];

const state = {
  activeSection: "inicio",
  canvasKey: "valor",
  timelineMonth: "1",
  raf: null,
  particles: []
};

const elements = {};

function cacheElements() {
  elements.panels = [...document.querySelectorAll("[data-section]")];
  elements.navLinks = [...document.querySelectorAll("[data-nav]")];
  elements.jumpButtons = [...document.querySelectorAll("[data-jump]")];
  elements.prev = document.getElementById("prevSection");
  elements.next = document.getElementById("nextSection");
  elements.progress = document.getElementById("progressBar");
  elements.menuToggle = document.querySelector(".menu-toggle");
  elements.sectionNav = document.getElementById("sectionNav");
  elements.modal = document.getElementById("contentModal");
  elements.modalTitle = document.getElementById("modalTitle");
  elements.modalText = document.getElementById("modalText");
  elements.canvasGrid = document.getElementById("canvasGrid");
  elements.canvasDetail = document.getElementById("canvasDetail");
  elements.investmentRows = document.getElementById("investmentRows");
  elements.riskAccordion = document.getElementById("riskAccordion");
  elements.timeline = document.getElementById("timeline");
  elements.heroCanvas = document.getElementById("heroCanvas");
}

function setActiveSection(sectionId, options = {}) {
  if (!sections.includes(sectionId)) {
    sectionId = "inicio";
  }

  state.activeSection = sectionId;

  elements.panels.forEach((panel) => {
    const isActive = panel.dataset.section === sectionId;
    panel.classList.toggle("active", isActive);
    panel.setAttribute("aria-hidden", String(!isActive));
  });

  elements.navLinks.forEach((link) => {
    const isActive = link.dataset.nav === sectionId;
    link.classList.toggle("active", isActive);
    if (link.classList.contains("nav-link")) {
      link.setAttribute("aria-current", isActive ? "page" : "false");
    }
  });

  const index = sections.indexOf(sectionId);
  elements.prev.disabled = index === 0;
  elements.next.disabled = index === sections.length - 1;
  elements.progress.style.width = `${((index + 1) / sections.length) * 100}%`;
  elements.sectionNav.classList.remove("open");
  elements.menuToggle.setAttribute("aria-expanded", "false");

  if (!options.skipHash) {
    history.replaceState(null, "", `#${sectionId}`);
  }

  if (!options.skipScroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (sectionId === "inversion") {
    animateInvestmentBars();
  }
}

function goToOffset(offset) {
  const current = sections.indexOf(state.activeSection);
  const nextIndex = Math.min(sections.length - 1, Math.max(0, current + offset));
  setActiveSection(sections[nextIndex]);
}

function bindNavigation() {
  elements.navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setActiveSection(link.dataset.nav);
    });
  });

  elements.jumpButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveSection(button.dataset.jump));
  });

  elements.prev.addEventListener("click", () => goToOffset(-1));
  elements.next.addEventListener("click", () => goToOffset(1));

  elements.menuToggle.addEventListener("click", () => {
    const open = !elements.sectionNav.classList.contains("open");
    elements.sectionNav.classList.toggle("open", open);
    elements.menuToggle.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("keydown", (event) => {
    if (elements.modal.classList.contains("open")) {
      if (event.key === "Escape") {
        closeModal();
      }
      return;
    }

    if (event.key === "ArrowRight") {
      goToOffset(1);
    }

    if (event.key === "ArrowLeft") {
      goToOffset(-1);
    }
  });
}

function bindExpandableCards() {
  document.querySelectorAll("[data-expand-group]").forEach((group) => {
    const cards = [...group.querySelectorAll("button")];

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        cards.forEach((item) => item.classList.toggle("active", item === card));
      });
    });
  });

  document.querySelectorAll("[data-module]").forEach((module) => {
    const trigger = module.querySelector(".module-trigger");
    trigger.addEventListener("click", () => module.classList.toggle("active"));
  });
}

function renderCanvas() {
  elements.canvasGrid.innerHTML = "";

  canvasBlocks.forEach((block) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `canvas-block ${block.className || ""}`.trim();
    button.dataset.canvasKey = block.key;

    const title = document.createElement("h3");
    title.textContent = block.title;
    button.appendChild(title);
    button.appendChild(createList(block.items));

    button.addEventListener("click", () => setCanvasDetail(block.key));
    elements.canvasGrid.appendChild(button);
  });

  setCanvasDetail(state.canvasKey);
}

function setCanvasDetail(key) {
  const block = canvasBlocks.find((item) => item.key === key) || canvasBlocks[0];
  state.canvasKey = block.key;

  document.querySelectorAll(".canvas-block").forEach((button) => {
    button.classList.toggle("active", button.dataset.canvasKey === block.key);
  });

  elements.canvasDetail.innerHTML = "";

  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = "Canvas";

  const title = document.createElement("h3");
  title.textContent = block.title;

  elements.canvasDetail.append(eyebrow, title, createList(block.items));
}

function renderInvestment() {
  const total = 20000000;
  elements.investmentRows.innerHTML = "";

  investmentRows.forEach((row) => {
    const tr = document.createElement("tr");
    const rubro = document.createElement("td");
    const monto = document.createElement("td");
    const justificacion = document.createElement("td");
    const visual = document.createElement("td");
    const bar = document.createElement("div");
    const fill = document.createElement("span");

    rubro.textContent = row.rubro;
    monto.textContent = row.monto;
    monto.className = "money";
    justificacion.textContent = row.justificacion;
    bar.className = "bar";
    fill.className = "bar-fill";
    fill.dataset.width = `${Math.min(100, (row.value / total) * 100)}%`;
    bar.appendChild(fill);
    visual.appendChild(bar);
    tr.append(rubro, monto, justificacion, visual);
    elements.investmentRows.appendChild(tr);
  });
}

function animateInvestmentBars() {
  requestAnimationFrame(() => {
    document.querySelectorAll(".bar-fill").forEach((bar) => {
      bar.style.width = bar.dataset.width || "0";
    });
  });
}

function renderRisks() {
  elements.riskAccordion.innerHTML = "";

  risks.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = `accordion-item ${index === 0 ? "active" : ""}`;

    const trigger = document.createElement("button");
    trigger.className = "accordion-trigger";
    trigger.type = "button";
    trigger.innerHTML = `
      <span>Riesgo</span>
      <strong>${item.risk}</strong>
      <em class="accordion-indicator" aria-hidden="true">+</em>
    `;

    const panel = document.createElement("div");
    panel.className = "accordion-panel";
    panel.innerHTML = `
      <dl class="accordion-meta">
        <div>
          <dt>Origen (DOFA/PESTEL)</dt>
          <dd>${item.origin}</dd>
        </div>
        <div>
          <dt>Estrategia de mitigación</dt>
          <dd>${item.mitigation}</dd>
        </div>
      </dl>
    `;

    trigger.addEventListener("click", () => {
      document.querySelectorAll(".accordion-item").forEach((node) => {
        node.classList.toggle("active", node === article);
      });
    });

    article.append(trigger, panel);
    elements.riskAccordion.appendChild(article);
  });
}

function renderTimeline() {
  elements.timeline.innerHTML = "";

  const steps = document.createElement("div");
  steps.className = "timeline-steps";

  const panel = document.createElement("article");
  panel.className = "timeline-panel";
  panel.setAttribute("aria-live", "polite");

  workPlan.forEach((entry) => {
    const button = document.createElement("button");
    button.className = `timeline-step ${entry.month === state.timelineMonth ? "active" : ""}`;
    button.type = "button";
    button.textContent = `Mes ${entry.month}`;
    button.addEventListener("click", () => {
      state.timelineMonth = entry.month;
      updateTimeline(panel);
      document.querySelectorAll(".timeline-step").forEach((step) => {
        step.classList.toggle("active", step === button);
      });
    });
    steps.appendChild(button);
  });

  elements.timeline.append(steps, panel);
  updateTimeline(panel);
}

function updateTimeline(panel) {
  const entry = workPlan.find((item) => item.month === state.timelineMonth) || workPlan[0];
  panel.innerHTML = `
    <span>Mes ${entry.month}</span>
    <h3>Actividades principales</h3>
    <p>${entry.activity}</p>
  `;
}

function bindModal() {
  document.querySelectorAll("[data-modal-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const content = pestelContent[button.dataset.modalKey];
      openModal(content);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((node) => {
    node.addEventListener("click", closeModal);
  });
}

function openModal(content) {
  if (!content) {
    return;
  }

  elements.modalTitle.textContent = content.title;
  elements.modalText.textContent = content.text;
  elements.modal.classList.add("open");
  elements.modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  elements.modal.classList.remove("open");
  elements.modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function createList(items) {
  const list = document.createElement("ul");
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
  return list;
}

function setupHeroCanvas() {
  const canvas = elements.heroCanvas;
  const context = canvas.getContext("2d");

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(26, Math.floor(rect.width / 38));
    state.particles = Array.from({ length: count }, (_, index) => ({
      x: (index * 83) % Math.max(rect.width, 1),
      y: (index * 47) % Math.max(rect.height, 1),
      vx: 0.18 + (index % 5) * 0.035,
      vy: 0.12 + (index % 7) * 0.028,
      r: 1.6 + (index % 4) * 0.35
    }));
  }

  function draw() {
    const rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, rect.width, rect.height);
    context.strokeStyle = "rgba(123, 196, 255, 0.18)";
    context.lineWidth = 1;
    context.fillStyle = "rgba(123, 196, 255, 0.74)";

    state.particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x > rect.width + 20) particle.x = -20;
      if (particle.y > rect.height + 20) particle.y = -20;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      context.fill();

      for (let cursor = index + 1; cursor < state.particles.length; cursor += 1) {
        const other = state.particles[cursor];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 122) {
          context.globalAlpha = 1 - distance / 122;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.stroke();
          context.globalAlpha = 1;
        }
      }
    });

    state.raf = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
}

function initializeFromHash() {
  const hash = window.location.hash.replace("#", "");
  setActiveSection(sections.includes(hash) ? hash : "inicio", {
    skipHash: !hash,
    skipScroll: true
  });
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function initialize() {
  cacheElements();
  renderCanvas();
  renderInvestment();
  renderRisks();
  renderTimeline();
  bindNavigation();
  bindExpandableCards();
  bindModal();
  setupHeroCanvas();
  initializeFromHash();
}

window.addEventListener("DOMContentLoaded", initialize);
