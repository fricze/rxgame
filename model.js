import Rx from 'rx';
import replicate from './replicate';
import startState, {
  nextState,
  baseCharArray
} from './state';

const currentString$ = new Rx.Subject();

export default {
  currentString$: currentString$
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
    .startWith(baseCharArray),

  observe
}

function observe(intent) {
  replicate(intent.letter$, currentString$);
}
