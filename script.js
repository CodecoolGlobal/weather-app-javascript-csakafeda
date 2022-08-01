// VARIABLES
const WEATHER_API_KEY = '15023434dde5493fa46114812220108';
const PEXELS_API_KEY = '563492ad6f917000010000017dc7253158424d50865df68010506ac8';
const LOCATION_NAME = ;
const CONDITION = ;
const MAX_TEMP = ;
const MIN_TEMP = ;
const TEMPERATURE = ;
const FEELSLIKE = ;
const SUNRISE = ;
const SUNSET = ;
const HUMIDITY = ;
const PRESSURE = ;
const UV_LEVEL = ;
const WIND = ;

// Fetching bitches

fetch(`http://api.weatherapi.com/v1/current.json?q=Budapest&key=${WEATHER_API_KEY}&lang=hu`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
fetch(`http://api.weatherapi.com/v1/astronomy.json?q=Budapest&key=${WEATHER_API_KEY}&lang=hu`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })

fetch(`http://api.weatherapi.com/v1/forecast.json?q=Budapest&key=${WEATHER_API_KEY}&lang=hu`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })

// Create a simple input field with an autocomplete feature which in after 3 characters a list of cities appear



// Create a card that shows the weather data (temperature, sky conditions, humidity, etc.) of the selected city



// Searching and selecting a new city should update the card, event listener - change maybe



// OPTIONAL TASKS

// Create a button to put a city into favourites, which shows up when the input field is selected and empty



// When weather panel loading there is a spinning animation (https://codepen.io/wang0nya/pen/bzwQPr)



// Assign background to chosen city, create object which store city name and image url, use Pexels API to get image