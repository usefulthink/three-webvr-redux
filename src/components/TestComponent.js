import THREE from '../../lib/three';
import {createSelector} from 'reselect';
import * as selectors from '../selectors';

/**
 * A component must implement a constructor and an update-function.
 */
export default class TestComponent {
  /**
   * Initializes this component.
   * @param {THREE.Object3D} container  the three-object hosting this component
   * @param {function} dispatch  the redux dispatcher-function
   */
  constructor(container, dispatch) {
    this.container = container;
    this.dispatch = dispatch;

    this.mesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.5, 0.5, 0.5),
      new THREE.MeshStandardMaterial({color: 0xccff33})
    );

    this.mesh.position.set(0, 1, 0);
    container.add(this.mesh);
  }

  update(state) {
    this.mesh.position.y = 1 + 0.3 * Math.sin(state.timestamp / 4000);
  }
}

/**
 * Every component has to define it's own select-function to retrieve the
 * relevant parts from the state. Direct access to state-properties is not
 * allowed. To access , you need to use or define the corresponding
 * functions in ../selectors.js.
 *
 * This is to make sure that components only have access to a well-defined
 * subset of application-state which hopefully prevents invisible coupling
 * through shared state between components.
 */
TestComponent.selector = createSelector(
  [selectors.timestamp, selectors.webvr, selectors.settings],

  (timestamp, webvr, settings) => {
    return {timestamp, display: webvr.displays[0], settings};
  }
);
