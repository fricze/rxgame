import Rx from 'rx';
import getCharFromKeyCode from './keycodes';
import { exampleString } from 'data';

const sourceCharArr = exampleString.split('');
const fromKeyBoard$ = Rx.Observable.fromEvent(window, 'keyup');

const letters$ = fromKeyBoard$
        .map(({keyCode}) => getCharFromKeyCode(keyCode))
        .scan((acc, val, index) => {
          const indexToCompare = +(!(index % 2) && acc.length - 1);
          const isMatch = (acc[indexToCompare] === val);
          acc.splice(indexToCompare,isMatch);
          return acc;
        }, sourceCharArr);

const firstInterval = Number(window.interval.value);

const interval$ = Rx.Observable.fromEvent(window.interval, 'change')
        .map(e => Number(e.currentTarget.value))
        .startWith(firstInterval);

const textElement = window.text;

const lettersGame$ = letters$
        .withLatestFrom(interval$)
        .timeout(([_, interval]) => Rx.Observable.timer(interval))
        .map(([data]) => data);

const lettersSubscription = lettersGame$
        .subscribe((x) => {
          textElement.innerText = x.join('');
        }, x => { alert(x) });

const finalSubscription = lettersGame$.filter((stringArr) => stringArr.length === 0)
        .do(()=>console.log('you won'))
        .subscribe(() => {
          finalSubscription.dispose(); // closing channel is needed in order to clear timeout (and error that it generates)
          lettersSubscription.dispose();
        });

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
