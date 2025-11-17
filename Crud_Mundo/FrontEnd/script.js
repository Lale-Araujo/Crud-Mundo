// ===========================
// ABAS DO PANEL (Info e Clima)
// ===========================
const tabButtons = document.querySelectorAll(".panel-tabs .tab-btn");
const tabContents = document.querySelectorAll(".side-panel .tab-content");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.getAttribute("data-tab");
    tabContents.forEach(c => c.classList.add("hide"));
    const tabContent = document.getElementById("tab-" + tab);
    if (tabContent) tabContent.classList.remove("hide");
  });
});

// ===========================
// ELEMENTOS DO MAPA
// ===========================
const map = document.querySelector("svg");
const countries = document.querySelectorAll("path");

const sidePanel = document.querySelector(".side-panel");
const container = document.querySelector(".side-panel .container");
const closeBtn = document.querySelector(".close-btn");
const loading = document.querySelector(".loading");

const zoomInBtn = document.querySelector(".zoom-in");
const zoomOutBtn = document.querySelector(".zoom-out");
const zoomValueOutput = document.querySelector(".zoom-value");

// ===========================
// CAMPOS DO PAINEL DO PAÍS
// ===========================
const countryNameOutput = document.querySelector(".country-name");
const countryFlagOutput = document.querySelector(".country-flag");
const cityOutput = document.querySelector(".city");
const areaOutput = document.querySelector(".area");
const currencyOutput = document.querySelector(".currencies");
const languagesOutput = document.querySelector(".languages");

const continentOutput = document.querySelector(".continent");
const populationOutput = document.querySelector(".population");
const cityListOutput = document.querySelector(".city-list");

// ===========================
// CAMPOS DO CLIMA
// ===========================
const weatherTemp = document.querySelector(".weather-temp");
const weatherHumidity = document.querySelector(".weather-humidity");
const weatherDesc = document.querySelector(".weather-desc");
const weatherWind = document.querySelector(".weather-wind");

const apiKey = "0c1f5a3278c8fad08da589bb59cbfd50";

