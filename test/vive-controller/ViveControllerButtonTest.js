import unexpected from 'unexpected';
import sinon from 'sinon';

import ViveControllerButton from '../../lib/vive-controller/ViveControllerButton';

const expect = unexpected.clone();

describe('ViveControllerButton', () => {
  let button, gamepad;

  beforeEach(() => {
    button = new ViveControllerButton(0);
    gamepad = makeGamepad();
  });

  it('stores the pressed-state', () => {
    gamepad.buttons[0].pressed = true;
    button.update(gamepad);
    expect(button.pressed, 'to be true');

    button = new ViveControllerButton(1);
    button.update(gamepad);
    expect(button.pressed, 'to be false');

    gamepad.buttons[1].pressed = true;
    button.update(gamepad);
    expect(button.pressed, 'to be true');
  });

  describe('events', () => {
    it('dispatches press-events', () => {
      const spy = sinon.spy();
      button.addEventListener('press', spy);

      button.update(gamepad);
      gamepad.buttons[0].pressed = true;
      button.update(gamepad);

      expect(spy.callCount, 'to be', 1);
    });

    it('dispatches release-events', () => {
      const spy = sinon.spy();
      button.addEventListener('release', spy);

      gamepad.buttons[0].pressed = true;
      button.update(gamepad);
      gamepad.buttons[0].pressed = false;
      button.update(gamepad);

      expect(spy.callCount, 'to be', 1);
    });

    it('dispatches click-events', () => {
      const spy = sinon.spy();
      button.addEventListener('click', spy);

      button.update(gamepad);
      gamepad.buttons[0].pressed = true;
      button.update(gamepad);
      gamepad.buttons[0].pressed = false;
      button.update(gamepad);

      expect(spy.callCount, 'to be', 1);
    });
  });
});

function makeGamepad() {
  const btn = () => ({pressed: false, touched: false, value: 0});
  return {
    buttons: [btn(), btn(), btn(), btn()]
  };
}
