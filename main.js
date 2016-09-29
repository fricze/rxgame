// .takeUntil(Rx.Observable.timer(5000));

// const firstInterval = Number(window.interval.value);

// const interval$ = Rx.Observable.fromEvent(window.interval, 'change')
//         .pluck('currentTarget', 'value')
//         .map(e => Number(e))
//         .startWith(firstInterval);

// const textElement = window.text;
// const speedValueElement = window.speed_value;
// const lastSpeedValueElement = window.last_speed_value;

// const lettersGame$ = letters$
//         .withLatestFrom(interval$)
//         .timeout(
//           ([ , interval]) => Rx.Observable.timer(interval),
//           Rx.Observable.just('loser!').map(x => [[x]])
//         )
//         .pluck(0)
//         .share();

import Intent from './intent';
import View from './view';
import Model from './model';
import Renderer from './renderer';

Renderer.observe(View);

View.observe(Model);
Model.observe(Intent);
Intent.observe(View);
