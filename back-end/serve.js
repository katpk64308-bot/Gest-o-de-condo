const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("../"));

const banco = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
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

        res.send(`
            <script>
                alert("Usuário cadastrado com sucesso!");
                window.location.href = "/index.html";
            </script>
        `);
    });
});

// ===========================================

app.post("/login", (req, res) => {

    const { email, senha } = req.body;

    const sql = `
        SELECT * FROM usuarios
        WHERE email = ? AND senha = ?
    `;

    banco.query(sql, [email, senha], (erro, resultados) => {

        if (erro) {
            console.log(erro);
            return res.status(500).send("Erro ao fazer login");
        }

        // Usuário não encontrado=====================
        if (resultados.length === 0) {

            return res.send(`
                <script>
                    alert("E-mail ou senha incorretos!");
                    window.location.href = "/index.html";
                </script>
            `);

        }

        // Login correto
        res.redirect("/main.html");
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});