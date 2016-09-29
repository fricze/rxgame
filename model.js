import Rx from 'rx';
import replicate from './replicate';
import startState, {
  nextState,
  baseCharArray
} from './state';

const string$ = new Rx.Subject();

const currentString$ = string$
        .scan(({transformTable, string, nextTransformation, nextGoal}, pressedKey) => {
          const getNextState = transformTable[pressedKey];
          const newData = getNextState({string, nextTransformation, nextGoal});

          transformTable = nextState();
          transformTable[newData.nextGoal] =
            ({string, nextTransformation}) => nextTransformation(string);

          return {
            transformTable,
            ...newData
          }
        }, startState)
        .distinctUntilChanged(data => data.string.join(''))
        .pluck('string')
        .startWith(baseCharArray);

const averageTime$ = currentString$
        .timeInterval()
        .pluck('interval')
        .scan((acc, val) => acc + val, 0)
        .map((val, idx) => val / (idx + 1));

export default {
  currentString$,
  averageTime$,
  observe
}

function observe(intent) {
  replicate(intent.letter$, string$);
}
