<h1 align="center">
  :ice_cube: JS Canvas Renderer
</h1>

<p align="center">
  <a href="http://vanilla-js.com/"><img src="https://img.shields.io/badge/VanillaJS-blanchedalmond?logo=javascript&logoColor=white" alt="VanillaJS badge"></a>
  <a href="/"><img src="https://img.shields.io/badge/HTML5-Canvas-b3dbf2?logo=html5&logoColor=white" alt="HTML5 Canvas badge"></a>
  <a href="/"><img src="https://img.shields.io/badge/CSS-blue?logo=css3&logoColor=white" alt="CSS badge"></a>
</p>

A work-in-progress, fully custom 3D renderer written VanillaJS. Everything from keyboard input to perspective geometry done without external libraries. See it in action at [juangutierrez01.github.io/canvas-renderer](https://juangutierrez01.github.io/canvas-renderer/)

## Controls
- Use <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to move around
- Use the arrow keys (<kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd>) to rotate the camera
- Use <kbd>Space</kbd> to fly upwards
- Use <kbd>Shift</kbd>+<kbd>Space</kbd> to fly downwards
- Press <kbd>1</kbd> to switch to [linear perspective projection](https://en.wikipedia.org/wiki/Perspective_(graphical)) (default)
- Press <kbd>2</kbd> to switch to [spherical perspective projection](https://en.wikipedia.org/wiki/Curvilinear_perspective)
- Press <kbd>3</kbd> to switch to [orthographic perspective projection](https://en.wikipedia.org/wiki/Parallel_projection#Orthographic_projection)

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/juangutierrez01/canvas-renderer/
    ```

2. Navigate to the cloned repository:

    ```bash
    cd canvas-renderer/
    ```

3. Start a local server in the current folder, for example, with Python:

    ```bash
    python3 -m http.server 8000
    ```

    This will start a local server on port 8000

4. Go to [`http://localhost:8000`](http://localhost:8000) on your web browser and you should see the renderer running locally.
