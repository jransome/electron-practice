import { app, BrowserWindow } from 'electron'
import dbConnection from './src/models'
import ProcessRecorder from './src/ProcessRecorder'

// listen for processes
// import processPoller from 'process-list' // this package does not install correctly on mac, commented out when developing on mac
const processPoller = { snapshot: () => Promise.resolve([]) } // stub for developing on mac
const processRecorder = new ProcessRecorder(processPoller, dbConnection, 5000)
processRecorder.startRecording()

setTimeout(() => {
  processRecorder.stopRecording()
}, 5000)

// app
let mainWindow

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

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
