// ---- action-types
const SET_TIMESTAMP = 'app/SET_TIMESTAMP';

// ---- reducer
const initialState = {
  timestamp: 0
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TIMESTAMP:
      return {...state, timestamp: action.payload};
  }

  return state;
}

// ---- action-creators
export function setTimestamp(timestamp) {
  return {type: SET_TIMESTAMP, payload: timestamp};
}
