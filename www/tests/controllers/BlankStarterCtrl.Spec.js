/**
 * Created by rodrigopalmafanjul on 06-06-17.
 */
describe('BlankStarterCtrl', function(){

  var $scope, $controller;

  // Load app
  beforeEach(module('app'));

  // Inject services and spin up the controller
  beforeEach(inject(function(_$rootScope_, _$controller_,_TRANSLATION_){

    $scope = _$rootScope_;
    $controller = _$controller_;
    TRANSLATION = _TRANSLATION_;
    ctrl = $controller('BlankStarterCtrl', {$scope,TRANSLATION});

  }));

  // Tests
  it('should get strings from translation file', function(){
    expect($scope.translation).toEqual(TRANSLATION.BlankStarter);
  });

});
