// VIVA — servidor (Express)
const path = require("node:path");
const express = require("express");
const rotasRegistros = require("./routes/registros");

const app = express();
const PORTA = process.env.PORT || 3000;
const PASTA_FRONTEND = path.join(__dirname, "..", "..", "frontend");

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

// Respostas da API nunca ficam guardadas no cache do navegador
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/api/saude", (req, res) => {
  res.json({ status: "ok", projeto: "VIVA", hora: new Date().toISOString() });
});

app.use("/api/registros", rotasRegistros);

app.use(express.static(PASTA_FRONTEND));

// Qualquer rota de API que não exista
app.use("/api", (req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

// Tratamento de erros: nunca devolve detalhes internos nem o conteúdo do pedido
app.use((erro, req, res, next) => {
  if (erro.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido." });
  }

  if (erro.type === "entity.too.large") {
    return res.status(413).json({ erro: "Pedido grande demais." });
  }

  console.error("Erro inesperado:", erro.message);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

app.listen(PORTA, () => {
  console.log(`VIVA rodando em http://localhost:${PORTA}`);
});