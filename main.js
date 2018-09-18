const { app, BrowserWindow } = require('electron')
const config = require('./config')
const initDb = require('./src/models')
const { MainRecorder, RECORDING_MODES } = require('./src/MainRecorder')
const exportSpreadsheet = require('./src/exportSpreadsheet')

const { userDocumentsPath } = config
let dbConnection
let mainRecorder
let mainWindow

async function startup() {
  const appDir = app.getAppPath()
  dbConnection = await initDb(config, appDir)
  mainRecorder = new MainRecorder(dbConnection, appDir)
  mainRecorder.startRecording(RECORDING_MODES.FOCUS_ONLY)

  mainRecorder.on('focus-recorder-log', log => {
    if (mainWindow) mainWindow.webContents.send('log-update', log)
  })
}

const createWindow = () => {
  mainWindow = new BrowserWindow({ width: 800, height: 600, show: false })
  mainWindow.loadFile('index.html')

  mainWindow.webContents.openDevTools()

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  try {
    createWindow()
    startup()
  } catch (error) {
    console.log('Startup error: ', error)
  }
})

app.on('window-all-closed', async () => {
  await mainRecorder.stopRecording()
  try {
    await exportSpreadsheet(dbConnection, userDocumentsPath)
  } catch (error) {
    console.log('Exporting spreadsheet error: ' + error)
  }
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
