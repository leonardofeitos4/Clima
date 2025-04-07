const apiKey = "709efe692594f4a99645309fd8c1aaa1";
const apiCountryURL = "https://flagcdn.com/w320/";

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
      // Esconde o container de clima
      weatherContainer.classList.add("hide");

      // Mostra a mensagem de erro
      errorMessageContainer.classList.remove("hide");

      return null;
    }

    // Esconde a mensagem de erro se a cidade for encontrada
    errorMessageContainer.classList.add("hide");

    return data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    toggleLoader(); // Desativa o loader

    // Esconde o container de clima
    weatherContainer.classList.add("hide");

    // Mostra a mensagem de erro
    errorMessageContainer.classList.remove("hide");

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

  // Mudar imagem de fundo para uma imagem local
  document.body.style.backgroundImage = `url('img/bg-weather.jpg')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";

  weatherContainer.classList.remove("hide");
};

// Eventos
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (city === "") {
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
