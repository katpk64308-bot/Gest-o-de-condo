const pagina = {
    visaogeral: `
        <section class="painel">
            <header class="cabecalho">
                <h1>Gestão do Condomínio</h1>
                <button class="secundario" onclick="trocarABA('pagamentos')">Pagamentos</button>
            </header>
            ${menu()}
            <h2>Bem-vindo ao painel</h2>
            <p>Use o menu para acompanhar as informações do condomínio.</p>
        </section>
    `
};

const modulos = {
    blocos: {
        titulo: "Blocos", singular: "bloco", api: "blocos",
        campos: [{ id: "descricao", label: "Descrição", obrigatorio: true }, { id: "quantidade", label: "Quantidade de apartamentos", tipo: "number", obrigatorio: true }]
    },
    apartamento: {
        titulo: "Apartamentos", singular: "apartamento", api: "apartamentos",
        campos: [{ id: "numero", label: "Número", obrigatorio: true }, { id: "bloco_id", label: "Bloco", obrigatorio: true, relacao: "blocos", exibicao: "bloco" }]
    },
    moradores: {
        titulo: "Moradores", singular: "morador", api: "moradores",
        campos: [{ id: "nome", label: "Nome", obrigatorio: true }, { id: "cpf", label: "CPF" }, { id: "telefone", label: "Telefone" }, { id: "apartamento_id", label: "Apartamento", obrigatorio: true, relacao: "apartamento", exibicao: "unidade" }, { id: "email", label: "E-mail", tipo: "email" }]
    },
    referencias: {
        titulo: "Referências de pagamento", singular: "referência", api: "referencias",
        campos: [{ id: "mes_ano", label: "Mês/Ano", tipo: "month", obrigatorio: true }, { id: "valor", label: "Valor", tipo: "number", obrigatorio: true }, { id: "vencimento", label: "Vencimento", tipo: "date", obrigatorio: true }]
    },
    pagamentos: {
        titulo: "Pagamentos", singular: "pagamento", api: "pagamentos",
        campos: [{ id: "referencia_id", label: "Mês/Ano de referência", obrigatorio: true, relacao: "referencias", exibicao: "referencia" }, { id: "apartamento_id", label: "Apartamento", obrigatorio: true, relacao: "apartamento", exibicao: "unidade" }, { id: "data_pagamento", label: "Data do pagamento", tipo: "date", obrigatorio: true }, { id: "valor", label: "Valor", exibicao: "valor", somenteLeitura: true }, { id: "vencimento", label: "Vencimento", exibicao: "vencimento", somenteLeitura: true }]
    },
    tiposManutencao: {
        titulo: "Tipos de manutenção", singular: "tipo de manutenção", api: "tiposManutencao",
        campos: [{ id: "descricao", label: "Descrição", obrigatorio: true }]
    },
    manutencao: {
        titulo: "Manutenção", singular: "manutenção", api: "manutencao",
        campos: [{ id: "tipo_id", label: "Tipo de manutenção", obrigatorio: true, relacao: "tiposManutencao", exibicao: "tipo" }, { id: "data", label: "Data", tipo: "date", obrigatorio: true }, { id: "local", label: "Local", obrigatorio: true }, { id: "descricao", label: "Descrição" }]
    },
    comunicados: {
        titulo: "Comunicados", singular: "comunicado", api: "comunicados",
        campos: [{ id: "titulo", label: "Título", obrigatorio: true }, { id: "mensagem", label: "Mensagem", obrigatorio: true }]
    }
};

const registros = { blocos: [], apartamento: [], moradores: [], referencias: [], pagamentos: [], tiposManutencao: [], manutencao: [], comunicados: [] };
const dependencias = { apartamento: ["blocos"], moradores: ["apartamento"], pagamentos: ["referencias", "apartamento", "moradores"], manutencao: ["tiposManutencao"] };
let paginaAtual = "visaogeral";

