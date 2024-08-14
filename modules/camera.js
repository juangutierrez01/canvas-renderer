import * as V from "./vector.js";

export default {
  position: [0, -5, 0],
  direction: [0, 1, 0],
  up: [0, 0, 1],
  right: [1, 0, 0],
  GLOBAL_UP: [0, 0, 1],
  fieldOfView: 110 * Math.PI / 180,
  scale: 0.16,
  orthographicPerspective: function(point) {
    point = V.difference(point, this.position);

    if (V.dot(point, this.direction) <= 0) {
      return [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];
    }

    const projection = V.planarProjection(point, this.direction);
    const x = this.scale * V.scalarProjection(point, this.right);
    const y = this.scale * V.scalarProjection(point, this.up);

    return [x, y];
  },
  linearPerspective: function(point) {
    point = V.difference(point, this.position);

    if (V.dot(point, this.direction) <= 0) {
      return [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];
    }

    point = V.scaled(point, 1 / V.dot(point, this.direction));
    const fovScale = Math.tan(this.fieldOfView / 2);
    const x = V.scalarProjection(point, this.right) / fovScale;
    const y = V.scalarProjection(point, this.up) / fovScale;

    return [x, y];
  },
  sphericalPerspective: function(point) {
    point = V.difference(point, this.position);

    const visualAngle = V.angle(this.direction, point) * 2;
    const screenRadius = (visualAngle / this.fieldOfView);

    const projection = V.planarProjection(point, this.direction);

    const x = screenRadius * V.cos(projection, this.right);
    const y = screenRadius * V.cos(projection, this.up);

    return [x, y];
  },
  screenPosition: function(point) {
    return this.linearPerspective(point);
  },
  rotateHorizontally: function(angle) {
    this.direction = V.unit(V.rotation(this.direction, this.GLOBAL_UP, angle));
    this.up = V.unit(V.rotation(this.up, this.GLOBAL_UP, angle));
    this.right = V.normal(this.direction, this.up);
  },
  rotateVertically: function(angle) {
    this.direction = V.unit(V.rotation(this.direction, this.right, angle));
    this.up = V.unit(V.rotation(this.up, this.right, angle));
  }
};
