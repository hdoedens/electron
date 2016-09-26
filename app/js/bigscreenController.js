// var remote = require('remote')
liedbase.controller('BigscreenController', function ($sce, log) {
    
  const {ipcRenderer} = require('electron')
  console.log('ipcRenderer: ' + ipcRenderer)
  ipcRenderer.on('test', function(event, data) {
    console.log('data: ' + data.msg)
  })
  // console.log(require('remote').getGlobal('sharedObject').someProperty);

})