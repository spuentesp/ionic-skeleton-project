angular.module("app").config(function($stateProvider, $urlRouterProvider) {
$stateProvider
  .state("blank", {
    url: "/blank",
    templateUrl: "templates/Core/blank_starter.html",
    controller: "BlankStarterCtrl"
  })
// if none of the above states are matched, use this as the fallback
$urlRouterProvider.otherwise("/blank");
});
