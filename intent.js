import Rx from 'rx';
import replicate from './replicate';

const keyDown$ = new Rx.Subject();
const gameData$ = new Rx.Subject();

const gameWon$ = gameData$.map(s => !s);

const observe = view => {
  replicate(view.keyDown$, keyDown$);
  replicate(view.viewData$, gameData$);
}

export default {
  keyDown$,
  gameWon$,
  observe
};
