// .takeUntil(Rx.Observable.timer(5000));

// const firstInterval = Number(window.interval.value);

// const interval$ = Rx.Observable.fromEvent(window.interval, 'change')
//         .pluck('currentTarget', 'value')
//         .map(e => Number(e))
//         .startWith(firstInterval);

// const textElement = window.text;
// const speedValueElement = window.speed_value;
// const lastSpeedValueElement = window.last_speed_value;

// const average2Subscribe = letters$
//         .timeInterval()
//         .pluck('interval')
//         .scan((acc, val) => acc + val, 0)
//         .map((val, idx) => val / (idx + 1))
//         .subscribe(averageSpeed => speedValueElement.innerText = averageSpeed);

// const averageSubscribe = letters$
//         .timeInterval()
//         .pluck('interval')
//         .average()
//         .subscribe(
//           averageSpeed => lastSpeedValueElement.innerText = averageSpeed,
//           onError => alert('onError'),
//           onComplete => console.log('onComplete average')
//         );

// const lettersGame$ = letters$
//         .withLatestFrom(interval$)
//         .timeout(
//           ([ , interval]) => Rx.Observable.timer(interval),
//           Rx.Observable.just('loser!').map(x => [[x]])
//         )
//         .pluck(0)
//         .share();


// const lettersSubscription = lettersGame$
//         .startWith(startState.string)
//         .subscribe(
//           x => textElement.innerText = spacesToUnderscore(x),
//           x => console.error(x),
//           () => console.log('lettersSubscription onComplete!')
//         );

// const finalSubscription = lettersGame$
//         .filter((stringArr) => stringArr.length === 0)
//         .do(() => console.log('you won'))
//         .subscribe(() => {
//           // closing channel is needed in order to clear timeout (and error that it generates)
//           finalSubscription.dispose();
//           lettersSubscription.dispose();
//           averageSubscribe.dispose();
//           average2Subscribe.dispose();

//           console.log('dispose');
//         });


import Intent from './intent';
import View from './view';
import Model from './model';
import Renderer from './renderer';

Renderer.observe(View);

View.observe(Model);
Model.observe(Intent);
Intent.observe(View);
