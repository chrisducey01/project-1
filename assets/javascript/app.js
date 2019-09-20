


const algoliaApiKey = "420478f8416cbf67fc5dc4b1617e298a";
const algoliaAppId = "pl4NIPBVHT19";
const googleMapsApiKey = "AIzaSyDaIexeQVRs07vtlX2WE6PSzjKEMoFt1u8";
let locationCenter;
var map;
var service;
var request;
var location;
var placesAutocomplete;

let latLng = {
    lat:33.4487,
    lng:-112.071
};  //latitude and longitude in an object returned from the suggestion from Algolia places


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
            callback(response);
        });
        
    }
};


const aerisResults = {
    temp: "",
    humidity: "",
    place: "",
    icon: ""
}
function setWeatherData(weatherObject) {
    aerisResults.temp = weatherObject.response.ob.tempF;
    aerisResults.humidity = weatherObject.response.ob.humidity;
    aerisResults.place = weatherObject.response.place.name;
    aerisResults.icon = weatherObject.response.ob.icon;
  
    console.log(weatherObject);
    console.log(aerisResults.temp);
    console.log(aerisResults.humidity);
    console.log(aerisResults.place);
    console.log(aerisResults.icon);
    
}





function logOutToConsole(obj) {
    console.log(obj);
}

// $(document).on("click","#submitLocation",function(event){
//   event.preventDefault()

//  map.setCenter(latLng)
// });

// })
// function initMap() {

//      map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 16,
//         center: {
//           lat: 33.4486,
//           lng: -112.077
//         },
//         mapTypeId: "roadmap"
//     });
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



}

function callback(results, status) {
    console.log("Ran callback function");
    console.log(google.maps.places.PlacesServiceStatus);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        console.log(results[i]);
      }
    }
  }

function getPlacesData(category){
    //let queryUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${category}&locationbias=6000@${latLng.lat},${latLng.lng}&inputtype=textquery&fields=name&key=${googleMapsApiKey}`;
    let queryUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${googleMapsApiKey}&location=${latLng.lat},${latLng.lng}&radius=1500&type=${category}`;
    console.log(queryUrl);
    $.ajax(
        {
            url: queryUrl,
            method: "GET",
            dataType: "json"
        }
    ).then(function(response){
        console.log(response);
    });
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



    aerisWeather.getCurrentWeather("33.4486,-112.077", logOutToConsole);  //testing with lat/long for Phoenix
    $(document).on("click","#get",function(){
        let rating = $("#ratingElement").val();
        let pricing=$("#priceElement").val();
        let location = $("#location").val();
        let category = $("#category").val();
        console.log(rating,pricing,location,category,latLng)
        //getPlacesData(category);
    
        location = new google.maps.LatLng(latLng.lat,latLng.lng );

        request = {
            location: location,
            radius: '500',
            query: 'restaurant'
          };
        

          service = new google.maps.places.PlacesService(map);
          service.textSearch(request, callback);
        
     })
    
    
});

