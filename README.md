# Virtual World 
*CSE 160: Introduction to Computer Graphics*

## Project Overview

This project is a WebGL-based 3D virtual world exploration application that demonstrates fundamental computer graphics concepts including camera movement, texture mapping, and interactive world manipulation.

## Features

- **First-Person Camera Navigation**:
  - WASD keys for movement (forward, left, backward, right)
  - QE keys for camera rotation (left, right)
  - Mouse drag for camera rotation

- **Textured Environment**:
  - Large 100x100 unit floor with grass texture
  - Procedurally generated 32x32 world map with walls
  - Multiple textures (grass, dirt) applied to different surfaces
  - Randomized texture application for visual variety

- **World Interaction**:
  - Block placement with spacebar
  - Block deletion with delete key
  - Block type selection with number keys (1-2)

## Technical Implementation

### Core Components

1. **Camera System**:
   - Perspective projection matrix
   - View matrix with lookAt implementation
   - Vector-based movement and rotation

2. **Rendering Pipeline**:
   - Vertex and fragment shaders
   - Matrix transformations (model, view, projection)
   - Depth testing for proper occlusion

3. **Texture Management**:
   - Multiple texture units
   - UV coordinate mapping
   - Texture parameter configuration (wrapping, filtering)

4. **World Generation**:
   - Height-based block system
   - Procedural wall generation
   - Block type tracking

### Technologies Used

- **WebGL**: Low-level 3D graphics API for the web
- **JavaScript**: Core programming language
- **HTML/CSS**: User interface and styling
- **Matrix4/Vector3**: Custom math libraries for 3D transformations

## Controls

- **W**: Move forward
- **A**: Move left
- **S**: Move backward
- **D**: Move right
- **Q**: Rotate camera left
- **E**: Rotate camera right
- **Mouse Drag**: Rotate camera
- **Space**: Place block
- **Delete**: Remove block
- **1-2**: Select block type

## Implementation Details

### Shader Programs

The application uses custom vertex and fragment shaders to handle:
- Position transformations through model, view, and projection matrices
- Texture coordinate mapping
- Multiple texture support with selection

### Camera Movement

The camera system implements:
- Forward/backward movement along the view direction
- Strafing with cross product calculations
- Rotation around the up vector
- Mouse-based rotation for intuitive control

### Texturing

Textures are:
- Loaded asynchronously from image files
- Configured with appropriate wrapping and filtering
- Applied to surfaces with customizable UV coordinates
- Repeated for large surfaces like the floor

### World Structure

The world consists of:
- A large textured floor
- A skybox for background
- A 32x32 grid of blocks with varying heights
- Support for multiple block types with different textures

## Future Enhancements

- Collision detection
- More varied world generation
- Additional block types and textures
- Lighting effects
- Game objectives or story elements

## Credits

Uses WebGL utility libraries:
- cuon-matrix.js
- cuon-utils.js
- webgl-utils.js
- webgl-debug.js