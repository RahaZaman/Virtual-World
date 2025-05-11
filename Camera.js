class Camera {
  constructor(width, height) {
    this.fov = 60;
    this.eye = new Vector3([0, 1.5, 10]);  // Start higher and further back
    this.at = new Vector3([0, 0.5, 0]);    // Look at the center of the scene
    this.up = new Vector3([0, 1, 0]);      // Up direction

    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();

    this.updateViewMatrix();
    this.updateProjectionMatrix(width, height);
    
    // Log initial camera setup
    console.log("Camera initialized:");
    console.log("- Eye:", this.eye.elements);
    console.log("- At:", this.at.elements);
    console.log("- Up:", this.up.elements);
  }

  updateViewMatrix() {
    this.viewMatrix.setLookAt(
      this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
      this.at.elements[0], this.at.elements[1], this.at.elements[2],
      this.up.elements[0], this.up.elements[1], this.up.elements[2]
    );
  }

  updateProjectionMatrix(width = canvas.width, height = canvas.height) {
    this.projectionMatrix.setPerspective(this.fov, width / height, 0.1, 1000);
  }

  moveForward(speed = 1.0) {  // Increased speed for larger world
    // Calculate forward direction vector (at - eye)
    let forward = new Vector3([
      this.at.elements[0] - this.eye.elements[0],
      0,  // Keep y at 0 to avoid flying
      this.at.elements[2] - this.eye.elements[2]
    ]);
    
    // Normalize and scale
    forward.normalize();
    forward.mul(speed);
    
    // Move both eye and at points
    this.eye.elements[0] += forward.elements[0];
    this.eye.elements[2] += forward.elements[2];
    this.at.elements[0] += forward.elements[0];
    this.at.elements[2] += forward.elements[2];
    
    console.log("After moveForward - Eye:", this.eye.elements, "At:", this.at.elements);
    this.updateViewMatrix();
  }

  moveBackward(speed = 1.0) {  // Increased speed for larger world
    this.moveForward(-speed);  // Reuse moveForward with negative speed
  }

  moveLeft(speed = 1.0) {  // Increased speed for larger world
    // Calculate forward direction
    let forward = new Vector3([
      this.at.elements[0] - this.eye.elements[0],
      0,
      this.at.elements[2] - this.eye.elements[2]
    ]);
    
    // Calculate left direction (up × forward)
    // Manual cross product calculation
    let left = new Vector3([0, 0, 0]);
    left.elements[0] = this.up.elements[1] * forward.elements[2] - this.up.elements[2] * forward.elements[1];
    left.elements[1] = this.up.elements[2] * forward.elements[0] - this.up.elements[0] * forward.elements[2];
    left.elements[2] = this.up.elements[0] * forward.elements[1] - this.up.elements[1] * forward.elements[0];
    
    left.normalize();
    left.mul(speed);
    
    // Move both eye and at points
    this.eye.elements[0] += left.elements[0];
    this.eye.elements[2] += left.elements[2];
    this.at.elements[0] += left.elements[0];
    this.at.elements[2] += left.elements[2];
    
    console.log("After moveLeft - Eye:", this.eye.elements, "At:", this.at.elements);
    this.updateViewMatrix();
  }

  moveRight(speed = 1.0) {  // Increased speed for larger world
    this.moveLeft(-speed);  // Reuse moveLeft with negative speed
  }

  panLeft(alpha = 8) {  // Increased rotation angle for faster turning
    // Calculate forward vector
    let forward = new Vector3([
      this.at.elements[0] - this.eye.elements[0],
      this.at.elements[1] - this.eye.elements[1],
      this.at.elements[2] - this.eye.elements[2]
    ]);
    
    // Create rotation matrix around up vector
    let rotMatrix = new Matrix4();
    rotMatrix.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    
    // Apply rotation to forward vector
    let rotated = rotMatrix.multiplyVector3(forward);
    
    // Update at point based on rotated forward vector
    this.at.elements[0] = this.eye.elements[0] + rotated.elements[0];
    this.at.elements[1] = this.eye.elements[1] + rotated.elements[1];
    this.at.elements[2] = this.eye.elements[2] + rotated.elements[2];
    
    console.log("After panLeft - Eye:", this.eye.elements, "At:", this.at.elements);
    this.updateViewMatrix();
  }

  panRight(alpha = 8) {  // Increased rotation angle for faster turning
    this.panLeft(-alpha);  // Reuse panLeft with negative angle
  }

  rotateWithMouse(deltaX) {
    // Convert pixel movement to rotation angle
    const sensitivity = 0.2;
    const rotationAngle = deltaX * sensitivity;
    
    this.panLeft(-rotationAngle);  // Reuse panLeft with calculated angle
  }
}
