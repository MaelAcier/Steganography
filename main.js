const path = require('path')
const glob = require('glob')
const {app, BrowserWindow} = require('electron')
//const autoUpdater = require('./auto-updater')

const debug = /--debug/.test(process.argv[2])

if (process.mas) app.setName('Electron Template')

let mainWindow = null

function initialize () {
  const shouldQuit = makeSingleInstance()
  if (shouldQuit) return app.quit()

  loadMainProcess()

  function createWindow () {
    const windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 840,
      title: app.getName()
    }

    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png')
    }

    mainWindow = new BrowserWindow(windowOptions)
    mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))

    // Launch fullscreen with DevTools open, usage: npm run debug
    if (debug) {
      mainWindow.webContents.openDevTools()
      mainWindow.maximize()
      require('devtron').install()
    }

    mainWindow.on('closed', () => {
      mainWindow = null
    })
  }

  app.on('ready', () => {
    createWindow()
    //autoUpdater.initialize()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance () {
  if (process.mas) return false

  return app.makeSingleInstance(() => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// Require each JS file in the main-process dir
function loadMainProcess () {
  const files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
  files.forEach((file) => { require(file) })
  //autoUpdater.updateMenu()
}

// Handle Squirrel on Windows startup events
/*switch (process.argv[1]) {
  case '--squirrel-install':
    autoUpdater.createShortcut(() => { app.quit() })
    break
  case '--squirrel-uninstall':
    autoUpdater.removeShortcut(() => { app.quit() })
    break
  case '--squirrel-obsolete':
  case '--squirrel-updated':
    app.quit()
    break
  default:
    initialize()
}*/

initialize()
