import THREE from '../three';

// touchpad states
const NONE = 0;
const PRESSED = 2;

export default class ViveControllerButton extends THREE.EventDispatcher {
  constructor(buttonIndex) {
    super();

    this.buttonIndex = buttonIndex;
    this.mesh = null;

    this.pressed = false;
    this.state = NONE;
  }

  update(gamepad) {
    const {pressed} = gamepad.buttons[this.buttonIndex];

    this.pressed = pressed;

    if (this.state === NONE && pressed) {
      this.dispatchEvent({type: 'press'});
      this.state = PRESSED;
    } else if (this.state === PRESSED && !pressed) {
      this.dispatchEvent({type: 'release'});
      this.dispatchEvent({type: 'click'});
      this.state = NONE;
    }

    if (this.mesh) {
      this.mesh.position.z = this.pressed ? 0.002 : 0;
    }
  }

  setMesh(mesh) {
    this.mesh = mesh;
  }
}
