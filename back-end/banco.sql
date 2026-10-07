CREATE DATABASE IF NOT EXISTS sistema_login;
USE sistema_login;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS blocos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL UNIQUE,
    quantidade INT NOT NULL
);

CREATE TABLE IF NOT EXISTS apartamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(20) NOT NULL,
    bloco_id INT NOT NULL,
    UNIQUE KEY uq_apartamento_bloco (numero, bloco_id),
    CONSTRAINT fk_apartamento_bloco FOREIGN KEY (bloco_id) REFERENCES blocos(id)
);

CREATE TABLE IF NOT EXISTS moradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(20) NULL UNIQUE,
    telefone VARCHAR(30) NULL,
    apartamento_id INT NOT NULL,
    email VARCHAR(150) NULL,
    CONSTRAINT fk_morador_apartamento FOREIGN KEY (apartamento_id) REFERENCES apartamentos(id)
);

CREATE TABLE IF NOT EXISTS referencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mes_ano CHAR(7) NOT NULL UNIQUE,
    valor DECIMAL(10,2) NOT NULL,
    vencimento DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS pagamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referencia_id INT NOT NULL,
    apartamento_id INT NOT NULL,
    data_pagamento DATE NOT NULL,
    UNIQUE KEY uq_pagamento_referencia_apartamento (referencia_id, apartamento_id),
    CONSTRAINT fk_pagamento_referencia FOREIGN KEY (referencia_id) REFERENCES referencias(id),
    CONSTRAINT fk_pagamento_apartamento FOREIGN KEY (apartamento_id) REFERENCES apartamentos(id)
);

CREATE TABLE IF NOT EXISTS tipos_manutencao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS manutencoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_id INT NOT NULL,
    data DATE NOT NULL,
    local VARCHAR(150) NOT NULL,
    descricao TEXT NULL,
    CONSTRAINT fk_manutencao_tipo FOREIGN KEY (tipo_id) REFERENCES tipos_manutencao(id)
);

CREATE TABLE IF NOT EXISTS comunicados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    mensagem TEXT NOT NULL
);
