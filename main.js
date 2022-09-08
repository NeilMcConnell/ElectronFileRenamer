const {clipboard} = require('electron')
const { app, BrowserWindow } = require('electron')

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


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})