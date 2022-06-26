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

class Vector2 {
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
class Vector3 {
  constructor(x,y,z){
    this.x = x
    this.y = y
    this.z = z
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

//plane class, takes in 3 vectors and calculates the plane
//v1 is i hat, v2 is j hat, v3 is used to determine z hat
class Plane {
  constructor(v1,v2,v3) {
    this.v1 = v1
    this.v2 = v2
    this.v3 = v3
    var equation = [0,0,0,0]//ax+by+cz=d
  }
  calcEq(){
    //vectors in the plane
    let vp1 = new Vector3(this.v1.x-this.v2.x,this.v1.y-this.v2.y,this.v1.z-this.v2.z)
    let vp2 = new Vector3(this.v1.x-this.v3.x,this.v1.y-this.v3.y,this.v1.z-this.v3.z)
    //cross product of vectors in the plane
    let xProd = new Vector3(vp1.y*vp2.z-vp1.z*vp2.y,-1*(vp1.x*vp2.z-vp1.z*vp2.x),vp1.x*vp2.y-vp1.y*vp2.x)
    //create plane equation, RHS being the constant on the right hand side
    let RHS = this.v1.x*xProd.x + this.v1.y*xProd.y + this.v1.z*xProd.z
    //equation is the cross product <x,y,z> = RHS
    this.equation = [xProd.x,xProd.y,xProd.z,RHS]
  }

  getIHat(){
    let iHat = this.v1
    return iHat 
  }

  getJHat(){
    let jHat = this.v2
    return jHat
  }
  
}

var vec1 = new Vector3(4,-3,1)
var vec2 = new Vector3(-3,-1,1)
var vec3 = new Vector3(4,-2,8)
var projPlane = new Plane(vec1,vec2,vec3)
projPlane.calcEq()
var lT = new Matrix2x2(projPlane.v1.x,projPlane.v2.x,projPlane.v1.y,projPlane.v2.y)
console.log(lT)
lT.invert()
console.log(lT)
var newVec1 = new Vector2(vec1.x,vec1.y)
var newVec2 = new Vector2(vec2.x,vec2.y)
var newVec3 = new Vector2(vec3.x,vec3.y)
newVec1.matMult(lT.a,lT.b,lT.c,lT.d)
newVec2.matMult(lT.a,lT.b,lT.c,lT.d)
newVec3.matMult(lT.a,lT.b,lT.c,lT.d)
console.log(newVec1)
console.log(newVec2)
console.log(newVec3)

lT.invert()
newVec1.matMult(lT.a,lT.b,lT.c,lT.d)
newVec2.matMult(lT.a,lT.b,lT.c,lT.d)
newVec3.matMult(lT.a,lT.b,lT.c,lT.d)
console.log(newVec1)
console.log(newVec2)
console.log(newVec3)





/*
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
  
  var testVect = new Vector3(3,4)
  console.log('Example Coordinates: ')
  console.log(testVect)
  console.log('Applying Transform Matrix')
  testVect.matMult(testMat.a,testMat.b,testMat.c,testMat.d)
  console.log('Modified Coordinates: ')
  console.log(testVect)
  }, 5000);
*/
/*setTimeout(() => {
  var shear = new Matrix2x2(1,1,0,1)
  console.log('Applied shearing matrix:')
  console.log(shear)

  var start = new Vector3(0,-25)
  var v1 = new Vector3(25,0)
  var v2 = new Vector3(25,-25)
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

*/

