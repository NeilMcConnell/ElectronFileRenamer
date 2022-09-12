const {clipboard} = require('electron')

const { app, BrowserWindow, ipcMain, nativeImage, NativeImage } = require('electron')
const path = require('path')
const fs = require('fs')
const https = require('https')

console.log("blarg")
console.log(app.getPath("userData"))
console.log(app.getPath("temp"))

let tempFolder = CreateTempFolder();
console.log(tempFolder);


function CreateTempFolder() {
    temp = path.join(app.getPath("temp"), "electronFileRenamer");

    if (!fs.existsSync(temp)) {
        fs.mkdirSync(temp);
    }
    return temp;
}


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

ipcMain.on("fileContents", (event, path, contents) =>
{
    console.log("received file contents for " + path);
    console.log("contents " + contents.length);
})

ipcMain.on('ontableupdate', (event, newToExisting) => {
    console.log("ontableupdate")
    for (const [key, value] of Object.entries(newToExisting)) {
        console.log(key + " -> " + value);
    }

})



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})