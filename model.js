import Rx from 'rx';
import replicate from './replicate';

import { exampleString } from 'data';

const currentString$ = new Rx.Subject();
const keyDown$ = new Rx.Subject();

keyDown$
  .withLatestFrom(currentString$, (char, string) => ({string, char}))
  .filter(({string, char}) => string[0] === char)
  .map(({string}) => {
    const [ , ...restString ] = string;

    return restString.join('');
  })
  .subscribe(restString => currentString$.onNext(restString))

const observe = intent => {
  replicate(intent.keyDown$, keyDown$);

  currentString$.onNext(exampleString);
}

export default {
  currentString$,
  observe
}
