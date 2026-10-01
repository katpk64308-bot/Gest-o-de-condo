const pagina = {

    login: `
        <div class="container">

            <h1>Login</h1>

            <label>E-mail</label>
            <input type="email" placeholder="Digite seu e-mail">

            <label>Senha</label>
            <input type="password" placeholder="Digite sua senha">

            <button>Entrar</button>

            <div class="trocar">
                <p>
                    Não possui uma conta?
                </p>

                <button class="link" onclick="trocarPagina('cadastro')">
                    Cadastre-se
                </button>
            </div>

        </div>
    `,

    cadastro: `
        <div class="container">

            <h1>Cadastro</h1>

            <label>Nome</label>
            <input type="text" placeholder="Digite seu nome">

            <label>E-mail</label>
            <input type="email" placeholder="Digite seu e-mail">

            <label>Senha</label>
            <input type="password" placeholder="Digite sua senha">

            <button>Cadastrar</button>

            <div class="trocar">
                <p>
                    Já possui uma conta?
                </p>

                <button class="link" onclick="trocarPagina('login')">
                    Fazer login
                </button>
            </div>

        </div>
    `
};


function trocarPagina(nomePagina) {

    document.getElementById("conteudo").innerHTML = pagina[nomePagina];

}


trocarPagina("login");