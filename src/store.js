import {createStore, combineReducers, applyMiddleware} from 'redux';

import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import webvrReducer, {init as initWebVR} from './redux/webvr';
import appReducer from './redux/app';
import settingsReducer from './redux/settings';

export default function initStore() {
  const loggerMiddleware = createLogger({
    predicate(getState, action) {
      if (action.type === 'app/SET_TIMESTAMP') { return false; }
      return true;
    }
  });

  const store = createStore(
    combineReducers({
      app: appReducer,
      webvr: webvrReducer,
      settings: settingsReducer
    }),

    applyMiddleware(thunkMiddleware, loggerMiddleware)
  );

  store.dispatch(initWebVR());

  return store;
}
