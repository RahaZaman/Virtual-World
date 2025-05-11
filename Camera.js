class Camera {
  constructor(width, height) {
    this.fov = 60;
    this.eye = new Vector3([0, 0, 3]);
    this.at = new Vector3([0, 0, 0]);
    this.up = new Vector3([0, 1, 0]);

    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();

    this.updateViewMatrix();
    this.updateProjectionMatrix(width, height);
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

  moveForward(speed = 0.2) {
    let f = new Vector3(this.at);
    f.sub(this.eye);
    f.normalize();
    f.mul(speed);
    this.eye.add(f);
    this.at.add(f);
    this.updateViewMatrix();
  }

  moveBackward(speed = 0.2) {
    let b = new Vector3(this.eye);
    b.sub(this.at);
    b.normalize();
    b.mul(speed);
    this.eye.add(b);
    this.at.add(b);
    this.updateViewMatrix();
  }

  moveLeft(speed = 0.2) {
    let f = new Vector3(this.at);
    f.sub(this.eye);
    let s = Vector3.cross(this.up, f);
    s.normalize();
    s.mul(speed);
    this.eye.add(s);
    this.at.add(s);
    this.updateViewMatrix();
  }

  moveRight(speed = 0.2) {
    let f = new Vector3(this.at);
    f.sub(this.eye);
    let s = Vector3.cross(f, this.up);
    s.normalize();
    s.mul(speed);
    this.eye.add(s);
    this.at.add(s);
    this.updateViewMatrix();
  }

  panLeft(alpha = 2) {
    let f = new Vector3(this.at);
    f.sub(this.eye);
    let rotMatrix = new Matrix4();
    rotMatrix.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    let f_prime = rotMatrix.multiplyVector3(f);
    this.at = new Vector3(this.eye);
    this.at.add(f_prime);
    this.updateViewMatrix();
  }

  panRight(alpha = 2) {
    let f = new Vector3(this.at);
    f.sub(this.eye);
    let rotMatrix = new Matrix4();
    rotMatrix.setRotate(-alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    let f_prime = rotMatrix.multiplyVector3(f);
    this.at = new Vector3(this.eye);
    this.at.add(f_prime);
    this.updateViewMatrix();
  }
}
