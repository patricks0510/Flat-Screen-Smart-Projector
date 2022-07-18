const { app, BrowserWindow, ipcMain } = require('electron');
const { maxHeaderSize } = require('http');
const path = require('path');

//import custom classes
const Vector2 = require('./vector2.js')
const Vector3 = require('./vector3.js')
const Matrix2x2 = require('./matrix2x2.js')
const Plane = require('./plane.js')
const CartesianPixel = require('./cartesianPixel.js')
//const BmpImage = require('./BmpImage.js')

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

//passes in a pixel buffer from bmpImage.js
function applyTransform(decodedBMP,transformMatrix){
  //empty 2d array for pixels with corresponding cartesian coordinates
  var pxInCartesian = [[],[]]
  //get the pixel data from the decoded BMP
  var pxBuffer = decodedBMP.getPixelArray()
  //pixel buffer position, increments by 4 as there are 4 bytes per pixel
  let bufPos = 0

  //loop through the image, pixel by pixel
  for(let i = 0; i<decodedBMP.getHeight(); i++) {
    for(let j = 0; j<decodedBMP.getWidth();j++) {
      //get the a,r,g,b values from each pixel
      let a = pxBuffer[buffPos]
      let r = pxBuffer[buffPos+1]
      let g = pxBuffer[buffPos+2]
      let b = pxBuffer[buffPos+3]
      
      //get the centered x,y coordinates from cornedered coordinates
      let x = -1*(j - decodedBMP.getWidth()/2)
      let y = -1*(i - decodedBMP.getHeight()/2)

      //create new pixel object and add to array
      pxInCartesian[i][j] = new CartesianPixel(a,r,g,b,x,y)
    }
    //move to next section of the pixel buffer to get the next pixel
    bufPos += 4
  }

  var modPxInCartesian = [[],[]]

  for(let i = 0; i<decodedBMP.getHeight(); i++){
    for(let j = 0; j< decodedBMP.getWidth(); j++){
      let currentPX = pxInCartesian[i][j]
      let originalCoords = currentPX.getCoords()

      let newCoords = originalCoords.matMult(transformMatrix.a,transformMatrix.b,transformMatrix.c,transformMatrix.d)
      let movedPX = new CartesianPixel(currrentPX.a,currentPX.r,currentPX.g,currentPX.b,newCoords.x,newCoords.y)

      modPxInCartesian[i][j] = movedPX
    }
  }
}


var originDistance = new Vector3(0,0,10)
var iHatDistance = new Vector3(1,0,10)
var jHatDistance = new Vector3(0,1,10)

var projPlane = new Plane(originDistance,iHatDistance,jHatDistance)

//image = 

//front end communication logics
ipcMain.on('requestData', (event, arg) => { event.reply('fetchData', { ready: true, originDistance: originDistance, iHatDistance: iHatDistance, jHatDistance: jHatDistance, projPlane: projPlane }) })
ipcMain.on('oDist',(event,arg) => {originDistance.setZ(arg);projPlane.setV1(originDistance)})
ipcMain.on('iDist',(event,arg) => {iHatDistance.setZ(arg);projPlane.setV2(iHatDistance)})
ipcMain.on('jDist',(event,arg) => {jHatDistance.setZ(arg);projPlane.setV3(jHatDistance)})
//ipcMain.on('projectPlane',(event,arg) => {projPlane.calcEq()})