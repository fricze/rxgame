import Rx from 'rx';
import replicate from './replicate';
import getCharFromKeyCode from './keycodes';
import { isValue } from './fn';

const letter$ = new Rx.Subject();
// const gameData$ = new Rx.Subject();

// const gameWon$ = gameData$.map(s => !s);

const observe = view => {
  replicate(view.keyDown$, letter$);
  // replicate(view.viewData$, gameData$);
}

export default {
  letter$: letter$
    .map(({keyCode}) => getCharFromKeyCode(keyCode))
    .filter(isValue),
  // gameWon$,
  observe
};
