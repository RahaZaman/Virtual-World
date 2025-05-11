// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;

  void main() {

    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;                    // Use color
    } 
    else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);           // Use UV debug color
    }
    else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);   // Use texture0
    }
    else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);   // Use texture1
    }
    else {
      gl_FragColor = vec4(1,.2,.2,1);               // Error, use Redish
    }

  }`

// Global variables
let canvas;
let gl; 
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return; 
  }

  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return; 
  }

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return; 
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return; 
  }

  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  // Get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  // Get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  // Set an initial value for this matrix to identity 
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// global related UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0]; 
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_yellowAnimation = false;

// map or world creation
var g_map = [];

for (let i = 0; i < 32; i++) {
  g_map[i] = [];
  for (let j = 0; j < 32; j++) {
    // Generate some basic wall pattern
    if (i === 0 || i === 31 || j === 0 || j === 31) {
      g_map[i][j] = 3; // Border wall
    } else if ((i % 5 === 0 && j % 5 === 0)) {
      g_map[i][j] = 2; // Decorative internal blocks
    } else {
      g_map[i][j] = 0; // Empty space
    }
  }
}

// Set up actions for HTML UI elements
function addActionsForHTMLUI() {
  document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderAllShapes(); });
  document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderAllShapes(); });

  document.getElementById('animationYellowOnButton').onclick = function() {g_yellowAnimation = true };
  document.getElementById('animationYellowOffButton').onclick = function() {g_yellowAnimation = false};

  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });

}

function initTextures() {

  // var image = new Image();  // Create the image object
  // if (!image) {
  //   console.log('Failed to create the image object');
  //   return false;
  // }
  // // Register the event handler to be called on loading an image
  // image.onload = function(){ sendTextureToTEXTURE0(image);};
  // // Tell the browser to load an image
  // image.src = 'img/sky.jpg';

  // Sky texture
  let skyImage = new Image();
  if (!skyImage) {
    console.log('Failed to create the sky image object');
    return false;
  }
  skyImage.onload = function () {
    sendTextureToTEXTURE0(skyImage);
  };
  skyImage.src = 'img/sky.jpg';

  // Dirt texture
  let dirtImage = new Image();
  if (!dirtImage) {
    console.log('Failed to create the dirt image object');
    return false;
  }
  dirtImage.onload = function () {
    sendTextureToTEXTURE1(dirtImage);
  };
  dirtImage.src = 'img/dirt.jpg';

  // Add more textures loading
  return true;
}

function sendTextureToTEXTURE0(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
  console.log('finished loadTexture');
}

function sendTextureToTEXTURE1(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the dirt texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);

  console.log('finished loadTexture');
}

function main() {
  
  // Set up canvas and gl variables
  setupWebGL();

  g_camera = new Camera(canvas.width, canvas.height);

  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Set up actions for HTML UI elements
  addActionsForHTMLUI();

  // Register function (event handler) to be called on a mouse press
  document.onkeydown = keydown;

  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Render
  // gl.clear(gl.COLOR_BUFFER_BIT);
  // renderAllShapes();
  requestAnimationFrame(tick);
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 + g_startTime;

// Called by browser repeatedly whenever its time
function tick() {
  // Prints some debugging information to console
  g_seconds = performance.now() / 1000.0 + g_startTime;
  // console.log(performance.now());

  // Update Animation Angles
  updateAnimationAngles();

  // Draw everything
  renderAllShapes();

  // Tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

var g_shapesList = [];

// function click(ev) {

//   // Extract the event click and return it in WebGL coordinates
//   let [x, y] = convertCoordinatesEventToGL(ev);

//   // Create and store the new Point
//   let point;

//   if (g_selectedType == POINT) {
//     point = new Point();
//   } else if (g_selectedType == TRIANGLE) {
//     point = new Triangle();
//   } else {
//     point = new Circle();
//   }

//   point.position = [x,y];
//   point.color = g_selectedColor.slice();
//   point.size = g_selectedSize;
//   point.segments = g_segment;
//   g_shapesList.push(point);

//   // Draw every shape that is supposed to be in the canvas
//   renderAllShapes();
// }

// // Extract the event click and return it in WebGL coordinates
// function convertCoordinatesEventToGL(ev) {
//   var x = ev.clientX; // x coordinate of a mouse pointer
//   var y = ev.clientY; // y coordinate of a mouse pointer
//   var rect = ev.target.getBoundingClientRect();

//   x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
//   y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

//   return([x,y]);
// }

// Update the angles of everything if currently animated
function updateAnimationAngles() {
  if (g_yellowAnimation) {
    g_yellowAngle = (45 * Math.sin(g_seconds));
  }
}

// performs the keyboard input
function keydown(ev) {

  /* Camera Movement */

  if (ev.key === 'w' || ev.key === 'W') {
    g_camera.moveForward();
  } 
  
  else if (ev.key === 's' || ev.key === 'S') {
    g_camera.moveBackward();
  } 
  
  else if (ev.key === 'a' || ev.key === 'A') {
    g_camera.moveLeft();
  } 
  
  else if (ev.key === 'd' || ev.key === 'D') {
    g_camera.moveRight();
  } 
  
  /* Rotating Cameras */

  else if (ev.key === 'q' || ev.key === 'Q') {
    g_camera.panLeft();
  } 
  
  else if (ev.key === 'e' || ev.key === 'E') {
    g_camera.panRight();
  }
  
  renderAllShapes();
  console.log(`Key pressed: ${ev.key}, KeyCode: ${ev.keyCode}`);
}

// variables that control where the camera is / angle
var g_eye = [0,0,3];
var g_at = [0,0, -100];
var g_up = [0, 1, 0]; 

function drawMap() {
  for (let x = 0; x < 32; x++) {
    for (let z = 0; z < 32; z++) {
      let height = g_map[x][z];
      for (let y = 0; y < height; y++) {
        let wall = new Cube();
        wall.textureNum = 1;
        wall.color = [0.8, 0.8, 0.8, 1.0];
        wall.matrix.translate(x - 16, y - 0.75, z - 16); // Center map
        wall.render();
      }
    }
  }
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {

  // Check the time at the start of this function
  var startTime = performance.now();

  // can call setPerspective and setLookAt commands in console with Matrix4()

  // // Pass the projection matrix
  // var projMat = new Matrix4();
  // projMat.setPerspective(50, 1*canvas.width/canvas.height, 1, 100);
  // gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // // Pass the view matrix
  // var viewMat = new Matrix4();
  // // viewMat.setLookAt(0, 0, 3,  0,0,-100,   0,1,0); // (eye, at, up)
  // viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2],  g_at[0],g_at[1],g_at[2],   g_up[0],g_up[1],g_up[2]); // (eye, at, up)
  // gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  g_camera.updateProjectionMatrix(); // in case canvas resizes
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projectionMatrix.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);

  // Pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Draw the floor
  var floor = new Cube();
  floor.color = [0.0, 0.6, 0.0, 1.0];
  floor.matrix.translate(0, -0.75, 0.0);
  floor.matrix.scale(10, 0, 10);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.render();

  // Draw the sky
  var sky = new Cube();
  sky.color = [0.6, 0.8, 1.0, 1.0];
  sky.matrix.scale(1000,1000,1000);
  sky.matrix.translate(-.5, -.5, -0.5);
  sky.render();

  drawMap();

  // Draw the body cube
  var body = new Cube();
  body.color = [1.0, 0.0, 0.0, 1.0];
  body.textureNum = 0; // It looks like this variable is not used

  body.matrix.translate(-0.25, -0.75, 0.0);
  body.matrix.rotate(-5, 1, 0, 0);
  body.matrix.scale(0.5, 0.3, 0.5);
  body.render();

  // Yellow arm
  var yellow = new Cube();
  yellow.color = [1, 1, 0, 1];
  yellow.matrix.setTranslate(0, -0.5, 0.0);
  yellow.matrix.rotate(-5, 1, 0, 0);
  yellow.matrix.rotate(g_yellowAngle, 0, 0, 1);

  var yellowCoordinatesMat = new Matrix4(yellow.matrix);
  yellow.matrix.scale(0.25, 0.7, 0.5);
  yellow.matrix.translate(-0.5, 0, 0);
  yellow.render();

  // Magenta box
  var magenta = new Cube();
  magenta.color = [1, 0, 1, 1]; 
  magenta.textureNum = 0;
  magenta.matrix = yellowCoordinatesMat;
  magenta.matrix.translate(0, 0.65, 0);
  magenta.matrix.rotate(g_magentaAngle, 0, 0, 1);
  magenta.matrix.scale(0.3, 0.3, 0.3);
  magenta.matrix.translate(-0.5, 0, -0.001);
  magenta.render();

  // Ground plane
  var ground = new Cube();
  ground.matrix.translate(0, 0, -1);
  ground.matrix.scale(2,.1,2);
  ground.render();

  // Check the time at the end of the function, and show on web page
  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + (Math.floor(1000/duration))/10, "numdot");
}

// Set the text of an HTML element
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + "from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
