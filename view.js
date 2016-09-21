import getCharFromKeyCode from './keycodes';
import Rx from 'rx';
import replicate from './replicate';
import { isValue } from './fn';

const viewData$ = new Rx.Subject();
const fromKeyBoard$ = Rx.Observable.fromEvent(window, 'keyup');

const observe = model => {
  replicate(model.currentString$, viewData$);
}

export default {
  keyDown$: fromKeyBoard$
    .map(({keyCode}) => keyCode)
    .map(keyCode => getCharFromKeyCode(keyCode))
    .filter(isValue),

  viewData$,
  observe
}
