
import TWEEN from 'tween.js';
import Stats from 'stats.js';

import App from './App';
import WebVRButton from './WebVRButton';

import initStore from './store';
import {setTimestamp} from './redux/app';

const store = initStore();
const stats = initStats();
const app = new App(store);

requestAnimationFrame(function __loop(timestamp) {
  requestAnimationFrame(__loop);

  store.dispatch(setTimestamp(timestamp));

  stats.begin();
  TWEEN.update();
  app.update();
  app.render();

  stats.end();
});

document.body.appendChild(app.getDomElement());

// init button
const button = new WebVRButton(store.dispatch);

document.body.appendChild(button.getDomElement());
store.subscribe(() => {
  button.update(WebVRButton.selector(store.getState()));
});

function initStats() {
  const stats = new Stats();

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  document.body.appendChild(stats.domElement);

  return stats;
}
