CREATE DATABASE IF NOT EXISTS bd_mundo;
USE bd_mundo;

-- Tabela países
CREATE TABLE IF NOT EXISTS paises (
  id_pais INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  continente VARCHAR(50) NOT NULL,
  populacao BIGINT,
  idioma VARCHAR(50)
);

-- Tabela cidades
CREATE TABLE IF NOT EXISTS cidades (
  id_cidade INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  populacao BIGINT,
  id_pais INT,
  FOREIGN KEY (id_pais) REFERENCES paises(id_pais) ON DELETE CASCADE
);

-- África
INSERT INTO paises (nome, continente) VALUES
('Egypt', 'Africa'),
('Nigeria', 'Africa'),
('South Africa', 'Africa'),
('Kenya', 'Africa'),
('Morocco', 'Africa');

-- América
INSERT INTO paises (nome, continente) VALUES
('Brazil', 'Americas'),
('United States', 'Americas'),
('Canada', 'Americas'),
('Mexico', 'Americas'),
('Argentina', 'Americas');

-- Ásia
INSERT INTO paises (nome, continente) VALUES
('China', 'Asia'),
('India', 'Asia'),
('Japan', 'Asia'),
('Saudi Arabia', 'Asia'),
('Indonesia', 'Asia');

-- Europa
INSERT INTO paises (nome, continente) VALUES
('Germany', 'Europe'),
('France', 'Europe'),
('United Kingdom', 'Europe'),
('Italy', 'Europe'),
('Spain', 'Europe');

-- Oceania
INSERT INTO paises (nome, continente) VALUES
('Australia', 'Oceania'),
('New Zealand', 'Oceania'),
('Fiji', 'Oceania'),
('Papua New Guinea', 'Oceania'),
('Samoa', 'Oceania');

-- Exibir os dados
SELECT * FROM paises;
SELECT * FROM cidades;

ALTER TABLE paises
ADD COLUMN capital VARCHAR(100) NULL,
ADD COLUMN moeda VARCHAR(50) NULL,
ADD COLUMN area BIGINT NULL,
ADD COLUMN bandeira VARCHAR(255) NULL;
