<?php
require_once 'conexao.php';
require_once 'header.php';
$id = $_GET['id'];

$stmt = $conn->prepare("SELECT * FROM cidades WHERE id_cidade=?");
$stmt->execute([$id]);
$cidade = $stmt->fetch(PDO::FETCH_ASSOC);

$stmtP = $conn->query("SELECT * FROM paises");
$paises = $stmtP->fetchAll(PDO::FETCH_ASSOC);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nome = $_POST['nome'];
    $populacao = $_POST['populacao'] ?: NULL;
    $pais_id = $_POST['id_pais'];

    $stmt = $conn->prepare("UPDATE cidades SET nome=?, populacao=?, id_pais=? WHERE id_cidade=?");
    $stmt->execute([$nome, $populacao, $pais_id, $id]);
    header("Location: ../crud.php");
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Cidade - CRUD Atlas</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../FrontEnd/crud.css">
</head>
<body>

<!-- CONTEÚDO PRINCIPAL -->
<div class="container mt-30">
    <h1>Editar Cidade</h1>
    <form method="POST">
        <label for="nome">Nome da Cidade:</label>
        <input type="text" id="nome" name="nome" value="<?= $cidade['nome'] ?>" required>

        <label for="populacao">População:</label>
        <input type="number" id="populacao" name="populacao" value="<?= $cidade['populacao'] ?>">

        <label for="id_pais">País:</label>
        <select name="id_pais" id="id_pais" required>
            <?php foreach ($paises as $p): ?>
                <option value="<?= $p['id_pais'] ?>" <?= ($cidade['id_pais'] == $p['id_pais'] ? 'selected' : '') ?>><?= $p['nome'] ?></option>
            <?php endforeach; ?>
        </select>

        <button type="submit">Atualizar Cidade</button>
    </form>

<p>
  <a href="../crud.php" class="link-voltar">Voltar</a>
</p>

</div>

</body>
</html>
