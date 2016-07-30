import THREE from '../three';

import ViveControllerTouchpad from './ViveControllerTouchpad';
import ViveControllerTrigger from './ViveControllerTrigger';
import ViveControllerButton from './ViveControllerButton';

/**
 * The ViveController provides the binding between the Gamepad-API and
 * three.js, handling both rendering-aspects and state-based
 * event-dispatching for all buttons and the touchpad.
 *
 * Event-based implementations dispatching touch*- and
 * press/release/click-events are provided for all buttons and the touchpad via
 * the corresponding object-properties.
 */
export default class ViveController extends THREE.Object3D {
  constructor() {
    super();

    this.matrixAutoUpdate = false;
    this.standingMatrix = new THREE.Matrix4();

    this.touchpad = new ViveControllerTouchpad();
    this.trigger = new ViveControllerTrigger();
    this.gripButton = new ViveControllerButton(2);
    this.menuButton = new ViveControllerButton(3);
  }

  /**
   * Updates the state of the controller and all components.
   * @param {number} gamepadId
   */
  update(gamepadId) {
    /** @type {VRGamepad} */
    const gamepad = navigator.getGamepads().item(gamepadId);

    if (!gamepad || !gamepad.pose) {
      this.visible = false;

      return;
    }

    this.visible = true;

    this.setMatrixFromPose(gamepad.pose);

    this.touchpad.update(gamepad);
    this.trigger.update(gamepad);
    this.gripButton.update(gamepad);
    this.menuButton.update(gamepad);
  }

  /**
   * Applies the spcified VRPose to this object.
   * @param {VRPose} pose
   */
  setMatrixFromPose(pose) {
    this.position.fromArray(pose.position);
    this.quaternion.fromArray(pose.orientation);
    this.matrix.compose(this.position, this.quaternion, this.scale);
    this.matrix.multiplyMatrices(this.standingMatrix, this.matrix);
    this.matrixWorldNeedsUpdate = true;
  }

  /**
   * Sets the model to render for this controller. The passed mesh is expected
   * to contain named child-meshes for the different parts
   * (see code for details).
   * @param {THREE.Object3D} model
   */
  setMesh(model) {
    this.add(model);

    // dissect and store references to child-objects
    this.refs = {
      led: model.getObjectByName('led'),
      touchpad: model.getObjectByName('touchpad'),
      trigger: model.getObjectByName('trigger'),
      menuBtn: model.getObjectByName('menu-btn'),
      leftSqueezeBtn: model.getObjectByName('left-squeeze-btn'),
      rightSqueezeBtn: model.getObjectByName('right-squeeze-btn')
    };

    this.fixMaterials();

    this.touchpad.setMesh(this.refs.touchpad);
    this.trigger.setMesh(this.refs.trigger);
    this.menuButton.setMesh(this.refs.menuBtn);
  }

  destroy() {
    this.traverse(obj => {
      if (obj.material) { obj.material.dispose(); }
      if (obj.geometry) { obj.geometry.dispose(); }
    });
  }

  /**
   * Updates the materials loaded from the model and clones material for
   * parts of the controller that need to be handled independently.
   */
  fixMaterials() {
    const baseMaterial = this.getObjectByName('handle').material;

    baseMaterial.shininess = 15;

    this.refs.touchpad.material = baseMaterial.clone();
    this.refs.touchpad.material.name = 'touchpad-mat';

    this.refs.trigger.material = baseMaterial.clone();
    this.refs.trigger.material.name = 'trigger-mat';

    this.refs.menuBtn.material = baseMaterial.clone();
    this.refs.menuBtn.material.name = 'menu-mat';

    // squeeze-buttons are always handled as one
    this.refs.leftSqueezeBtn.material =
      this.refs.rightSqueezeBtn.material = baseMaterial.clone();
    this.refs.leftSqueezeBtn.material.name = 'squeeze-btn-mat';

    this.refs.led.material = new THREE.MeshPhongMaterial({
      name: 'led-mat',
      color: 0x888888,
      emissive: 0x00ff00,
      emissiveIntensity: 0.8
    });
  }
}

/*
 # Vive Controller Gamepad-API

 id: "OpenVR Gamepad"
 pose: {position, rotation}

 ## axes

 - axes[0]/axes[1]: trackpad touch xy-position, range [-1,1] (positive: right/up)

 ## Buttons

 - buttons[0]: trackpad (touch position via axes [0..1])
 - .touched properly supported
 - .pressed for click
 - .value 0 or 1

 - buttons[1]: trigger
 - .touched always false
 - .pressed when fully pulled
 - .value: press amount

 - buttons[2]: squeeze button
 - .touched, .pressed: syncronized when pressed
 - .value 0 or 1

 - buttons[3]: menu-button
 - .pressed
 */

/**
 * @typedef {object} VRGamepad
 * @property {VRPose} pose
 * @property {VRGamepadButton[]} buttons
 * @property {number[]} axes
 */
/**
 * @typedef {object} VRPose
 * @property {Float32Array} position
 * @property {Float32Array} orientation
 */
/**
 * @typedef {object} VRGamepadButton
 * @property {boolean} touched
 * @property {boolean} pressed
 * @property {number} value
 */
