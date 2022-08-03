// VARIABLES

const PEXELS_API_KEY = '563492ad6f917000010000017dc7253158424d50865df68010506ac8';
const WEATHER_API_KEY = '15023434dde5493fa46114812220108';
const BODY = document.querySelector('body');
const CITY_INPUT = document.getElementById('cityInput');
const ICON_ON_CARD = document.getElementById('iconOnCard');
const WEATHER_ON_CARD = document.getElementById('weatherOnCard');
const MIN_ON_CARD = document.getElementById('minOnCard');
const MAX_ON_CARD = document.getElementById('maxOnCard');
const CITY_ON_CARD = document.getElementById('cityOnCard');
const DEGREE_ON_CARD = document.getElementById('degreeOnCard');
const FEELS_LIKE_ON_CARD = document.getElementById('feelsLikeOnCard');
const HUMIDITY_ON_CARD = document.getElementById('humidityOnCard');
const PRESSURE_ON_CARD = document.getElementById('pressureOnCard');
const UV_ON_CARD = document.getElementById('uvOnCard');
const WIND_OR_CARD = document.getElementById('windOnCard');
const SUNNY = "1000";
const CLOUD = "1003,1006,1009";
const RAIN = "1063,1087,1150,1153,1168,1171,1183,1186,1189,1192,1195,1198,1201,1243,1246,1273,1276";
const FOG = "1030,1135,1147";
const WINTER = "1066,1069,1072,1114,1117,1204,1207,1210,1213,1216,1219,1222,1225,1237,1240,1249,1252,1255,1258,1261,1264,1279,1282";

//CHANGING VARIABLES

let LOCATION_NAME = 'Budapest';
let ICON = "";
let CONDITION_TEXT = "";
let MAX_TEMP = "";
let MIN_TEMP = "";
let ACTUAL_TEMP = "";
let FEELSLIKE;
let SUNRISE;
let SUNSET;
let HUMIDITY;
let PRESSURE;
let UV_LEVEL;
let WIND;
let CITY_NAMES;
let BGRND_IMG;
let LOCATION_CODE;
let IMG_SEARCHER;

// GET data from weather api
function searchInputCity(input) {
    // const fetch = require('node-fetch');
    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${input}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '3c6387f1bbmsh3257c41f0afa079p1c70e4jsn3a0f607bffe0',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };
    fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error('error:' + err));
}

getData();
fillCardWithData();

async function getData() {
    await fetch(`http://api.weatherapi.com/v1/current.json?q=${LOCATION_NAME}&key=${WEATHER_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            ICON = data.current.condition.icon;
            CONDITION_TEXT = data.current.condition.text;
            ACTUAL_TEMP = data.current.temp_c;
            FEELSLIKE = data.current.feelslike_c;
            HUMIDITY = data.current.humidity;
            PRESSURE = data.current.pressure_mb;
            UV_LEVEL = data.current.uv;
            WIND = data.current.wind_kph;
            LOCATION_CODE = data.current.condition.code.toString();
        })
    await fetch(`http://api.weatherapi.com/v1/astronomy.json?q=${LOCATION_NAME}&key=${WEATHER_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            SUNRISE = data.astronomy.astro.sunrise;
            SUNSET = data.astronomy.astro.sunset;
        })

    await fetch(`http://api.weatherapi.com/v1/forecast.json?q=${LOCATION_NAME}&key=${WEATHER_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            MAX_TEMP = data.forecast.forecastday[0].day.maxtemp_c;
            MIN_TEMP = data.forecast.forecastday[0].day.mintemp_c;

        })
    fillCardWithData();
    searchSelector();
    bgrndImgChange();
}

// Create a simple input field with an autocomplete feature which in after 3 characters a list of cities appear
autocomplete();

function autocomplete(inp, arr) {
    let currentFocus;
    CITY_INPUT.addEventListener('input', function (e) {
        if (CITY_INPUT.value.length >= 3) {
            let a;
            let b;
            let i;
            let val = this.value;
            console.log(val);
            closeAllLists();
            console.log(val);
            a = document.createElement('div');
            a.setAttribute('id', this.id + 'autocomplete-list');
            a.setAttribute('class', 'autocomplete-items');
            this.parentNode.appendChild(a);
            console.log(val);
            searchInputCity(val);
        }
    });
}

function closeAllLists(elemnt) {
    let x = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < x.length; i++) {
        if (elemnt !== x[i] || elemnt !== CITY_INPUT) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
}

// Create a card that shows the weather data (temperature, sky conditions, humidity, etc.) of the selected city

// Searching and selecting a new city should update the card, event listener - change maybe
function fillCardWithData() {
    ICON_ON_CARD.src = ICON;
    MIN_ON_CARD.innerHTML = MIN_TEMP + `<sup>&deg;</sup>`;
    MAX_ON_CARD.innerHTML = MAX_TEMP + `<sup>&deg;</sup>`;
    CITY_ON_CARD.innerHTML = LOCATION_NAME;
    DEGREE_ON_CARD.innerHTML = `${ACTUAL_TEMP}` + `<sup>&deg;</sup>`;
    WEATHER_ON_CARD.innerHTML = CONDITION_TEXT;
    FEELS_LIKE_ON_CARD.innerHTML = `FeelReal:` + FEELSLIKE + `<sup>&deg;</sup>`;
    WIND_OR_CARD.innerHTML = WIND + " km/h";
    PRESSURE_ON_CARD.innerHTML = PRESSURE + " ";
    UV_ON_CARD.innerHTML = UV_LEVEL;
    HUMIDITY_ON_CARD.innerHTML = HUMIDITY + ` <sup></sup>`;
}

// OPTIONAL TASKS

// Create a button to put a city into favourites, which shows up when the input field is selected and empty

// When weather panel loading there is a spinning animation (https://codepen.io/wang0nya/pen/bzwQPr)

// Assign background to chosen city, create object which store city name and image url, use Pexels API to get image
function searchSelector() {
    if (SUNNY.includes(LOCATION_CODE)) IMG_SEARCHER = "sun";
    else if (CLOUD.includes(LOCATION_CODE)) IMG_SEARCHER = "cloud";
    else if (RAIN.includes(LOCATION_CODE)) IMG_SEARCHER = "rain";
    else if (FOG.includes(LOCATION_CODE)) IMG_SEARCHER = "fog";
    else if (WINTER.includes(LOCATION_CODE)) IMG_SEARCHER = "snow";
    else IMG_SEARCHER = (LOCATION_NAME);
}

async function bgrndImgChange() {
    await fetch(`https://api.pexels.com/v1/search?query=${LOCATION_NAME}%20${IMG_SEARCHER}`, {
        headers: {
            Authorization: PEXELS_API_KEY
        }
    })
        .then(response => response.json())
        .then(data => {
            // ha lefagyna az oldal, consoleban a "Limit reach ---> várni egy órát, hogy újra lehessen kérni képet" + console.log(data)
            BGRND_IMG = data.photos[Math.floor(Math.random() * 4)].src.landscape;
            BODY.style.backgroundImage = `url("${BGRND_IMG}")`;
        })
}