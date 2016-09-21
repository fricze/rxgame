import getCharFromKeyCode from './keycodes';
import Rx from 'rx';
import replicate from './replicate';
import { isValue } from './fn';

const mainView = (model) => {
  const viewTree = new Rx.Subject();
  replicate(model, viewTree);

  const fromKeyBoard$ = Rx.Observable.fromEvent(window, 'keyup');

  return {
    keysEqual: fromKeyBoard$
      .map(({keyCode}) => keyCode)
      .map(keyCode => getCharFromKeyCode(keyCode))
      .filter(isValue),

    viewTree
  };
}

export default mainView;
