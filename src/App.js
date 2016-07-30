import THREE from '../lib/three';
import {createStructuredSelector} from 'reselect';

import TestComponent from './components/TestComponent';
import ViveControllers from './components/ViveControllers';
import {setStandingMatrix} from './redux/webvr';

/**
 * The App is the main entry-point for the WebVR-application.
 */
export default class App {
  /**
   * Initializes the application.
   * @param {Store} store  the redux-store.
   */
  constructor(store) {
    this.store = store;

    this.renderer = null;
    this.vrEffect = null;
    this.scene = null;

    this.isPresenting = false;

    this.initRenderer();
    this.initScene();
    this.initCamera();
    this.initControls();

    // not immutable: standingMatrix is a THREE.Matrix-instance that is
    // continually updated by THREE.VRControls, so we only need to set it once.
    this.store.dispatch(setStandingMatrix(this.vrControls.getStandingMatrix()));

    this.components = {
      test: new TestComponent(this.scene, this.store.dispatch),
      controllers: new ViveControllers(this.scene, this.store.dispatch)
    };

    this.select = createStructuredSelector({
      test: TestComponent.selector,
      controllers: ViveControllers.selector
    });
  }

  /**
   * Returns the canvas-element created by the THREE.WebGLRenderer.
   * @returns {Element}
   */
  getDomElement() {
    return this.renderer ? this.renderer.domElement : null;
  }

  /**
   * Update the whole application. Is called by the renderloop before rendering.
   */
  update() {
    const state = this.store.getState();

    if (this.isPresenting !== state.webvr.isPresenting) {
      this.vrEffect.setFullScreen(state.webvr.isPresenting);
      this.isPresenting = state.webvr.isPresenting;
    }

    if (this.isPresenting) {
      this.vrControls.update();
    } else {
      const dt = (state.app.timestamp - this.timestamp) || 0;
      this.timestamp = state.app.timestamp;

      this.flyControls.update(dt);
    }

    // update all components with their state
    const componentState = this.select(state);
    Object.keys(this.components)
      .forEach(id => this.components[id].update(componentState[id]));
  }

  /**
   * Renders the scene using the VR-renderer.
   */
  render() {
    this.vrEffect.render(this.scene, this.camera);
  }

  /**
   * @private
   */
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.vrEffect = new THREE.VREffect(this.renderer);
    this.vrEffect.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * @private
   */
  initScene() {
    window.scene = this.scene = new THREE.Scene();

    // ---- basic lighting
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    const ambLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2);
    dirLight.position.set(-1, 2, 1);

    this.scene.add(dirLight, ambLight);

    // ---- some helpers
    this.scene.add(new THREE.AxisHelper(1));
    this.scene.add(new THREE.GridHelper(50, 100));
  }

  /**
   * @private
   */
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 5000);
    this.camera.layers.enable(1); // render left view when no stereo available

    this.scene.add(this.camera);
  }

  /**
   * @private
   */
  initControls() {
    this.vrControls = new THREE.VRControls(this.camera);
    this.vrControls.standing = true;

    this.flyControls = new THREE.FlyControls(this.camera);
    this.flyControls.autoForward = false;
    this.flyControls.dragToLook = true;
    this.flyControls.movementSpeed = 0.002;
    this.flyControls.rollSpeed = 0.0003;
  }
}
