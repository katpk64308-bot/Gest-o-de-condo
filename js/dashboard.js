const pagina = { visaogeral: true };

const modulos = {
  blocos: {
    titulo: "Blocos",
    singular: "bloco",
    api: "blocos",
    campos: [
      { id: "descricao", label: "Descrição", obrigatorio: true },
      { id: "quantidade", label: "Quantidade de apartamentos", tipo: "number", obrigatorio: true }
    ]
  },
  apartamento: {
    titulo: "Apartamentos",
    singular: "apartamento",
    api: "apartamentos",
    campos: [
      { id: "numero", label: "Número", obrigatorio: true },
      { id: "bloco_id", label: "Bloco", obrigatorio: true, relacao: "blocos", exibicao: "bloco" }
    ]
  },
  moradores: {
    titulo: "Moradores",
    singular: "morador",
    api: "moradores",
    campos: [
      { id: "nome", label: "Nome", obrigatorio: true },
      { id: "cpf", label: "CPF" },
      { id: "telefone", label: "Telefone" },
      { id: "apartamento_id", label: "Apartamento", obrigatorio: true, relacao: "apartamento", exibicao: "unidade" },
      { id: "email", label: "E-mail", tipo: "email" }
    ]
  },
  referencias: {
    titulo: "Referências de pagamento",
    singular: "referência",
    api: "referencias",
    campos: [
      { id: "mes_ano", label: "Mês/Ano", tipo: "month", obrigatorio: true },
      { id: "valor", label: "Valor", tipo: "number", obrigatorio: true },
      { id: "vencimento", label: "Vencimento", tipo: "date", obrigatorio: true }
    ]
  },
  pagamentos: {
    titulo: "Pagamentos",
    singular: "pagamento",
    api: "pagamentos",
    campos: [
      { id: "referencia_id", label: "Mês/Ano de referência", obrigatorio: true, relacao: "referencias", exibicao: "referencia" },
      { id: "apartamento_id", label: "Apartamento", obrigatorio: true, relacao: "apartamento", exibicao: "unidade" },
      { id: "data_pagamento", label: "Data do pagamento", tipo: "date", obrigatorio: true },
      { id: "valor", label: "Valor", exibicao: "valor", somenteLeitura: true },
      { id: "vencimento", label: "Vencimento", exibicao: "vencimento", somenteLeitura: true }
    ]
  },
  tiposManutencao: {
    titulo: "Tipos de manutenção",
    singular: "tipo de manutenção",
    api: "tiposManutencao",
    campos: [
      { id: "descricao", label: "Descrição", obrigatorio: true }
    ]
  },
  manutencao: {
    titulo: "Manutenção",
    singular: "manutenção",
    api: "manutencao",
    campos: [
      { id: "tipo_id", label: "Tipo de manutenção", obrigatorio: true, relacao: "tiposManutencao", exibicao: "tipo" },
      { id: "data", label: "Data", tipo: "date", obrigatorio: true },
      { id: "local", label: "Local", obrigatorio: true },
      { id: "descricao", label: "Descrição" }
    ]
  },
  comunicados: {
    titulo: "Comunicados",
    singular: "comunicado",
    api: "comunicados",
    campos: [
      { id: "titulo", label: "Título", obrigatorio: true },
      { id: "mensagem", label: "Mensagem", obrigatorio: true }
    ]
  }
};

const registros = { 
  blocos: [], 
  apartamento: [], 
  moradores: [], 
  referencias: [], 
  pagamentos: [], 
  tiposManutencao: [], 
  manutencao: [], 
  comunicados: [] 
};

const dependencias = { 
  apartamento: ["blocos"], 
  moradores: ["apartamento"], 
  pagamentos: ["referencias", "apartamento", "moradores"], 
  manutencao: ["tiposManutencao"] 
};

let paginaAtual = "visaogeral";

