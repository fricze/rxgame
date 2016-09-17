import Rx from 'rx';
import getCharFromKeyCode from './keycodes';
import { isValue } from './fn';

const l = console.log;
const observer1 = {
  next: (v) => console.log(v),
  complete: () => 'completed'
}
var observer2 = Rx.Observer.create(
  function (x) {
    console.log('Next: ' + x);
  },
  function (err) {
    console.log('Error: ' + err);
  },
  function () {
    console.log('Completed');
  }
);

let sourceCharArr;
let sourceArrObservable
const fromKeyBoard$ =  Rx.Observable.fromEvent(window, 'keyup');

const source  = fromKeyBoard$
  .map(({keyCode}) => keyCode)
  .map(keyCode => getCharFromKeyCode(keyCode))
  .filter((x)=>x)
  .withLatestFrom(sourceArrObservable, (key, data) => ({key, data}))
  .filter(({key, data}) => console.log(key,data) || key === data[0])
  .map(({data})=>{
    console.log(data)
    const shifted = [...data]
      shifted.shift();
    return shifted;
  })
//
console.log(source); // source jest
// a wyskakuje blad, ze nie mozna subskrybowac sie pod undefined
source.subscribe(({data}) => {

})
// tak jakby sourca nie bylo
sourceArrObservable = Rx.Observable.create((observer) => {
  source.subscribe(({data}) =>{
    console.log(data)
    observer.onNext(data)
  })
  return function () {
    console.log('disposed');
  };
//  filteredStream$.subscribe(({data}) => observer.onNext(data))
})

sourceArrObservable.subscribe(observer2)

console.log(sourceArrObservable)
