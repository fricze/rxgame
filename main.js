import Rx from 'rx';
import getCharFromKeyCode from './keycodes';
import { exampleString } from 'data';

const sourceCharArr = exampleString.split('');
const fromKeyBoard$ = Rx.Observable.fromEvent(window, 'keyup');

Array.prototype.safeReverse = function safeReverse() {
  return this.slice().reverse();
}

const left = 'left';
const right = 'right';

const newData = (toCheck, toView) => (proper, border) => {
  const key = `${border}_${proper}`;

  const constString = {
    toCheck,
    toView,
    border
  };

  const check = {
    'left_false': constString,
    'right_false': constString,
    'left_true': {
      toCheck: toCheck.slice(1).safeReverse(),
      toView: toView.slice(1),
      border: right,
    },
    'right_true': {
      toCheck: toCheck.slice(1).safeReverse(),
      toView: toView.safeReverse().slice(1).safeReverse(),
      border: left,
    },
  };

  return check[key];
};

const letters$ = fromKeyBoard$
        .startWith('')
        .map(({keyCode}) => getCharFromKeyCode(keyCode))
        .scan(({toCheck, toView, border}, val) => {
          const properHit = toCheck[0] === val;

          const data = newData(toCheck, toView)(properHit, border);

          toCheck = data.toCheck;
          toView = data.toView;
          border = data.border;

          return {
            toCheck,
            toView,
            border,
          };
        }, {
          toCheck: sourceCharArr,
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
          textElement.innerText = x.map(letter => letter === ' ' ? '_' : letter).join('');
        }, x => { console.error(x) });

const finalSubscription = lettersGame$.filter((stringArr) => stringArr.length === 0)
        .do(()=>console.log('you won'))
        .subscribe(() => {
          // closing channel is needed in order to clear timeout (and error that it generates)
          finalSubscription.dispose();
          lettersSubscription.dispose();
        });
