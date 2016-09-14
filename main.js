import Rx from 'rx';
import getCharFromKeyCode from './keycodes';
import { isValue } from './fn';
import { exampleString } from './data';

const currentString = Array.from(exampleString);

const keyUpStream = Rx.Observable.fromEvent(window, 'keyup');

const dataStream = new Rx.Subject();

keyUpStream
  .map(({keyCode}) => keyCode)
  .map(keyCode => getCharFromKeyCode(keyCode))
  .filter(isValue)
  .filter(key => key === currentString[0])
  .withLatestFrom(dataStream, (key, data) => ({key, data}))
  .subscribe(({key, data}) => {
    data.shift();
    dataStream.onNext(data)

    console.log(data);
  });

dataStream.onNext(currentString);
