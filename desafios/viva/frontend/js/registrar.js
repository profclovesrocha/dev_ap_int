
// VIVA — registro urbano, validação, ViaCEP e etapas

const formulario = document.getElementById("form-registro");

const campoBairro = document.getElementById("bairro");
const campoCategoria = document.getElementById("categoria");
const campoDescricao = document.getElementById("descricao");
const campoCiencia = document.getElementById("ciencia");

const campoCep = document.getElementById("cep");
const botaoBuscarCep = document.getElementById("buscar-cep");
const mensagemCep = document.getElementById("mensagem-cep");

const contador = document.getElementById("contador-descricao");

const campos = [
  campoCategoria,
  campoBairro,
  campoDescricao,
  campoCiencia
];

let etapaAtual = 1;
let consultaEmAndamento = false;

// 1. Validação dos campos

function mostrarErro(campo, mensagem) {
  document.getElementById("erro-" + campo.id).textContent = mensagem;
  campo.setAttribute("aria-invalid", "true");
}

function limparErro(campo) {
  document.getElementById("erro-" + campo.id).textContent = "";
  campo.removeAttribute("aria-invalid");
}

// Identifica possíveis telefones ou e-mails.
// É uma proteção básica, não uma garantia de anonimato.

function temDadoPessoal(texto) {
  const semSeparadores = texto.replace(/[\s.\-()]/g, "");

  return /\d{8,}/.test(semSeparadores) || texto.includes("@");
}

function validarCampo(campo) {
  const valor = campo.value.trim();

  limparErro(campo);

  if (campo.id === "bairro") {
    if (valor.length < 3) {
      mostrarErro(campo, "Informe o bairro com pelo menos 3 caracteres.");
      return false;
    }
        if (valor.length > 60) {
      mostrarErro(campo, "O nome do bairro deve ter até 60 caracteres.");
      return false;
    }

    if (temDadoPessoal(valor)) {
      mostrarErro(campo, "Informe somente o nome do bairro.");
      return false;
    }
  }

  if (campo.id === "categoria" && valor === "") {
    mostrarErro(campo, "Escolha o tipo de problema.");
    return false;
  }

  if (campo.id === "descricao") {
    if (valor.length < 20) {
      mostrarErro(campo, "Descreva o problema com pelo menos 20 caracteres.");
      return false;
    }

    if (valor.length > 500) {
      mostrarErro(campo, "A descrição deve ter até 500 caracteres.");
      return false;
    }

    if (temDadoPessoal(valor)) {
      mostrarErro(
        campo,
        "Remova possíveis telefones ou e-mails para proteger sua privacidade."
      );
      return false;
    }
  }

  if (campo.id === "ciencia" && !campo.checked) {
    mostrarErro(campo, "Confirme que está ciente da finalidade acadêmica.");
    return false;
  }

  return true;
}

function validarFormulario() {
  let primeiroInvalido = null;

  campos.forEach(function (campo) {
    if (!validarCampo(campo) && primeiroInvalido === null) {
      primeiroInvalido = campo;
    }
  });

  if (primeiroInvalido !== null) {
    primeiroInvalido.focus();
    return false;
  }

  return true;
}

campos.forEach(function (campo) {
  const evento = campo.type === "checkbox" ? "change" : "blur";

  campo.addEventListener(evento, function () {
    validarCampo(campo);
  });
});

// 2. Contador de caracteres

function atualizarContador() {
  contador.textContent =
    campoDescricao.value.length + "/500 caracteres";
}

campoDescricao.addEventListener("input", atualizarContador);

// 3. Integração ViaCEP

campoCep.addEventListener("input", function () {
  let cep = campoCep.value.replace(/\D/g, "").slice(0, 8);

  if (cep.length > 5) {
    cep = cep.slice(0, 5) + "-" + cep.slice(5);
  }

  campoCep.value = cep;
  mensagemCep.textContent = "";
});

async function buscarCep() {
  if (consultaEmAndamento) {
    return;
  }

  const cep = campoCep.value.replace(/\D/g, "");

  if (cep.length !== 8) {
    mensagemCep.textContent = "Informe um CEP válido com 8 números.";
    campoCep.focus();
    return;
  }

  consultaEmAndamento = true;

  botaoBuscarCep.disabled = true;
  campoCep.disabled = true;

  mensagemCep.textContent = "Consultando CEP...";

  try {
    const resposta = await fetch(
      `https://viacep.com.br/ws/${cep}/json/`
    );

    if (!resposta.ok) {
      throw new Error("Falha na consulta.");
    }

    const dados = await resposta.json();

    // Ignora a resposta se o formulário tiver sido limpo
    // ou se o CEP tiver mudado durante a consulta.

    if (campoCep.value.replace(/\D/g, "") !== cep) {
      return;
    }

    if (dados.erro) {
      mensagemCep.textContent = "CEP não encontrado.";
      return;
    }

    if (dados.localidade !== "Recife" || dados.uf !== "PE") {
      mensagemCep.textContent =
        "O VIVA atende atualmente à cidade do Recife.";
      return;
    }

    if (!dados.bairro) {
      mensagemCep.textContent =
        "Bairro não encontrado. Preencha manualmente.";
      return;
    }

    campoBairro.value = dados.bairro;

    limparErro(campoBairro);

    mensagemCep.textContent = "Bairro localizado com sucesso!";

  } catch (erro) {
    mensagemCep.textContent =
      "Não foi possível consultar o CEP. Informe o bairro manualmente.";

  } finally {
    consultaEmAndamento = false;

    botaoBuscarCep.disabled = false;
    campoCep.disabled = false;
  }
}