function menu() {
    return `
        <nav class="acoes" aria-label="Menu do condomínio">
            <button onclick="trocarABA('visaogeral')">Visão geral</button>
            <button onclick="trocarABA('blocos')">Blocos</button>
            <button onclick="trocarABA('apartamento')">Apartamentos</button>
            <button onclick="trocarABA('moradores')">Moradores</button>
            <button onclick="trocarABA('referencias')">Referências</button>
            <button onclick="trocarABA('pagamentos')">Pagamentos</button>
            <button onclick="trocarABA('tiposManutencao')">Tipos de manutenção</button>
            <button onclick="trocarABA('manutencao')">Manutenção</button>
            <button onclick="trocarABA('comunicados')">Comunicados</button>
        </nav>
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
        conteudo.innerHTML = pagina[nomePagina];
        return;
    }
    const modulo = modulos[nomePagina];
    if (!modulo) return;
    conteudo.innerHTML = `<section class="painel"><header class="cabecalho"><h1>${modulo.titulo}</h1><button class="secundario" onclick="trocarABA('visaogeral')">Voltar</button></header>${menu()}<p>Carregando dados...</p></section>`;
    try {
        registros[nomePagina] = await requisicao(`/api/${modulo.api}`);
        for (const dependencia of dependencias[nomePagina] || []) {
            const api = modulos[dependencia].api;
            registros[dependencia] = await requisicao(`/api/${api}`);
        }
        if (nomePagina === "pagamentos") registros.referencias = await requisicao("/api/referencias");
        if (paginaAtual === nomePagina) renderizarModulo(nomePagina);
    } catch (erro) {
        if (paginaAtual === nomePagina) conteudo.innerHTML = `<section class="painel"><header class="cabecalho"><h1>${modulo.titulo}</h1><button class="secundario" onclick="trocarABA('visaogeral')">Voltar</button></header>${menu()}<p class="mensagem erro">${escaparHTML(erro.message)} Confira o servidor e o banco de dados.</p><button onclick="trocarABA('${nomePagina}')">Tentar novamente</button></section>`;
    }
}

function escaparHTML(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caractere => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[caractere]);
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
            <header class="cabecalho"><h1>${modulo.titulo}</h1><button class="secundario" onclick="trocarABA('visaogeral')">Voltar</button></header>
            ${menu()}
            <form id="form${chave}" class="formulario-usuario">
                <h2 id="tituloFormulario">Cadastrar ${modulo.singular}</h2>
                ${campos.map(campo => `<label for="campo_${campo.id}">${campo.label}</label>${campoHTML(campo)}`).join("")}
                <button id="botaoSalvar" type="submit">Salvar</button>
                <button id="botaoCancelar" class="secundario oculto" type="button" onclick="cancelarEdicao('${chave}')">Cancelar</button>
                <p id="mensagemFormulario" class="mensagem" aria-live="polite"></p>
            </form>
            <label for="pesquisa${chave}">Pesquisar ${modulo.titulo.toLowerCase()}</label>
            <input id="pesquisa${chave}" placeholder="Digite para pesquisar">
            <div id="lista${chave}"></div>
        </section>
    `;
    document.getElementById(`form${chave}`).addEventListener("submit", evento => salvarRegistro(evento, chave));
    document.getElementById(`pesquisa${chave}`).addEventListener("input", () => atualizarLista(chave));
    if (chave === "pagamentos") {
        document.getElementById("campo_referencia_id").addEventListener("change", mostrarDetalhesPagamento);
        document.getElementById("campo_apartamento_id").addEventListener("change", mostrarDetalhesPagamento);
    }
    atualizarLista(chave);
}

function mostrarDetalhesPagamento() {
    const referencia = registros.referencias.find(item => String(item.id) === document.getElementById("campo_referencia_id").value);
    const apartamento = registros.apartamento.find(item => String(item.id) === document.getElementById("campo_apartamento_id").value);
    const morador = apartamento && registros.moradores.find(item => String(item.apartamento_id) === String(apartamento.id));
    const mensagem = document.getElementById("mensagemFormulario");
    if (!mensagem) return;
    const detalhes = [];
    if (morador) detalhes.push(`Morador: ${morador.nome} | CPF: ${morador.cpf || "—"} | Telefone: ${morador.telefone || "—"}`);
    if (referencia) detalhes.push(`Valor: R$ ${Number(referencia.valor).toFixed(2).replace(".", ",")} | Vencimento: ${referencia.vencimento}`);
    mensagem.textContent = detalhes.join(" · ");
}

