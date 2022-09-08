const {clipboard} = require('electron')
const { app, BrowserWindow } = require('electron')

const { app, BrowserWindow, ipcMain, nativeImage, NativeImage } = require('electron')
const path = require('path')
const fs = require('fs')
const https = require('https')



// include the Node.js 'path' module at the top of your file
const path = require('path')

console.log(clipboard.availableFormats())
console.log("---------------------------")
console.log(clipboard.readText())
console.log("---------------------------")
console.log(clipboard.readHTML())

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
    preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}


app.whenReady().then(() => {
  createWindow()
})


ipcMain.on('ondragstart', (event, filePath) => {
    console.log("On start drag");
    event.sender.startDrag({
        file: path.join(__dirname, filePath),
        icon: iconName,
    })
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})