botaoBuscarCep.addEventListener("click", buscarCep);

// Evita avançar o formulário ao pressionar Enter no CEP.

campoCep.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    evento.preventDefault();
    buscarCep();
  }
});

// 4. Controle das etapas

function mostrarEtapa(numero) {
  etapaAtual = numero;

  document.querySelectorAll(".registro-etapa").forEach(
    function (secao, indice) {
      secao.hidden = indice + 1 !== numero;
    }
  );

  document.querySelectorAll(".progresso__item").forEach(
    function (item, indice) {
      const etapa = indice + 1;

      item.classList.toggle("ativo", etapa === numero);
      item.classList.toggle("concluido", etapa < numero);

      if (etapa === numero) {
        item.setAttribute("aria-current", "step");
      } else {
        item.removeAttribute("aria-current");
      }

      item.querySelector(".progresso__numero").textContent =
        etapa < numero ? "✓" : String(etapa);
    }
  );

  const titulo = document.querySelector("#etapa-" + numero + " h2");

  titulo.focus();
}

// 5. Revisão das informações

function preencherRevisao() {
  document.getElementById("revisao-categoria").textContent =
    campoCategoria.options[campoCategoria.selectedIndex].text;

  document.getElementById("revisao-bairro").textContent =
    campoBairro.value.trim();

  document.getElementById("revisao-descricao").textContent =
    campoDescricao.value.trim();
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  if (consultaEmAndamento) {
    mensagemCep.textContent = "Aguarde a conclusão da consulta.";
    return;
  }

  if (!validarFormulario()) {
    return;
  }

  preencherRevisao();
  mostrarEtapa(2);
});

// 6. Voltar para edição

document.getElementById("voltar-editar").addEventListener(
  "click",
  function () {
    mostrarEtapa(1);
  }
);

// 7. Envio do registro ao servidor

const botaoConfirmar = document.getElementById("confirmar-registro");
const botaoVoltar = document.getElementById("voltar-editar");
const mensagemEnvio = document.getElementById("mensagem-envio");
const mensagemCopia = document.getElementById("mensagem-copia");

let envioEmAndamento = false;

function alternarEnvio(enviando) {
  envioEmAndamento = enviando;

  botaoConfirmar.disabled = enviando;
  botaoVoltar.disabled = enviando;
  botaoConfirmar.textContent = enviando ? "Enviando..." : "Confirmar registro";
}

// Lê os dados do formulário. Deve ser chamada ANTES de limpá-lo.
function montarRegistro() {
  return {
    categoria: campoCategoria.value,
    bairro: campoBairro.value.trim(),
    descricao: campoDescricao.value.trim(),
    ciencia: campoCiencia.checked
  };
}

// Se o servidor recusar algum campo, volta à etapa 1 mostrando os erros
function mostrarErrosDoServidor(detalhes) {
  mostrarEtapa(1);

  campos.forEach(function (campo) {
    if (detalhes[campo.id]) {
      mostrarErro(campo, detalhes[campo.id]);
    }
  });
}

botaoConfirmar.addEventListener("click", async function () {
  if (etapaAtual !== 2 || envioEmAndamento) {
    return;
  }

  const registro = montarRegistro();

  mensagemEnvio.textContent = "";
  alternarEnvio(true);

  try {
    const resposta = await fetch("/api/registros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registro)
    });

    const dados = await resposta.json();

    if (resposta.status === 400 && dados.detalhes) {
      mostrarErrosDoServidor(dados.detalhes);
      return;
    }

    if (!resposta.ok) {
      throw new Error("Falha no envio.");
    }

    document.getElementById("numero-protocolo").textContent = dados.protocolo;

    formulario.reset();

    document.getElementById("revisao-categoria").textContent = "";
    document.getElementById("revisao-bairro").textContent = "";
    document.getElementById("revisao-descricao").textContent = "";

    mostrarEtapa(3);

  } catch (erro) {
    mensagemEnvio.textContent =
      "Não foi possível enviar o registro agora. " +
      "Seus dados continuam preenchidos. Tente novamente em instantes.";

  } finally {
    alternarEnvio(false);
  }
});

// Copiar o protocolo (ele é a única forma de acompanhar o registro)

document.getElementById("copiar-protocolo").addEventListener(
  "click",
  async function () {
    const protocolo = document.getElementById("numero-protocolo").textContent;

    try {
      await navigator.clipboard.writeText(protocolo);
      mensagemCopia.textContent = "Protocolo copiado.";
    } catch (erro) {
      mensagemCopia.textContent =
        "Não foi possível copiar. Anote o protocolo manualmente.";
    }
  }
);

// Limpa as mensagens e o protocolo anterior ao recomeçar

formulario.addEventListener("reset", function () {
  mensagemEnvio.textContent = "";
});

document.getElementById("novo-registro").addEventListener(
  "click",
  function () {
    document.getElementById("numero-protocolo").textContent = "";
    mensagemCopia.textContent = "";
  }
);
// 8. Limpeza do formulário

formulario.addEventListener("reset", function () {
  campos.forEach(limparErro);

  mensagemCep.textContent = "";
  contador.textContent = "0/500 caracteres";
});

document.getElementById("novo-registro").addEventListener(
  "click",
  function () {
    formulario.reset();
    mostrarEtapa(1);
  }
);
