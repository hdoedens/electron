// var remote = require('remote')
const {ipcRenderer} = require('electron')

ipcRenderer.on('test', function(event, data) {
  console.log("data: ${data.msg}")
})