function menu() {
  const itens = [
    ["visaogeral", "⌂", "Visão geral"], 
    ["blocos", "▦", "Blocos"], 
    ["apartamento", "▦", "Apartamentos"], 
    ["moradores", "♟", "Moradores"], 
    ["referencias", "⛓", "Referências"], 
    ["pagamentos", "▣", "Pagamentos"], 
    ["tiposManutencao", "🔧", "Tipos de manutenção"], 
    ["manutencao", "⚒", "Manutenção"], 
    ["comunicados", "⚑", "Comunicados"]
  ];

  return `
    <header class="barra-superior">
      <a class="marca" href="#" onclick="trocarABA('visaogeral'); return false">
        <span class="marca-icone">⌂</span>
        <span><strong>Condomínio</strong><small>Gestão e Organização</small></span>
      </a>
      <nav class="acoes" aria-label="Menu do condomínio">
        ${itens.map(([id, icone, titulo]) => `
          <button class="${paginaAtual === id ? "ativo" : ""}" aria-current="${paginaAtual === id ? "page" : "false"}" onclick="trocarABA('${id}')">
            <span aria-hidden="true">${icone}</span>${titulo}
          </button>
        `).join("")}
      </nav>
      <span class="avatar" aria-hidden="true">♟</span>
    </header>
  `;
}

function renderizarVisaoGeral() {
  document.getElementById("conteudo").innerHTML = `
    ${menu()}
    <main class="visao-geral">
      <section class="boas-vindas">
        <p class="sobretitulo">GESTÃO DO CONDOMÍNIO</p>
      </section>
      <section class="atalhos" aria-label="Acesso rápido">
        <button class="atalho" onclick="trocarABA('blocos')"><span>▦</span><strong>Blocos</strong><small>Organize os blocos</small></button>
        <button class="atalho" onclick="trocarABA('apartamento')"><span>⌂</span><strong>Apartamentos</strong><small>Consulte as unidades</small></button>
        <button class="atalho" onclick="trocarABA('moradores')"><span>♟</span><strong>Moradores</strong><small>Cadastre e consulte moradores</small></button>
        <button class="atalho" onclick="trocarABA('pagamentos')"><span>▣</span><strong>Pagamentos</strong><small>Acompanhe as cobranças</small></button>
      </section>
    </main>
  `;
}

async function requisicao(url, opcoes = {}) {
  const resposta = await fetch(url, { headers: { "Content-Type": "application/json" }, ...opcoes });
  const resultado = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(resultado.erro || "Não foi possível concluir a operação.");
  return resultado;
}

async function trocarABA(nomePagina) {
  paginaAtual = nomePagina;
  const conteudo = document.getElementById("conteudo");
  if (!conteudo) return;
  if (pagina[nomePagina]) {
    renderizarVisaoGeral();
    return;
  }
  const modulo = modulos[nomePagina];
  if (!modulo) return;
  conteudo.innerHTML = `
    <section class="painel">
      <header class="cabecalho">
        <h1>${modulo.titulo}</h1>
        <button class="secundario" onclick="trocarABA('visaogeral')">Voltar</button>
      </header>
      ${menu()}
      <p>Carregando dados...</p>
    </section>
  `;
  try {
    registros[nomePagina] = await requisicao(`/api/${modulo.api}`);
    for (const dependencia of dependencias[nomePagina] || []) {
      const api = modulos[dependencia].api;
      registros[dependencia] = await requisicao(`/api/${api}`);
    }
    if (nomePagina === "pagamentos") registros.referencias = await requisicao("/api/referencias");
    if (paginaAtual === nomePagina) renderizarModulo(nomePagina);
  } catch (erro) {
    if (paginaAtual === nomePagina) {
      conteudo.innerHTML = `
        <section class="painel">
          <header class="cabecalho">
            <h1>${modulo.titulo}</h1>
            <button class="secundario" onclick="trocarABA('visaogeral')">Voltar</button>
          </header>
          ${menu()}
          <p class="mensagem erro">${escaparHTML(erro.message)} Confira o servidor e o banco de dados.</p>
          <button onclick="trocarABA('${nomePagina}')">Tentar novamente</button>
        </section>
      `;
    }
  }
}

function escaparHTML(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, caractere => ({ 
    "&": "&amp;", 
    "<": "&lt;", 
    ">": "&gt;", 
    '"': "&quot;", 
    "'": "'" 
  })[caractere]);
}

