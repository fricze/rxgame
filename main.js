import Rx from 'rx';
import getCharFromKeyCode from './keycodes';
import { isValue } from './fn';
import { exampleString } from 'data';

let sourceCharArr = exampleString.split('');
const arrSubject = new Rx.Subject();
const fromKeyBoard$ =  Rx.Observable.fromEvent(window, 'keyup');

arrSubject.subscribe((data) => {
  console.log('in subject ' + data)
  if(data.length === 0) {
    arrSubject.onCompleted();
    source.onCompleted();
  }
});

const source = fromKeyBoard$
  .map(({keyCode}) => keyCode)
  .map(keyCode => getCharFromKeyCode(keyCode))
  .filter((x)=>x)
  .withLatestFrom(arrSubject, (key, data) => ({key, data}))
  .filter(({key, data}) => key === data[0])
  .subscribe(({key, data})=> {
    console.log('key is ', key);
    const shifted = [...data];
    shifted.shift();
    arrSubject.onNext(shifted);
    return shifted;
  });

// INIT
arrSubject.onNext(sourceCharArr);