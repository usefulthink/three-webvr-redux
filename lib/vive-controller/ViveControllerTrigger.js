import THREE from '../three';

const BUTTON_INDEX = 1;

// touchpad states
const NONE = 0;
const PRESSED = 2;

const MAX_ROTATION = -20 * Math.PI / 180;

export default class ViveControllerTrigger extends THREE.EventDispatcher {
  constructor() {
    super();

    this.mesh = null;
    this.value = 0.0;
    this.state = NONE;
  }

  update(gamepad) {
    const {pressed, value} = gamepad.buttons[BUTTON_INDEX];

    if (value !== this.value) {
      this.dispatchEvent({type: 'change', value});
      this.value = value;
    }

    if (this.state === NONE && pressed) {
      this.dispatchEvent({type: 'press'});
      this.state = PRESSED;
    } else if (this.state === PRESSED && !pressed) {
      this.dispatchEvent({type: 'release'});
      this.dispatchEvent({type: 'click'});
      this.state = NONE;
    }

    if (this.mesh) {
      this.mesh.rotation.x = value * MAX_ROTATION;
    }
  }

  setMesh(mesh) {
    this.mesh = mesh;
  }
}
