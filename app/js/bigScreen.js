const {ipcRenderer} = require('electron');
liedbase.controller('BigScreenController', function ($sce, $scope, log, dbFactory) {

  var toggleBigscreen = function() {
    ipcRenderer.send('toggle-bigscreen')
  }
  
})