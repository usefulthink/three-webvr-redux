const SET_INITIALIZED = 'webvr/SET_INTIALIZED';
const SET_SUPPORTED = 'webvr/SET_SUPPORTED';
const SET_DISPLAYS = 'webvr/SET_DISPLAYS';
const SET_CONTROLLER_IDS = 'webvr/SET_CONTROLLER_IDS';
const SET_STANDING_MATRIX = 'webvr/SET_STANDING_MATRIX';
const SET_IS_PRESENTING = 'webvr/SET_IS_PRESENTING';

const initialState = {
  initialized: false,
  isSupported: false,
  isPresenting: false,
  displays: [],
  controllerIds: []
};


// ---- reducer

export default function webvrReducer(state = initialState, action) {
  switch(action.type) {
    case SET_INITIALIZED: return {
      ...state,
      initialized: true
    };

    case SET_IS_PRESENTING: return {
      ...state,
      isPresenting: action.payload
    };

    case SET_SUPPORTED: return {
      ...state,
      isSupported: action.payload
    };

    case SET_DISPLAYS: return {
      ...state,
      displays: action.payload
    };

    case SET_CONTROLLER_IDS: return {
      ...state,
      controllerIds: action.payload
    };

    case SET_STANDING_MATRIX: return {
      ...state,
      standingMatrix: action.payload
    }
  }

  return state;
}


// ---- thunk-actions

export function init() {
  return dispatch => {
    dispatch(setInitialized());

    if (!navigator.getVRDisplays) {
      return dispatch(setSupported(false));
    }

    dispatch(setSupported(true));
    navigator.getVRDisplays()
      .then(displays => {
        dispatch(setDisplays(displays));

        startGamepadDetection(dispatch);
      });
  };
}


// ---- action-creators
/**
 * Sets the (not immutable) standing-matrix instance managed by
 * THREE.VRControls.
 * @param {THREE.Matrix4} standingMatrix
 * @returns {object}
 */
export function setStandingMatrix(standingMatrix) {
  return {type: SET_STANDING_MATRIX, payload: standingMatrix};
}

function setInitialized() {
  return {
    type: SET_INITIALIZED
  };
}

function setSupported(isSupported) {
  return {
    type: SET_SUPPORTED,
    payload: isSupported
  };
}

function setDisplays(displays) {
  return {
    type: SET_DISPLAYS,
    payload: displays
  };
}

function setControllerIds(ids) {
  return {
    type: SET_CONTROLLER_IDS,
    payload: ids
  };
}

export function setIsPresenting(value) {
  return {
    type: SET_IS_PRESENTING,
    payload: value
  };
}

/**
 * Starts the gamepad-detection. ViveControllers are registered as gamepads
 * once getVRDisplays() has been called.
 * @param {function} dispatch The dispatcher-function
 */
function startGamepadDetection(dispatch) {
  requestAnimationFrame(function detectGamepadLoop() {
    const gamepads = navigator.getGamepads();
    const gamepadIds = [];

    // TODO: find a way to improve this...
    for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads.item(i);

      if (!gamepad) { continue; }
      if (gamepad.id === 'OpenVR Gamepad') {
        gamepadIds.push(i);
      }
    }

    if (gamepadIds.length > 0) {
      dispatch(setControllerIds(gamepadIds));
    }

    if (gamepadIds.length < 2) {
      requestAnimationFrame(detectGamepadLoop);
    }
  });
}
