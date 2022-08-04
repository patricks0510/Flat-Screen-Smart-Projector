const Vector2 = require('./vector2.js')
const Vector3 = require('./vector3.js')

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
      var equation = [0,0,0,10]//ax+by+cz=d
      var eqA = equation[0]
      var eqB = equation[1]
      var eqC = equation[3]
      var eqD = equation[4]
      //this.setEq()
    }

    //functions to set new distances, automatically recalculates equation
    setV1(newV1){
        this.v1 = newV1
        this.calcEq()
    }
    setV2(newV2){
        this.v2 = newV2
        this.calcEq()
    }
    setV3(newV3){
        this.v3 = newV3
        this.calcEq()
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
      console.log('detected plane equation: ' + this.equation)
      //this.setEq()
    }
    setEq(){
      if(this.equation){
        this.eqA = this.equation[0]
        this.eqB = this.equaiton[1]
        this.eqC = this.equation[2]
        this.eqD = this.equation[3]
      }
      else {
        this.calcEq()
      }
    }
  
    //unit vectors determined from sensors (v2 and v3):
    //      <1,0,beta> and <0,1,gamma>
    //these methods use the orign (v1) and the sensors do determine the actual
    //distance between the origin and the unit sensors
    //iHat and jHat are used to determine transformation
    getIHat(){
      // distance between origin and i hat calculated
      let numx = Math.pow(this.v2.x - this.v1.x,2)
      let numy = Math.pow(this.v2.y - this.v1.y,2)
      let numz = Math.pow(this.v2.z - this.v1.z,2)
      let dist = Math.sqrt(numx+numy+numz)
      //angle between planes calculated
      let theta = this.getAngle()
      let horz = dist*Math.cos(theta)
      let vert = dist*Math.sin(theta)
      //iHat calculated with trigonometry and angle between planes
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
      // let pi = Math.PI
      // let thetaDeg = 180/pi*theta
      return theta
    }
  }

  module.exports = Plane