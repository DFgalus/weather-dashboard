function findCity() {
    let cityName = $('#cityname')[0].value.trim()

    let apiURL = "https://api.openweathermap.org/data/2.5/forecast?=" + cityName + "&units=imperial&appid=85fdad770cb1b5590007071765f836b5";
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

                
            })
        }
    } )

}