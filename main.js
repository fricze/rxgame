import Rx from 'rx';
import { exampleString } from 'data';
import mainIntent from './intent';
import mainView from './view';
import replicate from './replicate';


const model = new Rx.Subject();

const data = model
        .startWith({
          string: exampleString.split(''),
          char: ''
        })
        .scan((acc, data) => {
          return {
            string: acc.string[0],
            char: data
          };
        })
        .filter(({string, char}) => string === char);


const view = mainView(data);
const intent = mainIntent(view);

// MODEL
replicate(intent.shiftString, model);

// .withLatestFrom(model, (key, data) => {
//         console.log('withLatestFrom');

//         return ({key, data})
//       })
//       .filter(({key, data}) => key === data[0])
// model.subscribe((data) => {
//   console.log('in subject ' + data)
//   // if(data.length === 0) {
//   //   model.onCompleted();
//   //   source.onCompleted();
//   // }
// });

// INIT
model.onNext(exampleString.split(''));
