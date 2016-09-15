import Rx from 'rx';
import getCharFromKeyCode from './keycodes';
import { isValue } from './fn';
import { exampleString } from './data';

const sourceCharArr = Rx.Observable.return(exampleString.split(''));

const keyUpStream = Rx.Observable.fromEvent(window, 'keyup');

const interval = Rx.Observable
  .interval(100 /* ms */)
  .timeInterval();

sourceCharArr
  .withLatestFrom(interval, (char, time) => console.log(time));

keyUpStream
  .map(({keyCode}) => keyCode)
  .map(keyCode => getCharFromKeyCode(keyCode))
  .filter(isValue)
  .withLatestFrom(sourceCharArr, (key, data) => ({key, data}))
  .filter(({key, data}) => key === data[0])
  .subscribe(({data}) => {
    data.shift();
    sourceCharArr.onNext(data);
    console.log(data);
  });

