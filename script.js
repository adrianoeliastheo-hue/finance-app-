const investmentOptions = {
  conservador: [
    { name: "Tesouro Selic", rate: 0.07 },
    { name: "CDB", rate: 0.065 },
    { name: "Poupança", rate: 0.04 },
  ],
  equilibrado: [
    { name: "Fundos Multimercado", rate: 0.10 },
    { name: "LCI/LCA", rate: 0.09 },
    { name: "Debêntures", rate: 0.11 },
  ],
  arrojado: [
    { name: "Ações", rate: 0.15 },
    { name: "Fundos Imobiliários", rate: 0.13 },
    { name: "Criptomoedas", rate: 0.25 },
  ],
};

const amountInput = document.getElementById("amount");
const periodSelect = document.getElementById("period");
const quantityInput = document.getElementById("quantidade-periodo");
const typeButtons = document.querySelectorAll(".type-btn");
const subtypesContainer = document.getElementById("subtypes-container");
const subtypeSelect = document.getElementById("subtype-select");
const simulateBtn = document.getElementById("simulate-btn");
const resultsSection = document.querySelector(".results-section");
const summary = document.getElementById("summary");
const chartCanvas = document.getElementById("chart");

let selectedType = null;
let chartInstance = null;

function selectType(type) {
  selectedType = type;
  typeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.type === type);
  });

  const options = investmentOptions[type];
  subtypeSelect.innerHTML = "";
  options.forEach((opt, i) => {
    const optionEl = document.createElement("option");
    optionEl.value = i;
    optionEl.textContent = `${opt.name} (${(opt.rate * 100).toFixed(1)}% a.a.)`;
    subtypeSelect.appendChild(optionEl);
  });

  subtypesContainer.classList.remove("hidden");
}

function calcularAcumulado(mensalidade, meses, taxaAnual) {
  const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1;
  let saldo = 0;
  const saldoMensal = [];
  for (let i = 1; i <= meses; i++) {
    saldo = (saldo + mensalidade) * (1 + taxaMensal);
    saldoMensal.push(saldo);
  }
  return saldoMensal;
}

function desenharGrafico(saldos) {
  if (chartInstance) {
    chartInstance.destroy();
  }
  chartInstance = new Chart(chartCanvas, {
    type: "line",
    data: {
      labels: saldos.map((_, i) => i + 1),
      datasets: [{
        label: "Saldo acumulado (R$)",
        data: saldos.map((v) => v.toFixed(2)),
        borderColor: "#0177fb",
        backgroundColor: "rgba(1, 119, 251, 0.3)",
        fill: true,
        tension: 0.25,
        pointRadius: 3,
      }],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Período (meses)",
          },
        },
        y: {
          title: {
            display: true,
            text: "Valor acumulado (R$)",
          },
          beginAtZero: true,
        },
      },
    },
  });
}

typeButtons.forEach((btn) => {
  btn.addEventListener("click", () => selectType(btn.dataset.type));
});

simulateBtn.addEventListener("click", () => {
  const mensalidade = parseFloat(amountInput.value);
  const periodo = periodSelect.value;
  const quantidade = parseInt(quantityInput.value);
  const tipo = selectedType;
  const subtipoIndex = subtypeSelect.value;

  if (!mensalidade || mensalidade <= 0) {
    alert("Por favor, insira um valor mensal válido.");
    amountInput.focus();
    return;
  }

  if (!quantidade || quantidade <= 0 || isNaN(quantidade)) {
    alert("Por favor, informe uma quantidade válida de meses ou anos.");
    quantityInput.focus();
    return;
  }

  if (!tipo) {
    alert("Por favor, selecione um tipo de aplicação.");
    return;
  }

  const meses = periodo === "anos" ? quantidade * 12 : quantidade;
  const investimento = investmentOptions[tipo][subtipoIndex];
  const saldos = calcularAcumulado(mensalidade, meses, investimento.rate);

  const saldoFinal = saldos[saldos.length - 1];
  summary.textContent = `Investindo R$ ${mensalidade.toFixed(2)} por mês, durante ${meses} meses, no investimento "${investimento.name}", com uma taxa anual média de ${(investimento.rate * 100).toFixed(2)}%, você terá aproximadamente R$ ${saldoFinal.toFixed(2)} no final do período.`;

  resultsSection.classList.remove("hidden");
  desenharGrafico(saldos);
});

function mostrarInputPeriodo() {
  const input = document.getElementById("quantidade-periodo");
  input.style.display = "inline-block";
  input.value = "";
  input.focus();
}
