import Rx from 'rxjs/Rx';
import getCharFromKeyCode from './keycodes';
import { isValue } from './fn';

Rx.Observable.fromEvent(window, 'keyup')
  .map(({keyCode}) => keyCode)
  .map(keyCode => getCharFromKeyCode(keyCode))
  .filter(isValue)
  .subscribe(showResults);

function showResults(key) {
  console.log(key);
}
