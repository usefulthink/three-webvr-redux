// ---- action-types
const SET_PARAMETER = 'settings/SET_PARAMETER';

// ---- reducer
const initialState = {};

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PARAMETER:
      const {name, value} = action.payload;

      return Object.assign({}, state, {[name]: value});
  }

  return state;
}

// ---- action-creators
export function setParameter(name, value) {
  return {type: SET_PARAMETER, payload: {name, value}};
}
