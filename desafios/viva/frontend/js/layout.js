// VIVA — layout compartilhado: barra de emergência, cabeçalho, rodapé e acessibilidade.
// Cada página só precisa de <header id="topo"> e <footer id="rodape"> vazios.

const SITE_NEUTRO = "https://www.google.com.br";

const PAGINAS = [
  { arquivo: "index.html", rotulo: "Início" },
  { arquivo: "servicos.html", rotulo: "Serviços de apoio" },
  { arquivo: "orientacoes.html", rotulo: "Orientações" },
  { arquivo: "menores.html", rotulo: "Meninas e adolescentes" },
  { arquivo: "registrar.html", rotulo: "Registrar problema" },
  { arquivo: "acompanhar.html", rotulo: "Acompanhar" }
];

const NIVEIS_FONTE = [87.5, 100, 112.5, 125]; // porcentagem do tamanho do texto
const NIVEL_PADRAO = 1;

// Ícones reutilizáveis (cada página os chama com <use href="#i-nome">)
const SPRITE = `
<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <symbol id="i-telefone" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></symbol>
  <symbol id="i-seta" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></symbol>
  <symbol id="i-balanca" viewBox="0 0 24 24"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></symbol>
  <symbol id="i-predio" viewBox="0 0 24 24"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4"/></symbol>
  <symbol id="i-saida" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></symbol>
  <symbol id="i-contraste" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></symbol>
</svg>`;

function montarTopo() {
  return `
  <div class="topbar">
    <div class="container topbar__interno">
      <p class="topbar__emergencia">
        <svg class="icone" aria-hidden="true"><use href="#i-telefone"></use></svg>
        <span>Emergência: <strong>190</strong></span>
        <span aria-hidden="true">•</span>
        <span>Orientação e atendimento: <strong>180</strong></span>
      </p>
      <div class="topbar__ferramentas" role="group" aria-label="Acessibilidade">
        <button type="button" class="ferramenta" data-acao="fonte-menor" aria-label="Diminuir o tamanho do texto">A−</button>
        <button type="button" class="ferramenta ferramenta--padrao" data-acao="fonte-padrao" aria-label="Tamanho padrão do texto">A</button>
        <button type="button" class="ferramenta" data-acao="fonte-maior" aria-label="Aumentar o tamanho do texto">A+</button>
        <button type="button" class="ferramenta" data-acao="contraste" aria-pressed="false" aria-label="Alto contraste">
          <svg class="icone" aria-hidden="true"><use href="#i-contraste"></use></svg>
        </button>
      </div>
    </div>
  </div>`;
}

// Na ordem do teclado, a Saída rápida vem logo depois da marca, de propósito:
// é o recurso de segurança e precisa ser o mais fácil de alcançar.
function montarCabecalho(paginaAtual) {
  const itens = PAGINAS.map(function (pagina) {
    const atual = pagina.arquivo === paginaAtual ? ' aria-current="page"' : "";
    return `<li><a class="menu__link" href="${pagina.arquivo}"${atual}>${pagina.rotulo}</a></li>`;
  }).join("");

  return `
  <div class="cabecalho">
    <div class="container cabecalho__interno">
      <a class="marca" href="index.html" aria-label="VIVA — Cidade que Protege, página inicial">
        <span class="marca__logo" aria-hidden="true">viva<span class="marca__ponto">.</span></span>
        <span class="marca__texto" aria-hidden="true">Cidade que Protege</span>
      </a>
      <button type="button" class="botao botao--saida" data-acao="saida-rapida">
        <svg class="icone" aria-hidden="true"><use href="#i-saida"></use></svg>
        <span>Saída rápida</span>
      </button>
      <button type="button" class="menu__alternar" data-acao="menu" aria-expanded="false" aria-controls="menu-principal">
        <svg class="icone" aria-hidden="true"><use href="#i-menu"></use></svg>
        <span>Menu</span>
      </button>
      <nav class="menu" id="menu-principal" aria-label="Menu principal">
        <ul class="menu__lista">${itens}</ul>
      </nav>
    </div>
  </div>`;
}

