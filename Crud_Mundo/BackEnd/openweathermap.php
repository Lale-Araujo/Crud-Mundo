<?php
/**
 * Integração com OpenWeatherMap
 * Retorna dados de clima de uma cidade
 */

function buscarClima($cidade) {
    static $cache = []; // Armazena resultados para não chamar a API várias vezes
    $apiKey = 'SUA_CHAVE_OPENWEATHERMAP'; // Substitua pela sua chave
    $cidade = trim($cidade);

    if (isset($cache[$cidade])) {
        return $cache[$cidade]; // Retorna do cache
    }

    $url = "https://api.openweathermap.org/data/2.5/weather?q=" . urlencode($cidade) . "&appid=$apiKey&units=metric&lang=pt_br";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $response = curl_exec($ch);
    curl_close($ch);

    $dados = json_decode($response, true);

    if (isset($dados['cod']) && $dados['cod'] == 200) {
        $resultado = [
            'temperatura' => $dados['main']['temp'] ?? '-',
            'descricao'   => $dados['weather'][0]['description'] ?? '-',
            'icone'       => isset($dados['weather'][0]['icon']) ? "http://openweathermap.org/img/wn/{$dados['weather'][0]['icon']}@2x.png" : ''
        ];
    } else {
        $resultado = [
            'temperatura' => '-',
            'descricao'   => 'Não disponível',
            'icone'       => ''
        ];
    }

    $cache[$cidade] = $resultado; // Salva no cache
    return $resultado;
}
?>
