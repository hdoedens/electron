liedbase.controller('BigscreenController', function ($sce, $scope, log, Liturgie) {

  const {ipcRenderer} = require('electron')

  $scope.title = 'levenslied 1: 1, 2, 4'
  $scope.text = 'body text<br />more body tekst'

  ipcRenderer.on('display', function(event, data) {
    $scope.title = formatTitle(data.title, data.highlight)
    $scope.text = data.text
    $scope.$apply();
  })

  var formatTitle = function(title, highlight) {
    var regex = new RegExp("(.*[: ])("+highlight+")[^0-9](.*)")
    var match = regex.exec(title)
    log.info(match)
    // return title.replace(new RegExp(highlight), "<b>"+highlight+"</b>")
    var newTitle = match[1]+" <b>"+highlight+"</b>"
    if(match[3] != '')
      return newTitle+", "+match[3]
    else
      return newTitle
  }

  $scope.getHtml = function(data) {
    return $sce.trustAsHtml(data)
  }

})