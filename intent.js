import Rx from 'rx';
import replicate from './replicate';

const keyDown$ = new Rx.Subject();

const observe = view => {
  replicate(view.keyDown$, keyDown$);
}

export default {
  keyDown$,
  observe
};
