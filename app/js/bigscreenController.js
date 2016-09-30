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
    
    if(title.search(':') == -1)
      return title
    
    // start by replacing *whitespaces with a single whitespace
    title = title.replace(/ +/g, " ")
    // split on ':'
    var titleParts = title.split(':')
    // remove whitespaces from second part 
    titleParts[1] = titleParts[1].replace(/ /g, '')
    // reassemble, replace comma's in second part by comma+whitespace
    title = titleParts[0]+': '+titleParts[1].replace(/,/g, ', ')

    // highlight the verse being displayed
    var regex = new RegExp("(.*[^\d])("+highlight+")((?:[^\d]|$)(?:[0-9, ]*))")
    var match = regex.exec(title)
    var newTitle = match[1]+" <b>"+highlight+"</b>"
    if(match[3] != '')
      return newTitle+match[3]
    else
      return newTitle
  }

  $scope.getHtml = function(data) {
    return $sce.trustAsHtml(data)
  }

})