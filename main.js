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
    nextTransformationObject: sliceFromBorder.right,
    nextGoal: string[string.length - 1]
  }),
  right: (string) => ({
    string: string.slice(0, -1),
    nextTransformationObject: sliceFromBorder.left,
    nextGoal: string[0]
  })
};

const startingTransformationObject = sliceFromBorder.left;

const startState = {
  transformTable: nextState(),
  string: sourceCharArr,
  nextTransformationObject: startingTransformationObject,
  nextGoal: sourceCharArr[0]
};

const letters$ = fromKeyBoard$
        .map(({keyCode}) => getCharFromKeyCode(keyCode))
        .filter(identity)
        .scan(({transformTable, string, nextTransformationObject, nextGoal}, pressedKey) => {
          console.log(pressedKey);
          const getNextState = transformTable[pressedKey];
          const newData = getNextState({string, nextTransformationObject, nextGoal});

          transformTable = nextState();
          transformTable[newData.nextGoal] =
            ({string, nextTransformationObject}) => nextTransformationObject(string);

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

letters$
  .timeInterval()
  .map(data => data.interval)
  .scan((acc, val) => acc + val, 0)
  .map((val, idx) => val / (idx + 1))
  .subscribe(averageSpeed => speedValueElement.innerText = averageSpeed);

const lettersGame$ = letters$
        .withLatestFrom(interval$)
        .timeout(
          ([ , interval]) => Rx.Observable.timer(interval),
          Rx.Observable.just('loser!').map(x => [[x]])
        )
        .map(([data]) => data)
        .share();

const lettersSubscription = lettersGame$
        .startWith(startState.string)
        .subscribe(
          x => textElement.innerText = spacesToUnderscore(x),
          x => console.error(x),
          () => console.log('onComplete!')
        );

const finalSubscription = lettersGame$
        .filter((stringArr) => stringArr.length === 0)
        .do(() => console.log('you won'))
        .subscribe(() => {
          // closing channel is needed in order to clear timeout (and error that it generates)
          finalSubscription.dispose();
          lettersSubscription.dispose();
        });