// ===========================
// EVENTOS DO MAPA
// ===========================
countries.forEach(country => {
  // ===== HOVER =====
  country.addEventListener("mouseenter", function () {
    if (this.classList.length === 0) return;
    const selector = "." + [...this.classList].join(".");
    document.querySelectorAll(selector).forEach(el => el.style.fill = "#c99aff");
  });

  country.addEventListener("mouseout", function () {
    if (this.classList.length === 0) return;
    const selector = "." + [...this.classList].join(".");
    document.querySelectorAll(selector).forEach(el => el.style.fill = "#254650");
  });

  // ===== CLIQUE EM UM PAÍS =====
  country.addEventListener("click", function (e) {
    loading.innerText = "Loading...";
    container.classList.add("hide");
    loading.classList.remove("hide");

    let clickedCountryName =
      e.target.hasAttribute("name") ? e.target.getAttribute("name") : e.target.classList.value;

    sidePanel.classList.add("side-panel-open");

    // BUSCA NA API REST COUNTRIES
    fetch(`https://restcountries.com/v3.1/name/${clickedCountryName}?fullText=true`)
      .then(response => response.json())
      .then(data => {
        const country = data[0];

        // Nome e bandeira
        countryNameOutput.innerText = country.name.common;
        countryFlagOutput.src = country.flags.png;

        // Capital
        const capital = country.capital ? country.capital[0] : null;
        cityOutput.innerText = capital ?? "N/A";

        // Continente e população
        if (continentOutput) continentOutput.innerText = country.region ?? "N/A";
        if (populationOutput) populationOutput.innerText = country.population.toLocaleString("pt-BR");

        // Área
        areaOutput.innerHTML = country.area.toLocaleString("pt-BR") + ' km<sup>2</sup>';

        // Moedas
        currencyOutput.innerHTML = "";
        if (country.currencies) {
          Object.keys(country.currencies).forEach(key => {
            currencyOutput.innerHTML += `<li>${country.currencies[key].name}</li>`;
          });
        }

        // Idiomas
        languagesOutput.innerHTML = "";
        if (country.languages) {
          Object.values(country.languages).forEach(lang => {
            languagesOutput.innerHTML += `<li>${lang}</li>`;
          });
        }

        // ===== LISTAR CIDADES DO BANCO =====
        if (cityListOutput) {
          cityListOutput.innerHTML = "Carregando cidades...";
          fetch(`backend/api/cidades_por_pais.php?pais=${encodeURIComponent(country.name.common)}`)
            .then(res => res.json())
            .then(cidades => {
              cityListOutput.innerHTML = "";
              if (!cidades || cidades.length === 0) {
                cityListOutput.innerHTML = `<li>Nenhuma cidade cadastrada</li>`;
                return;
              }
              cidades.forEach(c => {
                cityListOutput.innerHTML += `
                  <li>${c.nm_cidade} — Pop: ${Number(c.qt_populacao).toLocaleString("pt-BR")} — Temp: ${c.vl_temperatura}°C</li>`;
              });
            });
        }

        // ===== FETCH OPENWEATHERMAP =====
        if (capital) {
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(capital)}&appid=${apiKey}&units=metric&lang=pt`)
            .then(res => res.json())
            .then(data => {
              if (data && data.main && data.weather && data.weather.length > 0 && data.wind) {
                weatherTemp.innerText = data.main.temp.toFixed(1);
                weatherHumidity.innerText = data.main.humidity;
                weatherDesc.innerText = data.weather[0].description;
                weatherWind.innerText = data.wind.speed;
              } else {
                weatherTemp.innerText = "—";
                weatherHumidity.innerText = "—";
                weatherDesc.innerText = "—";
                weatherWind.innerText = "—";
                console.error("Dados de clima inválidos:", data);
              }
            })
            .catch(err => {
              weatherTemp.innerText = "—";
              weatherHumidity.innerText = "—";
              weatherDesc.innerText = "—";
              weatherWind.innerText = "—";
              console.error("Erro ao buscar clima:", err);
            });
        } else {
          weatherTemp.innerText = "—";
          weatherHumidity.innerText = "—";
          weatherDesc.innerText = "—";
          weatherWind.innerText = "—";
        }

        // Mostrar container
        countryFlagOutput.onload = () => {
          container.classList.remove("hide");
          loading.classList.add("hide");
        };

      })
      .catch(() => {
        loading.innerText = "Nenhum dado encontrado sobre este país!";
      });
  });
});

// ===========================
// FECHAR SIDE PANEL
// ===========================
closeBtn.addEventListener("click", () => {
  sidePanel.classList.remove("side-panel-open");
});

// ===========================
// ZOOM DO MAPA
// ===========================
let zoomValue = 100;
zoomOutBtn.disabled = true;

zoomInBtn.addEventListener("click", () => {
  zoomOutBtn.disabled = false;
  zoomValue += 100;
  if (zoomValue >= 500) zoomInBtn.disabled = true;
  map.style.width = zoomValue + "vw";
  map.style.height = zoomValue + "vh";
  zoomValueOutput.innerText = zoomValue + "%";
});

zoomOutBtn.addEventListener("click", () => {
  zoomInBtn.disabled = false;
  zoomValue -= 100;
  if (zoomValue <= 100) zoomOutBtn.disabled = true;
  map.style.width = zoomValue + "vw";
  map.style.height = zoomValue + "vh";
  zoomValueOutput.innerText = zoomValue + "%";
});

// ===========================
// CRUD PANEL
// ===========================
const crudBtn = document.querySelector(".crud-btn");
const crudPanel = document.querySelector(".crud-panel");
const crudClose = document.querySelector(".crud-close-btn");

crudBtn.addEventListener("click", () => crudPanel.classList.add("crud-panel-open"));
crudClose.addEventListener("click", () => crudPanel.classList.remove("crud-panel-open"));

// ===========================
// CARD CENTRAL DO CRUD
// ===========================
const crudCard = document.querySelector(".crud-card");
const selectPais = document.getElementById("selectPais");
const btnFecharCard = document.getElementById("btnFecharCard");

document.getElementById("btnCrudPaises").addEventListener("click", () => {
  sidePanel.classList.remove("side-panel-open");
  crudPanel.classList.remove("crud-panel-open");

  crudCard.classList.add("show");
  document.querySelector(".crud-card-title").innerText = "Gerenciar Países";

  fetch("backend/api/listar_paises.php")
    .then(res => res.json())
    .then(paises => {
      selectPais.innerHTML = "";
      paises.forEach(p => selectPais.innerHTML += `<option>${p.nm_pais}</option>`);
    });
});

document.getElementById("btnCrudCidades").addEventListener("click", () => {
  sidePanel.classList.remove("side-panel-open");
  crudPanel.classList.remove("crud-panel-open");

  crudCard.classList.add("show");
  document.querySelector(".crud-card-title").innerText = "Gerenciar Cidades";

  fetch("backend/api/listar_cidades.php")
    .then(res => res.json())
    .then(cidades => {
      selectPais.innerHTML = "";
      cidades.forEach(c => selectPais.innerHTML += `<option>${c.nm_cidade}</option>`);
    });
});

btnFecharCard.addEventListener("click", () => crudCard.classList.remove("show"));
