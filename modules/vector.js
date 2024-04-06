export function magnitude(v) {
  return Math.hypot(v[0], v[1], v[2]);
}

export function nonZeroMagnitude(v) {
  return Math.hypot(v[0], v[1], v[2]) || 1;
}

export function dot(v1, v2) {
  return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
}

export function cos(v1, v2) {
  return this.dot(v1, v2) / (this.nonZeroMagnitude(v1) * this.nonZeroMagnitude(v2));
}

export function angle(v1, v2) {
  return Math.acos(this.cos(v1, v2));
}

// The signed magnitude of the projection of v1 onto v2
export function scalarProjection(v1, v2) {
  return this.dot(v1, v2) / this.nonZeroMagnitude(v2);
}

export function sum(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}

// The sum of v1 and the opposite of v2 (v1-v2)
export function difference(v1, v2) {
  return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

export function scaled(v, s) {
  return [s*v[0], s*v[1], s*v[2]];
}

// The cross product of v1 and v2 (v1×V2)
export function cross(v1, v2) {
  return [
    v1[1]*v2[2] - v1[2]*v2[1],
    v1[2]*v2[0] - v1[0]*v2[2],
    v1[0]*v2[1] - v1[1]*v2[0]
  ];
}

// Unit normal vector attained from v1×v2 
export function normal(v1, v2) {
  return this.unit(this.cross(v1, v2));
}

// Rotation of vector v1 about unit plane v2 by amount s
export function rotation(v1, v2, s) {
  s %= Math.PI;

  const projection = this.projection(v1, v2);
  v1 = this.difference(v1, projection);

  if (s < 0) {
    v1 = this.scaled(v1, -1);
    s += Math.PI;
  }

  if (s === Math.PI/2) {
    return this.sum(this.cross(v1, v2), projection);
  }

  const normal = this.scaled(this.cross(v1, v2), Math.tan(s));
  const sum = this.sum(v1, normal);
  v1 = this.scaled(sum, Math.cos(s));
  return this.sum(v1, projection);
}

export function unit(v) {
  return this.scaled(v, 1 / this.nonZeroMagnitude(v));
}

// Projection of v1 onto v2
export function projection(v1, v2) {
  return this.scaled(v2, this.dot(v1, v2) / Math.pow(this.nonZeroMagnitude(v2), 2));
}

// Projection of vector v1 onto plane v2
export function planarProjection(v1, v2) {
  return this.difference(v1, this.projection(v1, v2));
}
