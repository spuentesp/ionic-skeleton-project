angular.module("app").run(function($ionicPlatform) { // eslint-disable-line no-undef
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true); // eslint-disable-line no-undef

      // Don"t remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true); // eslint-disable-line no-undef
    }
    if (window.StatusBar) {
      StatusBar.styleDefault(); // eslint-disable-line no-undef
    }
  });
});