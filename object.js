
// Object 클래스 정의

// Sphere 클래스
function Sphere(pt, radius, c) {
  this.class = "Sphere";

  this.p = pt.clone();
  this.radius = radius;
  this.firstT = 0;
  this.firstPoint = new Vector(0, 0, 0);
  this.color = c.clone();
}
Sphere.prototype = {
  checkIntersection : function (ray) {
    tmpvec = ray.O.minus(this.p);
    a = ray.V.dot(ray.V);
    b = ray.V.dot(tmpvec);
    c = tmpvec.dot(tmpvec) - this.radius*this.radius;
    d = b*b-a*c;
    if (d>=0)
    {
      this.firstT = (-b-Math.sqrt(d))/a;
      this.firstPoint = ray.at(this.firstT);
      if (this.firstT < 0)
        return false;
      return true;
    }
    return false;
  },
  getGradient : function() {
    var tmpvec = this.firstPoint.minus(this.p);
    var tmpvec2 = light.minus(this.firstPoint);
    var tmptheta = tmpvec.dot(tmpvec2) / (tmpvec.norm() * tmpvec2.norm());
    tmptheta = tmptheta * 0.5 + 0.5;
    return tmptheta;
  },
  getReflectVector : function(startPos) {
    var inVec = startPos.minus();
    var N = new Vector(this.p, this.firstPoint);
    return new Vector(N.multi((N.dot(inVec))/(N.dot(N))*2), inVec);
  },
  getHighLight : function(startpos) {
    var reflect = this.getReflectVector(light);
    var eyevec = new Vector(this.firstPoint, startpos);
    var tmp = reflect.dot(eyevec)/(reflect.norm()*eyevec.norm());
    tmp = (tmp>0)?Math.pow(tmp,31):0;
    return (tmp>0.80)?1:tmp;
  },
}

// Triangle 클래스
function Triangle(p, p1, p2, c, c1, c2) {
  this.class = "Triangle";

  this.p = p.clone();
  this.vec1 = p1.minus(p);
  this.vec2 = p2.minus(p);
  this.N = this.vec1.cross(this.vec2);
  var d = (this.vec1.cross(this.vec2)).dot(this.N);
  this.u = this.vec2.cross(this.N).div(d);
  this.v = this.vec1.cross(this.N).div(-d);

  this.firstT = 0;
  this.firstPoint = new Vector(0, 0, 0);
  this.color = new Vector(0, 0, 0);
  this.c = c.clone();
  this.c1 = c1.clone();
  this.c2 = c2.clone();
}
Triangle.prototype = {
  checkIntersection : function (ray) {
    this.firstT = -1;
    var d = this.N.dot(ray.V);
    if (d == 0) 
      return false;
    this.firstT = this.N.dot(this.p.minus(ray.O)) / this.N.dot(ray.V);
    this.firstPoint = ray.O.plus(ray.V.multi(this.firstT));
    
    var p = this.firstPoint.minus(this.p);
    var u = this.u.dot(p);
    var v = this.v.dot(p);
    if ( (u < 0) || (v < 0) || (u + v > 1) )
    {
      this.firstT = -1;
      return false;
    }
    this.color = this.c.multi(1-u-v).plus(this.c1.multi(u)).plus(this.c2.multi(v));
    return true;
  },
  getGradient : function() {
    var tmpvec = light.minus(this.firstPoint);    
    var tmptheta = this.N.dot(tmpvec) / (this.N.norm() * tmpvec.norm());
    tmptheta = tmptheta * 0.5 + 0.5;
    return tmptheta;
  },
  getReflectVector : function(startPos) {
    var inVec = startPos.minus();
    return new Vector(this.N.multi((this.N.dot(inVec))/(this.N.dot(this.N))*2), inVec);
  },
  getHighLight : function(startpos) {
    var reflect = this.getReflectVector(light);
    var eyevec = new Vector(this.firstPoint, startpos);
    var tmp = reflect.dot(eyevec)/(reflect.norm()*eyevec.norm());
    return (tmp>0)?Math.pow(tmp,31):0;
  },
}
