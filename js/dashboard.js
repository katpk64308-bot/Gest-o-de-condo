const dashboardData = {
    payments: [
        { unit: "Apto 101", resident: "Mariana Costa", amount: "R$ 685,00", due: "05/10/2026", status: "Pago" },
        { unit: "Apto 203", resident: "Rafael Mendes", amount: "R$ 685,00", due: "05/10/2026", status: "Pendente" },
        { unit: "Apto 304", resident: "Camila Oliveira", amount: "R$ 685,00", due: "05/10/2026", status: "Atrasado" },
        { unit: "Apto 402", resident: "Bruno Almeida", amount: "R$ 685,00", due: "05/10/2026", status: "Pago" }
    ],
    apartments: [
        { unit: "Apto 101", block: "Bloco A", resident: "Mariana Costa", area: "72 m²", status: "Ativo" },
        { unit: "Apto 203", block: "Bloco A", resident: "Rafael Mendes", area: "68 m²", status: "Ativo" },
        { unit: "Apto 304", block: "Bloco B", resident: "Camila Oliveira", area: "84 m²", status: "Ativo" },
        { unit: "Apto 402", block: "Bloco B", resident: "Bruno Almeida", area: "72 m²", status: "Ativo" }
    ],
    blocks: [
        { name: "Bloco A", apartments: "20", status: "Ativo" },
        { name: "Bloco B", apartments: "20", status: "Ativo" }
    ],
    residents: [
        { name: "Mariana Costa", unit: "Apto 101", email: "mariana@email.com", phone: "(43) 99912-3401", status: "Ativo" },
        { name: "Rafael Mendes", unit: "Apto 203", email: "rafael@email.com", phone: "(43) 99802-1176", status: "Ativo" },
        { name: "Camila Oliveira", unit: "Apto 304", email: "camila@email.com", phone: "(43) 99145-8872", status: "Ativo" },
        { name: "Bruno Almeida", unit: "Apto 402", email: "bruno@email.com", phone: "(43) 99930-6218", status: "Ativo" }
    ],
    maintenance: [
        { title: "Revisão do elevador", area: "Bloco A", responsible: "Elevatec Serviços", date: "02/10/2026", status: "Em andamento" },
        { title: "Iluminação da garagem", area: "Garagem", responsible: "Equipe predial", date: "04/10/2026", status: "Pendente" },
        { title: "Limpeza da caixa d'água", area: "Área técnica", responsible: "HidroClean", date: "28/09/2026", status: "Concluída" }
    ],
    maintenanceTypes: [
        { name: "Elevadores", description: "Inspeção e manutenção preventiva", frequency: "Mensal", status: "Ativo" },
        { name: "Piscina", description: "Limpeza e tratamento da água", frequency: "Semanal", status: "Ativo" },
        { name: "Caixa d'água", description: "Limpeza e higienização", frequency: "Semestral", status: "Ativo" }
    ]
};

const dashboardViews = {
    overview: { label: "Visão geral", icon: "⌂" },
    payments: { label: "Pagamentos", icon: "$" },
    apartments: { label: "Apartamentos", icon: "▦" },
    blocks: { label: "Blocos", icon: "▤" },
    residents: { label: "Moradores", icon: "♙" },
    maintenance: { label: "Manutenções", icon: "⚒" },
    maintenanceTypes: { label: "Tipos de manutenção", icon: "⚙" },
    notices: { label: "Comunicados", icon: "☷" }
};

let currentDashboardView = "overview";

