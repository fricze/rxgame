import getCharFromKeyCode from './keycodes';
import Rx from 'rx';
import replicate from './replicate';
import { isValue } from './fn';

const mainView = (model) => {
  // const keyboardKeys = new Rx.Subject();
  // replicate(model, keyboardKeys);

  model.subscribe(x => console.log(x));

  const fromKeyBoard$ = Rx.Observable.fromEvent(window, 'keyup');

  return {
    keysEqual: fromKeyBoard$
      .map(({keyCode}) => keyCode)
      .map(keyCode => getCharFromKeyCode(keyCode))
      .filter(isValue)
  };
}

export default mainView;
