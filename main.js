import Rx from 'rx';
import getCharFromKeyCode from './keycodes';
import { isValue } from './fn';
import { exampleString } from './data';

const sourceCharArr = Rx.Observable.return(exampleString);
const shiftCharArr = {
  next: charArr => {
    charArr.shift();
    return charArr;
  },
  error: err => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification')
};

sourceCharArr.subscribe(shiftCharArr);

const keyUpStream = Rx.Observable.fromEvent(window, 'keyup');

keyUpStream
  .map(({keyCode}) => keyCode)
  .map(keyCode => getCharFromKeyCode(keyCode))
  .filter(isValue)
  .withLatestFrom(sourceCharArr, (key, data) => ({key, data}))
  .filter(({key, data}) => key === data[0])
  .subscribe(({data}) => {
    source.onNext(data);
    console.log(data);
  });

