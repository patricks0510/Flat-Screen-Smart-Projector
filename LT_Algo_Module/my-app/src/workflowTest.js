const Vector2 = require('./vector2.js')
const Vector3 = require('./vector3.js')
const Matrix2x2 = require('./matrix2x2.js')
const Plane = require('./plane.js')
const CartesianPixel = require('./cartesianPixel.js')
const BmpImage = require('./bmpImage.js')
const transformer = require('./applyTransform.js')

const { performance } = require('perf_hooks');

var startTime = performance.now()

var originDistance = new Vector3(0,0,10)
var iHatDistance = new Vector3(1,0,10.5)
var jHatDistance = new Vector3(0,1,10)

var projPlane = new Plane(originDistance,iHatDistance,jHatDistance)

projPlane.calcEq()

var iHat = projPlane.getIHat()
var jHat = projPlane.getJHat()

var lT = new Matrix2x2(iHat.x,jHat.x,iHat.y,jHat.y)

lT.invert()

var pic = new BmpImage('circle')
let newpixelStream = transformer.applyTransform(pic.pixelStream,pic.bmpData.height,pic.bmpData.width,lT)
pic.overwritePxStream(newpixelStream)
//pic.colorShift()

pic.createNewBMP()

var endTime = performance.now()

console.log(`Sensor input to image output took ${endTime - startTime} milliseconds`)