import THREE from '../three';

const BUTTON_INDEX = 0;

// touchpad states
const NONE = 0;
const TOUCHED = 1;
const PRESSED = 2;

const TOUCHPAD_RADIUS = 0.018;

export default class ViveControllerTouchpad extends THREE.EventDispatcher {
  constructor() {
    super();

    this.touchpadMesh = null;
    this.positionIndicatorMesh = null;

    this.pressed = false;
    this.touched = false;
    this.x = 0;
    this.y = 0;

    this.state = NONE;
    this.stateHandlers = {
      [NONE]: this.transitionFromNone.bind(this),
      [TOUCHED]: this.transitionFromTouched.bind(this),
      [PRESSED]: this.transitionFromPressed.bind(this)
    };
  }

  update(gamepad) {
    const [x, y] = gamepad.axes;
    const {touched, pressed} = gamepad.buttons[BUTTON_INDEX];

    const lastX = this.x;
    const lastY = this.y;

    this.x = x;
    this.y = y;
    this.pressed = pressed;
    this.touched = touched;

    const inputs = {touched, pressed, x, y, lastX, lastY};

    this.state = this.stateHandlers[this.state](inputs);

    if (this.positionIndicatorMesh) {
      this.positionIndicatorMesh.visible = touched;
      this.positionIndicatorMesh.position.set(
          x * TOUCHPAD_RADIUS,
          y * TOUCHPAD_RADIUS,
          0.001 * (Math.sqrt(x * x + y * y) - 1));
    }
  }

  setMesh(mesh) {
    this.positionIndicatorMesh = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.002, 16, 8),
      new THREE.MeshPhongMaterial({color: 0x666666, shininess: 5})
    );

    this.touchpadMesh = mesh;
    this.touchpadMesh.add(this.positionIndicatorMesh);
  }

  transitionFromNone(inputs) {
    const {touched, pressed, x, y} = inputs;

    let state = NONE;

    if (touched) {
      this.dispatchEvent({type: 'touchstart', x, y});
      state = TOUCHED;
    }

    if (pressed) {
      this.dispatchEvent({type: 'press', x, y});
      state = PRESSED;
    }

    return state;
  }

  transitionFromTouched(inputs) {
    const {touched, pressed, x, y, lastX, lastY} = inputs;
    const positionChanged = lastX !== x || lastY !== y;

    let state = TOUCHED;

    if (positionChanged) {
      this.dispatchEvent({type: 'touchmove', x, y});
    }

    if (!touched) {
      this.dispatchEvent({type: 'touchend', x: lastX, y: lastY});
      state = NONE;
    }

    if (pressed) {
      this.dispatchEvent({type: 'press', x, y});
      state = PRESSED;
    }

    return state;
  }

  transitionFromPressed(inputs) {
    const {touched, pressed, x, y, lastX, lastY} = inputs;
    const positionChanged = lastX !== x || lastY !== y;

    let state = PRESSED;

    if (positionChanged) {
      this.dispatchEvent({type: 'touchmove', x, y});
    }

    if (!pressed) {
      this.dispatchEvent({type: 'release', x: lastX, y: lastY});
      this.dispatchEvent({type: 'click', x: lastX, y: lastY});

      state = TOUCHED;
    }

    if (!touched) {
      this.dispatchEvent({type: 'touchend', x: lastX, y: lastY});
      state = NONE;
    }

    return state;
  }
}
