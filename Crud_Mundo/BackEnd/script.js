// =======================================================
// ELEMENTOS
// =======================================================
const map = document.querySelector("svg");
const countries = document.querySelectorAll("path");

const sidePanelInfo = document.getElementById("side-panel-info");
const sidePanelClima = document.getElementById("side-panel-clima");
const sidePanelCities = document.getElementById("side-panel-cities");

const closeInfo = document.querySelector(".close-btn-info");
const closeClima = document.querySelector(".close-btn-clima");
const closeCities = document.querySelector(".close-btn-cities");

const countryNameOutput = sidePanelInfo.querySelector(".country-name");
const countryFlagOutput = sidePanelInfo.querySelector(".country-flag");
const cityOutput = sidePanelInfo.querySelector(".city");
const areaOutput = sidePanelInfo.querySelector(".area");
const currencyOutput = sidePanelInfo.querySelector(".currencies");
const languagesOutput = sidePanelInfo.querySelector(".languages");
const continentOutput = sidePanelInfo.querySelector(".continent");
const populationOutput = sidePanelInfo.querySelector(".population");

const weatherTemp = sidePanelClima.querySelector(".weather-temp");
const weatherHumidity = sidePanelClima.querySelector(".weather-humidity");
const weatherDesc = sidePanelClima.querySelector(".weather-desc");
const weatherWind = sidePanelClima.querySelector(".weather-wind");

const cityListCities = document.getElementById("cityListCities");

const zoomInBtn = document.querySelector(".zoom-in");
const zoomOutBtn = document.querySelector(".zoom-out");
const zoomValueOutput = document.querySelector(".zoom-value");

const circleMenu = document.getElementById("circleMenu");
const menuBtn = document.getElementById("menuBtn");
const infoBtn = circleMenu.querySelector(".item.info");
const cloudBtn = circleMenu.querySelector(".item.cloud");
const citiesBtn = circleMenu.querySelector(".item.cities");
const editBtn = circleMenu.querySelector(".item.edit");

const apiKey = "0c1f5a3278c8fad08da589bb59cbfd50";

let paisSelecionado = null;
let zoomValue = 100;
let mouseOverMenuOrPanel = false;

// =======================================================
// FUNÇÃO POSICIONAR CARD (EVITA SAIR DA TELA)
// =======================================================
function positionCard(card, x, y) {
  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  card.style.left = (x + cardWidth + 20 > screenWidth ? x - cardWidth - 20 : x + 20) + "px";
  card.style.top = (y + cardHeight > screenHeight ? screenHeight - cardHeight - 20 : y + 20) + "px";
}

// =======================================================
// CLICAR NO PAÍS → MOSTRA MENU CIRCULAR
// =======================================================
countries.forEach(country => {
  country.addEventListener("click", e => {
    e.stopPropagation();
    paisSelecionado = e.target.getAttribute("name") || e.target.classList.value;

    circleMenu.style.left = e.pageX + "px";
    circleMenu.style.top = e.pageY + "px";
    circleMenu.classList.add("active");

    sidePanelInfo.classList.remove("show");
    sidePanelClima.classList.remove("show");
    sidePanelCities.classList.remove("show");
  });
});

// =======================================================
// FECHAR MENU CIRCULAR AO CLICAR FORA
// =======================================================
document.addEventListener("click", (e) => {
  const clicouNoMenu = circleMenu.contains(e.target);
  const clicouNoBtnCentral = menuBtn.contains(e.target);
  const clicouNoX = closeInfo.contains(e.target) || closeClima.contains(e.target) || closeCities.contains(e.target);

  if (!clicouNoMenu && !clicouNoBtnCentral && !clicouNoX) {
    circleMenu.classList.remove("active");
    sidePanelInfo.classList.remove("show");
    sidePanelClima.classList.remove("show");
    sidePanelCities.classList.remove("show");
  }
});

