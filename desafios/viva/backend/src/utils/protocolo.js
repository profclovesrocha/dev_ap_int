// VIVA — geração de protocolos aleatórios
const crypto = require("node:crypto");

// Sem I, L, O, 0 e 1, que se confundem ao ler ou digitar
const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

const PADRAO_PROTOCOLO = /^VIVA-\d{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;

function sortearTrecho(tamanho) {
  let trecho = "";

  for (let i = 0; i < tamanho; i += 1) {
    trecho += ALFABETO[crypto.randomInt(ALFABETO.length)];
  }

  return trecho;
}

function gerarProtocolo() {
  const ano = new Date().getFullYear();
  return `VIVA-${ano}-${sortearTrecho(4)}-${sortearTrecho(4)}`;
}

module.exports = { gerarProtocolo, PADRAO_PROTOCOLO };