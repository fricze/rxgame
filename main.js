import Rx from 'rx';
import getCharFromKeyCode from './keycodes';
import { isValue } from './fn';
import { exampleString } from './data';

const stringStream = Array.from(exampleString);

const keyUpStream = Rx.Observable
        .fromEvent(window, 'keyup')
        .map(({keyCode}) => keyCode)
        .map(keyCode => getCharFromKeyCode(keyCode))
        .filter(isValue)
        .filter(key => key === stringStream[0])
        .subscribe(key => {
          stringStream.shift();

          console.log(stringStream);
        });
