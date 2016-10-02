"use strict";

angular.module('realityApp')
  .service('Reality', function($http, $q) {
    const API_KEY = 'AIzaSyDP6X1_N95A5pEKOyNgzWNtRK04sL12oek';
    const NODE5_LOCATION = {
      lat: 50.0663614,
      lng: 14.4005557
    };
    const MUZEUM_METRO_STATION_LOCATION = {
      lat: 50.0814746,
      lng: 14.4302696
    };

    var _getLocation = function(address) {
      return $http.get('https://crossorigin.me/https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURI(address) + '&key=' + API_KEY);
    };

    var _loadPlaces = function(type, location, radiusMeters) {
      return $http.get('https://crossorigin.me/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + location.lat + ',' + location.lng +
        '&radius=' + radiusMeters + '&type=' + type + '&key=' + API_KEY);
    };

    var _loadLiftago = function(locationFrom, locationTo) {
      return $http.get('https://crossorigin.me/http://54.93.66.14:8000/api?t=1468582200&pickup=' + locationFrom.lat + ',' + locationFrom.lng +
        '&dest=' + locationTo.lat + ',' + locationTo.lng);
    };

    var _loadAvailibility = function(travelMode, address) {
      const DESTINATIONS = 'Muzeum,Praha|Radlická 180/50, Praha'; // Node5 = Radlická 180/50, Praha
      const MAPS_API_BASE_URL = 'https://crossorigin.me/https://maps.googleapis.com/maps/api/distancematrix/json';
      var distanceMatrixApiUrl = MAPS_API_BASE_URL + '?origins=' + encodeURI(address) + '&destinations=' + encodeURI(DESTINATIONS) + '&mode=' + travelMode + '&language=cs&key=' + API_KEY;
      return $http.get(distanceMatrixApiUrl);
    };

    var _loadParkingZones = function(location) {
      return $http.get('https://crossorigin.me/http://realreality-app.azurewebsites.net/realreality/rest/zones-count?lat=' + location.lat + '&lon=' + location.lng + '&dist=500');
    };

    var _loadNoise = function(location, night) {
      return $http.get('https://crossorigin.me/http://realreality-app.azurewebsites.net/realreality/rest/noise?lat=' + location.lat + '&lon=' + location.lng + '&dist=500' + '&at-night=' + night);
    };

    var _loadAir = function(location) {
      return $http.get('https://crossorigin.me/http://realreality-app.azurewebsites.net/realreality/rest/atmosphere?lat=' + location.lat + '&lon=' + location.lng);
    };

    this.getInfo = function(address) {
      return $q(function(resolve, reject) {
        return _getLocation(address).then(function(result) {
          var location = result.data.results[0].geometry.location;
          $q.all({
            pubs: _loadPlaces('restaurant', location, 500),
            nightClubs: _loadPlaces('night_club', location, 500),
            stops: _loadPlaces('transit_station', location, 400),
            park: _loadPlaces('park', location, 600),
            school: _loadPlaces('school', location, 1000),
            liftago: _loadLiftago(location, NODE5_LOCATION),
            liftagoFromMuzeumTo: _loadLiftago(MUZEUM_METRO_STATION_LOCATION, location),
            transit: _loadAvailibility('transit', address),
            driving: _loadAvailibility('driving', address),
            zones: _loadParkingZones(location, 500),
            noiseDay: _loadNoise(location, false),
            noiseNight: _loadNoise(location, true),
            air: _loadAir(location)
          }).then(function(results) {
            var finalResults = {};
            _.each(results, function(value, key) {
              finalResults[key] = value.data;
            });
            finalResults.location = result.data.results[0];
            resolve(finalResults);
          }, function(error) {
            reject(error);
          });
        }, function(error) {
          reject(error);
        });
      });
    };

  });
