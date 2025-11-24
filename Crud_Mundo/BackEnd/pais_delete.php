<?php
require_once 'conexao.php';
$id = $_GET['id'];

// Deleta o país (cidades relacionadas serão removidas automaticamente pelo FOREIGN KEY ON DELETE CASCADE)
$stmt = $conn->prepare("DELETE FROM paises WHERE id_pais=?");
$stmt->execute([$id]);

header("Location: ../crud.php");
?>
