import THREE from '../../lib/three';
import ViveController from '../../lib/ViveController';

import {createSelector} from 'reselect';
import * as selectors from '../selectors';

const MODEL_JSON = './assets/vive-vr-controller.json';

/**
 * The ViveControllers-class is the integration-point of the controllers
 * into the application.
 *
 * Responsibilities:
 *  - load the controller-model
 *  - setup and configure controller-instances
 *  - assign controller-roles if applicable
 *  - add application-specific behaviours
 *  - bind event-listeners, dispatch meaningful redux-actions for events
 */
export default class ViveControllers {
  constructor(container, dispatch) {
    this.container = container;
    this.dispatch = dispatch;

    this.controllers = [
      new ViveController(),
      new ViveController()
    ];

    this.container.add(...this.controllers);
    this.loadModel().then(model => {
      this.controllers.forEach(
          controller => controller.setMesh(model.clone()));
    });
  }

  /**
   * Updates the current state of the controllers.
   * @param {object} state the state, as defined in
   *     {@link ViveControllers.selector}.
   */
  update(state) {
    const {standingMatrix, controllerIds} = state;

    for (let i = 0; i < this.controllers.length; i++) {
      this.controllers[i].visible = false;
    }

    // update controllers
    for (let i = 0; i < controllerIds.length; i++) {
      const controller = this.controllers[i];

      controller.update(controllerIds[i]);
      if (standingMatrix) {
        controller.standingMatrix.copy(standingMatrix);
      }
    }
  }

  /**
   * A promise-wrapper around `ObjectLoader.load()`. Will resolve with the
   * controller-mesh from {@link #MODEL_JSON}.
   *
   * @returns {Promise<THREE.Mesh>}
   */
  loadModel() {
    const objectLoader = new THREE.ObjectLoader();

    return new Promise(resolve => {
      objectLoader.load(MODEL_JSON, scene => {
        resolve(scene.getObjectByName('vive-controller'));
      });
    });
  }
}

/**
 * Selects required data from the state.
 */
ViveControllers.selector = createSelector(
  [selectors.webvr],

  ({standingMatrix, controllerIds}) => {
    return {
      standingMatrix,
      controllerIds: controllerIds || []
    };
  }
);
