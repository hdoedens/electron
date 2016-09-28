liedbase.controller('BigscreenController', function ($sce, $scope, log, Liturgie) {

  const {ipcRenderer} = require('electron')

  $scope.title = 'levenslied 8: 1, 2, 4'
  $scope.text = 'body text<br />more body tekst'

  ipcRenderer.on('display', function(event, data) {
    $scope.title = formatTitle(data.title, data.highlight)
    $scope.text = data.text
    $scope.$apply();
  })

  var formatTitle = function(title, highlight) {
    return title.replace(new RegExp(highlight+"\w"), "<b>"+highlight+"</b>")
  }

  $scope.getHtml = function(data) {
    return $sce.trustAsHtml(data)
  }

})