<?php
require_once 'BackEnd/conexao.php';

// Buscar países
$stmtPaises = $conn->query("SELECT * FROM paises ORDER BY continente, nome");
$paises = $stmtPaises->fetchAll(PDO::FETCH_ASSOC);

// Buscar cidades
$stmtCidades = $conn->query("SELECT * FROM cidades ORDER BY nome");
$cidades = $stmtCidades->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciar - CRUD Atlas</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="FrontEnd/crud.css">
    
</head>
<body>

<header>
    <div class="container">
        <div class="logo">
            <i class="fas fa-globe"></i>
            <span>CRUD Atlas</span>
        </div>

        <nav>
            <ul>
                <li><a href="index.php"><i class="fas fa-map"></i> Mapa</a></li>
                <li><a href="../crud.php"><i class="fas fa-database"></i> Gerenciar</a></li>
            </ul>
        </nav>
    </div>
</header>
    <!-- CONTEÚDO PRINCIPAL -->
    <div class="container mt-30">
        <div class="crud-container">
            <!-- SEÇÃO DE PAÍSES -->
            <div class="crud-section">
                <h2 class="crud-section-title">
                    <i class="fas fa-flag"></i> Gerenciar Países
                </h2>
                
                <button class="btn btn-primary btn-grande" id="btnAdicionarPais">
                    <i class="fas fa-plus"></i> Adicionar País
                </button>

                <script>
                    document.getElementById('btnAdicionarPais').addEventListener('click', function() {
                        // Redireciona para a página de adicionar país
                        window.location.href = 'BackEnd/pais_add.php';
                    });
                </script>

                <div class="tabela-container">
                    <table id="tabelaPaises">
                        <thead>
                            <tr>
                                <th>País</th>
                                <th>Capital</th>
                                <th>Continente</th>
                                <th>População</th>
                                <th>Área (km²)</th>
                                <th>Idioma</th>
                                <th>Moeda</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($paises as $pais): ?>
                                <tr>
                                    <td><?php echo $pais['nome']; ?></td>
                                    <td><?php echo $pais['capital']; ?></td>
                                    <td><?php echo $pais['continente']; ?></td>
                                    <td><?php echo $pais['populacao']; ?></td>
                                    <td><?php echo $pais['area_km2']; ?></td>
                                    <td><?php echo $pais['idioma']; ?></td>
                                    <td><?php echo $pais['moeda']; ?></td>
                                    <td>
                                        <a href="BackEnd/pais_edit.php?id=<?php echo $pais['id_pais']; ?>" class="btn-editar" title="Editar">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <br><br><br>
                                        <a href="BackEnd/pais_delete.php?id=<?php echo $pais['id_pais']; ?>" class="btn-excluir" onclick="return confirm('Deseja realmente excluir?')" title="Excluir">
                                            <i class="fas fa-trash-alt"></i>
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- SEÇÃO DE CIDADES -->
            <div class="crud-section">
                <h2 class="crud-section-title">
                    <i class="fas fa-city"></i> Gerenciar Cidades
                </h2>
                
                <button class="btn btn-primary btn-grande" id="btnAdicionarCidade">
                    <i class="fas fa-plus"></i> Adicionar Cidade
                </button>

                <script>
                    document.getElementById('btnAdicionarCidade').addEventListener('click', function() {
                        // Redireciona para a página de adicionar cidade
                        window.location.href = 'BackEnd/cidade_add.php';
                    });
                </script>

                <div class="tabela-container">
                    <table id="tabelaCidades">
                        <thead>
                            <tr>
                                <th>Cidade</th>
                                <th>País</th>
                                <th>População</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($cidades as $cidade): ?>
                                <tr>
                                    <td><?php echo $cidade['nome']; ?></td>
                                    <td><?php echo $cidade['id_pais']; ?></td> <!-- Aqui você pode usar o ID do país para buscar o nome do país -->
                                    <td><?php echo $cidade['populacao']; ?></td>
                                    <td>
                                        <a href="BackEnd/cidade_edit.php?id=<?php echo $cidade['id_cidade']; ?>" class="btn-editar" title="Editar">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a> 
                                        <br><br><br>
                                        <a href="BackEnd/cidade_delete.php?id=<?php echo $cidade['id_cidade']; ?>" class="btn-excluir" onclick="return confirm('Deseja realmente excluir?')" title="Excluir">
                                            <i class="fas fa-trash-alt"></i>
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- SCRIPTS -->
    <script src="FrontEnd/js/crud.js"></script>
</body>
</html>
