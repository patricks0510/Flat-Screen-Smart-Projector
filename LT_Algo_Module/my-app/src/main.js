const { app, BrowserWindow } = require('electron');
const { maxHeaderSize } = require('http');
const path = require('path');

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

class Vector {
  constructor(x,y){
    this.x = x
    this.y = y
  }
  matMult(a,b,c,d) {
    let newx = a*this.x+b*this.y
    let newy = c*this.x+d*this.y

    this.x = newx
    this.y = newy
  }
}
/*2x2 matrix class in the form of:
 [a b; c d]
*/
class Matrix2x2 {
  constructor(a,b,c,d){
    this.a = a
    this.b = b
    this.c = c
    this.d = d
  }
  invert(){
    let det = (1/(this.a*this.d-this.b*this.c))
    det = det.toFixed(3)
    let tempA = this.d*det
    let tempD = this.a*det
    this.a = tempA
    this.b = -1*this.b*det
    this.c = -1*this.c*det
    this.d = tempD
    this.a = this.a.toFixed(3)
    this.b = this.b.toFixed(3)
    this.c = this.c.toFixed(3)
    this.d = this.d.toFixed(3)
  }
}
setTimeout(() => {
  var testMat = new Matrix2x2(4,7,2,6)
  console.log('Original: ')
  console.log(testMat)
  testMat.invert()
  console.log('Inveterted: ')
  console.log(testMat)
  console.log('Reinverting')
  testMat.invert()
  console.log('Orignial: ')
  console.log(testMat)
  
  var testVect = new Vector(3,4)
  console.log('Example Coordinates: ')
  console.log(testVect)
  console.log('Applying Transform Matrix')
  testVect.matMult(testMat.a,testMat.b,testMat.c,testMat.d)
  console.log('Modified Coordinates: ')
  console.log(testVect)
  }, 5000);

setTimeout(() => {
  var shear = new Matrix2x2(1,1,0,1)
  console.log('Applied shearing matrix:')
  console.log(shear)

  var start = new Vector(0,-25)
  var v1 = new Vector(25,0)
  var v2 = new Vector(25,-25)
  console.log('Original coordinates of the triangle vertices: ' )
  console.log(start)
  console.log(v1)
  console.log(v2)
  start.matMult(shear.a,shear.b,shear.c,shear.d)
  v1.matMult(shear.a,shear.b,shear.c,shear.d)
  v2.matMult(shear.a,shear.b,shear.c,shear.d)
  
  console.log('Transformed coordinates of the triangle vertices: ' )
  console.log(start)
  console.log(v1)
  console.log(v2)

  },5000);



