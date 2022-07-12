'use strict';

/* ================ VARIABLE ================ */

const dayOfWeek = document.querySelector('.weather--left .day'),
      date = document.querySelector('.date'),
      city = document.querySelector('.city'),
      imgState = document.querySelector('.weather--left .weather__state'),
      temperature = document.querySelector('.weather--left .temperature'),
      textState = document.querySelector('.state'),
      pressure = document.querySelector('.pressure'),
      humidity = document.querySelector('.humidity'),
      wind = document.querySelector('.wind'),
      timeline = document.querySelector('.weather__timeline'),
      input = document.querySelector('.input'),
      btnSearch = document.querySelector('.icon--search'),
      btnDeviceLoc = document.querySelector('.weather__current-location')
      ;

const apiKeys = '74b2bc7eab84c86dab9dde6f1609b9ab';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const states = {
    ash: './icons/ash.png',
    clear: './icons/clear-sky.png',
    clouds: './icons/cloud.png',
    drizzle: './icons/drizzle.png',
    dust: './icons/sandstorm.png',
    fog: './icons/fog.png',
    haze: './icons/haze.png',
    mist: './icons/mist.png',
    sand: './icons/sand.png',
    smoke: './icons/carbon-dioxide.png',
    snow: './icons/snowy.png',
    squall: './icons/squall.png',
    sun: './icons/sun.png',
    rain: './icons/rain.png', 
    thunderstorm: './icons/thunderstorm.png',
    tornado: './icons/tornado.png'
}

/* ================ UTILITY ================ */

const init = () => {
    input.value = '';
}

/* ================ HANDLE EVENT ================ */


const getWeatherData = async function(e) {
    try {
        // If 'enter' key || hit search icon then implements fecth api 
        if(e.target.classList.contains('input') && e.key !== 'Enter')   return;
        
        // Get value from input
        const cityInput = input.value.trim().toLowerCase();
        
        const weatherData = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKeys}`);

        const res = await weatherData.json();
        console.log(res);

        // Get today
        const now = new Date();

        // Day of week
        dayOfWeek.textContent = weekdays[now.getDay()];
        
        // day, month year
        date.textContent = `${now.getDate()}, ${months[now.getMonth()]} ${now.getFullYear()}`;

        // city and country
        city.innerHTML = `${res.city.name} <span class="text text--mini country">${res.city.country}</span>`;

        const weatherToday = res.list[0];
        
        imgState.src = states[weatherToday.weather[0].main.toLowerCase()];
        temperature.innerHTML = `${Math.trunc(weatherToday.main.temp - 270)}<span class="text text--small unit">℃</span>`;
        textState.textContent = weatherToday.weather[0].description;
        
        pressure.textContent = `${weatherToday.main.pressure} Pa`;
        humidity.textContent = `${weatherToday.main.humidity}%`;
        wind.textContent = `${weatherToday.wind.speed} km/h`;
        
        // Weather in 4 day
        timeline.innerHTML = '';
        for(let i = 0; i <= 24; i += 8) {
            timeline.insertAdjacentHTML('beforeend', `
                <div class="weather__timeline__day">
                    <img src="${states[res.list[i].weather[0].main.toLowerCase()]}" alt="" class="icon icon--small weather__state">
                    <p class="text text--mini day">${weekdays[now.getDay() + i / 8].slice(0, 3)}</p>
                    <p class="text text--bold text--small temperature">
                        ${Math.trunc(res.list[i].main.temp - 270)}<span class="text text--small unit">℃</span>
                    </p>
                    </p>
                </div>
            `);
            
        }
    } catch (err) {
        console.log(err);
    }
}

input.addEventListener('keyup', getWeatherData);
btnSearch.addEventListener('click', getWeatherData);
window.addEventListener('load', init);