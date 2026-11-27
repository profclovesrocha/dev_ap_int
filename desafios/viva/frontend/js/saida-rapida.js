// VIVA — saída rápida
// Cria um botão que leva a pessoa para um site neutro.

const SITE_NEUTRO = "https://www.google.com.br";

function criarBotaoSaidaRapida() {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "saida-rapida";
  botao.textContent = "Saída rápida";
  botao.setAttribute("aria-label", "Saída rápida: sair deste site agora");

  botao.addEventListener("click", function () {
    window.location.replace(SITE_NEUTRO);
  });

  document.body.prepend(botao);
}

criarBotaoSaidaRapida();