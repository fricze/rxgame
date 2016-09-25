import Rx from 'rx';
import getCharFromKeyCode from './keycodes';
import { isValue,identity } from './fn';
import { exampleString } from 'data';

const sourceCharArr = exampleString.split('');
const fromKeyBoard$ =  Rx.Observable.fromEvent(window, 'keyup');

const source = fromKeyBoard$
  .map(({keyCode}) => getCharFromKeyCode(keyCode))
  .scan((acc, val) => acc.slice(acc[0] === val), sourceCharArr)
  .filter((stringArr) => stringArr.length === 0)
  .subscribe(() => source.onCompleted());


/*
const arrObservable = new Rx.Observable.just(sourceCharArr).subscribe((observer) => {

    console.log('in arrObservable ' + arrObservable)
    if(observer.length === 0) {
      observer.onCompleted();
    }

    fromKeyBoard$
      .map(({keyCode}) => keyCode)
      .map(keyCode => getCharFromKeyCode(keyCode))
      .filter((x)=>x)
      .withLatestFrom(arrObservable, (key, data) => ({key, data}))
      .filter(({key, data}) => key === data[0])
      .subscribe(({key, data})=> {
        console.log('key is ', key);
        const shifted = [...data];
        shifted.shift();
        observer.onNext(shifted);
        return shifted;
      });
  }

);
  */

/*
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
 */
