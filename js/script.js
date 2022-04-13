const key = config.API_KEY;
const container = document.querySelector(".container");
const inputPart = document.querySelector(".input-section");
const infoTxt = document.querySelector(".info-text");
const inputField = document.querySelector("input");
const locationBtn = document.querySelector("button");
const arrowBack = document.querySelector("header .bx-left-arrow-alt")

// weather detail information selectors
const temperature = document.querySelector(".temp .numb");
const humidInfo = document.querySelector(".humidity span");
const feelsLike = document.querySelector(".temp .numb-2");
const weather = document.querySelector(".weather");
const locationInfo = document.querySelector(".location span");
const weatherIcon = document.querySelector(".weather-section .icon img");
const dayNight = document.querySelector(".time")

// ************** EVENT LISTENERS **************
inputField.addEventListener("keyup", function(e) {
  // check if user hit enter and the input value is not empty
  if(e.key == "Enter" && inputField.value != "") {
    // pass input value to get data from api
    requestAPI(inputField.value);
  }
});

locationBtn.addEventListener("click", function() {
  // check if browser supports geolocation api
  if(navigator.geolocation) {
    // method to return user's position - if successful then onSuccess will call
    navigator.geolocation.getCurrentPosition(onSuccess, onError)
  }else {
    alert("Your browser does nto support geolocation api")
  }
})

arrowBack.addEventListener("click", function() {
  container.classList.remove("active");
  infoTxt.innerText = 'Please enter a city location'
  infoTxt.classList.remove("pending", "error")
})

// ************** FUNCTIONS **************
const onError = function(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

const onSuccess = function(position) {
  // if user allows then get lat and long of the user device
  // console.log(position)
  const { latitude, longitude } = position.coords;
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=imperial`;

  // get data from geolocation endpoint
  fetchData(api)
    .then(data => weatherDetails(data))
}

// Get Weather details from object / update UI
const weatherDetails = function(data) {
  infoTxt.classList.replace("pending", "error");
  if(data.cod === "404") {
    infoTxt.innerText = `${inputField.value} is not a valid city name`;
    inputField.value = ""
  } else {
    inputField.value = ""
    // active the container class
    container.classList.add("active");

    // get info from data object
    let city = data.name;
    let country = data.sys.country;
    // get description and icon string id
    const { description, icon } = data.weather[0] // array of objects
    // get temperature info
    const {feels_like, humidity, temp } = data.main; // object

    // change weather icon - use from API icons
    weatherIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`

    // change card day/night image
    if(icon.includes("d")) {
      dayNight.src = "./img/day.png";
    } else if(icon.includes("n")) {
      dayNight.src = "./img/night.png";
    }
    // change inner text of elements on card
    temperature.innerText = Math.floor(temp);
    humidInfo.innerText = `${humidity}%`;
    feelsLike.innerText = Math.floor(feels_like);
    weather.innerText = description;
    locationInfo.innerText = `${city} ${country}`;
  }

}

// asynchronous function that fetches data
const fetchData = async function(api) {
  // change the inner text to show pending data
  infoTxt.innerText = "Getting weather details..."
  infoTxt.classList.add("pending");

  // fetch data from api, resolve promise
  const response = await fetch(api);
  // convert JSON text file to js object
  const data = await response.json();
  console.log(data);
  // returns a promise to where function is called
  return data
}

// configures api url to request data
const requestAPI = function(city) {
  console.log(city);
  const base = `https://api.openweathermap.org/data/2.5/weather`
  const query = `?q=${city}&appid=${key}&units=imperial`;
  let api = base + query;

  // resolve promise and pass data to get weather details & update UI
  fetchData(api)
    .then(data => weatherDetails(data))
    .catch(err => console.log(err))
}
