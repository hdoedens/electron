liedbase.controller('BigscreenController', function ($sce, $scope, log, Liturgie) {

  const {ipcRenderer} = require('electron')

  $scope.mainText = 'default'

  ipcRenderer.on('display', function(event, data) {
    $scope.mainText = data
    $scope.$apply();
  })

})