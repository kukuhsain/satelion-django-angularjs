var satelionApp = angular.module('map.service', []);

satelionApp.factory('MapSatelionService',  function() {
    // map components
    return {
      // map components
      mapComponents: {
        currentCoordinate: {
          latitude: null,
          longitude: null,
        },
        gMap: {},
        gMapOptions: {},
        markerSat: {},
        markerOptionsSat: {},
        predictionPathObject: {
          latitude: null,
          longitude: null,
        },
        predictionPathList: [],
        polyPredictionPath: {},
        polyOptionsPredictionPath: {},
        antennaLocation: {
          latitude: null,
          longitude: null,
        },
        markerAntenna: {},
        markerOptionsAntenna: {},
        polyAntennaLocation: {},
        polyOptionsAntennaLocation: {},
      },
      // map component methods
      initMap: function() {
        this.setGMapOptions();
        this.setGMap();
        this.setMarkerOptionsSat();
        this.setMarkerSat();
        this.setPredictionPath();
        //console.log("markerSat" + this.mapComponents.markerSat);
      },
      setInitialCoordinate: function(lat, lng) {
        this.mapComponents.currentCoordinate.latitude = lat;
        this.mapComponents.currentCoordinate.longitude = lng;
      },
      setGMap: function() {
        this.mapComponents.gMap = new google.maps.Map(document.getElementById('map-canvas'), this.mapComponents.gMapOptions);
      },
      setGMapOptions: function() {
        //console.log(mapComponents.currentCoordinate.latitude);
        this.mapComponents.gMapOptions = {
          center: {
            lat: this.mapComponents.currentCoordinate.latitude,
            lng: this.mapComponents.currentCoordinate.longitude,
          },
          zoom: 5,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      },
      setMarkerSat: function() {
        this.mapComponents.markerSat = new google.maps.Marker(this.mapComponents.markerOptionsSat);
      },
      setMarkerOptionsSat: function() {
        this.mapComponents.markerOptionsSat = {
          position: new google.maps.LatLng(this.mapComponents.currentCoordinate.latitude, this.mapComponents.currentCoordinate.longitude),
          map: this.mapComponents.gMap,
          title: initSatName
        };
      },
      setPolyOptionsPredictionPath: function() {
        this.mapComponents.polyOptionsPredictionPath = {
          path: this.mapComponents.predictionPathList,
          geodetic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        };
      },
      setPolyPredictionPath: function() {
        this.mapComponents.polyPredictionPath = new google.maps.Polyline(this.mapComponents.polyOptionsPredictionPath);
      },
      setPredictionPath: function() {
        for (var number=0; number<24*60; number++) {
          this.mapComponents.predictionPathList.push(new google.maps.LatLng(this.mapComponents.predictionPathObject.latitude[number], this.mapComponents.predictionPathObject.longitude[number]));
        };
        //console.log(mapComponents.predictionPathList);
        this.setPolyOptionsPredictionPath();
        this.setPolyPredictionPath();
        this.mapComponents.polyPredictionPath.setMap(this.mapComponents.gMap);
      },
      // set marker option antenna
      setMarkerOptionsAntenna: function() {
        this.mapComponents.markerOptionsAntenna = {
          map: this.mapComponents.gMap,
        };
      },

      // set marker antenna
      setMarkerAntenna: function() {
        this.mapComponents.markerAntenna = new google.maps.Marker(this.mapComponents.markerOptionsAntenna);
      },

      // set polyline option antenna
      setPolyOptionsAntennaLocation: function() {
        this.mapComponents.polyOptionsAntennaLocation = {
          strokeColor: '#000000',
          strokeOpacity: 1.0,
          strokeWeight: 3,
        };
      },

      // set polyine antenna
      setPolyAntennaLocation: function() {
        this.mapComponents.polyAntennaLocation = new google.maps.Polyline(this.mapComponents.polyOptionsAntennaLocation);
      },

      // get lat long antenna
      getLatLongFromMap: function() {
        this.setMarkerOptionsAntenna();
        this.setMarkerAntenna();
        this.setPolyOptionsAntennaLocation();
        this.setPolyAntennaLocation();
        this.mapComponents.polyAntennaLocation.setMap(this.mapComponents.gMap);
      },
    };
    });
