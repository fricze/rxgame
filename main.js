import Rx from 'rx';
import getCharFromKeyCode from './keycodes';
import { exampleString } from 'data';

const sourceCharArr = exampleString.split('');
const fromKeyBoard$ = Rx.Observable.fromEvent(window, 'keyup');

Array.prototype.safeReverse = function safeReverse() {
  return this.slice().reverse();
}

const spacesToUnderscore = string => string.map(letter => letter === ' ' ? '_' : letter).join('');

const left = 'left';
const right = 'right';

const newData = ({
  toCheck, toView, border, properHit
}) => {
  const constString = {
    toCheck,
    toView,
    border
  };

  const newToCheck = toCheck.slice(1).safeReverse()

  const newState = {
    get left() {
      return {
        toCheck: newToCheck,
        toView: toView.slice(1),
        border: right,
      }
    },
    get right() {
      return {
        toCheck: newToCheck,
        toView: toView.slice(0, -1),
        border: left,
      }
    },
  };

  const nextState = {
    false: constString,
    true: newState[border],
  };

  return nextState[properHit];
};

const letters$ = fromKeyBoard$
        .startWith('')
        .map(({keyCode}) => getCharFromKeyCode(keyCode))
        .scan(({toCheck, toView, border}, val) =>
              newData({toCheck, toView, properHit: toCheck[0] === val, border}),
              { toCheck: sourceCharArr,
                toView: sourceCharArr,
                border: left
              });

const firstInterval = Number(window.interval.value);

const interval$ = Rx.Observable.fromEvent(window.interval, 'change')
        .map(e => Number(e.currentTarget.value))
        .startWith(firstInterval);

const textElement = window.text;

const lettersGame$ = letters$
        .withLatestFrom(interval$)
        .timeout(([ , interval]) => Rx.Observable.timer(interval))
        .map(([data]) => data.toView);

const lettersSubscription = lettersGame$
        .subscribe((x) => {
          textElement.innerText = spacesToUnderscore(x);
        }, x => { console.error(x) });

const finalSubscription = lettersGame$
        .filter((stringArr) => stringArr.length === 0)
        .do(()=>console.log('you won'))
        .subscribe(() => {
          // closing channel is needed in order to clear timeout (and error that it generates)
          finalSubscription.dispose();
          lettersSubscription.dispose();
        });