// =======================================================
// BOTÃO CENTRAL FECHA MENU
// =======================================================
menuBtn.addEventListener("click", e => {
  e.stopPropagation();
  circleMenu.classList.remove("active");
  sidePanelInfo.classList.remove("show");
  sidePanelClima.classList.remove("show");
  sidePanelCities.classList.remove("show");
});

// =======================================================
// BOTÕES DE FECHAR SIDE PANELS
// =======================================================
closeInfo.addEventListener("click", () => sidePanelInfo.classList.remove("show"));
closeClima.addEventListener("click", () => sidePanelClima.classList.remove("show"));
closeCities.addEventListener("click", () => sidePanelCities.classList.remove("show"));

// =======================================================
// BOTÃO INFO → ABRE CARD INFO
// =======================================================
infoBtn.addEventListener("click", e => {
  e.stopPropagation();
  if (!paisSelecionado) return;

  carregarInfoPais(paisSelecionado);
  const rect = circleMenu.getBoundingClientRect();
  positionCard(sidePanelInfo, rect.right, rect.top);

  sidePanelInfo.classList.add("show");
  sidePanelClima.classList.remove("show");
  sidePanelCities.classList.remove("show");
});

// =======================================================
// BOTÃO CLOUD → ABRE CARD CLIMA
// =======================================================
cloudBtn.addEventListener("click", e => {
  e.stopPropagation();
  if (!paisSelecionado) return;

  carregarClima(paisSelecionado);
  const rect = circleMenu.getBoundingClientRect();
  positionCard(sidePanelClima, rect.right, rect.top);

  sidePanelClima.classList.add("show");
  sidePanelInfo.classList.remove("show");
  sidePanelCities.classList.remove("show");
});

// =======================================================
// BOTÃO EDIT → ABRE CARD EDIT
// =======================================================
editBtn.addEventListener("click", e => {
  e.stopPropagation();
  window.location.href = "crud.php";
});


// =======================================================
// BOTÃO CITIES → ABRE CARD CIDADES COM EXEMPLO
// =======================================================
citiesBtn.addEventListener("click", e => {
  e.stopPropagation();
  if (!paisSelecionado) return;

  fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(paisSelecionado)}?fullText=true`)
    .then(res => res.json())
    .then(data => {
      const country = data[0];

      // Atualiza título e bandeira
      sidePanelCities.querySelector(".country-name").innerText = country.name.common;
      sidePanelCities.querySelector(".country-flag").src = country.flags.png;

      // Limpa lista e adiciona UMA cidade de exemplo
      cityListCities.innerHTML = "";
      const cityName = "São Paulo"; // cidade de exemplo
      const row = document.createElement("tr");
      row.innerHTML = `<td>${cityName}</td><td><button class="btn-city-weather"><i class="fas fa-cloud"></i></button></td>`;
      cityListCities.appendChild(row);

      // Posiciona o card
      const rect = circleMenu.getBoundingClientRect();
      positionCard(sidePanelCities, rect.right, rect.top);

      // Mostra o card
      sidePanelCities.classList.add("show");

      // Fecha outros cards
      sidePanelInfo.classList.remove("show");
      sidePanelClima.classList.remove("show");
    })
    .catch(err => console.error(err));
});

// =======================================================
// ABRIR CLIMA DA CIDADE AO CLICAR NO ÍCONE
// =======================================================
document.addEventListener("click", e => {
  const btn = e.target.closest(".btn-city-weather");
  if (!btn) return;

  const cityRow = btn.closest("tr");
  const cityName = cityRow.querySelector("td").innerText;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric&lang=pt`)
    .then(res => res.json())
    .then(data => {
      if (data.main && data.weather && data.weather.length > 0 && data.wind) {
        sidePanelClima.querySelector(".country-name").innerText = cityName;
        sidePanelClima.querySelector(".country-flag").src = "";
        weatherTemp.innerText = data.main.temp.toFixed(1);
        weatherHumidity.innerText = data.main.humidity;
        weatherDesc.innerText = data.weather[0].description;
        weatherWind.innerText = data.wind.speed;

        const rect = cityRow.getBoundingClientRect();
        positionCard(sidePanelClima, rect.right, rect.top);
        sidePanelClima.classList.add("show");
        sidePanelInfo.classList.remove("show");
        sidePanelCities.classList.remove("show");
      }
    })
    .catch(err => console.error(err));
});

