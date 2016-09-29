import Rx from 'rx';
import getCharFromKeyCode, { keyCodes } from './keycodes';
import { exampleString } from 'data';
import { identity } from 'fn';

const sourceCharArr = exampleString.split('');
const fromKeyBoard$ = Rx.Observable.fromEvent(window, 'keyup');

Array.prototype.safeReverse = function() {
  return this.slice().reverse();
};

function spacesToUnderscore(string) {
  return string.map(letter => letter === ' ' ? '_' : letter).join('');
}

function mapObject(obj, fn) {
  return Object.keys(obj).reduce(function(acc, currentProp) {
    const { key, val } = fn(currentProp, obj[currentProp]);
    acc[key] = val;
    return acc;
  }, {});
}

function nextState() {
  return mapObject(keyCodes, (key, val) => ({ key: val, val: identity }));
}

const sliceFromBorder = {
  left: (string) => ({
    string: string.slice(1),
    // nextTransformation: sliceFromBorder.right,
    nextTransformation: sliceFromBorder.left,
    // nextGoal: string[string.length - 1]
    nextGoal: string[1]
  }),
  right: (string) => ({
    string: string.slice(0, -1),
    nextTransformation: sliceFromBorder.left,
    nextGoal: string[0]
  })
};

const startingTransformation = sliceFromBorder.left;

const transformTable = nextState();
const nextGoal = sourceCharArr[0];
transformTable[nextGoal] =
  ({string, nextTransformation}) => nextTransformation(string);

const startState = {
  transformTable,
  string: sourceCharArr,
  nextTransformation: startingTransformation,
  nextGoal
};

const letters$ = fromKeyBoard$
        .map(({keyCode}) => getCharFromKeyCode(keyCode))
        .filter(identity)
        .scan(({transformTable, string, nextTransformation, nextGoal}, pressedKey) => {
          const getNextState = transformTable[pressedKey];
          const newData = getNextState({string, nextTransformation, nextGoal});

          console.log(newData.nextGoal);

          transformTable = nextState();
          transformTable[newData.nextGoal] =
            ({string, nextTransformation}) => nextTransformation(string);

          return {
            transformTable,
            ...newData
          }
        }, startState)
        .distinctUntilChanged(data => data.string.join(''))
        .pluck('string')
        .share()
        // .takeUntil(Rx.Observable.timer(5000));

const firstInterval = Number(window.interval.value);

const interval$ = Rx.Observable.fromEvent(window.interval, 'change')
        .pluck('currentTarget', 'value')
        .map(e => Number(e))
        .startWith(firstInterval);

const textElement = window.text;
const speedValueElement = window.speed_value;
const lastSpeedValueElement = window.last_speed_value;

const average2Subscribe = letters$
  .timeInterval()
  .pluck('interval')
  .scan((acc, val) => acc + val, 0)
  .map((val, idx) => val / (idx + 1))
  .subscribe(averageSpeed => speedValueElement.innerText = averageSpeed);

const averageSubscribe = letters$
        .timeInterval()
        .pluck('interval')
        .average()
        .subscribe(
          averageSpeed => lastSpeedValueElement.innerText = averageSpeed,
          onError => alert('onError'),
          onComplete => console.log('onComplete average')
        );

const lettersGame$ = letters$
        .withLatestFrom(interval$)
        .timeout(
          ([ , interval]) => Rx.Observable.timer(interval),
          Rx.Observable.just('loser!').map(x => [[x]])
        )
        .pluck(0)
        .share();

const lettersSubscription = lettersGame$
        .startWith(startState.string)
        .subscribe(
          x => textElement.innerText = spacesToUnderscore(x),
          x => console.error(x),
          () => console.log('lettersSubscription onComplete!')
        );

const finalSubscription = lettersGame$
        .filter((stringArr) => stringArr.length === 0)
        .do(() => console.log('you won'))
        .subscribe(() => {
          // closing channel is needed in order to clear timeout (and error that it generates)
          finalSubscription.dispose();
          lettersSubscription.dispose();
          averageSubscribe.dispose();
          average2Subscribe.dispose();

          console.log('dispose');
        });
