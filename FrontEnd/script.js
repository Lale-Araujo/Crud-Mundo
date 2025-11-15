const mapa = document.getElementById("mapa");
const areas = document.querySelectorAll("area");
const titulo = document.getElementById("titulo");
const info = document.getElementById("info");

areas.forEach(area => {
  area.addEventListener("click", (e) => {
    e.preventDefault();
    const pais = area.dataset.pais;

    // Efeito visual
    mapa.classList.add("destacado");
    titulo.textContent = pais;
    info.textContent = "Carregando informações...";

    // Busca os dados do PHP (ajuste o caminho se precisar)
    fetch(`../backend/pais/listar_pais.php?nome=${encodeURIComponent(pais)}`)
      .then(res => res.text())
      .then(dados => info.innerHTML = dados)
      .catch(() => info.innerHTML = "Erro ao carregar dados do país.");
  });
});
