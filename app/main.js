const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// use pouchDB
var PouchDB = require('pouchdb');

var bigScreenWindow

const {ipcMain} = require('electron')
ipcMain.on('toggle-bigscreen', (event, arg) => {
  if(bigScreenWindow.isVisible())
    bigScreenWindow.hide()
  else {
    bigScreenWindow.show()
    bigScreenWindow.setFullScreen(true);
  }
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createMainWindow() {
  // Create the main window.
  mainWindow = new BrowserWindow({x:0, y:0, width: 1920, height: 1280})

  // disable the default menu
  mainWindow.setMenu(null);

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function createBigScreenWindow() {
  // create the window for the big screen
  bigScreenWindow = new BrowserWindow({
    width: 400,
    height: 300,
    show: true
  })

  bigScreenWindow.setFullScreen(true);

  bigScreenWindow.loadURL('file://' + __dirname + '/bigScreen.html')
}

function createWindows () {
  createMainWindow()
  createBigScreenWindow()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindows)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindows()
  }
})
