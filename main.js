// .takeUntil(Rx.Observable.timer(5000));

// const firstInterval = Number(window.interval.value);

// const interval$ = Rx.Observable.fromEvent(window.interval, 'change')
//         .pluck('currentTarget', 'value')
//         .map(e => Number(e))
//         .startWith(firstInterval);

import Intent from './intent';
import View from './view';
import Model from './model';
import Renderer from './renderer';

Renderer.observe(View);

View.observe(Model);
Model.observe(Intent);
Intent.observe(View);
