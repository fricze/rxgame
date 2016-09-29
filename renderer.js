import Rx from 'rx';
import replicate from './replicate';
import { spacesToUnderscore } from './fn';

const renderString$ = new Rx.Subject();
const renderAverageTime$ = new Rx.Subject();
const renderLoseMessage$ = new Rx.Subject();

const textElement = window.text;
const errorElement = window.error;
const averageTimeElement = window.speed_value;

renderString$
  .subscribeOnNext(
    x => textElement.innerText = spacesToUnderscore(x)
  );

renderAverageTime$
  .subscribeOnNext(
    x => averageTimeElement.innerText = x
  );

renderLoseMessage$
  .subscribeOnNext(
    x => errorElement.innerText = x
  );

export default {
  observe,
}

function observe(view) {
  replicate(view.viewString$, renderString$);
  replicate(view.viewAverageTime$, renderAverageTime$);
  replicate(view.loseMessage$, renderLoseMessage$);
}
