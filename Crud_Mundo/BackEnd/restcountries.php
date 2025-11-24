<?php
/**
 * Arquivo de integração com a API Rest Countries
 * Retorna informações de um país pelo nome
 */

function buscarPais($nomePais) {
    $url = "https://restcountries.com/v3.1/name/" . urlencode($nomePais) . "?fullText=true";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode != 200) {
        // Retorna false se a API não retornar sucesso
        return false;
    }

    $dados = json_decode($response, true);

    // Verifica se é um array válido e contém pelo menos um país
    if (!is_array($dados) || count($dados) === 0 || isset($dados['status'])) {
        return false;
    }

    $paisApi = $dados[0] ?? null;
    if (!$paisApi) {
        return false;
    }

    // Extrai dados com segurança
    $continente = $paisApi['region'] ?? '';
    $populacao = $paisApi['population'] ?? null;

    // Idioma principal
    $idioma = '';
    if (!empty($paisApi['languages']) && is_array($paisApi['languages'])) {
        $idiomas = array_values($paisApi['languages']);
        $idioma = $idiomas[0] ?? '';
    }

    // Capital
    $capital = $paisApi['capital'][0] ?? '';

    // Moeda principal
    $moeda = '';
    if (!empty($paisApi['currencies']) && is_array($paisApi['currencies'])) {
        $moedas = array_values($paisApi['currencies']);
        $moeda = $moedas[0]['name'] ?? '';
    }

    // Bandeira
    $bandeira = $paisApi['flags']['png'] ?? '';

    // Área
    $area = $paisApi['area'] ?? null;

    return [
        'nome' => $paisApi['name']['common'] ?? $nomePais,
        'continente' => $continente,
        'populacao' => $populacao,
        'idioma' => $idioma,
        'capital' => $capital,
        'moeda' => $moeda,
        'bandeira' => $bandeira,
        'area' => $area
    ];
}

/**
 * Busca vários países ao mesmo tempo
 */
function buscarVariosPaises(array $nomes) {
    $resultados = [];
    foreach ($nomes as $nome) {
        $resultados[$nome] = buscarPais($nome);
    }
    return $resultados;
}
?>
