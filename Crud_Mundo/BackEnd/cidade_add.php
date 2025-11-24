<?php
require_once 'conexao.php';
require_once 'openweathermap.php';
require_once 'header.php';

$mensagem = '';
$erro = '';
$id_pais = $_GET['id_pais'] ?? $_POST['id_pais'] ?? '';

// Buscar todos os países
$stmtPaises = $conn->query("SELECT id_pais, nome FROM paises ORDER BY nome");
$paises = $stmtPaises->fetchAll(PDO::FETCH_ASSOC);

// Inserir nova cidade
if (isset($_POST['nome']) && !empty(trim($_POST['nome'])) && !empty($_POST['id_pais'])) {
    $nomeCidade = trim($_POST['nome']);
    $populacao = $_POST['populacao'] ?? null;
    $idPais = $_POST['id_pais'];

    // Validação: apenas letras e espaços
    if (!preg_match("/^[a-zA-ZÀ-ÿ\s'-]+$/u", $nomeCidade)) {
        $erro = "O nome da cidade deve conter apenas letras e espaços.";
    } else {
        // Verifica duplicidade
        $stmtCheck = $conn->prepare("SELECT COUNT(*) FROM cidades WHERE nome = ? AND id_pais = ?");
        $stmtCheck->execute([$nomeCidade, $idPais]);
        if ($stmtCheck->fetchColumn() > 0) {
            $erro = "A cidade '$nomeCidade' já está cadastrada para este país.";
        } else {
            try {
                $stmt = $conn->prepare("INSERT INTO cidades (nome, populacao, id_pais) VALUES (?, ?, ?)");
                $resultado = $stmt->execute([$nomeCidade, $populacao, $idPais]);
                $mensagem = $resultado ? "Cidade '$nomeCidade' cadastrada com sucesso!" : "Erro ao cadastrar cidade no banco.";
            } catch (PDOException $e) {
                $erro = "Erro no banco: " . $e->getMessage();
            }
        }
    }
}

// Listar cidades do país selecionado
$cidades = [];
if (!empty($id_pais)) {
    $stmtCidades = $conn->prepare("SELECT * FROM cidades WHERE id_pais = ? ORDER BY nome");
    $stmtCidades->execute([$id_pais]);
    $cidades = $stmtCidades->fetchAll(PDO::FETCH_ASSOC);

    // Buscar clima de cada cidade
    foreach ($cidades as &$cidade) {
        $cidade['clima'] = buscarClima($cidade['nome']);
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Adicionar Cidade</title>
<link rel="stylesheet" href="../FrontEnd/crud.css">
</head>
<body>

<h1>Adicionar Cidade</h1>

<?php if (!empty($erro)) : ?>
    <p class="erro"><?= htmlspecialchars($erro) ?></p>
<?php endif; ?>

<?php if (!empty($mensagem)) : ?>
    <p class="mensagem"><?= htmlspecialchars($mensagem) ?></p>
<?php endif; ?>

<form method="post">
    <label>Nome da cidade:</label>
    <input type="text" name="nome" required>

    <label>População:</label>
    <input type="number" name="populacao">

    <label>País:</label>
    <select name="id_pais" required>
        <option value="">-- Selecione o país --</option>
        <?php foreach ($paises as $pais): ?>
            <option value="<?= $pais['id_pais'] ?>" <?= $pais['id_pais'] == $id_pais ? 'selected' : '' ?>>
                <?= htmlspecialchars($pais['nome']) ?>
            </option>
        <?php endforeach; ?>
    </select>

    <input type="submit" value="Adicionar Cidade">
</form>

<p>
  <a href="../crud.php" class="link-voltar">Voltar</a>
</p>



</body>
</html>
