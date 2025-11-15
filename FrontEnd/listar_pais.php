<?php
include '../conexao.php';
$nome = $_GET['nome'];

$sql = "SELECT * FROM paises WHERE nome LIKE '%$nome%' LIMIT 1";
$result = $conn->query($sql);

if ($row = $result->fetch_assoc()) {
  echo "<p><b>Continente:</b> {$row['continente']}</p>";
  echo "<p><b>População:</b> {$row['populacao']}</p>";
  echo "<p><b>Idioma:</b> {$row['idioma']}</p>";
  echo "<p><b>Capital:</b> {$row['capital']}</p>";
  if (!empty($row['bandeira'])) {
    echo "<img src='{$row['bandeira']}' width='80'>";
  }
} else {
  echo "<p>Nenhum país encontrado no banco de dados.</p>";
}
?>
