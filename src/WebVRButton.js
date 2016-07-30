import {webvr as webvrSelector} from './selectors';
import {setIsPresenting} from './redux/webvr';

/**
 * Implementation for the Enter/Exit VR button.
 */
export default class WebVRButton {
  constructor(dispatch) {
    this.dispatch = dispatch;

    this.state = null;

    this.button = document.createElement('button');
    this.button.className = 'webvr-button';
    this.button.addEventListener('click', this.onButtonClick.bind(this));
  }

  getDomElement() {
    return this.button;
  }

  onButtonClick() {
    this.dispatch(setIsPresenting(!this.state.isPresenting));
  }

  update(state) {
    if (state === this.state) {
      return;
    }

    this.state = state;
    if (!state.initialized) {
      this.button.style.display = 'none';
    } else if (!state.isSupported) {
      this.button.disabled = true;
      this.button.style.display = '';
      this.button.classList.add('webvr-button--disabled');
      this.button.innerText = 'VR not supported';
    } else if (state.isPresenting) {
      this.button.style.display = '';
      this.button.classList.add('webvr-button--presenting');
      this.button.innerText = 'Exit VR';
    } else {
      this.button.style.display = '';
      this.button.classList.remove('webvr-button--presenting');
      this.button.innerText = 'Enter VR';
    }
  }
}

WebVRButton.selector = webvrSelector;
