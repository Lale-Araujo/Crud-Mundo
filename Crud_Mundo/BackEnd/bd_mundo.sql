CREATE DATABASE mapa_db;

USE mapa_db;

CREATE TABLE paises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    continente VARCHAR(100),
    populacao BIGINT,
    capital VARCHAR(100),
    idioma VARCHAR(255)
);

CREATE TABLE cidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    pais_id INT,
    populacao BIGINT,
    FOREIGN KEY (pais_id) REFERENCES paises(id) ON DELETE CASCADE
);
