import * as V from "./modules/vector.js";
import {vertices, edges} from "./modules/model.js";

const canvas = window.document.querySelector("canvas");
const context = canvas.getContext("2d", { alpha: false });

const camera = {
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
  ["ArrowDown", 0],
  ["Digit1", 0],
  ["Digit2", 0],
  ["Digit3", 0]
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
  camera.scale *= 1 + (keyMap.get("KeyW") - keyMap.get("KeyS")) * movementSpeed / 4;
  if (keyMap.get("Digit1")) {
    camera.screenPosition = camera.linearPerspective;
  } else if (keyMap.get("Digit2")) {
    camera.screenPosition = camera.sphericalPerspective;
  } else if (keyMap.get("Digit3")) {
    camera.screenPosition = camera.orthographicPerspective;
  }

  context.fillStyle = "cornflowerblue";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "oldlace";
  for (const edge of edges) {
    context.beginPath();
    let [x, y] = camera.screenPosition(vertices[edge[0]]);
    x = (canvas.width / 2) + canvasRadius*x;
    y = (canvas.height / 2) - canvasRadius*y;
    context.moveTo(x, y);
    for (let i = 1; i < edge.length; ++i) {
      [x, y] = camera.screenPosition(vertices[edge[i]]);
      x = (canvas.width / 2) + canvasRadius*x;
      y = (canvas.height / 2) - canvasRadius*y;
      context.lineTo(x, y);
    }
    context.stroke();
  }

  context.fillStyle = "oldlace";
  for (const vertex of vertices) {
    const [x, y] = camera.screenPosition(vertex);
    context.fillRect(
      (canvas.width / 2) + canvasRadius*x - 3,
      (canvas.height / 2) - canvasRadius*y - 3,
      6,
      6
    );
  }
});
