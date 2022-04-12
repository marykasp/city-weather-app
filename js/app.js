// ************** SELECTORS **************
const key = "6761f5c44d7776ef436b1d69d5ab11b2";
const container = document.querySelector(".container");
const inputPart = document.querySelector(".input-section");
const infoTxt = document.querySelector(".info-text");
const inputField = document.querySelector("input")

// ************** EVENT LISTENERS **************
inputField.addEventListener("keyup", function(e) {
  // check if user hit enter and the input value is not empty
  if(e.key == "Enter" && inputField.value != "") {
    // pass input value to get data from api
    requestData(inputField.value);
  }
})
// ************** FUNCTIONS **************
const requestData = async function(city) {
  console.log(city)
  let base = `https://api.openweathermap.org/data/2.5/weather`
  let query = `?q=${city}&appid=${key}`

  const response = await fetch(base + query);
  const data = await response.json();
}
