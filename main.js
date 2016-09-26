import Rx from 'rx';
import getCharFromKeyCode from './keycodes';
import { exampleString } from 'data';

const sourceCharArr = exampleString.split('');
const fromKeyBoard$ = Rx.Observable.fromEvent(window, 'keyup');

const newString = string => proper => {
  const check = ({ true: string.slice(1), false: string });

  return check[proper];
};

const letters$ = fromKeyBoard$
        .startWith('')
        .map(({keyCode}) => getCharFromKeyCode(keyCode))
        .scan(({toCheck, toView}, val) => {
          const properHit = toCheck[0] === val;
          toCheck = newString(toCheck)(properHit);

          toView = toCheck;

          return {
            toCheck,
            toView,
          };
        }, {
          toCheck: sourceCharArr,
          toView: sourceCharArr,
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
          textElement.innerText = x.join('');
        }, x => { alert(x) });

// const finalSubscription = lettersGame$.filter((stringArr) => stringArr.length === 0)
//         .do(()=>console.log('you won'))
//         .subscribe(() => {
//           // closing channel is needed in order to clear timeout (and error that it generates)
//           finalSubscription.dispose();
//           lettersSubscription.dispose();
//         });

Array.prototype.safeReverse = function safeReverse() {
  return this.slice().reverse();
}
