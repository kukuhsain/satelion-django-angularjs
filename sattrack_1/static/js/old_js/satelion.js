/////////////// List Satellite ////////////////
$.getJSON( "data/list_satellite_json", function(json) {
    console.log("success list satellite json");
    $("#listSats").autocomplete({
        source: json.listSatellite
    });
});
///////////////////////////////////////////////

//////////////// TLE Satellite ////////////////
$.getJSON( "data/get_TLE_json/?sat=" + initSatName, function(json) {
    console.log("success TLE satellite json");
    $("#satName").text(json.satName);
    $("#satLine1").text(json.satLine1);
    $("#satLine2").text(json.satLine2);
});
////////////////////////////////////////////////


var currentCoordinate = {satName: 'PALAPA C2', latitude: 4.0070107, longitude: 145.9430289}

var map;
var marker;
var currentCoordinate;
var satPath;
var satPredictLine = [];


$.getJSON( "data/get_prediction_path_json/?sat=" + initSatName, function(json) {
        console.log("success TLE satellite json");
        for (var number=0; number<24*60; number++) {
            satPredictLine.push(new google.maps.LatLng(json.latitude[number], json.longitude[number]));
        }
        dadaDada(satPredictLine);
    });
    
    
    
    

var dadaDada = function (satPredictLine) {


//// Satellite Parameter, Update Per Second ////
var i = 0;
var updatePerSecond = function(currentCoordinated) {
    setTimeout(function() {
        //console.log( "success time " + i);
        //console.log( "latitude = " + json.latitude[i]);
        $("#satLatitude").text(currentCoordinated.latitude[i].toFixed(7));
        $("#satLongitude").text(currentCoordinated.longitude[i].toFixed(7));
        $("#satAltitude").text(currentCoordinated.altitude[i]);
        
        map.setCenter(new google.maps.LatLng(currentCoordinated.latitude[i], currentCoordinated.longitude[i]));
        marker.setPosition(new google.maps.LatLng(currentCoordinated.latitude[i], currentCoordinated.longitude[i]));
        
        i++;
        if (i<90){
            updatePerSecond(currentCoordinated);
        }
        else
            recursiveTimeAndSatParam();
    }, 1000);
};


var recursiveTimeAndSatParam = function() {
    i = 0;
    $.getJSON( "data/get_time_and_sat_param_json/?sat=" + initSatName, function(jsondata) {
        console.log( "json data = " + jsondata);
        updatePerSecond(jsondata);
    });
};

recursiveTimeAndSatParam();
satPath.setMap(map);

};

/////////////////////////////////////////////////



//////////////// Prediction Path Satellite ////////////////
/*$.getJSON( "data/get_prediction_path_json/?sat=" + initSatName, function(json) {
    console.log("success TLE satellite json");
    json.latitude;
    json.longitude;
});*/
////////////////////////////////////////////////






////////////////// Google Map ///////////////////





// initialize function, the main function
function initialize() {
    
    //create object of main map (mapOption)
    var mapOptions = {
        center: { lat: currentCoordinate.latitude, lng: currentCoordinate.longitude},
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    //get the object into Google Map
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    
    //create object of marker (markerOption)
    var markerOption = {
        position: new google.maps.LatLng(currentCoordinate.latitude, currentCoordinate.longitude),
        map: map,
        title: currentCoordinate.satName
    };
    
    //get marker object into Google Map
    marker = new google.maps.Marker(markerOption);
    
    //add 'click' listener into marker
    /*google.maps.event.addListener(marker, 'click',  function() {
        infowindow.open(map, marker);*/
    
    
    //create object of polyline (satPath)
    satPath = new google.maps.Polyline({
        path: satPredictLine,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    
    //put the polyline into the map
    satPath.setMap(map);
    
        
};

// add 'load' DOM listener of initialize function to the window 
google.maps.event.addDomListener(window, 'load', initialize);

//////////////////////////////////////////////



