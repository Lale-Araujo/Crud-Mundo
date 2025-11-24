<?php
require_once 'restcountries.php';

$pais = buscarPais("Brasil");

if ($pais) {
    echo "Nome: " . $pais['nome'] . "<br>";
    echo "Continente: " . $pais['continente'] . "<br>";
    echo "População: " . $pais['populacao'] . "<br>";
    echo "Idioma: " . $pais['idioma'] . "<br>";
    echo "Capital: " . $pais['capital'] . "<br>";
    echo "Moeda: " . $pais['moeda'] . "<br>";
    echo "<img src='" . $pais['bandeira'] . "' alt='Bandeira' width='100'>";
} else {
    echo "País não encontrado!";
}

?>
