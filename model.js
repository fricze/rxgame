import Rx from 'rx';
import replicate from './repe';
import { identity } from './fn';

const clearModel$ = new Rx.Subject();

clearModel$
  .filter(identity)
  .subscribe(() => {
    currentString$.onCompleted();
    keyDown$.onCompleted();
  });

const currentString$ = new Rx.Subject();

const keyDown$ = new Rx.Subject();

const keyDownObserver$ = keyDown$
        .withLatestFrom(currentString$, (char, string) => ({string, char}))
        .filter(({string, char}) => string[0] === char)
        .map(({string}) => {
          const [ , ...restString ] = string;

          return restString.join('');
        })

// Remember: onNext produces new value therefore all other subsrcibers
// will not receive value that came just before onNext, since this value
// no longer exists
keyDownObserver$
  .subscribe(restString => {
    currentString$.onNext(restString);
  });

const observe = intent => {
  replicate(intent.keyDown$, keyDown$);
  replicate(intent.gameWon$, clearModel$);
}

export default {
  currentString$,
  observe
}
