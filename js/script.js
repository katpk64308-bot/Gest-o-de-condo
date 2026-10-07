const pagina = {
    login: `
        <div class="container">

            <h1>Login</h1>

            <form id="formLogin">

                <label>E-mail</label>

                <input
                    type="email"
                    id="emailLogin"
                    name="email"
                    placeholder="Digite seu e-mail"
                    required
                >


                <label>Senha</label>

                <input
                    type="password"
                    id="senhaLogin"
                    name="senha"
                    placeholder="Digite sua senha"
                    required
                >


                <button type="submit">
                    Entrar
                </button>

            </form>


            <div class="trocar">

                <p>
                    Não possui uma conta?
                </p>

                <button
                    class="link"
                    onclick="trocarPagina('cadastro')"
                >
                    Cadastre-se
                </button>

            </div>

        </div>
    `,
    cadastro: `
        <div class="container">

            <h1>Cadastro</h1>

            <form id="formCadastro">

                <label>Nome</label>

                <input
                    type="text"
                    id="nomeCadastro"
                    name="nome"
                    placeholder="Digite seu nome"
                    required
                >


                <label>E-mail</label>

                <input
                    type="email"
                    id="emailCadastro"
                    name="email"
                    placeholder="Digite seu e-mail"
                    required
                >


                <label>Senha</label>

                <input
                    type="password"
                    id="senhaCadastro"
                    name="senha"
                    placeholder="Digite sua senha"
                    required
                >


                <button type="submit">
                    Cadastrar
                </button>

            </form>


            <div class="trocar">

                <p>
                    Já possui uma conta?
                </p>

                <button
                    class="link"
                    onclick="trocarPagina('login')"
                >
                    Fazer login
                </button>

            </div>

        </div>
    `
};

function trocarPagina(nomePagina) {

    document.getElementById("conteudo").innerHTML =
        pagina[nomePagina];

    if (nomePagina === "login") {
        configurarLogin();
    }

    if (nomePagina === "cadastro") {
        configurarCadastro();
    }
}

function configurarLogin() {

    const formulario =
        document.getElementById("formLogin");


    formulario.addEventListener("submit", async function (evento) {

        evento.preventDefault();


        const email =
            document.getElementById("emailLogin").value;

        const senha =
            document.getElementById("senhaLogin").value;


        try {

            const resposta = await fetch("/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    senha: senha
                })

            });

            if (resposta.redirected) {

                window.location.href =
                    resposta.url;

                return;
            }


            const resultado =
                await resposta.text();

            document.open();

            document.write(resultado);

            document.close();

        } catch (erro) {

            console.error(
                "Erro no login:",
                erro
            );

            alert(
                "Não foi possível conectar ao servidor."
            );

        }

    });

}

function configurarCadastro() {

    const formulario =
        document.getElementById("formCadastro");


    formulario.addEventListener("submit", async function (evento) {

        evento.preventDefault();


        const nome =
            document.getElementById("nomeCadastro").value;

        const email =
            document.getElementById("emailCadastro").value;

        const senha =
            document.getElementById("senhaCadastro").value;


        try {

            const resposta = await fetch("/cadastro", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    nome: nome,
                    email: email,
                    senha: senha

                })

            });


            const resultado =
                await resposta.text();

            document.open();

            document.write(resultado);

            document.close();


        } catch (erro) {

            console.error(
                "Erro no cadastro:",
                erro
            );

            alert(
                "Não foi possível conectar ao servidor."
            );

        }

    });

}
trocarPagina("login");