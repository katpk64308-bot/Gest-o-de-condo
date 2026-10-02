const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("../"));

const banco = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "SUA_SENHA",
    database: "sistema_login"
});

banco.connect((erro) => {
    if (erro) {
        console.log("Erro ao conectar no MySQL:", erro);
        return;
    }

    console.log("MySQL conectado!");
});

app.post("/cadastro", (req, res) => {

    const { nome, email, senha } = req.body;

    const sql = `
        INSERT INTO usuarios (nome, email, senha)
        VALUES (?, ?, ?)
    `;

    banco.query(sql, [nome, email, senha], (erro) => {

        if (erro) {
            console.log(erro);
            return res.status(500).send("Erro ao cadastrar");
        }

        res.send("Usuário cadastrado!");
    });

});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});