const tableConfig = {
    payments: {
        title: "Pagamentos", description: "Acompanhe as cobranças e os pagamentos do condomínio.", action: "Registrar pagamento", columns: ["Unidade", "Morador", "Valor", "Vencimento", "Status"], fields: [
            ["unit", "Unidade", "text", "Apto 101"], ["resident", "Morador", "text", "Nome do morador"], ["amount", "Valor", "text", "R$ 0,00"], ["due", "Vencimento", "date"], ["status", "Status", "select", ["Pendente", "Pago", "Atrasado"]]
        ]
    },
    apartments: {
        title: "Apartamentos", description: "Unidades, blocos e ocupação do condomínio.", action: "Cadastrar apartamento", columns: ["Unidade", "Bloco", "Morador", "Área", "Status"], editable: true, fields: [
            ["unit", "Unidade", "text", "Apto 105"], ["block", "Bloco", "text", "Bloco A"], ["resident", "Morador responsável", "text", "Nome do morador"], ["area", "Área", "text", "70 m²"], ["status", "Status", "select", ["Ativo", "Inativa"]]
        ]
    },
    blocks: {
        title: "Blocos", description: "Cadastre e consulte os blocos do condomínio.", action: "Cadastrar bloco", columns: ["Bloco", "Apartamentos", "Status"], editable: true, fields: [
            ["name", "Nome do bloco", "text", "Ex.: Bloco A"], ["apartments", "Quantidade de apartamentos", "number"], ["status", "Status", "select", ["Ativo", "Inativo"]]
        ]
    },
    residents: {
        title: "Moradores", description: "Cadastro e contato dos moradores.", action: "Cadastrar morador", columns: ["Morador", "Unidade", "E-mail", "Telefone", "Status"], editable: true, fields: [
            ["name", "Nome completo", "text", "Nome do morador"], ["unit", "Unidade", "text", "Apto 105"], ["email", "E-mail", "email", "nome@email.com"], ["phone", "Telefone", "tel", "(00) 00000-0000"], ["status", "Status", "select", ["Ativo", "Inativo"]]
        ]
    },
    maintenance: {
        title: "Manutenções", description: "Solicitações, serviços e agenda de manutenção.", action: "Registrar manutenção", columns: ["Serviço", "Local", "Responsável", "Data", "Status"], fields: [
            ["title", "Serviço", "text", "Descreva o serviço"], ["area", "Local", "text", "Ex.: Bloco A"], ["responsible", "Responsável", "text", "Prestador ou equipe"], ["date", "Data", "date"], ["status", "Status", "select", ["Pendente", "Em andamento", "Concluída"]]
        ]
    },
    maintenanceTypes: {
        title: "Tipos de manutenção", description: "Organize as categorias de serviços do condomínio.", action: "Cadastrar tipo", columns: ["Tipo", "Descrição", "Frequência", "Status"], editable: true, fields: [
            ["name", "Tipo de manutenção", "text", "Ex.: Elevadores"], ["description", "Descrição", "text", "Descreva o serviço"], ["frequency", "Frequência", "text", "Ex.: Mensal"], ["status", "Status", "select", ["Ativo", "Inativo"]]
        ]
    }
};

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function abrirPainel() {
    document.getElementById("conteudo").innerHTML = `
        <div class="dashboard">
            <aside class="sidebar">
                <div class="brand"><span class="brand-mark">V</span><span><strong>Viver Bem</strong><small>Gestão condominial</small></span></div>
                <div class="nav-label">Menu principal</div>
                <nav class="nav-list" aria-label="Menu principal">
                    ${Object.entries(dashboardViews).map(([key, view]) => `<button class="nav-item ${key === currentDashboardView ? "active" : ""}" data-view="${key}"><span class="nav-symbol">${view.icon}</span>${view.label}</button>`).join("")}
                </nav>
                <div class="sidebar-bottom"><div class="building-chip"><small>CONDOMÍNIO</small><strong>Residencial Viver Bem</strong></div></div>
            </aside>
            <section class="main-area">
                <header class="topbar"><span class="crumb">Painel <span aria-hidden="true">/</span> <span id="breadcrumb">Visão geral</span></span><div class="top-actions"><button class="icon-button" type="button" aria-label="Notificações" title="Notificações">♧</button><div class="profile-wrap"><button class="profile-button" type="button" data-profile-toggle aria-expanded="false"><span class="avatar">LM</span><span><strong>Luiza Martins</strong><small>Síndica</small></span><span aria-hidden="true">⌄</span></button><div class="profile-menu" data-profile-menu hidden><button type="button" data-profile>Meu perfil</button><button type="button" data-logout>Sair da conta</button></div></div></div></header>
                <main class="page-content" id="dashboard-content"></main>
            </section>
        </div>`;
    renderDashboardView();
}

