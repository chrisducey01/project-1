const algoliaApiKey = "420478f8416cbf67fc5dc4b1617e298a";
const algoliaAppId = "pl4NIPBVHT19";
const googleMapsApiKey = "AIzaSyDaIexeQVRs07vtlX2WE6PSzjKEMoFt1u8";
let locationCenter;
let locationsArr = new Array;
var map;
var service;
var request;
var location;
var placesAutocomplete;
let thumbnail="assets/images/generic.png"

let latLng = {
    lat: 33.4487,
    lng: -112.071
}; //latitude and longitude in an object returned from the suggestion from Algolia places


const aerisWeather = {
    apiKey: "XfKCLeB7QSZnVmsSSrlqL5abBWmH1kLv4GiHMpWB",
    accessId: "IhoPBape6zamvrXhAop7j",
    currentWeatherBaseUrl: "https://api.aerisapi.com/observations/",
    getCurrentWeather(location, callback) {
        let queryUrl = `${this.currentWeatherBaseUrl}${location}?&format=json&filter=allstations&limit=1&client_id=${this.accessId}&client_secret=${this.apiKey}`;
        console.log(queryUrl);
        $.ajax({
            url: queryUrl,
            method: "GET"
        }).then(function (response) {
            setWeatherData(response);
        });

    }
};

const aerisResults = {
    temp: "",
    humidity: "",
    place: "",
    icon: "",
    weatherConditions: "",
    heatIndex: "",
    dateTime: "",
    sunrise: "",
    sunset: ""
}

// function logOutToConsole(obj) {
//     console.log(obj);
// }


function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: {
            lat: 33.4486,
            lng: -112.077
        },
        mapTypeId: "roadmap"
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            //Update the global var that holds lat/lng to have the current location
            latLng.lat = position.coords.latitude;
            latLng.lng = position.coords.longitude;
            $("#location").val("Current Location");
            console.log(position);
            aerisWeather.getCurrentWeather(`${latLng.lat},${latLng.lng}`, setWeatherData);
            console.log(latLng);

            map.setCenter(pos);
            console.log("Successfully setup gelocation for map");
        }, function () {
            console.log("Unable to setup geolocation for map.  Falling back to default location.");
        });
    } else {
        // Browser doesn't support Geolocation
        console.log("Browser doesn't support geolocation for map.  Falling back to default location.");
    }
}


function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        locationsArr = results.map(function (location) {
            let newObj = {
                name: location.name,
                address: location.formatted_address,
                icon: location.icon,
                priceLevel: location.price_level,
                rating:  location.rating,
                placeId:  location.place_id,
                openNow:  Object.keys(location).includes("opening_hours") ? location.opening_hours.open_now : null,
                latLng:  {
                    lat: location.geometry.location.lat(),
                    lng: location.geometry.location.lng()
                }
                // `${location.geometry.location.lat()},${location.geometry.location.lng()}`  
            };
            return newObj;
        });

        console.log(locationsArr);

        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            console.log(results[i]);
        }

        displayMarkers();
        renderResults(locationsArr);
    }
}


function displayMarkers() {
    var markers = locationsArr.map(function (location) {
        return new google.maps.Marker({
            position: location.latLng,
            label: location.name
        });
    })
    console.log(markers);
    var markerCluster = new MarkerClusterer(map, markers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });
 }

  function renderResults(results){
      resultsDiv = $("#results");
      resultsDiv.empty();

    //Build a card for each places result and append to the div
    results.forEach(result => {
        let cardDiv = $("<div>");
        let cardRow = $("<div>");
        let cardImgDiv = $("<div>");
        let cardBodyDiv = $("<div>");

        cardDiv.attr("id",result.placeId);
        cardDiv.addClass("card col-md-10 col-md-offset-1 results");
        cardRow.addClass("row no-gutters");
        cardImgDiv.addClass("col-md-3");
        cardBodyDiv.addClass("col-md-9 bg-dark text-white p-2");

        cardImgDiv.append($(`<img id="result-img" src="${thumbnail}" class="card-img img-thumbnail" alt="restaurant-pic">`));

        cardBodyDiv.append($(`<h5 class="card-title">${result.name}</h5>`));
        cardBodyDiv.append($(`<p class="card-text">${result.address}</p>`));

        let priceLevelText = result.priceLevel === undefined ? "Not Specified" : result.priceLevel;
        cardBodyDiv.append($(`<p class="card-text">Price Range: ${priceLevelText}</p>`));
        cardBodyDiv.append($(`<p class="card-text">Rating: ${result.rating}</p>`));

        cardRow.append(cardImgDiv,cardBodyDiv);
        cardDiv.append(cardRow);
        resultsDiv.append(cardDiv);
    });
}



