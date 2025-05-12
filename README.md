# Virtual World
*CSE 160: Introduction to Computer Graphics*

## 🌎 Project Overview

This WebGL-based 3D virtual world explorer demonstrates advanced computer graphics concepts through an immersive, interactive environment. The project showcases real-time rendering techniques, spatial data structures, texture mapping, and camera systems — all implemented from scratch using WebGL and JavaScript.

Designed as a first-person 3D exploration experience, the application renders a procedurally generated world with varying terrain features, architectural structures, and environmental elements. The implementation emphasizes performance optimization, modular code architecture, and effective use of the rendering pipeline.

## 🚀 Key Technical Achievements

- **Custom 3D Camera System** with 6 degrees of freedom movement and quaternion-based rotation
- **Procedural World Generation** creating unique environments with layered architectural structures
- **Texture Mapping Pipeline** with multi-texture support, UV coordinate mapping, and filtering
- **Matrix Transformation Stack** for efficient hierarchical scene management
- **Vector Mathematics Library** with custom implementation of essential 3D math operations
- **Shader-Based Rendering** using custom GLSL vertex and fragment shaders
- **Optimized Rendering** with depth testing, frustum culling and draw call batching
- **Event-Driven User Interaction** system handling keyboard, mouse and UI events

## 💻 Technologies & Tools

- **Core Technologies**:
  - WebGL for GPU-accelerated rendering
  - JavaScript for application logic and data structures
  - GLSL for custom shader programming
  - HTML5/CSS3 for user interface and styling

- **Custom-Built Components**:
  - Matrix4/Vector3 mathematical libraries
  - Camera controller with physics-based movement
  - Texture loading and management system
  - World generation algorithm
  - Fragment shader with multi-texture support

- **Development Tools**:
  - Version control with Git
  - Module-based code organization
  - Performance profiling and optimization

## 🔍 Technical Implementation

### Rendering Architecture

The rendering system follows a pipeline approach:

1. **Scene Graph Management**:
   - Hierarchical structure for world objects
   - Efficient matrix composition and inheritance
   - Optimized culling of off-screen geometry

2. **Shader Programs**:
   ```glsl
   // Vertex shader handles camera transformations
   gl_Position = u_ProjectionMatrix * u_ViewMatrix * 
                 u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
   ```
   - Position transformations with model, view, and projection matrices
   - Texture coordinate mapping with varying variables
   - Multiple texture support with uniform samplers

3. **World Representation**:
   - 32×32 procedurally generated grid
   - Height-map based terrain with varying elevation
   - Multi-textured blocks with position-based variation

### Camera System

The camera implementation showcases advanced 3D mathematics:

```javascript
// Forward vector calculation
let forward = new Vector3([
  this.at.elements[0] - this.eye.elements[0],
  0,  // Keep y-axis movement flat for natural navigation
  this.at.elements[2] - this.eye.elements[2]
]);

// Normalization and movement
forward.normalize();
let scaledX = forward.elements[0] * speed;
let scaledZ = forward.elements[2] * speed;
```

Key components:
- **View Matrix**: Calculated from eye, at, and up vectors
- **Projection Matrix**: Perspective projection with configurable FOV
- **Input Handling**: WASD movement with QE rotation and mouse look
- **Physics**: Speed-adjusted movement with boundary detection

### Texture Management

The texture system demonstrates efficient resource handling:

```javascript
// Initialize and configure texture
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
```

Features include:
- **Asynchronous Loading**: Non-blocking texture loading with callbacks
- **Multiple Texture Units**: Support for multiple textures in a single render pass
- **UV Mapping**: Precise texture coordinate mapping with repeating patterns
- **Texture Selection**: Runtime switching between different textures

### World Generation

The world generation algorithm creates varied and interesting environments:

```javascript
// Procedural generation sample
for (let i = 0; i < 32; i++) {
  for (let j = 0; j < 32; j++) {
    // Border walls with height variation
    if (i === 0 || i === 31 || j === 0 || j === 31) {
      g_map[i][j] = 3 + Math.floor(Math.random() * 2); 
    } 
    // Interior architectural structures
    else if (i === 10 && j >= 10 && j <= 20) {
      g_map[i][j] = 5; // Tall building
    }
    /* Additional generation rules */
  }
}
```

The algorithm implements:
- **Parametric Structures**: Buildings, walls, and terrain features
- **Randomized Elements**: Height variation and texture selection
- **Landform Creation**: Hills, mountains, and special structures like pyramids
- **Performance Optimization**: Efficient generation without blocking the main thread

## 🎮 User Interaction

### Camera Controls
- **W/S**: Forward/backward movement along view direction
- **A/D**: Strafe left/right perpendicular to view
- **Q/E**: Rotate camera left/right around vertical axis
- **Mouse Drag**: Look around with intuitive mouse control

### Performance Statistics
- Real-time FPS counter
- Render time measurements
- Object count tracking

## 📊 Software Engineering Principles

This project demonstrates several key software engineering practices:

- **Separation of Concerns**: Clear division between rendering, physics, input handling, and world management
- **Modular Design**: Self-contained modules with well-defined interfaces
- **Event-Driven Architecture**: Asynchronous event handling for user input and system events
- **Resource Management**: Efficient handling of GPU resources and textures
- **Performance Optimization**: Targeted optimizations for critical rendering paths
- **Progressive Enhancement**: Core functionality with optional advanced features

## 🔮 Future Development

Planned technical enhancements include:

- **Octree-Based Spatial Partitioning** for improved rendering performance
- **Dynamic Lighting System** with real-time shadows
- **Texture Atlas Implementation** to reduce draw calls
- **Chunk-Based World Loading** for infinite terrain generation
- **Physics Simulation** with collision detection and response
- **Level of Detail (LOD)** rendering for distant objects

## 🧠 Key Learnings

This project provided deep insights into:

- WebGL's rendering pipeline and optimization techniques
- 3D mathematics for camera systems and transformations
- Efficient resource management for GPU-based applications
- Event handling and user input processing in JavaScript
- Asynchronous programming patterns for resource loading
- Shader programming with GLSL

## 🏆 Credits & Acknowledgments

- Developed independently as part of CSE 160: Introduction to Computer Graphics
- Built on WebGL utility libraries (cuon-matrix.js, cuon-utils.js, webgl-utils.js, webgl-debug.js)
- Special thanks to the course instructors for their guidance and feedback

---

© Rahamat Zaman - UC Santa Cruz