async function salvarRegistro(evento, chave) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const modulo = modulos[chave];
    const item = Object.fromEntries(new FormData(formulario).entries());
    const id = formulario.dataset.id;
    try {
        await requisicao(`/api/${modulo.api}${id ? `/${encodeURIComponent(id)}` : ""}`, {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(item)
        });
        alert("Dados salvos com sucesso.");
        await trocarABA(chave);
    } catch (erro) {
        const mensagem = document.getElementById("mensagemFormulario");
        if (mensagem) {
            mensagem.textContent = erro.message;
            mensagem.className = "mensagem erro";
        } else alert(erro.message);
    }
}

function atualizarLista(chave) {
    const modulo = modulos[chave];
    const alvo = document.getElementById(`lista${chave}`);
    if (!alvo) return;
    const pesquisa = document.getElementById(`pesquisa${chave}`).value.toLocaleLowerCase("pt-BR");
    const itens = registros[chave].filter(item => Object.values(item).some(valor => String(valor ?? "").toLocaleLowerCase("pt-BR").includes(pesquisa)));
    if (!itens.length) {
        alvo.innerHTML = `<p>Nenhum ${modulo.singular} cadastrado.</p>`;
        return;
    }
    alvo.innerHTML = itens.map(item => `
        <article class="usuario">
            <div>${modulo.campos.map(campo => `<strong>${escaparHTML(campo.label)}: ${escaparHTML(rotuloCampo(campo, item))}</strong>`).join("<br>")}</div>
            <div class="acoes">
                <button type="button" onclick="consultarRegistro('${chave}', ${Number(item.id)})">Consultar</button>
                <button type="button" onclick="editarRegistro('${chave}', ${Number(item.id)})">Alterar</button>
                <button type="button" class="perigo" onclick="excluirRegistro('${chave}', ${Number(item.id)})">Excluir</button>
            </div>
        </article>
    `).join("");
}

function rotuloCampo(campo, item) {
    const valor = item[campo.exibicao || campo.id];
    if (campo.id === "valor" && valor !== undefined) return `R$ ${Number(valor).toFixed(2).replace(".", ",")}`;
    return valor || "—";
}

function consultarRegistro(chave, id) {
    const item = registros[chave].find(registro => Number(registro.id) === id);
    const modulo = modulos[chave];
    alert(modulo.campos.map(campo => `${campo.label}: ${rotuloCampo(campo, item)}`).join("\n"));
}

function editarRegistro(chave, id) {
    const item = registros[chave].find(registro => Number(registro.id) === id);
    const formulario = document.getElementById(`form${chave}`);
    formulario.dataset.id = id;
    document.getElementById("tituloFormulario").textContent = `Alterar ${modulos[chave].singular}`;
    document.getElementById("botaoSalvar").textContent = "Salvar alterações";
    document.getElementById("botaoCancelar").classList.remove("oculto");
    modulos[chave].campos.filter(campo => !campo.somenteLeitura).forEach(campo => {
        const entrada = document.getElementById(`campo_${campo.id}`);
        if (entrada) entrada.value = item[campo.id] ?? "";
    });
    if (chave === "pagamentos") mostrarDetalhesPagamento();
    formulario.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelarEdicao(chave) {
    renderizarModulo(chave);
}

async function excluirRegistro(chave, id) {
    if (!confirm(`Deseja excluir este ${modulos[chave].singular}?`)) return;
    try {
        await requisicao(`/api/${modulos[chave].api}/${id}`, { method: "DELETE" });
        await trocarABA(chave);
    } catch (erro) { alert(erro.message); }
}

trocarABA("visaogeral");
