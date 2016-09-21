import Rx from 'rx';
import replicate from './replicate';

const currentString$ = new Rx.Subject();
currentString$
  .subscribe(() => null, () => null, function onCompleted() {
    alert('complete!');
  });

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
  .filter(string => string !== '')
  .subscribe(restString => {
    currentString$.onNext(restString);
  });

keyDownObserver$
  .filter(string => string === '')
  .subscribe(() => {
    currentString$.onCompleted();
    keyDown$.onCompleted();
  });

const observe = intent => {
  replicate(intent.keyDown$, keyDown$);
}

export default {
  currentString$,
  observe
}
