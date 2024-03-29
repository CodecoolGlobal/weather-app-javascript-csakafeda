// VARIABLES

const PEXELS_API_KEY = '563492ad6f917000010000017dc7253158424d50865df68010506ac8';
const WEATHER_API_KEY = '15023434dde5493fa46114812220108';
const BODY = document.querySelector('body');
const CITY_INPUT = document.getElementById('input-city');
const ICON_ON_CARD = document.getElementById('card-icon');
const WEATHER_ON_CARD = document.getElementById('card-weather');
const MIN_ON_CARD = document.getElementById('card-min');
const MAX_ON_CARD = document.getElementById('card-max');
const CITY_ON_CARD = document.getElementById('card-city');
const DEGREE_ON_CARD = document.getElementById('card-degree');
const FEELS_LIKE_ON_CARD = document.getElementById('card-feelslike');
const HUMIDITY_ON_CARD = document.getElementById('card-humidity');
const PRESSURE_ON_CARD = document.getElementById('card-pressure');
const UV_ON_CARD = document.getElementById('card-uv');
const WIND_OR_CARD = document.getElementById('card-wind');
const LOCAL_TIME_ON_CARD = document.getElementById("card-time");
const TOGGLE_FAVORITE = document.getElementById("button-add-favorite");
const NEW_DIV = document.createElement('div');
const SUNNY = "1000";
const CLOUD = "1003,1006,1009";
const RAIN = "1063,1087,1150,1153,1168,1171,1183,1186,1189,1192,1195,1198,1201,1243,1246,1273,1276";
const FOG = "1030,1135,1147";
const WINTER = "1066,1069,1072,1114,1117,1204,1207,1210,1213,1216,1219,1222,1225,1237,1240,1249,1252,1255,1258,1261,1264,1279,1282";
const FAV_ARRAY = [];
const SPINNER = document.getElementById('spinner');

//CHANGING VARIABLES

let LOCATION_NAME = 'London';
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
let LOCAL_TIME;

// GET city names starting with user's input

const GEO_URL = 'https://api.geoapify.com/v1/ipinfo?apiKey=1f0ce3f788934d84ada176d2cb290b2e';
async function fetchGeoUrl() {
    let response = await fetch(`${GEO_URL}`)
    let locationData = await response.json();
    LOCATION_NAME = locationData.city.name;
    getData();
}

async function searchInputCity(input) {
    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=4&namePrefix=${input}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '3c6387f1bbmsh3257c41f0afa079p1c70e4jsn3a0f607bffe0',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };
    let response = await fetch(url, options)
    let json = await response.json();
    let cityList = [];
    for (let i = 0; i < json.data.length; i++) {
        cityList.push(json.data[i].city)
    }
    return cityList;
}

// GET user's location

fetchGeoUrl();

// GET data from weather api

async function getData() {
    loadData();
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
            LOCAL_TIME = data.location.localtime.slice(-5);
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
    SPINNER.hidden = true;
}

// Create a simple input field with an autocomplete feature which in after 3 characters a list of cities appear
autocomplete(CITY_INPUT);

function autocomplete(CITY_INPUT) {
    let currentFocus;
    CITY_INPUT.addEventListener('input', async function (e) {
        let a;
        let b;
        let i;
        let val = this.value;
        closeAllLists();
        if (!val) {
            return false;
        }
        if (val.length >=3) {
        currentFocus = -1;
        a = document.createElement('div');
        a.setAttribute('id', this.id + 'autocomplete-list');
        a.setAttribute('class', 'autocomplete-items');
        this.parentNode.appendChild(a);
        let cityList = await searchInputCity(val);
        for (i = 0; i < cityList.length; i++) {
            if (cityList[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement('div');;
                b.innerHTML = '<strong>' + cityList[i].substr(0, val.length) + '</strong>';
                b.innerHTML += cityList[i].substr(val.length);
                b.innerHTML += '<input type="hidden" value="' + cityList[i] + '">';
                b.addEventListener('click', function (e) {
                    CITY_INPUT.value = this.getElementsByTagName('input')[0].value;
                    closeAllLists();
                    LOCATION_NAME = CITY_INPUT.value;
                    getData();
                    if (FAV_ARRAY.includes(LOCATION_NAME.toLocaleUpperCase())) {
                        TOGGLE_FAVORITE.innerHTML = " Remove from Favorites"
                    } if (!FAV_ARRAY.includes(LOCATION_NAME.toLocaleUpperCase())) {
                        TOGGLE_FAVORITE.innerHTML = " Add To Favorites"
                    }
                });
                a.appendChild(b);
            }
        }
    }
});

CITY_INPUT.addEventListener('keydown', function (e) {
    let x = document.getElementById(this.id + 'autocomplete-list');
    if (x) {
        x = x.getElementsByTagName('div');
    }
    if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
    }
    else if (e.keyCode == 38) {
        currentFocus--;
        addActive(x);
    }
    else if (e.keyCode == 13) {
        e.preventDefault();
        LOCATION_NAME = CITY_INPUT.value;
        getData();
        if (currentFocus > -1) {
            if (x) {
                x[currentFocus].click();
            }
        }
        if (FAV_ARRAY.includes(LOCATION_NAME.toLocaleUpperCase())) {
            TOGGLE_FAVORITE.innerHTML = " Remove from Favorites"
        } if (!FAV_ARRAY.includes(LOCATION_NAME.toLocaleUpperCase())) {
            TOGGLE_FAVORITE.innerHTML = " Add To Favorites "
        }
    }
});

function addActive(x) {
    if (!x) {
        return false;
    }
    removeActive(x);
    if (currentFocus >= x.length) {
        currentFocus = 0;
    }
    if (currentFocus < 0) {
        currentFocus = (x.length - 1);
    }
    x[currentFocus].classList.add('autocomplete-active')
}

function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
        x[i].classList.remove('autocomplete-active');
    }
}

