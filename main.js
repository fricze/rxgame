import Rx from 'rx';
import { exampleString } from 'data';
import mainIntent from './intent';
import mainView from './view';
import replicate from './replicate';
import renderer from './renderer';
import { isValue } from './fn';

const model = new Rx.Subject();

const data = model
        .startWith({
          string: exampleString.split(''),
          firstChar: undefined,
          keyChar: undefined
        })
        .scan((acc, data) => {
          if (acc.string[0] === data) {
            const [ , ...restString ] = acc.string;

            return {
              string: restString,
              firstChar: acc.string[0],
              keyChar: data
            };
          }

          return {
            string: acc.string,
            firstChar: acc.string[0],
            keyChar: data
          };
        })

const view = mainView(data);
const intent = mainIntent(view);

renderer(view.viewTree);

// MODEL
replicate(intent.shiftString, model);

// INIT
// model.onNext(exampleString.split(''));
