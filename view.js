import Rx from 'rx';
import replicate from './replicate';

const fromKeyBoard$ = Rx.Observable.fromEvent(window, 'keyup');
const viewString$ = new Rx.Subject();
const viewAverageTime$ = new Rx.Subject();

export default {
  keyDown$: fromKeyBoard$,
  viewString$,
  viewAverageTime$,
  observe,
}

function observe(model) {
  replicate(model.currentString$, viewString$);
  replicate(model.averageTime$, viewAverageTime$);
}
