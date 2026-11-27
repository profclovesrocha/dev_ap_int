// VIVA — validação dos dados do registro (repete as regras do navegador)

const CATEGORIAS = ["iluminacao", "abandono", "policiamento", "transporte", "mato", "outro"];

// Proteção básica contra telefones e e-mails, não uma garantia de anonimato
function temDadoPessoal(texto) {
  const semSeparadores = texto.replace(/[\s.\-()]/g, "");
  return /\d{8,}/.test(semSeparadores) || texto.includes("@");
}

function lerTexto(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}
// Conta caracteres do mesmo modo que o banco (emojis valem 1, não 2)
function tamanho(texto) {
  return Array.from(texto).length;
}
function validarRegistro(corpo) {
  const categoria = lerTexto(corpo.categoria);
  const bairro = lerTexto(corpo.bairro);
  const descricao = lerTexto(corpo.descricao);
  const erros = {};

  if (!CATEGORIAS.includes(categoria)) {
    erros.categoria = "Escolha um tipo de problema válido.";
  }

    if (tamanho(bairro) < 3 || tamanho(bairro) > 60) {
    erros.bairro = "Informe o bairro com 3 a 60 caracteres.";
  } else if (temDadoPessoal(bairro)) {
    erros.bairro = "Informe somente o nome do bairro.";
  }

    if (tamanho(descricao) < 20 || tamanho(descricao) > 500) {
    erros.descricao = "A descrição deve ter de 20 a 500 caracteres.";
  } else if (temDadoPessoal(descricao)) {
    erros.descricao = "Remova possíveis telefones ou e-mails.";
  }

  if (corpo.ciencia !== true) {
    erros.ciencia = "Confirme a ciência da finalidade acadêmica.";
  }

  return {
    valido: Object.keys(erros).length === 0,
    erros,
    dados: { categoria, bairro, descricao }
  };
}

module.exports = { validarRegistro };