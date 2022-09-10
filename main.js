const {clipboard} = require('electron')

const { app, BrowserWindow, ipcMain, nativeImage, NativeImage } = require('electron')
const path = require('path')
const fs = require('fs')
const https = require('https')

console.log("blarg")
console.log(app.getPath("userData"))


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

const iconName = path.join(__dirname, 'drag_icon.png');

function getDragFiles() {
   let files = []
    files[0] = "13 files"
    files[1] = "13 files"
   return files;
}

ipcMain.on('ondragstart', (event, filePath) => {
    console.log("On start drag");
    event.sender.startDrag({
        files: getDragFiles(),
        icon: iconName,
    })
})

ipcMain.on('ondragend', (event, filePath) => {
    console.log("On drop");
})


ipcMain.on('ontableupdate', (event, rowCount) => {
    console.log("OnTAbleUpdate, rows: " + rowCount);
})



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})