// elementos do html
const map = document.querySelector('svg');
const countries = document.querySelectorAll('path');
const sidePanel = document.querySelector('.side-panel');
const container = document.querySelector('.side-panel .container');
const closeBtn = document.querySelector('.close-btn');
const loading = document.querySelector('.loading');
const zoomInBtn = document.querySelector('.zoom-in');
const zoomOutBtn = document.querySelector('.zoom-out');
const zoomValueOutput = document.querySelector('.zoom-value');

// dados do painel
const countryNameOutput = document.querySelector('.country-name');
const countryFlagOutput = document.querySelector('.country-flag');
const cityOutput = document.querySelector('.city');
const areaOutput = document.querySelector('.area');
const currencyOutput = document.querySelector('.currencies'); // CORRIGIDO
const languagesOutput = document.querySelector('.languages');

countries.forEach(country => {

  // efeito hover
  country.addEventListener('mouseenter', function () {
    if (this.classList.length === 0) return; // ← EVITA ERRO DO PONTO

    const selector = '.' + [...this.classList].join('.');
    const matching = document.querySelectorAll(selector);

    matching.forEach(el => el.style.fill = '#c99aff');
  });

  country.addEventListener('mouseout', function () {
    if (this.classList.length === 0) return; // ← EVITA ERRO DO PONTO

    const selector = '.' + [...this.classList].join('.');
    const matching = document.querySelectorAll(selector);

    matching.forEach(el => el.style.fill = '#254650');
  });

  // clique em país
  country.addEventListener('click', function (e) {
    loading.innerText = 'Loading...';
    container.classList.add("hide");
    loading.classList.remove("hide");

    let clickedCountryName;

    if (e.target.hasAttribute('name')) {
      clickedCountryName = e.target.getAttribute('name');
    } else {
      clickedCountryName = e.target.classList.value;
    }

    sidePanel.classList.add('side-panel-open');

    // API
    fetch(`https://restcountries.com/v3.1/name/${clickedCountryName}?fullText=true`)
      .then(response => {
        if (!response.ok) throw new Error('Erro ao buscar país');
        return response.json();
      })
      .then(data => {

        const country = data[0];

        // Preenchendo os dados
        countryNameOutput.innerText = country.name.common;
        countryFlagOutput.src = country.flags.png;
        cityOutput.innerText = country.capital ? country.capital[0] : "N/A";

        const formattedArea = country.area.toLocaleString('de-DE');
        areaOutput.innerHTML = formattedArea + ' km<sup>2</sup>';

        // moedas
        currencyOutput.innerHTML = "";
        if (country.currencies) {
          Object.keys(country.currencies).forEach(key => {
            currencyOutput.innerHTML += `<li>${country.currencies[key].name}</li>`;
          });
        }

        // idiomas
        languagesOutput.innerHTML = "";
        if (country.languages) {
          Object.keys(country.languages).forEach(key => {
            languagesOutput.innerHTML += `<li>${country.languages[key]}</li>`;
          });
        }

        // mostrar quando bandeira carregar
        countryFlagOutput.onload = () => {
          container.classList.remove('hide');
          loading.classList.add('hide');
        };

      })
      .catch(err => {
        console.error(err);
        loading.innerText = "No data to show for this country";
      });
  });
});

closeBtn.addEventListener('click', () => {
  sidePanel.classList.remove('side-panel-open');
});

let zoomValue = 100;
zoomOutBtn.disabled = true;

zoomInBtn.addEventListener('click', () => {
  zoomOutBtn.disabled = false;
  zoomValue += 100;
  if (zoomValue < 500) {
    zoomInBtn.disabled = false;
  } else {
    zoomInBtn.disabled = true;
  } 

  map.style.width = zoomValue + 'vw';
  map.style.height = zoomValue + 'vh';

  zoomValueOutput.innerText = zoomValue + '%';
});

zoomOutBtn.addEventListener('click', () => {
  zoomInBtn.disabled = false;
  zoomValue -= 100;
  if (zoomValue > 100) {
    zoomOutBtn.disabled = false;
  } else {
    zoomOutBtn.disabled = true;
  } 

  map.style.width = zoomValue + 'vw';
  map.style.height = zoomValue + 'vh';
  zoomValueOutput.innerText = zoomValue + '%';
});
