import Rx from 'rx';
import replicate from './replicate';
import getCharFromKeyCode from './keycodes';
import { isValue } from './fn';
import toDispose from './to_dispose';

const timeoutLose = {
  message: 'timeout',
  type: 'lose'
};

const gameWon = {
  message: 'you won you fuckermother!',
  type: 'win'
};

const gameWonMessage$ = Rx.Observable.just(gameWon);
const gameLoseMessage$ = Rx.Observable.just(timeoutLose);

const letter$ = new Rx.Subject();
const intervalChange$ = new Rx.Subject();
const intervalValue$ = new Rx.Subject();
const charTimeout$ = new Rx.Subject();
const gameWonReplicate$ = new Rx.Subject();

const gameWon$ = gameWonMessage$.sample(
  gameWonReplicate$.filter(string => !string.length)
);
const gameLose$ = gameLoseMessage$.sample(
  charTimeout$
    .withLatestFrom(intervalValue$)
    .timeout(
      ([ , interval]) => Rx.Observable.timer(interval),
      Rx.Observable.just(timeoutLose)
    )
    .filter(val => val.type === 'lose')
);

const terminateGame$ = Rx.Observable.merge(gameWon$, gameLose$);
const subscriptions = toDispose(terminateGame$);

subscriptions.push(terminateGame$.subscribe(() => {
  subscriptions.forEach(subscription => subscription.dispose());
}));

export default {
  letter$: letter$
    .map(({keyCode}) => getCharFromKeyCode(keyCode))
    .filter(isValue),
  intervalChange$: intervalChange$
    .pluck('currentTarget', 'value')
    .map(Number),
  gameLose$,
  gameWon$,
  terminateGame$,
  observe,
};

function observe(view) {
  subscriptions.push(
    replicate(view.keyDown$, letter$),
    replicate(view.intervalChange$, intervalChange$),
    replicate(view.intervalValue$, intervalValue$),
    replicate(view.viewString$, charTimeout$),
    replicate(view.viewString$, gameWonReplicate$)
  )
}
