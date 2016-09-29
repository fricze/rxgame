import Rx from 'rx';
import replicate from './replicate';

const fromKeyBoard$ = Rx.Observable.fromEvent(window, 'keyup');
const viewData$ = new Rx.Subject();

const observe = model => {
  replicate(model.currentString$, viewData$);
}

export default {
  keyDown$: fromKeyBoard$,
  viewData$,
  observe,
}
