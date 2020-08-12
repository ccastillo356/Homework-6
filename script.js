$(document).ready(function() {
    var currentDate = moment().format("MM/DD/YYYY");
    var currentHour = moment().format("HH");
    var cities = [];

    $("#searchIcon").on("click", function(event) {
        event.preventDefault();

        if (($("#search").val() !== null) && ($("#search").val() !== "")) {
            extractInfo();
        } else {
            return;
        };

    });
    
    function extractInfo() {

        if (($("#search").val() !== null) && ($("#search").val() !== "")) {
            var cityName = $("#search").val().trim();
        } else {
            
            var cityName = $(this).val();
        };

        
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&apikey=572d14321ae6789e9c768be6fb36520d";
        var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&apikey=572d14321ae6789e9c768be6fb36520d";

        
        var fiveDayRow = $("<div>");
        fiveDayRow.attr("class", "row");
        fiveDayRow.attr("id", "five-day-forecast-row");
        $("#five-day-forecast").empty();
        $("#five-day-forecast").append(fiveDayRow);

        
        cityName = capitalize(cityName);

       
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            var temp = response.main.temp;
            var iconCode = response.weather[0].icon;
            var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
            var imgIcon = $("<img>");
            imgIcon.attr("src", iconURL);
            $("#infoHeader").append(imgIcon);
            $("#temperature").text("Temperature: " + temp + " \xB0F");
            $("#humidity").text("Humidity: " + response.main.humidity + "%");
            $("#wind-speed").text("Wind Speed: " + response.wind.speed + " MPH");
            
            
            var uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&apikey=a473acf69da2e842dc53764003276374";

            
            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function(uvData) {
                $("#uv-index-label").text("UV Index: ");
                var uvIndexEl = $("<span>");
                uvIndexEl.attr("id", "uv-index");
                uvIndexEl.text(uvData.value);
                $("#uv-index-label").append(uvIndexEl);
            });
        });

        $.ajax({
            url: fiveDayURL,
            method: "GET"
        }).then(function(fiveDayData) {
            var fiveDayList = fiveDayData.list;
            var currentTimeBlock = "00:00:00";

            if (currentHour >= 0 && currentHour < 3) {
                currentTimeBlock = "00:00:00";
            } else if (currentHour >= 3 && currentHour < 6) {
                currentTimeBlock = "03:00:00";
            } else if (currentHour >= 6 && currentHour < 9) {
                currentTimeBlock = "06:00:00";
            } else if (currentHour >= 9 && currentHour < 12) {
                currentTimeBlock = "09:00:00";
            } else if (currentHour >= 12 && currentHour < 15) {
                currentTimeBlock = "12:00:00";
            } else if (currentHour >= 15 && currentHour < 18) {
                currentTimeBlock = "15:00:00";
            } else if (currentHour >= 18 && currentHour < 21) {
                currentTimeBlock = "18:00:00";
            } else if (currentHour >= 21 && currentHour < 24) {
                currentTimeBlock = "21:00:00";
            };
            
            for (var i = 0; i < fiveDayList.length; i++) {
                if (fiveDayList[i].dt_txt.includes(currentTimeBlock)) {
                    
                    var divCol = $("<div>");
                    var divCard = $("<div>");
                    var divCardBody = $("<div>");
                    var h5El = $("<h5>");
                    var fiveDayImgIcon = $("<img>");
                    var pTemp = $("<p>");
                    var pHumidity = $("<p>");
                    var fiveDayDate = moment(fiveDayList[i].dt_txt).format("MM/DD/YYYY");
                    var fiveDayIconURL = "https://openweathermap.org/img/w/" + fiveDayList[i].weather[0].icon + ".png";

                    divCol.attr("class", "col forecasted-day");
                    divCol.attr("id", "day-" + (i + 2));
                    divCard.attr("class", "card");
                    divCardBody.attr("class", "card-body forecast");
                    h5El.attr("class", "card-title");
                    h5El.attr("id", "date-" + (i + 2));
                    pTemp.attr("class", "lead");
                    pHumidity.attr("class", "lead");

                    h5El.text(fiveDayDate);
                    
                    pTemp.text("Temp: " + fiveDayList[i].main.temp + " \xB0F");
                    pHumidity.text("Humidity: " + fiveDayList[i].main.humidity + "%");
                    fiveDayImgIcon.attr("src", fiveDayIconURL);

                    $("#five-day-forecast-row").append(divCol);
                    divCol.append(divCard);
                    divCard.append(divCardBody);
                    divCardBody.append(h5El);
                    divCardBody.append(fiveDayImgIcon);
                    divCardBody.append(pTemp);
                    divCardBody.append(pHumidity);
                };
            };
        });

        
        cities.push(cityName);
        
        cities = [...new Set(cities)];
        localStorage.setItem("cities", JSON.stringify(cities));

        
        $("#infoHeader").text(cityName + " " + "(" + currentDate + ")");

       
        var h3El = $("<h3>");
        h3El.text("5-Day Forecast");
        $("#five-day-forecast").prepend(h3El);

        
        $("#search").val("");

        renderCities();
    };

    
    function capitalize(name) {
        var splitName = name.split(" ");
        for (var i = 0; i < splitName.length; i++) {
            splitName[i] = splitName[i].charAt(0).toUpperCase() + splitName[i].substr(1).toLowerCase();
            
            var properName = splitName.join(" ");
            
        };
        return properName;
    };

    
    function renderCities() {
        $("#cities").empty();

        
        for (var i = cities.length - 1; i >= 0; i--) {
            
            var divCityCard = $("<div>");
            var divCityCardBody = $("<div>");
            var cityButton = $("<button>");

            cityButton.text(cities[i]);
    
            
            divCityCard.attr("class", "card");
            divCityCardBody.attr("class", "card-body city");
            cityButton.attr("class", "btn btn-link navCity");
            cityButton.attr("value", cities[i]);
    
            
            $("#cities").append(divCityCard);
            divCityCard.append(divCityCardBody);
            divCityCardBody.append(cityButton);
        };
    };

    function init() {
    
        var storedCities = JSON.parse(localStorage.getItem("cities"));

        if (storedCities !== null) {
            cities = storedCities;
        }

        renderCities();
    }

    init();
    
    
    $(document).on("click", ".navCity", extractInfo);
})