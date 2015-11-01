var satelionApp = angular.module('satelionApp', ['ui.bootstrap', 'map.service']);

satelionApp.controller('SatelionController', ['$scope', '$http', '$timeout', 'MapSatelionService', function($scope, $http, $timeout, MapSatelionService) {

    var isInitialLoading = 0;

    // get TLE data
    var dataTle = $http.get('data/get_TLE_json/' + '?sat=' + initSatName);
    dataTle.then(function(succeed_data) {
      $scope.satTle = succeed_data.data;
    });

    // get list satellites
    var dataListSat = $http.get('data/list_satellite_json');
    dataListSat.then(function(succeed_data) {
      $scope.satellites = succeed_data.data.listSatellite;
    });

    var loopEverySecond = function(i, succeed_data) {
      $timeout(function() {
        $scope.satParam = {
          latitude: succeed_data.data.latitude[i],
          longitude: succeed_data.data.longitude[i],
          altitudeKm: succeed_data.data.altitude[i]/1000,
          altitudeMi: succeed_data.data.altitude[i]*0.62137/1000,
          rightAsc: succeed_data.data.right_asc[i],
          declination: succeed_data.data.declination[i],
        };
        // time
        console.log(i);
        // change marker
        i++;
        if (i<90) {
          loopEverySecond(i, succeed_data);
        }
        else {
          getSatParams();
        };
      }, 1000);
    };

    var getAntennaParams = function(latitude, longitude) {
      var dataAntennaParams = $http.get('data/get_antenna_param_json/' + '?latitude=' + latitude + '&longitude=' + longitude + '&sat=' + initSatName);
      dataAntennaParams.then(function(succeed_data) {
        console.log(succeed_data.data);
        $scope.antennaParam = {
          azimuth: succeed_data.data.azimuth,
          elevation: succeed_data.data.elevation,
          latitude: latitude,
          longitude: longitude,
        };
      });
    };

    var getPredictionPath = function() {
      var dataPredictionPath = $http.get('data/get_prediction_path_json/' + '?sat=' + initSatName);
      dataPredictionPath.then(function(succeed_data) {

        // init map
        MapSatelionService.mapComponents.predictionPathObject.latitude = succeed_data.data.latitude;
        MapSatelionService.mapComponents.predictionPathObject.longitude = succeed_data.data.longitude;
        //MapSatelionService.initMap();
        MapSatelionService.setGMapOptions();
        MapSatelionService.setGMap();
        MapSatelionService.setMarkerOptionsSat();
        MapSatelionService.setMarkerSat();
        MapSatelionService.setPredictionPath();

        // init antenna
        MapSatelionService.getLatLongFromMap();
        //click listener
        MapSatelionService.mapComponents.gMap.addListener('click', function(event){
          var latitude = event.latLng.lat();
          var longitude = event.latLng.lng();
          console.log( latitude + ', ' + longitude );
          //console.log(MapSatelionService.mapComponents.markerAntenna);

          MapSatelionService.mapComponents.markerAntenna.setPosition(new google.maps.LatLng(latitude, longitude));

          //MapSatelionService.mapComponents.polyAntennaLocation.setMap(null);
          MapSatelionService.mapComponents.antennaLocation = [];
          MapSatelionService.mapComponents.antennaLocation.push({
            lat: MapSatelionService.mapComponents.currentCoordinate.latitude,
            lng: MapSatelionService.mapComponents.currentCoordinate.longitude
          });
          MapSatelionService.mapComponents.antennaLocation.push({
            lat: latitude,
            lng: longitude
          });
          //console.log(MapSatelionService.mapComponents.antennaLocation);
          //MapSatelionService.mapComponents.polyOptionsAntennaLocation.path = MapSatelionService.mapComponents.antennaLocation;
          MapSatelionService.mapComponents.polyAntennaLocation.setPath(MapSatelionService.mapComponents.antennaLocation);
          //MapSatelionService.setPolyAntennaLocation();
          //console.log(MapSatelionService.mapComponents.polyOptionsAntennaLocation);
          //MapSatelionService.mapComponents.polyAntennaLocation = new google.maps.Polyline(MapSatelionService.mapComponents.polyOptionsAntennaLocation);
          //MapSatelionService.mapComponents.polyAntennaLocation.setMap(MapSatelionService.mapComponents.gMap);
          getAntennaParams(latitude, longitude);

          //setMap null
          //setMap again
        });
      });
    };

    // get satellite parameters
    var getSatParams = function() {
      var dataSatParams = $http.get('data/get_time_and_sat_param_json/' + '?sat=' + initSatName);
      dataSatParams.then(function(succeed_data) {
        var i = 0;
        loopEverySecond(i, succeed_data);
        if (isInitialLoading == 0) {
          MapSatelionService.setInitialCoordinate(succeed_data.data.latitude[0], succeed_data.data.longitude[0]);
          //

          getPredictionPath();
          // listener to click event on map


          //
          isInitialLoading = 1;
        };
        //get prediction path

      });
    };

    getSatParams();


  }]);
