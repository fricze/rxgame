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
  const constValue = {
    toCheck,
    toView,
    border
  };

  const newState = {
    get left() {
      const newToView = toView.slice(1);

      return {
        toCheck: newToView[newToView.length - 1],
        toView: newToView,
        border: right,
      }
    },
    get right() {
      const newToView = toView.slice(0, -1);

      return {
        toCheck: newToView[0],
        toView: newToView,
        border: left,
      }
    },
  };

  return properHit ? newState[border] : constValue;
};

const letters$ = fromKeyBoard$
        .startWith('')
        .map(({keyCode}) => getCharFromKeyCode(keyCode))
        .scan(({toCheck, toView, border}, val) =>
              newData({toCheck, toView, properHit: toCheck === val, border}),
              { toCheck: sourceCharArr[0],
                toView: sourceCharArr,
                border: left
              })
        .distinctUntilChanged(data => data.toView.join(''));

const firstInterval = Number(window.interval.value);

const interval$ = Rx.Observable.fromEvent(window.interval, 'change')
        .map(e => Number(e.currentTarget.value))
        .startWith(firstInterval);

const textElement = window.text;

letters$
  .timeInterval()
  .map(data => data.interval)
  .scan((acc, val) => acc + val, 0)
  .map((val, idx) => val / (idx + 1))
  .subscribe(x => console.log(x));

const lettersGame$ = letters$
        .withLatestFrom(interval$)
        .timeout(([ , interval]) => Rx.Observable.timer(interval))
        .map(([data]) => data.toView)
        .share();

const lettersSubscription = lettersGame$
        .subscribe(
          (x) => {
            textElement.innerText = spacesToUnderscore(x);
          },
          x => { console.error(x) });

const finalSubscription = lettersGame$
        .filter((stringArr) => stringArr.length === 0)
        .do(() => console.log('you won'))
        .subscribe(() => {
          // closing channel is needed in order to clear timeout (and error that it generates)
          finalSubscription.dispose();
          lettersSubscription.dispose();
        });
