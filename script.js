// Dados dos investimentos com nomes mais simples e taxas anuais médias
const investmentOptions = {
  conservador: [
    { name: "Tesouro Direto (rende com segurança)", rate: 0.07 },
    { name: "Banco CDB (rende mais que a poupança)", rate: 0.065 },
    { name: "Poupança (baixo rendimento, mas segura)", rate: 0.04 },
  ],
  equilibrado: [
    { name: "Fundos Diversificados", rate: 0.10 },
    { name: "Letra de Crédito (livre de imposto)", rate: 0.09 },
    { name: "Títulos de Empresas (rentáveis, com risco)", rate: 0.11 },
  ],
  arrojado: [
    { name: "Ações (varia muito, mas pode render mais)", rate: 0.15 },
    { name: "Fundos de Imóveis (aluguel e valorização)", rate: 0.13 },
    { name: "Cripto (alta volatilidade e risco)", rate: 0.25 },
  ],
};

const amountInput = document.getElementById("amount");
const periodSelect = document.getElementById("period");
const quantidadeInput = document.getElementById("quantidade");
const typeButtons = document.querySelectorAll(".type-btn");
const subtypesContainer = document.getElementById("subtypes-container");
const subtypeSelect = document.getElementById("subtype-select");
const simulateBtn = document.getElementById("simulate-btn");
const resultsSection = document.querySelector(".results-section");
const summary = document.getElementById("summary");
const chartCanvas = document.getElementById("chart");

let selectedType = null;
let chartInstance = null;

// Ativar botão de tipo e mostrar subtipos
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

// Calcular saldo com juros compostos mensais
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

// Mostrar gráfico com Chart.js
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

// Mostrar input "quantos?" conforme escolha
function mostrarCampoPeriodo() {
  const select = document.getElementById("period");
  const campo = document.getElementById("campo-quantidade");

  if (select.value === "anos" || select.value === "meses") {
    campo.style.display = "block";
  } else {
    campo.style.display = "none";
  }
}

// Evento de clique nos botões de tipo
typeButtons.forEach((btn) => {
  btn.addEventListener("click", () => selectType(btn.dataset.type));
});

// Clique em "Simular"
simulateBtn.addEventListener("click", () => {
  const mensalidade = parseFloat(amountInput.value);
  const periodo = periodSelect.value;
  const quantidade = parseInt(quantidadeInput.value);
  const tipo = selectedType;
  const subtipoIndex = subtypeSelect.value;

  if (!mensalidade || mensalidade <= 0) {
    alert("Por favor, insira um valor mensal válido.");
    amountInput.focus();
    return;
  }
  if (!tipo) {
    alert("Por favor, selecione um tipo de aplicação.");
    return;
  }
  if (isNaN(quantidade) || quantidade <= 0) {
    alert("Por favor, insira a quantidade de tempo válida.");
    return;
  }

  let meses = quantidade;
  if (periodo === "anos") {
    meses = quantidade * 12;
  }

  const investimento = investmentOptions[tipo][subtipoIndex];
  const saldos = calcularAcumulado(mensalidade, meses, investimento.rate);

  const saldoFinal = saldos[saldos.length - 1];
  summary.textContent = `Investindo R$ ${mensalidade.toFixed(2)} por mês, durante ${meses} meses, no investimento "${investimento.name}", com uma taxa anual média de ${(investimento.rate * 100).toFixed(2)}%, você terá aproximadamente R$ ${saldoFinal.toFixed(2)} no final do período.`;

  resultsSection.classList.remove("hidden");
  desenharGrafico(saldos);
});
