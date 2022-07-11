const { app, BrowserWindow, ipcMain } = require('electron');
const { maxHeaderSize } = require('http');
const path = require('path');

//import custom classes
const Vector2 = require('./vector2.js')
const Vector3 = require('./vector3.js')
const Matrix2x2 = require('./matrix2x2.js')
const Plane = require('./plane.js')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools({mode: 'detach'});
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

function mathProof(){
  var vec1 = new Vector3(0,0,5)
  var vec2 = new Vector3(1,0,6)
  var vec3 = new Vector3(0,1,7)
  var projPlane = new Plane(vec1,vec2,vec3)
  projPlane.calcEq()
  console.log(projPlane.equation)
  var iHat = projPlane.getIHat()
  var jHat = projPlane.getJHat()
  console.log('i^: ')
  console.log(iHat)
  console.log('j^: ')
  console.log(jHat)
  var lT = new Matrix2x2(iHat.x,jHat.x,iHat.y,jHat.y)
  console.log('Matrix: ')
  console.log(lT)
  lT.invert()
  console.log('Matrix\': ')
  console.log(lT)
  var newVec1 = new Vector2(vec1.x,vec1.y)
  var newVec2 = new Vector2(vec2.x,vec2.y)
  var newVec3 = new Vector2(vec3.x,vec3.y)
  newVec1.matMult(lT.a,lT.b,lT.c,lT.d)
  newVec2.matMult(lT.a,lT.b,lT.c,lT.d)
  newVec3.matMult(lT.a,lT.b,lT.c,lT.d)
  console.log('Vector1*LT: ')
  console.log(newVec1)
  console.log('Vector2*LT: ')
  console.log(newVec2)
  console.log('Vector3*LT: ')
  console.log(newVec3)

  lT.invert()
  newVec1.matMult(lT.a,lT.b,lT.c,lT.d)
  newVec2.matMult(lT.a,lT.b,lT.c,lT.d)
  newVec3.matMult(lT.a,lT.b,lT.c,lT.d)
  console.log('Vector1: ')
  console.log(newVec1)
  console.log('Vector2: ')
  console.log(newVec2)
  console.log('Vector3: ')
  console.log(newVec3)
}

originDistance = new Vector3(0,0,10)
iHatDistance = new Vector3(1,0,10)
jHatDistance = new Vector3(0,1,10)

projPlane = new Plane(originDistance,iHatDistance,jHatDistance)

//front end communication logics
ipcMain.on('requestData', (event, arg) => { event.reply('fetchData', { ready: true, originDistance: originDistance, iHatDistance: iHatDistance, jHatDistance: jHatDistance }) })
ipcMain.on('oDist',(event,arg) => {originDistance.setZ(arg);projPlane.setV1(originDistance)})
ipcMain.on('iDist',(event,arg) => {iHatDistance.setZ(arg);projPlane.setV2(iHatDistance)})
ipcMain.on('jDist',(event,arg) => {jHatDistance.setZ(arg);projPlane.setV3(jHatDistance)})
//ipcMain.on('projectPlane',(event,arg) => {projPlane.calcEq()})