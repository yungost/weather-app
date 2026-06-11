const btnGet = document.querySelector('.get_weather');
const showTemp = document.querySelector('.temperature');
const showWind = document.querySelector('.wind_speed');
const cityInput = document.getElementById('city');
const resultContainer = document.querySelector('.result');

async function weatherAPI(latitude, longitude){
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error.message);
  }
}

async function geoLocationAPI(name){
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=1&language=en&format=json`;
  try{
    const response = await fetch(url);

    if(!response.ok){
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
  }
}
async function getWeather(){
  resultContainer.classList.add('on');
  showTemp.textContent = "Loading...";
  showWind.textContent = '';
  let city = cityInput.value.trim()
  if(city === ''){
    showTemp.textContent = 'Please input city name';
    showWind.textContent = '';
    return;
  }
  const location = await geoLocationAPI(city); //City input by user -> send into geoLocationAPI
  if (!location.results) {
    showTemp.textContent = 'City not found';
    showWind.textContent = '';
    return;
  }
  const latitude = location.results[0].latitude;
  const longitude = location.results[0].longitude;
  const result = await weatherAPI(latitude, longitude);

  showTemp.textContent = 'Temperature is: ' + result.current.temperature_2m +'°C;';
  showWind.textContent = 'Wind speed is: ' + result.current.wind_speed_10m + ' km/h;';
}
btnGet.addEventListener('click', getWeather);
cityInput.addEventListener('keydown', (e) => {
  if(e.code === 'Enter'){
    getWeather();
  }
});