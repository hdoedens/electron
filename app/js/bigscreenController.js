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
    var regex = new RegExp("(.*[:] ?[0-9, ]*)[^0-9]("+highlight+")[^0-9]?(.*)")
    var regex = new RegExp("(.*[:]*[^0-9])("+highlight+")([^0-9]?.*)")
    var match = regex.exec(title)
    var newTitle = match[1]+" <b>"+highlight+"</b>"
    if(match[3] != '')
      return newTitle+","+match[3]
    else
      return newTitle
  }

  console.log('1 levenslied 8: 1')
  console.log(formatTitle('levenslied 8: 1', '1'))
  console.log('1 levenslied 8: 1, 3')
  console.log(formatTitle('levenslied 8: 1, 3', '1'))
  console.log('3 levenslied 8: 1, 3')
  console.log(formatTitle('levenslied 8: 1, 3', '3'))
  console.log('3 levenslied 8: 1, 3, 5')
  console.log(formatTitle('levenslied 8: 1, 3, 5', '3'))
  console.log('1 levenslied 8: 1, 3, 5')
  console.log(formatTitle('levenslied 8: 1, 3, 5', '1'))
  console.log('5 levenslied 8: 1, 3, 5')
  console.log(formatTitle('levenslied 8: 1, 3, 5', '5'))
  console.log('1 levenslied 8: 1, 3, 5, 12')
  console.log(formatTitle('levenslied 8: 1, 3, 5, 12', '1'))
  console.log('3 levenslied 8: 1, 3, 5, 12')
  console.log(formatTitle('levenslied 8: 1, 3, 5, 12', '3'))
  console.log('12 levenslied 8: 1, 3, 5, 12')
  console.log(formatTitle('levenslied 8: 1, 3, 5, 12', '12'))

  $scope.getHtml = function(data) {
    return $sce.trustAsHtml(data)
  }

})