// VARIABLES

const PEXELS_API_KEY = '563492ad6f917000010000017dc7253158424d50865df68010506ac8';
const WEATHER_API_KEY = '15023434dde5493fa46114812220108';
const BODY = document.querySelector('body');

//CHANGING VARIABLES

let LOCATION_NAME = 'Budapest';
let ICON;
let CONDITION_TEXT;
let MAX_TEMP;
let MIN_TEMP;
let ACTUAL_TEMP;
let FEELSLIKE;
let SUNRISE;
let SUNSET;
let HUMIDITY;
let PRESSURE;
let UV_LEVEL;
let WIND;
let CITY_NAMES;
let BGRND_IMG;


// GET data from weather api
getData();
bgrndImgChange();

function getData() {
    fetch(`http://api.weatherapi.com/v1/current.json?q=${LOCATION_NAME}&key=${WEATHER_API_KEY}`)
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
        })
    fetch(`http://api.weatherapi.com/v1/astronomy.json?q=${LOCATION_NAME}&key=${WEATHER_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            SUNRISE = data.astronomy.astro.sunrise;
            SUNSET = data.astronomy.astro.sunset;
        })
    fetch(`http://api.weatherapi.com/v1/forecast.json?q=${LOCATION_NAME}&key=${WEATHER_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            MAX_TEMP = data.forecast.forecastday[0].day.maxtemp_c;
            MIN_TEMP = data.forecast.forecastday[0].day.mintemp_c;
        })

    // fetch(`http://api.weatherapi.com/v1/search.json?q=${LOCATION_NAME}&key=${WEATHER_API_KEY}`)
    //     .then(response => response.json())
    //     .then(data => {

    //     })
}

// Create a simple input field with an autocomplete feature which in after 3 characters a list of cities appear



//document.createElement('input');


// Create a card that shows the weather data (temperature, sky conditions, humidity, etc.) of the selected city



// Searching and selecting a new city should update the card, event listener - change maybe



// OPTIONAL TASKS

// Create a button to put a city into favourites, which shows up when the input field is selected and empty



// When weather panel loading there is a spinning animation (https://codepen.io/wang0nya/pen/bzwQPr)



// Assign background to chosen city, create object which store city name and image url, use Pexels API to get image

function bgrndImgChange() {
    fetch(`https://api.pexels.com/v1/search?query=${LOCATION_NAME}`)
        .then(response => response.json())
        .then(data => {
            BGRND_IMG = data.photos[Math.floor(Math.random() * (data.photos.length))].src.landscape;
            BODY.style.backgroundImage = `url("${BGRND_IMG}")`;
        })
}