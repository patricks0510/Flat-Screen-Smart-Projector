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

      return new Vector2(this.x,this.y)
    }
  }
  module.exports = Vector2