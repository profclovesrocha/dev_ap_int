// VIVA — validação do formulário de registro

const formulario = document.getElementById("form-registro");
const mensagemSucesso = document.getElementById("mensagem-sucesso");
const campos = [
  document.getElementById("bairro"),
  document.getElementById("categoria"),
  document.getElementById("descricao")
];

function mostrarErro(campo, mensagem) {
  document.getElementById("erro-" + campo.id).textContent = mensagem;
  campo.setAttribute("aria-invalid", "true");
}

function limparErro(campo) {
  document.getElementById("erro-" + campo.id).textContent = "";
  campo.removeAttribute("aria-invalid");
}

// Procura sinais de telefone ou e-mail no texto, para proteger a privacidade
function temDadoPessoal(texto) {
  const semSeparadores = texto.replace(/[\s.\-()]/g, "");
  return /\d{8,}/.test(semSeparadores) || texto.includes("@");
}

function validarCampo(campo) {
  const valor = campo.value.trim();
  limparErro(campo);

  if (campo.id === "bairro" && valor.length < 3) {
    mostrarErro(campo, "Informe o bairro, com pelo menos 3 letras.");
    return false;
  }

  if (campo.id === "categoria" && valor === "") {
    mostrarErro(campo, "Escolha o tipo de problema.");
    return false;
  }

  if (campo.id === "descricao") {
    if (valor.length < 20) {
      mostrarErro(campo, "Descreva o problema com pelo menos 20 letras.");
      return false;
    }
    if (temDadoPessoal(valor)) {
      mostrarErro(campo, "Parece haver telefone ou e-mail no texto. Remova para proteger a sua privacidade.");
      return false;
    }
  }

  return true;
}

campos.forEach(function (campo) {
  campo.addEventListener("blur", function () {
    validarCampo(campo);
  });
});

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
  mensagemSucesso.textContent = "";

  let primeiroInvalido = null;
  campos.forEach(function (campo) {
    if (!validarCampo(campo) && primeiroInvalido === null) {
      primeiroInvalido = campo;
    }
  });

  if (primeiroInvalido !== null) {
    primeiroInvalido.focus();
    return;
  }

  // O envio ao servidor será feito na etapa do backend.
  mensagemSucesso.textContent = "Dados válidos. O envio ao servidor será implementado na etapa do backend.";
  formulario.reset();
});