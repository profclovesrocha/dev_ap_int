// VIVA — servidor (Express)
const path = require("node:path");
const express = require("express");

const app = express();
const PORTA = process.env.PORT || 3000;
const PASTA_FRONTEND = path.join(__dirname, "..", "..", "frontend");

app.disable("x-powered-by");           // não revela qual tecnologia o servidor usa
app.use(express.json({ limit: "10kb" })); // lê JSON e recusa corpos grandes demais

// Rota de teste: confirma que a API está no ar
app.get("/api/saude", (req, res) => {
  res.json({ status: "ok", projeto: "VIVA", hora: new Date().toISOString() });
});

// Entrega o site (pasta frontend) pelo mesmo servidor
app.use(express.static(PASTA_FRONTEND));

// Qualquer rota de API que não exista
app.use("/api", (req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

app.listen(PORTA, () => {
  console.log(`VIVA rodando em http://localhost:${PORTA}`);
});