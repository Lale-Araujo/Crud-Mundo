# CRUD Mundo - Prog. WEB

## 🧾 Descrição do Projeto

O **CRUD Mundo** é uma aplicação web completa desenvolvida para o gerenciamento de **dados geográficos**, permitindo o cadastro, consulta, edição e exclusão de **países e cidades**.
O sistema integra **Front End (HTML, CSS e JavaScript)** com **Back End em PHP** e banco de dados **MySQL**, oferecendo uma interface intuitiva e funcional.

## 🎯 Objetivo

Implementar um sistema CRUD (Create, Read, Update, Delete) que possibilite ao usuário:

* Cadastrar novos países e associar cidades a eles.
* Consultar listas de países e cidades existentes.
* Editar e excluir registros de forma segura, mantendo a integridade do banco de dados.

## ⚙️ Funcionalidades

### Gerenciamento de Países

* Inserir, listar, editar e excluir países.
* Cada país contém: **ID, nome, continente, população e idioma principal**.

### Gerenciamento de Cidades

* Inserir, listar, editar e excluir cidades associadas a países existentes.
* Cada cidade contém: **ID, nome, população e país (chave estrangeira)**.

### Interface Web

* Estrutura em **HTML5** e **CSS3** com design responsivo.
* **JavaScript** para validações e interações dinâmicas (alertas, confirmações etc.).

### Back End (PHP + MySQL)

* Comunicação entre PHP e banco de dados via queries SQL (**INSERT, SELECT, UPDATE, DELETE**).
* Garantia da integridade referencial (exclusão segura de países e cidades).
