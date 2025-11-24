<?php
require_once 'conexao.php';
require_once 'restcountries.php';
require_once 'header.php';

$mensagem = '';
$erroApi = '';
$dadosApi = [];

// Buscar país na API
if (isset($_POST['nome_busca']) && !empty(trim($_POST['nome_busca']))) {
    $nomeBusca = trim($_POST['nome_busca']);

    // Validação: apenas letras e espaços
    if (!preg_match("/^[a-zA-ZÀ-ÿ\s'-]+$/u", $nomeBusca)) {
        $erroApi = "O nome do país deve conter apenas letras e espaços.";
    } else {
        try {
            $dadosApi = buscarPais($nomeBusca);
            if (!$dadosApi) {
                $erroApi = "País '{$nomeBusca}' não encontrado na API.";
            }
        } catch (Exception $e) {
            $erroApi = "Erro ao buscar país: " . $e->getMessage();
        }
    }
}

// Inserir no banco
if (isset($_POST['nome']) && !empty(trim($_POST['nome']))) {
    $nome = trim($_POST['nome']);
    $continente = $_POST['continente'] ?? '';
    $populacao = $_POST['populacao'] ?? null;
    $idioma = $_POST['idioma'] ?? '';
    $capital = $_POST['capital'] ?? '';
    $moeda = $_POST['moeda'] ?? '';
    $area = $_POST['area'] ?? null;
    $bandeira = $_POST['bandeira'] ?? '';

    // Validação: apenas letras no nome do país
    if (!preg_match("/^[a-zA-ZÀ-ÿ\s'-]+$/u", $nome)) {
        $mensagem = "O nome do país deve conter apenas letras e espaços.";
    } else {
        // Verifica se já existe no banco
        $stmtCheck = $conn->prepare("SELECT COUNT(*) FROM paises WHERE nome = ?");
        $stmtCheck->execute([$nome]);
        if ($stmtCheck->fetchColumn() > 0) {
            $mensagem = "O país '$nome' já está cadastrado no banco.";
        } else {
            try {
                $stmt = $conn->prepare("INSERT INTO paises (nome, continente, populacao, idioma, capital, moeda, area, bandeira) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                $resultado = $stmt->execute([$nome, $continente, $populacao, $idioma, $capital, $moeda, $area, $bandeira]);

                $mensagem = $resultado ? "País '$nome' cadastrado com sucesso!" : "Erro ao cadastrar país no banco.";
                $dadosApi = [];
                $_POST = [];
            } catch (PDOException $e) {
                $mensagem = "O país não existe! " . $e->getMessage();
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Adicionar País</title>
<link rel="stylesheet" href="../FrontEnd/crud.css">
</head>
<body>

<h1>Adicionar País</h1>

<!-- Formulário para buscar país na API -->
<form method="post">
    <label>Nome do país (em inglês):</label>
    <input type="text" name="nome_busca" value="<?= isset($_POST['nome_busca']) ? htmlspecialchars($_POST['nome_busca']) : '' ?>" placeholder="Ex: Brazil">
    <input type="submit" value="Buscar dados da API">
</form>

<?php if (!empty($erroApi)) : ?>
    <p class="erro"><?= htmlspecialchars($erroApi) ?></p>
<?php endif; ?>

<!-- Formulário para inserir país no banco -->
<?php if (!empty($dadosApi)) : ?>
<form method="post">
    <label>Nome:</label>
    <input type="text" name="nome" value="<?= htmlspecialchars($dadosApi['nome']) ?>" required>

    <label>Continente:</label>
    <input type="text" name="continente" value="<?= htmlspecialchars($dadosApi['continente']) ?>" required>

    <label>População:</label>
    <input type="number" name="populacao" value="<?= htmlspecialchars($dadosApi['populacao']) ?>">

    <label>Idioma:</label>
    <input type="text" name="idioma" value="<?= htmlspecialchars($dadosApi['idioma']) ?>">

    <label>Capital:</label>
    <input type="text" name="capital" value="<?= htmlspecialchars($dadosApi['capital']) ?>">

    <label>Moeda:</label>
    <input type="text" name="moeda" value="<?= htmlspecialchars($dadosApi['moeda']) ?>">

    <label>Área (km²):</label>
    <input type="number" name="area" value="<?= htmlspecialchars($dadosApi['area'] ?? '') ?>">

    <?php if (!empty($dadosApi['bandeira'])): ?>
        <label>Bandeira:</label>
        <img src="<?= htmlspecialchars($dadosApi['bandeira']) ?>" alt="Bandeira">
    <?php endif; ?>
    <input type="hidden" name="bandeira" value="<?= htmlspecialchars($dadosApi['bandeira']) ?>">
<br>
    <input type="submit" style="text-align: center;" value="Salvar no banco">
</form>
<?php endif; ?>

<?php if (!empty($mensagem)) : ?>
    <p class="mensagem"><?= htmlspecialchars($mensagem) ?></p>
<?php endif; ?>

<p>
  <a href="../crud.php" class="link-voltar">Voltar</a>
</p>

</body>
</html>
