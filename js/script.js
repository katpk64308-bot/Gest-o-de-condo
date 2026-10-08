const pagina = {
  login: `
    <div class="container">
      <h1>Login</h1>
      <form id="formLogin">
        <label>E-mail</label>
        <input type="email" id="emailLogin" name="email" placeholder="Digite seu e-mail" required>

        <label>Senha</label>
        <input type="password" id="senhaLogin" name="senha" placeholder="Digite sua senha" required>

        <button type="submit">Entrar</button>
      </form>
      <div class="trocar">
        <p>Não possui uma conta?</p>
        <button class="link" onclick="trocarPagina('cadastro')">Cadastre-se</button>
      </div>
    </div>
  `,
  cadastro: `
    <div class="container">
      <h1>Cadastro</h1>
      <form id="formCadastro">
        <label>Nome</label>
        <input type="text" id="nomeCadastro" name="nome" placeholder="Digite seu nome" required>

        <label>E-mail</label>
        <input type="email" id="emailCadastro" name="email" placeholder="Digite seu e-mail" required>

        <label>Senha</label>
        <input type="password" id="senhaCadastro" name="senha" placeholder="Digite sua senha" required>

        <button type="submit">Cadastrar</button>
      </form>
      <div class="trocar">
        <p>Já possui uma conta?</p>
        <button class="link" onclick="trocarPagina('login')">Fazer login</button>
      </div>
    </div>
  `
};

function trocarPagina(nomePagina) {
  document.getElementById("conteudo").innerHTML = pagina[nomePagina];

  if (nomePagina === "login") {
    configurarLogin();
  }

  if (nomePagina === "cadastro") {
    configurarCadastro();
  }
}

function mostrarMensagemFormulario(formulario, texto, tipo = "erro") {
  let mensagem = formulario.querySelector(".mensagem");
  
  if (!mensagem) {
    mensagem = document.createElement("p");
    mensagem.className = "mensagem";
    mensagem.setAttribute("aria-live", "polite");
    formulario.appendChild(mensagem);
  }
  
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

function configurarLogin() {
  const formulario = document.getElementById("formLogin");
  
  formulario.addEventListener("submit", async evento => {
    evento.preventDefault();
    const dados = Object.fromEntries(new FormData(formulario).entries());
    
    try {
      const resposta = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });
      
      if (resposta.redirected) {
        window.location.href = resposta.url;
        return;
      }
      
      const resultado = await resposta.json().catch(() => ({}));
      
      if (!resposta.ok) {
        mostrarMensagemFormulario(formulario, resultado.erro || "Não foi possível entrar.", "erro");
        return;
      }
      
      window.location.href = resultado.destino || "/main.html";
    } catch (erro) {
      console.error("Erro no login:", erro);
      mostrarMensagemFormulario(formulario, "Não foi possível conectar ao servidor.", "erro");
    }
  });
}

function configurarCadastro() {
  const formulario = document.getElementById("formCadastro");
  
  formulario.addEventListener("submit", async evento => {
    evento.preventDefault();
    const dados = Object.fromEntries(new FormData(formulario).entries());
    
    try {
      const resposta = await fetch("/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });
      
      const resultado = await resposta.json().catch(() => ({}));
      
      if (!resposta.ok) {
        mostrarMensagemFormulario(formulario, resultado.erro || "Não foi possível criar a conta.", "erro");
        return;
      }
      
      mostrarMensagemFormulario(formulario, resultado.mensagem || "Cadastro realizado com sucesso.", "sucesso");
      formulario.reset();
    } catch (erro) {
      console.error("Erro no cadastro:", erro);
      mostrarMensagemFormulario(formulario, "Não foi possível conectar ao servidor.", "erro");
    }
  });
}

trocarPagina("login");