function closeAllLists(elemnt) {
    let x = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < x.length; i++) {
        if (elemnt !== x[i] || elemnt !== CITY_INPUT) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
}

document.addEventListener('click', function (e) {
    closeAllLists(e.target);
});
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
    FEELS_LIKE_ON_CARD.innerHTML = `Feels like: ` + FEELSLIKE + `<sup>&deg;</sup>`;
    WIND_OR_CARD.innerHTML = WIND + " km/h";
    PRESSURE_ON_CARD.innerHTML = PRESSURE + " mb";
    UV_ON_CARD.innerHTML = UV_LEVEL;
    HUMIDITY_ON_CARD.innerHTML = HUMIDITY + ' %';
    LOCAL_TIME_ON_CARD.innerHTML = LOCAL_TIME;
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
    await fetch(`https://api.pexels.com/v1/search?query=${LOCATION_NAME}`/*${IMG_SEARCHER}**/, {
        headers: {
            Authorization: PEXELS_API_KEY
        }
    })
        .then(response => response.json())
        .then(data => {
            // ha lefagyna az oldal, consoleban a "Limit reach ---> várni egy órát, hogy újra lehessen kérni képet" + console.log(data)
            BGRND_IMG = data.photos[Math.floor(Math.random() * 10)].src.landscape;
            BODY.style.backgroundImage = `url("${BGRND_IMG}")`;
        })
}

TOGGLE_FAVORITE.addEventListener("click", () => {
    if (!FAV_ARRAY.includes(LOCATION_NAME.toUpperCase())) {
        FAV_ARRAY.push(LOCATION_NAME.toUpperCase());
        addFav();
    } else {
        const index = FAV_ARRAY.indexOf(LOCATION_NAME.toUpperCase());
        FAV_ARRAY.splice(index, 1);
        removeFav();
    }
});

function addFav() {
    let li = document.createElement("li");
    li.innerHTML = LOCATION_NAME;
    li.setAttribute("id", `${LOCATION_NAME.toUpperCase()}`);
    document.getElementById("add-to-fav").appendChild(li);
    let LIST_ELEMENT = document.getElementById(`${LOCATION_NAME.toUpperCase()}`);
    LIST_ELEMENT.style.cursor = "pointer";
    LIST_ELEMENT.addEventListener("mousedown", () => {
        LOCATION_NAME = LIST_ELEMENT.innerHTML;
        getData();
        fillCardWithData();
    });
    if (FAV_ARRAY.includes(LOCATION_NAME.toLocaleUpperCase())) {
        TOGGLE_FAVORITE.innerHTML = " Remove from Favorite"
    } else {
        TOGGLE_FAVORITE.innerHTML = " Add To Favorite"
    }
}

function removeFav() {
    let location = document.getElementById(LOCATION_NAME.toUpperCase())
    location.remove();
    if (!FAV_ARRAY.includes(LOCATION_NAME.toLocaleUpperCase())) {
        TOGGLE_FAVORITE.innerHTML = " Add to Favorite"
    }
}

function loadData() {
    SPINNER.removeAttribute('hidden');
    fetch('https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=5000ms')
        .then(response => response.json())
        .then(data => {
            SPINNER.setAttribute('hidden', '');
        });
}