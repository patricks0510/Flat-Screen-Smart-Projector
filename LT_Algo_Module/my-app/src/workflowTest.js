const Vector2 = require('./vector2.js')
const Vector3 = require('./vector3.js')
const Matrix2x2 = require('./matrix2x2.js')
const Plane = require('./plane.js')
const CartesianPixel = require('./cartesianPixel.js')
const BmpImage = require('./bmpImage.js')
const transformer = require('./applyTransform.js')


var originDistance = new Vector3(0,0,10)
var iHatDistance = new Vector3(1,0,11)
var jHatDistance = new Vector3(0,1,10)

var projPlane = new Plane(originDistance,iHatDistance,jHatDistance)

projPlane.calcEq()

var iHat = projPlane.getIHat()
var jHat = projPlane.getJHat()

var lT = new Matrix2x2(iHat.x,jHat.x,iHat.y,jHat.y)

lT.invert()

var pic = new BmpImage('bmp_24')
console.log(pic.bmpData.width)
console.log(pic.bmpData.height)
pic.pixelStream = transformer.applyTransform(pic.pixelStream,pic.bmpData.height,pic.bmpData.width,lT)

pic.createNewBMP()