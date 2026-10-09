const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..")));

const banco = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD ?? "root",
  database: process.env.DB_NAME || "sistema"
});

banco.connect((erro) => {
  if (erro) {
    console.log("Erro ao conectar no MySQL:", erro);
    return;
  }
  console.log("MySQL conectado!");
});
//===========================
app.post("/cadastro", (req, res) => {
  const { nome, email, senha } = req.body;
  const sql = `
    INSERT INTO usuarios (nome, email, senha)
    VALUES (?, ?, ?)
  `;

  banco.query(sql, [nome, email, senha], (erro) => {
    if (erro) {
      console.log(erro);
      return res.status(500).json({ erro: "Erro ao cadastrar." });
    }
    res.status(201).json({ mensagem: "Cadastro realizado com sucesso." });
  });
});
//===========================
app.post("/login", (req, res) => {
  const { email, senha } = req.body;
  const sql = `
    SELECT * FROM usuarios
    WHERE email = ? AND senha = ?
  `;

  banco.query(sql, [email, senha], (erro, resultados) => {
    if (erro) {
      console.log(erro);
      return res.status(500).json({ erro: "Erro ao fazer login." });
    }

    if (resultados.length === 0) {
      return res.status(401).json({ erro: "E-mail ou senha incorretos." });
    }

    res.redirect("/main.html");
  });
});
//===========================
const recursos = {
  referencias: {
    tabela: "referencias",
    campos: ["mes_ano", "valor", "vencimento"],
    obrigatorios: ["mes_ano", "valor", "vencimento"],
    consulta: "SELECT id, mes_ano, valor, vencimento FROM referencias ORDER BY mes_ano DESC"
  },
  blocos: {
    tabela: "blocos",
    campos: ["descricao", "quantidade"],
    obrigatorios: ["descricao", "quantidade"],
    consulta: "SELECT id, descricao, quantidade FROM blocos ORDER BY descricao"
  },
  apartamentos: {
    tabela: "apartamentos",
    campos: ["numero", "bloco_id"],
    obrigatorios: ["numero", "bloco_id"],
    consulta: "SELECT a.id, a.numero, a.bloco_id, b.descricao AS bloco FROM apartamentos a JOIN blocos b ON b.id = a.bloco_id ORDER BY b.descricao, a.numero"
  },
  moradores: {
    tabela: "moradores",
    campos: ["nome", "cpf", "telefone", "apartamento_id", "email"],
    obrigatorios: ["nome", "apartamento_id"],
    consulta: "SELECT m.id, m.nome, m.cpf, m.telefone, m.apartamento_id, m.email, a.numero AS unidade, b.descricao AS bloco FROM moradores m JOIN apartamentos a ON a.id = m.apartamento_id JOIN blocos b ON b.id = a.bloco_id ORDER BY m.nome"
  },
  pagamentos: {
    tabela: "pagamentos",
    campos: ["referencia_id", "apartamento_id", "data_pagamento"],
    obrigatorios: ["referencia_id", "apartamento_id", "data_pagamento"],
    consulta: "SELECT p.id, p.referencia_id, p.apartamento_id, p.data_pagamento, r.mes_ano AS referencia, r.valor, r.vencimento, a.numero AS unidade FROM pagamentos p JOIN referencias r ON r.id = p.referencia_id JOIN apartamentos a ON a.id = p.apartamento_id ORDER BY r.mes_ano DESC, a.numero"
  },
  tiposManutencao: {
    tabela: "tipos_manutencao",
    campos: ["descricao"],
    obrigatorios: ["descricao"],
    consulta: "SELECT id, descricao FROM tipos_manutencao ORDER BY descricao"
  },
  manutencao: {
    tabela: "manutencoes",
    campos: ["tipo_id", "data", "local", "descricao"],
    obrigatorios: ["tipo_id", "data", "local"],
    consulta: "SELECT m.id, m.tipo_id, m.data, m.local, m.descricao, t.descricao AS tipo FROM manutencoes m JOIN tipos_manutencao t ON t.id = m.tipo_id ORDER BY m.data DESC"
  },
  comunicados: {
    tabela: "comunicados",
    campos: ["titulo", "mensagem"],
    obrigatorios: ["titulo", "mensagem"],
    consulta: "SELECT id, titulo, mensagem FROM comunicados ORDER BY id DESC"
  }
};

function obterRecurso(nome, res) {
  const recurso = recursos[nome];
  if (!recurso) res.status(404).json({ erro: "Recurso não encontrado." });
  return recurso;
}

