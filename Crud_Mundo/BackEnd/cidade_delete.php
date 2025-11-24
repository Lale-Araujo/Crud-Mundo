<?php
require_once 'conexao.php';
$id = $_GET['id'];

$stmt = $conn->prepare("DELETE FROM cidades WHERE id_cidade=?");
$stmt->execute([$id]);

header("Location: ../crud.php");
?>
