import Rx from 'rx';
import replicate from './replicate';
import startState, {
  nextState,
  baseCharArray,
  startInterval
} from './state';

const string$ = new Rx.Subject();
const interval$ = new Rx.Subject();
const gameLose$ = new Rx.Subject();
const gameWon$ = new Rx.Subject();

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
        .startWith({
          string: baseCharArray
        })
        .distinctUntilChanged(data => data.string.join(''))
        .pluck('string')

const averageTime$ = currentString$
        .timeInterval()
        .pluck('interval')
        .scan((acc, val) => acc + val, 0)
        .map((val, idx) => val / (idx + 1));

export default {
  currentString$,
  averageTime$,
  interval$: interval$.startWith(startInterval),
  loseMessage$: gameLose$.pluck('message'),
  winMessage$: gameWon$.pluck('message'),
  observe,
}

function observe(intent) {
  replicate(intent.letter$, string$);
  replicate(intent.intervalChange$, interval$);
  replicate(intent.loser$, gameLose$);
  replicate(intent.gameWon$, gameWon$);
}
