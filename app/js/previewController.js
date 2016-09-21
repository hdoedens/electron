const {ipcRenderer} = require('electron');
liedbase.controller('PreviewController', function ($sce, $scope, log, Liturgie) {
  $scope.liturgie = Liturgie;

  $scope.getHtml = function(data) {
    return $sce.trustAsHtml(data)
  }

  $scope.toggleBigscreen = function() {
    ipcRenderer.send('toggle-bigscreen', '')
  }
})