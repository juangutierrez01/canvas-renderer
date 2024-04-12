import * as V from "./modules/vector.js";
import points from "./modules/points.js";

const canvas = window.document.querySelector("canvas");
const context = canvas.getContext("2d");

const camera = {
  position: [0, -5, 0],
  direction: [0, 1, 0],
  up: [0, 0, 1],
  right: [1, 0, 0],
  GLOBAL_UP: [0, 0, 1],
  fieldOfView: 110 * Math.PI / 180,
  linearPerspective: function(point) {
    point = V.difference(point, this.position);

    if (V.dot(point, this.direction) <= 0) {
      return [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY];
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

const keyMap = new Map([
  ["KeyW", 0],
  ["KeyA", 0],
  ["KeyS", 0],
  ["KeyD", 0],
  ["Space", 0],
  ["ShiftLeft", 0],
  ["ArrowLeft", 0],
  ["ArrowRight", 0],
  ["ArrowUp", 0],
  ["ArrowDown", 0]
]);

window.addEventListener("keydown", (event) => {
  if (keyMap.has(event.code)) {
    keyMap.set(event.code, 1);
  }
});

window.addEventListener("keyup", (event) => {
  if (keyMap.has(event.code)) {
    keyMap.set(event.code, 0);
  }
});

window.addEventListener("blur", (event) => {
  keyMap.forEach((value, key, map) => {
    map.set(key, 0);
  });
});

window.addEventListener("resize", (function resizeCanvas() {
    canvas.width = window.document.documentElement.clientWidth;
    canvas.height = window.document.documentElement.clientHeight;
    return resizeCanvas;
})());

let previousTime = window.document.timeline.currentTime;
let elapsedTime = 0;

window.requestAnimationFrame(function draw(currentTime) {
  window.requestAnimationFrame(draw);
  elapsedTime = currentTime - previousTime;
  previousTime = currentTime;

  const canvasRadius = Math.max(canvas.width, canvas.height) / 2;
  const movementSpeed = 0.03;
  const rotationSpeed = Math.PI/180;
  camera.position = V.sum(camera.position, V.scaled(camera.direction, (keyMap.get("KeyW") - keyMap.get("KeyS")) * movementSpeed));
  camera.position = V.sum(camera.position, V.scaled(camera.right, (keyMap.get("KeyD") - keyMap.get("KeyA")) * movementSpeed));
  camera.position = V.sum(camera.position, V.scaled(camera.GLOBAL_UP, (keyMap.get("Space") * (-2*keyMap.get("ShiftLeft") + 1)) * movementSpeed));
  camera.rotateHorizontally((keyMap.get("ArrowRight") - keyMap.get("ArrowLeft")) * rotationSpeed);
  camera.rotateVertically((keyMap.get("ArrowDown") - keyMap.get("ArrowUp")) * rotationSpeed);

  context.fillStyle = "cornflowerblue";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "oldlace";
  for (const point of points) {
    const [x, y] = camera.screenPosition(point);
    context.fillRect(
      (canvas.width / 2) + canvasRadius*x - 5,
      (canvas.height / 2) - canvasRadius*y - 5,
      10,
      10
    );
  }
});