function tratarErroBanco(erro, res) {
  console.log("Erro na operação do banco:", erro);
  if (erro.code === "ECONNREFUSED" || erro.code === "PROTOCOL_CONNECTION_LOST") return res.status(503).json({ erro: "MySQL indisponível. Inicie o serviço do MySQL e tente novamente." });
  if (erro.code === "ER_ACCESS_DENIED_ERROR") return res.status(503).json({ erro: "Acesso ao MySQL negado. Confira DB_USER e DB_PASSWORD." });
  if (erro.code === "ER_BAD_DB_ERROR") return res.status(503).json({ erro: "Banco sistema não encontrado. Execute back-end/banco.sql no MySQL." });
  if (erro.code === "ER_NO_SUCH_TABLE") return res.status(503).json({ erro: `Tabela ausente no banco: ${erro.sqlMessage || erro.message}` });
  if (erro.code === "ER_DUP_ENTRY") return res.status(409).json({ erro: "Este registro já está cadastrado." });
  if (erro.code === "ER_NO_REFERENCED_ROW_2") return res.status(400).json({ erro: "Selecione um registro relacionado que exista." });
  if (erro.code === "ER_ROW_IS_REFERENCED_2") return res.status(409).json({ erro: "Não é possível excluir: existem registros vinculados." });
  return res.status(500).json({ erro: "Erro ao acessar o banco de dados." });
}

function obterDados(req, recurso) {
  const dados = {};
  recurso.campos.forEach(campo => {
    if (Object.prototype.hasOwnProperty.call(req.body, campo)) {
      dados[campo] = req.body[campo] === "" ? null : req.body[campo];
    } else if (!recurso.obrigatorios.includes(campo)) {
      dados[campo] = null;
    }
  });
  return dados;
}

function validarDados(dados, recurso, res) {
  const faltando = recurso.obrigatorios.some(campo => dados[campo] === undefined || dados[campo] === null || dados[campo] === "");
  if (faltando) {
    res.status(400).json({ erro: "Preencha os campos obrigatórios." });
    return false;
  }
  return true;
}

app.get("/api/:recurso", (req, res) => {
  const recurso = obterRecurso(req.params.recurso, res);
  if (!recurso) return;
  banco.query(recurso.consulta, (erro, resultados) => {
    if (erro) return tratarErroBanco(erro, res);
    res.json(resultados);
  });
});

app.post("/api/:recurso", (req, res) => {
  const recurso = obterRecurso(req.params.recurso, res);
  if (!recurso) return;
  const dados = obterDados(req, recurso);
  if (!validarDados(dados, recurso, res)) return;
  const campos = Object.keys(dados);
  const sql = `INSERT INTO ${recurso.tabela} (${campos.join(", ")}) VALUES (${campos.map(() => "?").join(", ")})`;

  banco.query(sql, campos.map(campo => dados[campo]), (erro, resultado) => {
    if (erro) return tratarErroBanco(erro, res);
    res.status(201).json({ id: resultado.insertId, mensagem: "Dados salvos com sucesso." });
  });
});

app.put("/api/:recurso/:id", (req, res) => {
  const recurso = obterRecurso(req.params.recurso, res);
  if (!recurso) return;
  const dados = obterDados(req, recurso);
  if (!validarDados(dados, recurso, res)) return;
  const campos = Object.keys(dados);
  const sql = `UPDATE ${recurso.tabela} SET ${campos.map(campo => `\${campo} = ?`).join(", ")} WHERE id = ?`;

  banco.query(sql, [...campos.map(campo => dados[campo]), req.params.id], (erro, resultado) => {
    if (erro) return tratarErroBanco(erro, res);
    if (!resultado.affectedRows) {
      return banco.query(`SELECT id FROM ${recurso.tabela} WHERE id = ?`, [req.params.id], (erroBusca, linhas) => {
        if (erroBusca) return tratarErroBanco(erroBusca, res);
        if (!linhas.length) return res.status(404).json({ erro: "Registro não encontrado." });
        res.json({ mensagem: "Dados updated com sucesso." });
      });
    }
    res.json({ mensagem: "Dados atualizados com sucesso." });
  });
});

app.delete("/api/:recurso/:id", (req, res) => {
  const recurso = obterRecurso(req.params.recurso, res);
  if (!recurso) return;
  banco.query(`DELETE FROM ${recurso.tabela} WHERE id = ?`, [req.params.id], (erro, resultado) => {
    if (erro) return tratarErroBanco(erro, res);
    if (!resultado.affectedRows) return res.status(404).json({ erro: "Registro não encontrado." });
    res.json({ mensagem: "Registro excluído com sucesso." });
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});



