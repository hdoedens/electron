liedbase.controller('BigscreenController', function ($sce, $scope, log, Liturgie) {

  const {ipcRenderer} = require('electron')
  console.log('ipcRenderer: ' + ipcRenderer)
  ipcRenderer.on('test', function(event, data) {
    console.log('data: ' + data.msg)
  })

})