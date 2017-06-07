/**
 * Created by rodrigopalmafanjul on 20-04-17.
 */
angular.module("Core").provider("LocalStorageProvider", function() { // eslint-disable-line no-undef
  return {
    $get: ["$rootScope", "$window",
      function($rootScope, $window) {
        var getLocalStorageItem = function(key) {
          var item = $window.localStorage.getItem(key);
          if (item) {
            return item;
          } else
            return "";

        };

        var setLocalStorageItem = function(key, value) {
          if (key) {
            $window.localStorage.setItem(key, value);
          }
          throw "Key must not be null"
        };

        var removeLocalStorageItem = function(key) {
          if (key) {
            $window.localStorage.removeItem(key);
          } else throw "Key not found"
        };

        var clearLocalStorage = function(estoySeguro) {
          if (estoySeguro === true) {
            $window.localStorage.clear();
          }
        };


        return {
          getLocalStorageItem: getLocalStorageItem,
          setLocalStorageItem: setLocalStorageItem,
          removeLocalStorageItem: removeLocalStorageItem,
          clearLocalStorage: clearLocalStorage
        };
      }
    ]
  }
});