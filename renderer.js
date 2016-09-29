import Rx from 'rx';
import replicate from './replicate';
import { spacesToUnderscore } from './fn';

const renderString$ = new Rx.Subject();
const renderAverageTime$ = new Rx.Subject();
const renderLoseMessage$ = new Rx.Subject();
const renderWinMessage$ = new Rx.Subject();

const textElement = window.text;
const errorElement = window.error;
const winElement = window.win;
const averageTimeElement = window.speed_value;

renderString$
  .subscribeOnNext(
    message => textElement.innerText = spacesToUnderscore(message)
  );

renderAverageTime$
  .subscribeOnNext(
    message => averageTimeElement.innerText = message
  );

renderLoseMessage$
  .subscribeOnNext(
    message => errorElement.innerText = message
  );

renderWinMessage$
  .subscribeOnNext(
    message => winElement.innerText = message
  );

export default {
  observe,
}

function observe(view) {
  replicate(view.viewString$, renderString$);
  replicate(view.viewAverageTime$, renderAverageTime$);
  replicate(view.loseMessage$, renderLoseMessage$);
  replicate(view.winMessage$, renderWinMessage$);
}
