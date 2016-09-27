liedbase.controller('PreviewController', function ($sce, $scope, log, Liturgie) {
  $scope.liturgie = Liturgie;

  $scope.getHtml = function(data) {
    return $sce.trustAsHtml(data)
  }

  const {ipcRenderer} = require('electron')

  $scope.showThis = function(liturgieIndex, documentIndex) {
    ipcRenderer.send('display', $scope.liturgie[liturgieIndex].documents[documentIndex].text)
  } 

})