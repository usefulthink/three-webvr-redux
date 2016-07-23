
import TWEEN from 'tween.js';
import Stats from 'stats.js';
import WEBVR from '../lib/WebVR';

import App from './App';
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

// FIXME: this should use the detection from redux/webvr
if (WEBVR.isLatestAvailable() === false) {
  document.body.appendChild(WEBVR.getMessage());
}

if (WEBVR.isAvailable() === true) {
  document.body.appendChild(WEBVR.getButton(app.vrEffect));
}


function initStats() {
  const stats = new Stats();

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  document.body.appendChild(stats.domElement);

  return stats;
}
