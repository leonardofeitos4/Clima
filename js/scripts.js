const apiKey = "709efe692594f4a99645309fd8c1aaa1"; // Sua chave de API
const apiCountryURL = "https://flagcdn.com/w320/";
const apiUnsplash = "https://source.unsplash.com/1600x900/?";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const humidityElement = document.querySelector("#humidity span");
const windElement = document.querySelector("#wind span");

const weatherContainer = document.querySelector("#weather-data");
const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");

const suggestionContainer = document.querySelector("#suggestions");
const suggestionButtons = document.querySelectorAll("#suggestions button");

// Loader
const toggleLoader = () => {
  loader.classList.toggle("hide");
};

// Função para pegar os dados do clima
const getWeatherData = async (city) => {
  toggleLoader(); // Ativa o loader

  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

  try {
    const res = await fetch(apiWeatherURL);
    const data = await res.json();
    toggleLoader(); // Desativa o loader

    if (data.cod === "404") {
      alert("Cidade não encontrada! Tente novamente.");
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    alert("Erro ao buscar dados do clima. Verifique sua conexão.");
    toggleLoader(); // Desativa o loader
    return null;
  }
};

// Função para exibir os dados na tela
const showWeatherData = async (city) => {
  const data = await getWeatherData(city);

  if (!data) return; // Se a cidade não for encontrada, para aqui

  cityElement.innerText = data.name;
  tempElement.innerText = Math.round(data.main.temp);
  descElement.innerText = data.weather[0].description;

  // Ícone do clima
  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );
  weatherIconElement.setAttribute("alt", data.weather[0].description);

  // Bandeira do país
  countryElement.setAttribute(
    "src",
    apiCountryURL + data.sys.country.toLowerCase() + ".png"
  );
  countryElement.setAttribute("alt", `Bandeira de ${data.sys.country}`);

  humidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed} km/h`;

  // Mudar imagem de fundo
  document.body.style.backgroundImage = `url("${apiUnsplash + city}")`;

  weatherContainer.classList.remove("hide");
};

// Eventos
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (city === "") {
    alert("Por favor, digite o nome de uma cidade.");
    return;
  }

  showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value;
    showWeatherData(city);
  }
});

// Sugestões
suggestionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const city = btn.getAttribute("id");
    showWeatherData(city);
  });
});