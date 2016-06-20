angular.module('typeAhead', []).controller('TypeAheadController', function ($scope, $http) {
  
  $scope.items = [];
  $http.get('./resources/type-ahead.json').then(function(response) {
    $scope.items = response.data;
  })

  $scope.modelOptions = {
    debounce: {
      default: 500,
      blur: 250
    },
    getterSetter: true
  };
})