function campoHTML(campo) {
  if (campo.relacao) {
    const opcoes = registros[campo.relacao].map(item => {
      const texto = campo.relacao === "referencias"
        ? `${item.mes_ano} — R$ ${item.valor} (vence ${item.vencimento})`
        : campo.relacao === "apartamento"
          ? `${item.numero}${item.bloco ? ` — Bloco ${item.bloco}` : ""}`
          : campo.relacao === "blocos" || campo.relacao === "tiposManutencao"
            ? item.descricao
            : item[campo.exibicao];
      return `<option value="${escaparHTML(item.id)}">${escaparHTML(texto)}</option>`;
    }).join("");
    return `<select id="campo_${campo.id}" name="${campo.id}" ${campo.obrigatorio ? "required" : ""}><option value="">Selecione</option>${opcoes}</select>`;
  }
  return `<input id="campo_${campo.id}" name="${campo.id}" type="${campo.tipo || "text"}" ${campo.obrigatorio ? "required" : ""} ${campo.id === "valor" ? 'min="0.01" step="0.01"' : campo.tipo === "number" ? 'min="1" step="1"' : ""}>`;
}

function renderizarModulo(chave) {
  const modulo = modulos[chave];
  const campos = modulo.campos.filter(campo => !campo.somenteLeitura);
  
  document.getElementById("conteudo").innerHTML = `
    <section class="painel">
      ${menu()}
      <header class="cabecalho">
        <h1>${modulo.titulo}</h1>
        <button class="secundario" onclick="trocarABA('visaogeral')">Voltar</button>
      </header>
      <form class="formulario-usuario" id="form_${chave}" onsubmit="salvarRegistro('${chave}', event)">
        <h2>Novo ${modulo.singular}</h2>
        ${campos.map(campo => `
          <label for="campo_${campo.id}">${campo.label}</label>${campoHTML(campo)}
        `).join("")}
        <button type="submit" id="botaoSalvar">Salvar</button>
      </form>
      <div id="lista_${chave}">
        <p>Carregando listagem...</p>
      </div>
    </section>
  `;
  listarRegistros(chave);
}
async function listarRegistros(chave) {
  const lista = document.getElementById(`lista_${chave}`);
  if (!lista) return;
  try {
    const itens = registros[chave] || [];
    const modulo = modulos[chave];
    lista.innerHTML = itens.length ? itens.map(item => `<article class="usuario"><div>${modulo.campos.map(campo => {
      let valor = item[campo.exibicao || campo.id];
      if (campo.relacao === "apartamento" && item.unidade) valor = `${item.unidade}${item.bloco ? ` — Bloco ${item.bloco}` : ""}`;
      if (campo.relacao === "referencias" && item.referencia) valor = item.referencia;
      if (campo.relacao === "tiposManutencao" && item.tipo) valor = item.tipo;
      return `<div><strong>${escaparHTML(campo.label)}:</strong> ${escaparHTML(valor || "—")}</div>`;
    }).join("")}</div><div class="acoes"><button class="perigo" type="button" onclick="excluirRegistro('${chave}', ${Number(item.id)})">Excluir</button></div></article>`).join("") : "<p>Nenhum registro cadastrado.</p>";
  } catch (erro) {
    lista.innerHTML = `<p class="mensagem erro">${escaparHTML(erro.message)}</p>`;
  }
}

async function salvarRegistro(chave, evento) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  const botao = formulario.querySelector("[type=submit]");
  botao.disabled = true;
  try {
    const dados = Object.fromEntries(new FormData(formulario).entries());
    await requisicao(`/api/${modulos[chave].api}`, { method: "POST", body: JSON.stringify(dados) });
    formulario.reset();
    registros[chave] = await requisicao(`/api/${modulos[chave].api}`);
    listarRegistros(chave);
  } catch (erro) {
    alert(erro.message);
  } finally {
    botao.disabled = false;
  }
}

async function excluirRegistro(chave, id) {
  try {
    await requisicao(`/api/${modulos[chave].api}/${id}`, { method: "DELETE" });
    registros[chave] = await requisicao(`/api/${modulos[chave].api}`);
    listarRegistros(chave);
  } catch (erro) {
    alert(erro.message);
  }
}
trocarABA('visaogeral');



