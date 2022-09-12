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

let win = null;

const createWindow = () => {
  win = new BrowserWindow({
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
    //let files = new DataTransferItemList();
    let files = [];
    for (const [key, value] of Object.entries(newToExistingRequested)) {
        if (newToExistingInFolder[key] == value)
            files.push(composeTempFileName(key, value));
    }
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

let newToExistingRequested = new Object();  // wanted
let newToExistingInFolder = new Object();   // currently in temp folder
let newToExistingInFlight = new Object();   // Promise - the file copy that is in progress


ipcMain.on('ontableupdate', (event, newToExisting) => {
    console.log("ontableupdate")
    let count = 0;
    for (const [key, value] of Object.entries(newToExisting)) {
        console.log(key + " -> " + value);
        ++count;
    }
    newToExistingRequested = newToExisting;
    countReadyItems();
    sheduleFileTransfers(newToExisting);
})


function composeTempFileName(newName, existingFileName) {
    let destFile = newName + path.extname(existingFileName);
    let destPath = path.join(tempFolder, destFile);
    return destPath;
}

function sheduleFileTransfers(newToExisting) {
    for (const [key, value] of Object.entries(newToExisting)) {
        if (newToExistingInFlight[key] == null)
            newToExistingInFlight[key] = Promise.resolve(true);
        newToExistingInFlight[key] = newToExistingInFlight[key].finally(async () => {
            let destPath = composeTempFileName(key, value);
            console.log("moving from " + value + " to " + destPath);
            await fs.copyFile(value, destPath, (err) => onFinishedFileCopy(key, value, err))
        })
    }
}

function onFinishedFileCopy(newName, existingFile, err) {
    newToExistingInFolder[newName] = existingFile;
    countReadyItems();
}

function countReadyItems() {
    let count = 0;
    for (const [key, value] of Object.entries(newToExistingRequested)) {
        if (newToExistingInFolder[key] == value)
            count++;
    }
   win.webContents.send("updateReadyCount", count)
}




app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})