function renderDashboardView() {
    const container = document.getElementById("dashboard-content");
    if (!container) return;
    document.getElementById("breadcrumb").textContent = dashboardViews[currentDashboardView].label;
    document.querySelectorAll("[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === currentDashboardView));
    if (currentDashboardView === "overview") {
        container.innerHTML = renderOverview();
        return;
    }
    if (currentDashboardView === "notices") {
        container.innerHTML = renderNotices();
        return;
    }
    container.innerHTML = renderDataView(currentDashboardView);
}

function renderOverview() {
    return `
        <div class="page-heading"><div><h1>Bom dia, Luiza</h1><p>Acompanhe o que está acontecendo no seu condomínio.</p></div><button class="primary-button" data-view="payments">＋ Registrar pagamento</button></div>
        <section class="stat-grid" aria-label="Resumo do condomínio">
            ${statCard("Arrecadação do mês", "R$ 24.680", "↑ 8,2% em relação ao mês passado", "↗")}
            ${statCard("Pagamentos pendentes", "12", "4 vencem nos próximos 7 dias", "◷")}
            ${statCard("Apartamentos ocupados", "36 / 40", "90% de ocupação", "▦")}
            ${statCard("Manutenções abertas", "03", "1 serviço em andamento", "⚒")}
        </section>
        <section class="overview-grid">
            <article class="panel"><div class="panel-heading"><div><h2>Receitas e despesas</h2><p>Movimentação dos últimos 6 meses</p></div><select class="filter-select" aria-label="Período do gráfico"><option>Últimos 6 meses</option><option>Este ano</option></select></div><div class="chart-area" aria-label="Gráfico de receitas e despesas"><div class="chart-column"><div class="chart-bars"><i style="--bar:52%"></i><i style="--bar:36%"></i></div><span>Mai</span></div><div class="chart-column"><div class="chart-bars"><i style="--bar:64%"></i><i style="--bar:43%"></i></div><span>Jun</span></div><div class="chart-column"><div class="chart-bars"><i style="--bar:56%"></i><i style="--bar:47%"></i></div><span>Jul</span></div><div class="chart-column"><div class="chart-bars"><i style="--bar:78%"></i><i style="--bar:49%"></i></div><span>Ago</span></div><div class="chart-column"><div class="chart-bars"><i style="--bar:68%"></i><i style="--bar:53%"></i></div><span>Set</span></div><div class="chart-column"><div class="chart-bars"><i style="--bar:88%"></i><i style="--bar:57%"></i></div><span>Out</span></div></div></article>
            <article class="panel"><div class="panel-heading"><div><h2>Atividade recente</h2><p>Últimas movimentações</p></div></div><div class="activity-list">${dashboardData.payments.slice(0, 3).map((payment) => `<div class="activity-row"><div><strong>${escapeHtml(payment.resident)}</strong><small>${escapeHtml(payment.unit)} · ${escapeHtml(payment.due)}</small></div><span class="activity-amount">${escapeHtml(payment.amount)}</span></div>`).join("")}</div></article>
        </section>
        ${renderTablePanel("payments", "Pagamentos recentes", "Ver todos", true)}
    `;
}

function statCard(label, value, note, icon) {
    return `<article class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon}</span></div><div class="stat-value">${value}</div><div class="stat-note">${note}</div></article>`;
}

function renderDataView(viewKey) {
    const config = tableConfig[viewKey];
    return `<div class="page-heading"><div><h1>${config.title}</h1><p>${config.description}</p></div><button class="primary-button" data-add="${viewKey}">＋ ${config.action}</button></div>${renderTablePanel(viewKey, config.title, "", false)}`;
}

function renderTablePanel(viewKey, title, link, compact) {
    const config = tableConfig[viewKey];
    return `<section class="panel table-panel"><div class="panel-heading table-heading"><div><h2>${title}</h2>${compact ? "<p>Visão rápida das cobranças do mês</p>" : ""}</div><div class="table-tools"><input class="search-box" type="search" placeholder="Buscar ${config.title.toLowerCase()}..." aria-label="Buscar ${config.title.toLowerCase()}" data-search="${viewKey}">${link ? `<button class="subtle-link" data-view="payments">${link} →</button>` : ""}</div></div><div class="table-scroll"><table class="data-table"><thead><tr>${config.columns.map((column) => `<th>${column}</th>`).join("")}${config.editable ? "<th>Ações</th>" : ""}</tr></thead><tbody data-rows="${viewKey}">${renderRows(viewKey, dashboardData[viewKey])}</tbody></table></div></section>`;
}

function renderRows(viewKey, rows) {
    const config = tableConfig[viewKey];
    if (!rows.length) return `<tr><td class="empty-state" colspan="${config.columns.length + (config.editable ? 1 : 0)}">Nenhum registro encontrado.</td></tr>`;
    return rows.map((row) => {
        const cells = config.fields.map(([field]) => {
            const value = row[field] ?? "";
            return field === "status"
                ? `<td><span class="status status-${escapeHtml(value.toLowerCase().replaceAll(" ", "-"))}">${escapeHtml(value)}</span></td>`
                : `<td>${escapeHtml(value)}</td>`;
        }).join("");
        const rowIndex = dashboardData[viewKey].indexOf(row);
        const actions = config.editable
            ? `<td><div class="row-actions"><button class="row-action" type="button" data-edit="${viewKey}" data-index="${rowIndex}">Editar</button><button class="row-action danger-link" type="button" data-delete="${viewKey}" data-index="${rowIndex}">Excluir</button></div></td>`
            : "";
        return `<tr>${cells}${actions}</tr>`;
    }).join("");
}

function renderNotices() {
    const notices = [
        ["Assembleia de condomínio", "A próxima assembleia será realizada no salão de festas. A pauta inclui orçamento anual e melhorias nas áreas comuns.", "Publicado em 28/09/2026 · Administração"],
        ["Manutenção da piscina", "A piscina ficará fechada na manhã de sábado para limpeza e tratamento da água. A previsão de reabertura é às 14h.", "Publicado em 25/09/2026 · Zeladoria"],
        ["Atualização de cadastro", "Mantenha seus telefones e contatos de emergência atualizados com a administração do condomínio.", "Publicado em 20/09/2026 · Administração"],
        ["Coleta seletiva", "A coleta de recicláveis acontece às terças e quintas, a partir das 8h. Separe os materiais limpos antes do descarte.", "Publicado em 18/09/2026 · Administração"]
    ];
    return `<div class="page-heading"><div><h1>Comunicados</h1><p>Informações importantes para moradores e equipe.</p></div><button class="primary-button" data-notice>＋ Novo comunicado</button></div><section class="notice-grid">${notices.map(([title, body, date]) => `<article class="notice-card"><h2>${title}</h2><p>${body}</p><small>${date}</small></article>`).join("")}</section>`;
}

function openRecordModal(viewKey, recordIndex = null) {
    const config = tableConfig[viewKey];
    const record = recordIndex === null ? {} : dashboardData[viewKey][recordIndex];
    const fields = config.fields.map(([name, label, type, option]) => {
        const savedValue = record[name] ?? "";
        const value = type === "date" && savedValue.includes("/") ? savedValue.split("/").reverse().join("-") : savedValue;
        const control = type === "select"
            ? `<select name="${name}" required>${option.map((choice) => `<option value="${escapeHtml(choice)}" ${String(value) === choice ? "selected" : ""}>${escapeHtml(choice)}</option>`).join("")}</select>`
            : `<input name="${name}" type="${type}" value="${escapeHtml(value)}" ${option && type !== "select" ? `placeholder="${escapeHtml(option)}"` : ""} required>`;
        return `<div class="form-field"><label for="field-${name}">${label}</label>${control.replace(`name="${name}"`, `name="${name}" id="field-${name}"`)}</div>`;
    }).join("");
    const editing = recordIndex !== null;
    const title = editing ? `Editar ${config.title.toLowerCase()}` : config.action;
    const description = editing ? "Atualize os dados deste registro." : "Preencha os dados para incluir o registro.";
    document.body.insertAdjacentHTML("beforeend", `<div class="modal-backdrop" data-modal-backdrop><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-heading"><div><h2 id="modal-title">${title}</h2><p>${description}</p></div><button class="modal-close" type="button" data-close-modal aria-label="Fechar">×</button></div><form data-record-form="${viewKey}" data-record-index="${recordIndex ?? ""}"><div class="form-grid">${fields}</div><div class="modal-actions"><button class="cancel-button" type="button" data-close-modal>Cancelar</button><button class="primary-button" type="submit">${editing ? "Salvar alterações" : "Salvar cadastro"}</button></div></form></section></div>`);
    document.querySelector(".modal input, .modal select")?.focus();
}

document.addEventListener("click", (event) => {
    const navButton = event.target.closest("[data-view]");
    if (navButton) {
        currentDashboardView = navButton.dataset.view;
        renderDashboardView();
        return;
    }
    const editButton = event.target.closest("[data-edit]");
    if (editButton) {
        openRecordModal(editButton.dataset.edit, Number(editButton.dataset.index));
        return;
    }
    const deleteButton = event.target.closest("[data-delete]");
    if (deleteButton) {
        const { delete: viewKey, index } = deleteButton.dataset;
        if (window.confirm("Deseja excluir este registro?")) {
            dashboardData[viewKey].splice(Number(index), 1);
            renderDashboardView();
        }
        return;
    }
    const addButton = event.target.closest("[data-add]");
    if (addButton) openRecordModal(addButton.dataset.add);
    if (event.target.closest("[data-profile-toggle]")) {
        const menu = document.querySelector("[data-profile-menu]");
        menu.hidden = !menu.hidden;
        event.target.closest("[data-profile-toggle]").setAttribute("aria-expanded", String(!menu.hidden));
    }
    if (event.target.closest("[data-logout]")) {
        currentDashboardView = "overview";
        document.querySelector("[data-profile-menu]").hidden = true;
        trocarPagina("login");
    }
    if (event.target.closest("[data-profile]")) {
        document.querySelector("[data-profile-menu]").hidden = true;
        window.alert("Perfil de Luiza Martins · Síndica");
    }
    if (event.target.closest("[data-notice]")) window.alert("A publicação de comunicados será habilitada em uma próxima etapa.");
    if (event.target.closest("[data-close-modal]") || event.target.matches("[data-modal-backdrop]")) document.querySelector("[data-modal-backdrop]")?.remove();
});

document.addEventListener("input", (event) => {
    const search = event.target.closest("[data-search]");
    if (!search) return;
    const viewKey = search.dataset.search;
    const query = search.value.trim().toLocaleLowerCase("pt-BR");
    const matchingRows = dashboardData[viewKey].filter((row) => Object.values(row).some((value) => value.toLocaleLowerCase("pt-BR").includes(query)));
    document.querySelector(`[data-rows="${viewKey}"]`).innerHTML = renderRows(viewKey, matchingRows);
});

document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-record-form]");
    if (!form) return;
    event.preventDefault();
    const viewKey = form.dataset.recordForm;
    const record = Object.fromEntries(new FormData(form).entries());
    const dateField = viewKey === "maintenance" ? "date" : viewKey === "payments" ? "due" : null;
    if (dateField && record[dateField]) {
        const [year, month, day] = record[dateField].split("-");
        record[dateField] = `${day}/${month}/${year}`;
    }
    if (form.dataset.recordIndex !== "") {
        dashboardData[viewKey][Number(form.dataset.recordIndex)] = record;
    } else {
        dashboardData[viewKey].unshift(record);
    }
    document.querySelector("[data-modal-backdrop]")?.remove();
    renderDashboardView();
});

abrirPainel();
