// VIVA — conexão com o banco SQLite (módulo nativo do Node)
const fs = require("node:fs");
const path = require("node:path");
const sqlite = require("node:sqlite");

// Node 26 chama a classe de "Database"; versões anteriores, de "DatabaseSync"
const Banco = sqlite.Database ?? sqlite.DatabaseSync;

const CAMINHO = process.env.DB_PATH || path.join(__dirname, "..", "..", "data", "viva.db");

fs.mkdirSync(path.dirname(CAMINHO), { recursive: true });

const banco = new Banco(CAMINHO);

// Cria as tabelas se ainda não existirem
banco.exec(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));

module.exports = banco;