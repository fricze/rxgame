import Rx from 'rx';
import replicate from './replicate';
import { spacesToUnderscore } from './fn';

const renderer$ = new Rx.Subject();

const textElement = window.text;
// const speedValueElement = window.speed_value;
// const lastSpeedValueElement = window.last_speed_value;

renderer$
  .subscribe(
    x => textElement.innerText = spacesToUnderscore(x),
    x => console.error(x),
    () => console.log('lettersSubscription onComplete!')
  );

export default {
  observe,
}

function observe(view) {
  replicate(view.viewData$, renderer$);
}