function setWeatherData(weatherObject) {
    aerisResults.temp = weatherObject.response.ob.tempF;
    aerisResults.humidity = weatherObject.response.ob.humidity;
    aerisResults.place = weatherObject.response.place.name;
    aerisResults.icon = weatherObject.response.ob.icon;
    aerisResults.dateTime = moment(weatherObject.response.ob.dateTimeISO).format('h:mm a');
    aerisResults.heatIndex = weatherObject.response.ob.heatindexF;
    aerisResults.weatherConditions = weatherObject.response.ob.weather;
    if (aerisResults.weatherConditions=="Sunny"){
        console.log("sunny");
        $("#weather-condition").attr("src","assets/css/images/sunny-weather.jpg")
    }else if (aerisResults.weatherConditions=="Rainy"){
        $("#weather-condition").attr("src","assets/css/images/rainy-weather.jpg")
    }else if (aerisResults.weatherConditions=="Cloudy"){
        $("#weather-condition").attr("src","assets/css/images/cloudy-weather.jpg")
    }else if (aerisResults.weatherConditions=="Snowy"){
        $("#weather-condition").attr("src","assets/css/images/snowy-weather.jpg")
    }

    else{
        $("#weather-condition").attr("src","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdh0A2Gi5sD-AjzwrBe0kyQueh_A_9BbRZ05lbjljJ9AdpR7ho")
    }

    aerisResults.sunrise = moment(weatherObject.response.ob.sunriseISO).format('h:mm a');
    aerisResults.sunset = moment(weatherObject.response.ob.sunsetISO).format('h:mm a');

    console.log(weatherObject);
    console.log(aerisResults.temp);
    console.log(aerisResults.humidity);
    console.log(aerisResults.place);
    console.log(aerisResults.icon);
    console.log(aerisResults.dateTime);
    console.log(aerisResults.heatIndex);
    console.log(aerisResults.weatherConditions);

    $("#current-temp").text(aerisResults.temp);
    $("#humidity").text(aerisResults.humidity);
    $("#location-weather").text(aerisResults.place);
    $("#heat-index").text(aerisResults.heatIndex);
    $("#weather-conditions").text(aerisResults.weatherConditions);
    $("#date-time").text(aerisResults.dateTime);
    $("#sunrise").text(aerisResults.sunrise);
    $("#sunset").text(aerisResults.sunset);
}


$(document).ready(function () {

    //instantiate places and attach it to an input text box in the html
    placesAutocomplete = places({
        appId: algoliaAppId,
        apiKey: algoliaApiKey,
        container: document.querySelector('#location')
    });


    //When user selects a suggested address, save off the latitude and longitude
    placesAutocomplete.on('change', e => { latLng = e.suggestion.latlng; });
});


$(document).on("click", "#get", function () {
    let rating = $("#ratingElement").val();
    let pricing = $("#priceElement").val();
    let location = $("#location").val();
    let category = $("#category").val();
    console.log(rating, pricing, location, category, latLng)
    //getPlacesData(category);
    if(category== "airport"){
        thumbnail="assets/images/airport.png"
    }else if(category== "bar"){
        thumbnail="assets/images/bar.png"
    }else if(category== "cafe"){
        thumbnail="assets/images/cafe.png"
    }else if(category== "casino"){
        thumbnail="assets/images/casino.png"
    }else if(category== "restaurant"){
        thumbnail="assets/images/resturant.png"
    }
    else{
        thumbnail="assets/images/generic.png"
    }
    //Get current weather via AJAX call and then update in HTML
    aerisWeather.getCurrentWeather(`${latLng.lat},${latLng.lng}`, setWeatherData);

    map.setCenter(latLng);

    location = new google.maps.LatLng(latLng.lat, latLng.lng);

    request = {
        location: location,
        radius: '500',
        query: category
    };


    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
});