const key = "6761f5c44d7776ef436b1d69d5ab11b2";
const container = document.querySelector(".container");
const inputPart = document.querySelector(".input-section");
const infoTxt = document.querySelector(".info-text");
const inputField = document.querySelector("input");
const locationBtn = document.querySelector("button");

// weather detail information selectors
const temperature = document.querySelector(".temp .numb");
const humidInfo = document.querySelector(".humidity span");
const feelsLike = document.querySelector(".temp .numb-2");
const weather = document.querySelector(".weather");
const locationInfo = document.querySelector(".location span");

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

const weatherDetails = function(data) {
  infoTxt.classList.replace("pending", "error");
  if(data.cod === "404") {
    infoTxt.innerText = `${inputField.value} is not a valid city name`;
    inputField.value = ""
  }

  let city = data.name;
  let country = data.sys.country;

  const { description, id } = data.weather[0] // array of objects
  const {feels_like, humidity, temp } = data.main;

  // active the container class
  container.classList.add("active");
  // change inner text of elements on card
  temperature.innerText = Math.floor(temp);
  humidInfo.innerText = `${humidity}%`;
  feelsLike.innerText = Math.floor(feels_like);
  weather.innerText = description;
  locationInfo.innerText = `${city} ${country}`
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
