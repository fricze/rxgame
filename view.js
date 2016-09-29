import Rx from 'rx';
import replicate from './replicate';
import toDispose from './to_dispose';

const keyDown$ = Rx.Observable.fromEvent(window, 'keydown');
const viewString$ = new Rx.ReplaySubject(1);
const viewAverageTime$ = new Rx.Subject();
const intervalValue$ = new Rx.ReplaySubject(1);
const loseMessage$ = new Rx.Subject();
const winMessage$ = new Rx.Subject();
const terminateGame$ = new Rx.Subject();

const subscriptions = toDispose(terminateGame$);

const intervalElement = window.interval;
const intervalChange$ = Rx.Observable.fromEvent(intervalElement, 'change');

subscriptions.push(
  intervalValue$
    .subscribe(intervalValue => intervalElement.value = intervalValue)
);

export default {
  keyDown$,
  viewString$,
  viewAverageTime$,
  intervalChange$,
  intervalValue$,
  loseMessage$,
  winMessage$,
  terminateGame$,
  observe,
}

function observe(model) {
  subscriptions.push(
    replicate(model.currentString$, viewString$),
    replicate(model.averageTime$, viewAverageTime$),
    replicate(model.interval$, intervalValue$),
    replicate(model.loseMessage$, loseMessage$),
    replicate(model.winMessage$, winMessage$),
    replicate(model.terminateGame$, terminateGame$)
  )
}
