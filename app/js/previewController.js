liedbase.controller('PreviewController', function ($sce, $scope, log, Liturgie) {
  $scope.liturgie = Liturgie;

  $scope.getHtml = function(data) {
    return $sce.trustAsHtml(data)
  }

  const {ipcRenderer} = require('electron')

  $scope.showThis = function(liturgieIndex, documentIndex) {
    var data = {}
    data.title = $scope.liturgie[liturgieIndex].regel
    data.text = $scope.liturgie[liturgieIndex].documents[documentIndex].text
    data.highlight = $scope.liturgie[liturgieIndex].documents[documentIndex].verse
    ipcRenderer.send('display', data)
  } 

})