function montarRodape() {
  return `
  <div class="container rodape__interno">
    <a class="marca marca--clara" href="index.html" aria-label="VIVA — Cidade que Protege, página inicial">
      <span class="marca__logo" aria-hidden="true">viva<span class="marca__ponto">.</span></span>
    </a>
    <div class="rodape__texto">
      <p class="rodape__nome">VIVA • Cidade que Protege</p>
      <p class="rodape__aviso">Projeto acadêmico — UNINASSAU Olinda, 2026.2. O VIVA não é um serviço de emergência: em risco imediato, ligue 190.</p>
    </div>
    <div class="rodape__arte" aria-hidden="true"></div>
  </div>`;
}

// Preferências guardadas só no navegador da pessoa (tamanho do texto e contraste).
// Não são dados pessoais e nada é enviado a servidor.
function lerPreferencia(chave) {
  try { return window.localStorage.getItem(chave); } catch (erro) { return null; }
}
function salvarPreferencia(chave, valor) {
  try { window.localStorage.setItem(chave, valor); } catch (erro) { /* sem armazenamento: segue sem salvar */ }
}

let nivelFonte = NIVEL_PADRAO;

function aplicarFonte() {
  document.documentElement.style.fontSize = NIVEIS_FONTE[nivelFonte] + "%";
  salvarPreferencia("viva-fonte", String(nivelFonte));
}

function mudarFonte(passo) {
  nivelFonte = Math.min(NIVEIS_FONTE.length - 1, Math.max(0, nivelFonte + passo));
  aplicarFonte();
}

function aplicarContraste(ativo) {
  document.documentElement.classList.toggle("alto-contraste", ativo);
  const botao = document.querySelector('[data-acao="contraste"]');
  if (botao) { botao.setAttribute("aria-pressed", String(ativo)); }
  salvarPreferencia("viva-contraste", ativo ? "1" : "0");
}

function alternarMenu(botao) {
  const abrir = botao.getAttribute("aria-expanded") !== "true";
  botao.setAttribute("aria-expanded", String(abrir));
  document.getElementById("menu-principal").classList.toggle("menu--aberto", abrir);
}

// Um único "ouvinte" de cliques atende todos os botões marcados com data-acao
document.addEventListener("click", function (evento) {
  const botao = evento.target.closest("[data-acao]");
  if (!botao) { return; }

  switch (botao.dataset.acao) {
    case "saida-rapida": window.location.replace(SITE_NEUTRO); break;
    case "fonte-menor": mudarFonte(-1); break;
    case "fonte-padrao": nivelFonte = NIVEL_PADRAO; aplicarFonte(); break;
    case "fonte-maior": mudarFonte(1); break;
    case "contraste": aplicarContraste(!document.documentElement.classList.contains("alto-contraste")); break;
    case "menu": alternarMenu(botao); break;
  }
});

function iniciar() {
  const paginaAtual = window.location.pathname.split("/").pop() || "index.html";
  const topo = document.getElementById("topo");
  const rodape = document.getElementById("rodape");

  document.body.insertAdjacentHTML("beforeend", SPRITE);
  if (topo) { topo.innerHTML = montarTopo() + montarCabecalho(paginaAtual); }
  if (rodape) { rodape.className = "rodape"; rodape.innerHTML = montarRodape(); }

  const fonteSalva = Number(lerPreferencia("viva-fonte"));
  if (Number.isInteger(fonteSalva) && fonteSalva >= 0 && fonteSalva < NIVEIS_FONTE.length) {
    nivelFonte = fonteSalva;
    aplicarFonte();
  }
  if (lerPreferencia("viva-contraste") === "1") { aplicarContraste(true); }
}

iniciar();