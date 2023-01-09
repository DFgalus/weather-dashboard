function findCity() {
    let cityName = $('#cityname')[0].value.trim()

    let apiURL = "https://api.openweathermap.org/data/2.5/weather?=" + cityName + "&units=imperial&appid=85fdad770cb1b5590007071765f836b5";
    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                $("#cityName")[0].textContent = cityName + "(" + dayjs().format('M/D/YYYY') + ")";
                $("#city-list").append('<button type="button" class="list-group-item list-group-item-light list-group-item-action city-name">' + 
                cityName);

                let lat = data.coord.lat;
                let lon = data.coord.lon;

                let latLonPair = lat.toString() + " " + lon.toString();

                localStorage.setItem(cityName, latLonPair);

                apiURL = "https://api.openweathermap.org/data/3.0/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly &appid=85fdad770cb1b5590007071765f836b5";

                fetch(apiURL).then(funtion(newResponse) {
                    if (newResponse.ok) {
                        newResponse.json().then(function (newData) {
                            getCurrentWeather(newData);
                        })
                    }
                })
                
            })
        } else {
            alert("Cannot find city!!");
        }
    })

}

//Function to get information for a city in the list
function getListCity(coordinates) {
    apiURL = "https://api.openweathermap.org/data/3.0/onecall?lat=" + coordinates[0] + "&lon=" + coorinates[1] + "&exclude=minutely,hourly &appid=85fdad770cb1b5590007071765f836b5";

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                getCurrentWeather(data);
            })
        }

    })
}

function getCurrentWeather(data) {
    $(".results-panel").addClass("visible");

    $("#currentIcon")[0].src = "http://openweathermap.org/img/wn/" + data.daily(i + 1).weather.icon + "@2x.png";
    $("#temperature")[0].textContent = "Temperature:" + data.current.temp.toFixed() + "\u2109";
    $("#wind")[0].textContent = "Wind Speed:" + data.current.wind_speed.toFixed() + " MPH";
    $("#humidity").textContent = "Humidity:" + data.current.humidity.toFixed() + " %";


    getFutureWeather();


}

function getFutureWeather(data) {
    for (var i = 0; i < 5; i++) {
        let futureWeather = {
            date: convertUnixTime(data, i),
            icon: "http://openweathermap.org/img/wn/" + data.daily(i + 1).weather.icon + "@2x.png",
            temp: data.daily[i + 1].temp.day.toFixed(1),
            wind: data.daily[i + 1].wind_speed,
            hum: data.daily[i + 1].humidity,
        }
        let currentSelector = "#day-" + i;
        $(currentSelector)[0].textContent = futureWeather.date;
        currentSelector = "#img-" + i;
        $(currentSelector)[0].src = futureWeather.icon;
        currentSelector = "#temp-" + i;
        $(currentSelector)[0].textContent = "Temp: " + futureWeather.temp + "\u2109";
        currentSelector = "#wind-" + i;
        $(currentSelector)[0].textContent = "Wind: " + futureWeather.wind + " MPH";
        currentSelector = "#hum-" + i;
        $(currentSelector)[0].textContent = "Hum: " + futureWeather.hum + " %";
    }
}

//applies title case to cities with more than one word
function titleCase(city) {
    var updatedCity = city.toLowerCase().split(" ");
    var returnedCity = "";
    for (var i = 0; i < updatedCity.length; i++) {
        updatedCity[i] = updatedCity[i][0].toUpperCase() + updatedCity[i].slice(1);
        returnedCity += " " + updatedCity[i];
    }
    return returnedCity;
}

//function to convert unix time that is fetched from the server
function convertUnixTime(data, index) {
    let dateObj = new Date(data.daily[index + 1].dt * 1000);

    return (dateObj.toLocaleDateString());
}

$("#search-button").on("click", function (e) {
    e.preventDefault();

    findCity();
    $("form")[0].reset();
})

$(".city-list-box").on("click", ".city-name", function () {
    let coordinates = (localStorage.getItem($(this)[0].textContent)).split(" ");
    coordinates[0] = parseFloat(coordinates[0]);
    coordinates[1] = parseFloat(coordinates[1]);

    $("#city-name")[0].textContent = $(this)[0].textcontent + "(" + dayjs().format('M/D/YYYY') + ")";

    getListCity(coordinates);
})