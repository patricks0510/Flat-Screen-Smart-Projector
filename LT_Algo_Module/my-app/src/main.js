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
//v1 is origin, v2 is i hat, v3 is j hat
//distance data comes in, corner sensor goes to v1 <0,0,data1>
//other bottom sensor goes to v2 <1,0,data2>
//top sensor goes to v3 <0,1,data3>
//v1-v3 are points on the projection plane treated as vectors from the origin ('center' of bulb), for the sake of calculations
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

  //unit vectors determined from sensors (v2 and v3) are hard coded to <1,0,dist> and <0,1,dist>
  //these methods use the orign (v1) and the sensors do depermine the actual distance between the origin and the unit sensors
  //iHat and jHat are used to determine transformation
  getIHat(){
    let numx = Math.pow(this.v2.x - this.v1.x,2)
    let numy = Math.pow(this.v2.y - this.v1.y,2)
    let numz = Math.pow(this.v2.z - this.v1.z,2)
    let dist = Math.sqrt(numx+numy+numz)
    let theta = this.getAngle()
    let horz = dist*Math.cos(theta)
    let vert = dist*Math.sin(theta)
    let iHat = new Vector2(horz,vert)
    return iHat
  }

  getJHat(){
    let numx = Math.pow(this.v3.x - this.v1.x,2)
    let numy = Math.pow(this.v3.y - this.v1.y,2)
    let numz = Math.pow(this.v3.z - this.v1.z,2)
    let dist = Math.sqrt(numx+numy+numz)
    let theta = this.getAngle()
    let horz = dist*Math.cos(theta)
    let vert = dist*Math.sin(theta)
    let jHat = new Vector2(vert,horz)
    return jHat
  }
  
  //calculates the angle between the projection plane and a plane that would be normal to the projector 0x+0y+1z=0
  getAngle() {
    //numerator = |A1*A2+B1*B2+C1*C2| = |A1*0+B1*0+C1*1|
    let numerator = Math.abs(this.equation[2])
    //denominator = sqrt(A1^2+A2^2+A3^2)*sqrt(0^2+0^2+1^2)
    let denominator = Math.sqrt(Math.pow(this.equation[0],2)+Math.pow(this.equation[1],2)+Math.pow(this.equation[2],2))
    let cosTheta = numerator/denominator
    let theta = Math.acos(cosTheta)
    return theta
  }
}

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

