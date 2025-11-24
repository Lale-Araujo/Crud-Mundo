<?php
require_once 'header.php';
require_once 'conexao.php';
$id = $_GET['id'];

$stmt = $conn->prepare("SELECT * FROM paises WHERE id_pais=?");
$stmt->execute([$id]);
$pais = $stmt->fetch(PDO::FETCH_ASSOC);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nome = $_POST['nome'];
    $continente = $_POST['continente'];
    $populacao = $_POST['populacao'] ?: NULL;
    $idioma = $_POST['idioma'] ?: NULL;

    $stmt = $conn->prepare("UPDATE paises SET nome=?, continente=?, populacao=?, idioma=? WHERE id_pais=?");
    $stmt->execute([$nome, $continente, $populacao, $idioma, $id]);
    header("Location: ../crud.php");
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar País - CRUD Atlas</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../FrontEnd/crud.css">
<body>

<!-- CONTEÚDO PRINCIPAL -->
<div class="container mt-30">
    <h1>Editar País</h1>
    <form method="POST">
        <label for="nome">Nome:</label>
        <input type="text" id="nome" name="nome" value="<?= $pais['nome'] ?>" required>

        <label for="continente">Continente:</label>
        <input type="text" id="continente" name="continente" value="<?= $pais['continente'] ?>" required>

        <label for="populacao">População:</label>
        <input type="number" id="populacao" name="populacao" value="<?= $pais['populacao'] ?>">

        <label for="idioma">Idioma:</label>
        <input type="text" id="idioma" name="idioma" value="<?= $pais['idioma'] ?>">

        <button type="submit">Atualizar País</button>
    </form>

<p>
  <a href="../crud.php" class="link-voltar">Voltar</a>
</p>

</div>

</body>
</html>
