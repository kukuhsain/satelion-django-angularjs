var model = {
  satName: initSatName,
  satTle: {
    satName: "",
    satLine1: "",
    satLine2: ""
  },
  listSat: [],
  satParam: {
    latitude: [],
    longitude: [],
    altitude: [],
    rightAscension: [],
    declination: []
  },
  currentCoordinate: {
    latitude: null,
    longitude: null,
    altitude: null,
    rightAscension: null,
    declination: null
  },
  mapComponents: {
    currentCoordinate: {
      latitude: null,
      longitude: null
    },
    map: {},
    mapOptions: {},
    marker: {},
    markerOptions: {},
    predictionPathObject: {
      latitude: null,
      longitude: null
    },
    predictionPathList: []
  },
  antennaParam: {
    latitude: null,
    longitude: null,
    azimuth: null,
    elevation: null
  }
};


var controller = {
  init: function() {
    this.getJsonData.getTleJson();
    this.getJsonData.getListSatJson();
    this.getJsonData.getPredictionPathJson();
    view.satParamView.init();
    this.getJsonData.getSatParamJson();
  },

  getJsonData: {
    getTleJson: function() {
      $.getJSON( "data/get_TLE_json/?sat=" + initSatName, function(json) {
        model.satTle.satName = json.satName;
        model.satTle.satLine1 = json.satLine1;
        model.satTle.satLine2 = json.satLine2;
        view.tleView.init();
      });
    },
    getListSatJson: function() {
      $.getJSON( "data/list_satellite_json", function(json) {
        model.listSat = json.listSatellite;
        view.listSatelliteView.init();
      });
    },
    getPredictionPathJson: function() {
      $.getJSON( "data/get_prediction_path_json/?sat=" + initSatName, function(json) {
        model.mapComponents.predictionPathObject.latitude = json.latitude;
        model.mapComponents.predictionPathObject.longitude = json.longitude;
        var curLat = json.latitude[0];
        var curLng = json.longitude[0];
        controller.setMapComponents.setInitialCoordinate(curLat, curLng);
        controller.setMapComponents.initMap();
        controller.setMapComponents.getLatLongFromMap();
      });
    },
    getSatParamJson: function() {
      $.getJSON( "data/get_time_and_sat_param_json/?sat=" + initSatName, function(json) {
        model.satParam.latitude = json.latitude;
        model.satParam.longitude = json.longitude;
        model.satParam.altitude = json.altitude;
        model.satParam.rightAscension = json.right_asc;
        model.satParam.declination = json.declination;
        controller.loopUntilClosed.init();
      });
    },
    getAntennaParamJson: function() {
      $.getJSON( "data/get_antenna_param_json/?latitude=" + model.antennaParam.latitude + "&longitude=" + model.antennaParam.longitude + "&sat=" + model.satName, function(json) {
        model.antennaParam.azimuth = json.azimuth;
        model.antennaParam.elevation = json.elevation;
        view.antennaParamView.init();
      });
    }
  },

  getSatTleModel: function() {
    return model.satTle
  },

  getListSatModel: function() {
    return model.listSat
  },

  getCurrentCoordinateModel: function() {
    return model.currentCoordinate
  },

  setCurrentCoordinate: function(lat, lng, alt, ra, dec) {
    model.currentCoordinate.latitude = lat;
    model.currentCoordinate.longitude = lng;
    model.currentCoordinate.altitude = alt;
    model.currentCoordinate.rightAscension = ra;
    model.currentCoordinate.declination = dec;
  },

  getAntennaParamModel: function() {
    return model.antennaParam
  },

  setMapComponents: {
    initMap: function() {
      //this.setCurrentCoordinate();
      this.setMapOptions();
      this.setMap();
      this.setMarkerOptions();
      this.setMarker();
      this.setPredictionPath();
    },
    setInitialCoordinate: function(lat, lng) {
      model.mapComponents.currentCoordinate.latitude = lat;
      model.mapComponents.currentCoordinate.longitude = lng;
    },
    setMap: function() {
      model.mapComponents.map = new google.maps.Map(document.getElementById('map-canvas'), model.mapComponents.mapOptions);
    },
    setMapOptions: function() {
      model.mapComponents.mapOptions = {
        center: {
          lat: model.mapComponents.currentCoordinate.latitude,
          lng: model.mapComponents.currentCoordinate.longitude
        },
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
    },
    setMarker: function() {
      model.mapComponents.marker = new google.maps.Marker(model.mapComponents.markerOptions);
    },
    setMarkerOptions: function() {
      model.mapComponents.markerOptions = {
        position: new google.maps.LatLng(model.mapComponents.currentCoordinate.latitude, model.mapComponents.currentCoordinate.longitude),
        map: model.mapComponents.map,
        title: model.satName
      };
    },
    setPredictionPath: function() {
      for (var number=0; number<24*60; number++) {
        model.mapComponents.predictionPathList.push(new google.maps.LatLng(model.mapComponents.predictionPathObject.latitude[number], model.mapComponents.predictionPathObject.longitude[number]));
      };
      var PredictionPath = new google.maps.Polyline({
        path: model.mapComponents.predictionPathList,
        geodetic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      PredictionPath.setMap(model.mapComponents.map);
    },
    getLatLongFromMap: function() {
      google.maps.event.addListener(model.mapComponents.map, "rightclick", function (event) {
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();
        console.log( latitude + ', ' + longitude );

        var radius = new google.maps.Circle({
          map: model.mapComponents.map,
          radius: 100,
          center: event.latLng,
          fillColor: '#777',
          fillOpacity: 0.1,
          strokeColor: '#AA0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          draggable: true,    // Dragable
          editable: true      // Resizable
        });

        model.antennaParam.latitude = latitude;
        model.antennaParam.longitude = longitude;
        controller.getJsonData.getAntennaParamJson();
      });
    }
  },

  loopUntilClosed: {
    init: function() {
      var i = 0;
      this.loopEverySecond(i);
    },
    loopEverySecond: function(i){
      setTimeout(function() {
        var lat = model.satParam.latitude[i];
        var lng = model.satParam.longitude[i];
        var alt = model.satParam.altitude[i];
        var ra = model.satParam.rightAscension[i];
        var dec = model.satParam.declination[i];
        controller.setCurrentCoordinate(lat, lng, alt, ra, dec);
        view.satParamView.render();
        model.mapComponents.map.setCenter(new google.maps.LatLng(model.currentCoordinate.latitude, model.currentCoordinate.longitude));
        model.mapComponents.marker.setPosition(new google.maps.LatLng(model.currentCoordinate.latitude, model.currentCoordinate.longitude));
        i++;
        if (i<90) {
          controller.loopUntilClosed.loopEverySecond(i);
        }
        else {
          controller.getJsonData.getSatParamJson();
        }
      }, 1000);
    }
  }
};

var view = {
  tleView: {
    init: function() {
      this.satNameElem = $('#satName');
      this.satLine1Elem = $('#satLine1');
      this.satLine2Elem = $('#satLine2');
      this.render();
    },
    render: function() {
      var currentSatTle = controller.getSatTleModel();
      this.satNameElem.text(currentSatTle.satName);
      this.satLine1Elem.text(currentSatTle.satLine1);
      this.satLine2Elem.text(currentSatTle.satLine2);
    }
  },

  listSatelliteView: {
    init: function() {
      this.listSatElem = $('#listSats');
      this.render();
    },
    render: function() {
      var listSat = controller.getListSatModel();
      this.listSatElem.autocomplete({
        source: listSat
      })
    }
  },

  satParamView: {
    init: function() {
      this.satParamLatitude = $('#satLatitude');
      this.satParamLongitude = $('#satLongitude');
      this.satParamAltitudeKm = $('#satAltitudeKm');
      this.satParamAltitudeMi = $('#satAltitudeMi');
      this.satParamRightAscension = $('#satRightAsc');
      this.satParamDeclination = $('#satDeclination');
    },
    render: function() {
      var currentCoordinate = controller.getCurrentCoordinateModel();
      this.satParamLatitude.text((currentCoordinate.latitude).toFixed(3));
      this.satParamLongitude.text((currentCoordinate.longitude).toFixed(3));
      this.satParamAltitudeKm.text((currentCoordinate.altitude/1000).toFixed(2));
      this.satParamAltitudeMi.text((currentCoordinate.altitude*0.62137/1000).toFixed(2));
      this.satParamRightAscension.text(currentCoordinate.rightAscension);
      this.satParamDeclination.text(currentCoordinate.declination);
    }
  },

  antennaParamView: {
    init: function() {
      this.antennaParamLatitude = $('#antLatitude');
      this.antennaParamLongitude = $('#antLongitude');
      this.antennaParamAzimuth = $('#antAzimuth');
      this.antennaParamElevation = $('#antElevation');
      this.render();
    },
    render: function() {
      var antennaParam = controller.getAntennaParamModel();
      this.antennaParamLatitude.text((antennaParam.latitude).toFixed(5));
      this.antennaParamLongitude.text((antennaParam.longitude).toFixed(5));
      this.antennaParamAzimuth.text((antennaParam.azimuth).toFixed(2));
      this.antennaParamElevation.text((antennaParam.elevation).toFixed(2));
    }
  },
};

controller.init();
