// VIVA — rotas de registros urbanos
const express = require("express");
const banco = require("../database/banco");
const { gerarProtocolo, PADRAO_PROTOCOLO } = require("../utils/protocolo");
const { validarRegistro } = require("../utils/validacao");

const rotas = express.Router();

// Comandos SQL preparados: os "?" recebem os valores com segurança
const inserirRegistro = banco.prepare(
  "INSERT INTO registros (protocolo, categoria, bairro, descricao) VALUES (?, ?, ?, ?)"
);
const protocoloExiste = banco.prepare("SELECT 1 AS achou FROM registros WHERE protocolo = ?");
const buscarRegistro = banco.prepare(
  `SELECT protocolo, categoria, bairro, descricao, status, demonstrativo, criado_em
   FROM registros WHERE protocolo = ?`
);

function criarProtocoloUnico() {
  for (let tentativa = 0; tentativa < 10; tentativa += 1) {
    const protocolo = gerarProtocolo();

    if (!protocoloExiste.get(protocolo)) {
      return protocolo;
    }
  }

  throw new Error("Não foi possível gerar um protocolo único.");
}

function formatarRegistro(registro) {
  return {
    protocolo: registro.protocolo,
    categoria: registro.categoria,
    bairro: registro.bairro,
    descricao: registro.descricao,
    status: registro.status,
    demonstrativo: registro.demonstrativo === 1,
    criadoEm: registro.criado_em
  };
}

// POST /api/registros — cria um registro e devolve o protocolo
rotas.post("/", (req, res) => {
  const resultado = validarRegistro(req.body ?? {});

  if (!resultado.valido) {
    return res.status(400).json({ erro: "Dados inválidos.", detalhes: resultado.erros });
  }

  const { categoria, bairro, descricao } = resultado.dados;
  const protocolo = criarProtocoloUnico();

  inserirRegistro.run(protocolo, categoria, bairro, descricao);

  res.status(201).json(formatarRegistro(buscarRegistro.get(protocolo)));
});

// GET /api/registros/:protocolo — consulta o andamento
rotas.get("/:protocolo", (req, res) => {
  const protocolo = String(req.params.protocolo).trim().toUpperCase();

  if (!PADRAO_PROTOCOLO.test(protocolo)) {
    return res.status(400).json({ erro: "Formato de protocolo inválido." });
  }

  const registro = buscarRegistro.get(protocolo);

  if (!registro) {
    return res.status(404).json({ erro: "Protocolo não encontrado." });
  }

  res.json(formatarRegistro(registro));
});

module.exports = rotas;