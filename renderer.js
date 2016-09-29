import Rx from 'rx';
import replicate from './replicate';
import { spacesToUnderscore } from './fn';

const renderString$ = new Rx.Subject();
const renderAverageTime$ = new Rx.Subject();

const textElement = window.text;
const averageTimeElement = window.speed_value;

// const lastSpeedValueElement = window.last_speed_value;

renderString$
  .subscribe(
    x => textElement.innerText = spacesToUnderscore(x),
    x => console.error(x),
    () => console.log('lettersSubscription onComplete!')
  );

renderAverageTime$
  .subscribe(
    x => averageTimeElement.innerText = x,
    x => console.error(x),
    () => console.log('lettersSubscription onComplete!')
  );

export default {
  observe,
}

function observe(view) {
  replicate(view.viewString$, renderString$);
  replicate(view.viewAverageTime$, renderAverageTime$);
}
