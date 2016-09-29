import Rx from 'rx';
import replicate from './replicate';
import getCharFromKeyCode from './keycodes';
import { isValue } from './fn';

const letter$ = new Rx.Subject();
const intervalChange$ = new Rx.Subject();
const intervalValue$ = new Rx.Subject();
const charTimeout$ = new Rx.Subject();

const observe = view => {
  replicate(view.keyDown$, letter$);
  replicate(view.intervalChange$, intervalChange$);
  replicate(view.intervalValue$, intervalValue$);
  replicate(view.viewString$, charTimeout$);
}

const timeoutLose = {
  message: 'timeout',
  type: 'lose'
};

export default {
  letter$: letter$
    .map(({keyCode}) => getCharFromKeyCode(keyCode))
    .filter(isValue),
  intervalChange$: intervalChange$
    .pluck('currentTarget', 'value')
    .map(e => Number(e)),
  loser$: charTimeout$
    .withLatestFrom(intervalValue$)
    .timeout(
      ([ , interval]) => Rx.Observable.timer(interval),
      Rx.Observable.just(timeoutLose)
    )
    .filter(val => val.type === 'lose'),
  observe,
};
