const perfis = {
  conservador: {
    taxa: 0.005, // 0,5% ao mês
    opcoes: ['Tesouro Selic', 'Poupança', 'CDB (baixo risco)']
  },
  equilibrado: {
    taxa: 0.01, // 1% ao mês
    opcoes: ['Fundos Imobiliários', 'Tesouro IPCA', 'CDB com liquidez']
  },
  arrojado: {
    taxa: 0.015, // 1,5% ao mês
    opcoes: ['Ações', 'Criptomoedas', 'ETFs']
  }
};

let perfilSelecionado = null;
let opcaoSelecionada = null;

function selecionarPerfil(perfil) {
  perfilSelecionado = perfil;
  const container = document.getElementById('opcoes-investimento');
  const opcoes = perfis[perfil].opcoes;

  let html = `<h3>Selecione o tipo de investimento (${perfil}):</h3>`;
  opcoes.forEach(opcao => {
    html += `<label><input type="radio" name="opcao" value="${opcao}"> ${opcao}</label><br>`;
  });

  container.innerHTML = html;
}

function simular() {
  const valorMensal = parseFloat(document.getElementById('valor').value);
  let periodo = parseInt(document.getElementById('periodo').value);
  const tipoPeriodo = document.getElementById('tipo-periodo').value;
  const radios = document.getElementsByName('opcao');

  for (const radio of radios) {
    if (radio.checked) {
      opcaoSelecionada = radio.value;
      break;
    }
  }

  if (!valorMensal || !periodo || !perfilSelecionado || !opcaoSelecionada) {
    alert("Preencha todos os campos e selecione um investimento.");
    return;
  }

  // Converter anos em meses
  if (tipoPeriodo === 'anos') {
    periodo *= 12;
  }

  const taxa = perfis[perfilSelecionado].taxa;

  // Fórmula de juros compostos com aportes mensais
  const valorFuturo = valorMensal * (((1 + taxa) ** periodo - 1) / taxa);

  const resultado = document.getElementById('resultado');
  resultado.innerHTML = `
    <h3>Resultado da Simulação</h3>
    <p>Investindo <strong>R$ ${valorMensal.toFixed(2)}</strong> por ${periodo} meses em <strong>${opcaoSelecionada}</strong>,</p>
    <p>Você terá aproximadamente <strong>R$ ${valorFuturo.toFixed(2)}</strong>.</p>
  `;
}
