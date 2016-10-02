'use strict';



/**
 * @ngdoc function
 * @name realityApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the realityApp
 */
angular.module('realityApp')
  .controller('MainCtrl', function (Reality) {
    var _self=this;

    this.search = function(address) {
      address += ', Praha';
      Reality.getInfo(address).then(function(results) {
          console.log(results);
          _self.info = results;
      });
    };

    this.formatNoise = function(noiseLevels) {
      return noiseLevels['db-low'] + ' - ' + noiseLevels['db-high'];
    };

    this.formatAirQuality = function(airQualityNum) {
     /*  Definice: Klasifikace klimatologické charakteristiky 1 = velmi dobrá 2 = dobrá 3 = přijatelná 4 = zhoršená 5 = špatná  */

      var airQuality = 'Very bad'; // for case api will add something worse than 5 ;)
      if (airQualityNum === 5) {
        airQuality = 'Bad :(';
      } else if (airQualityNum === 4) {
        airQuality = 'Not Good !';
      } else if (airQualityNum === 3) {
        airQuality = 'Acceptable';
      } else if (airQualityNum === 2) {
        airQuality = 'Good';
      } else if (airQualityNum === 1) {
        airQuality = 'Very Good';
      }

      return airQuality;
    };  

    this.getNoiseLevelAsText = function(noiseLevels) {
      console.log(noiseLevels);
      // http://www.converter.cz/tabulky/hluk.htm
      var highValue = noiseLevels['db-high'];

      switch (true) {
        case (highValue >= 70): return 'Very High !!!';
        case (highValue >= 60): return 'High !!';
        case (highValue >= 50): return 'Moderate';
        case (highValue >= 30): return 'Low';
        case (highValue < 30): return 'Very Low';
      }
    };
  });