// =======================================================
// FUNÇÕES CARREGAR INFO E CLIMA
// =======================================================
function carregarInfoPais(countryName) {
  fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`)
    .then(res => res.json())
    .then(data => {
      const country = data[0];
      countryNameOutput.innerText = country.name.common;
      countryFlagOutput.src = country.flags.png;
      cityOutput.innerText = country.capital ? country.capital[0] : "N/A";
      continentOutput.innerText = country.region ?? "N/A";
      populationOutput.innerText = country.population.toLocaleString("pt-BR");
      areaOutput.innerHTML = country.area.toLocaleString("pt-BR") + ' km<sup>2</sup>';

      currencyOutput.innerHTML = "";
      if (country.currencies) Object.keys(country.currencies).forEach(key => {
        currencyOutput.innerHTML += `<li>${country.currencies[key].name}</li>`;
      });

      languagesOutput.innerHTML = "";
      if (country.languages) Object.values(country.languages).forEach(lang => {
        languagesOutput.innerHTML += `<li>${lang}</li>`;
      });
    });
}

function carregarClima(countryName) {
  fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`)
    .then(res => res.json())
    .then(data => {
      const country = data[0];
      sidePanelClima.querySelector(".country-name").innerText = country.name.common;
      sidePanelClima.querySelector(".country-flag").src = country.flags.png;

      const capital = country.capital ? country.capital[0] : null;
      if (!capital) {
        weatherTemp.innerText = weatherHumidity.innerText = weatherDesc.innerText = weatherWind.innerText = "—";
        return;
      }

      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(capital)}&appid=${apiKey}&units=metric&lang=pt`)
        .then(res => res.json())
        .then(weather => {
          if (weather.main && weather.weather && weather.weather.length > 0 && weather.wind) {
            weatherTemp.innerText = weather.main.temp.toFixed(1);
            weatherHumidity.innerText = weather.main.humidity;
            weatherDesc.innerText = weather.weather[0].description;
            weatherWind.innerText = weather.wind.speed;
          } else {
            weatherTemp.innerText = weatherHumidity.innerText = weatherDesc.innerText = weatherWind.innerText = "—";
          }
        })
        .catch(() => {
          weatherTemp.innerText = weatherHumidity.innerText = weatherDesc.innerText = weatherWind.innerText = "—";
        });
    });
}

// =======================================================
// ZOOM
// =======================================================
zoomOutBtn.disabled = true;
zoomInBtn.addEventListener("click", () => {
  zoomValue = Math.min(zoomValue + 25, 500);
  map.style.width = zoomValue + "vw";
  map.style.height = zoomValue + "vh";
  zoomValueOutput.innerText = zoomValue + "%";
  zoomOutBtn.disabled = zoomValue <= 100;
  zoomInBtn.disabled = zoomValue >= 500;
  repositionCards();
});

zoomOutBtn.addEventListener("click", () => {
  zoomValue = Math.max(zoomValue - 25, 100);
  map.style.width = zoomValue + "vw";
  map.style.height = zoomValue + "vh";
  zoomValueOutput.innerText = zoomValue + "%";
  zoomOutBtn.disabled = zoomValue <= 100;
  zoomInBtn.disabled = zoomValue >= 500;
  repositionCards();
});

function repositionCards() {
  const rect = circleMenu.getBoundingClientRect();
  if (sidePanelInfo.classList.contains("show")) positionCard(sidePanelInfo, rect.right, rect.top);
  if (sidePanelClima.classList.contains("show")) positionCard(sidePanelClima, rect.right, rect.top);
  if (sidePanelCities.classList.contains("show")) positionCard(sidePanelCities, rect.right, rect.top);
}

