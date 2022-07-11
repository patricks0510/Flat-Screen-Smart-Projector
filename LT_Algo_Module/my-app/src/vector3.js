class Vector3 {
    constructor(x,y,z){
      this.x = x
      this.y = y
      this.z = z
    }
    setZ(num){
        this.z = num
    }
    getZ(){
        return this.z
    }
  }
  module.exports = Vector3