
// Math Classes

// Vector Class
function Vector(x, y, z) {
  this.x = x; this.y = y; this.z = z;
}
Vector.fromPoints = function(p1, p2) {
  return new Vector(p2.x-p1.x, p2.y-p1.y, p2.z-p1.z);
}
Vector.prototype = {
  clone : function() {
    return new Vector(this.x, this.y, this.z);
  },
  plus : function(vec) { return new Vector(this.x+vec.x, this.y+vec.y, this.z+vec.z); },
  negative : function() { return new Vector(-this.x, -this.y, -this.z); },
  minus : function(vec) { 
    return new Vector(this.x-vec.x, this.y-vec.y, this.z-vec.z); 
  },
  multi : function(s) { return new Vector(this.x*s, this.y*s, this.z*s); },
  div : function(s) { return new Vector(this.x/s, this.y/s, this.z/s); },
  dot : function(vec) { return this.x*vec.x + this.y*vec.y + this.z*vec.z; },
  cross : function(vec) { return new Vector(this.y*vec.z-this.z*vec.y,this.z*vec.x-this.x*vec.z,this.x*vec.y-this.y*vec.x); },
  norm : function() {
      return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
  },
  normalize : function() {
      norm = this.norm();
      this.x /= norm;
      this.y /= norm;
      this.z /= norm;
      return this.clone();
  },
  normal : function() {
      norm = this.norm();
      return new Vector(this.x/norm,this.y/norm,this.z/norm);
  },
  toString : function() {
      return "Vector (" + this.x + ", " + this.y + ", " + this.z + ")";
  }
}

// Point Class
function Point(x, y, z) {
  this.x = x; this.y = y; this.z = z;
}
Point.prototype = {
  clone : function() {
    return new Point(this.x, this.y, this.z);
  },
  plus : function(pt) { return new Point(this.x+pt.x, this.y+pt.y, this.z+pt.z); },
  minus : function(pt) { return new Point(this.x-pt.x, this.y-pt.y, this.z-pt.z); },
  multi : function(s) { return new Point(this.x*s, this.y*s, this.z*s); },
  div : function(s) { return new Point(this.x/s, this.y/s, this.z/s); },
  dot : function(pt) { return this.x*pt.x + this.y*pt.y + this.z*pt.z; },
  cross : function(pt) { return new Point(this.y*pt.z-this.z*pt.y,this.z*pt.x-this.x*pt.z,this.x*pt.y-this.y*pt.x); },
  norm : function() {
    return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
  },
  toString : function() {
    return "Point (" + this.x + ", " + this.y + ", " + this.z + ")";
  }
}

// Ray Class
function Ray(pt, vec) {
  this.V = vec.clone();
  this.O = pt.clone();
}
Ray.prototype = {
  copy : function(ray) {
      return new Ray( ray.pt.clone(), ray.vec.clone() );
  },
  at : function(t) {
      return this.O.plus(this.V.multi(t));
  },
  toString : function() {
      return "Ray p : " + this.O + ", v : " + this.V;
  }
}

// Coordination System Class
function CoordinationSystem(ray, upvec) {
  w = new Vector(0, 0, 0);
  u = new Vector(0, 0, 0);
  v = new Vector(0, 0, 0);

  w = ray.V;
  w.normalize();
  u = upvec.cross(w);
  u.normalize();
  v = w.cross(u);
  v.normalize();

  this.O = ray.O;
  this.N1 = new Vector(u.x, v.x, w.x);
  this.N2 = new Vector(u.y, v.y, w.y);
  this.N3 = new Vector(u.z, v.z, w.z);
}
CoordinationSystem.prototype.worldize = function(obj) {
  var x = this.N1.dot(obj);
  var y = this.N2.dot(obj);
  var z = this.N3.dot(obj);
  if (obj instanceof Vector) return new Vector(x, y, z);
  if (obj instanceof Point) return new Vector(x+O.x, y+O.y, z+O.z);
  return error("CoordinationSystem::Worldize() : Only Vector or Point can be accepted.");
}
