import Rx from 'rx';
import replicate from './replicate';

const keyDown$ = Rx.Observable.fromEvent(window, 'keydown');
const viewString$ = new Rx.ReplaySubject(1);
const viewAverageTime$ = new Rx.Subject();
const intervalValue$ = new Rx.ReplaySubject(1);
const loseMessage$ = new Rx.Subject();

const intervalElement = window.interval;
const intervalChange$ = Rx.Observable.fromEvent(intervalElement, 'change');

intervalValue$
  .subscribe(intervalValue => intervalElement.value = intervalValue);

export default {
  keyDown$,
  viewString$,
  viewAverageTime$,
  intervalChange$,
  intervalValue$,
  loseMessage$,
  observe,
}

function observe(model) {
  replicate(model.currentString$, viewString$);
  replicate(model.averageTime$, viewAverageTime$);
  replicate(model.interval$, intervalValue$);
  replicate(model.loseMessage$, loseMessage$);
}
