import { mapObject, identity } from './fn';
import { keyCodes } from './keycodes';
import { exampleString } from './data';
import sliceString from './slice_string';

export const baseCharArray = exampleString.split('');

export function nextState() {
  return mapObject(keyCodes, (key, val) => ({ key: val, val: identity }));
}

const startingTransformation = sliceString.left;

const transformTable = nextState();
const nextGoal = baseCharArray[0];
transformTable[nextGoal] =
  ({string, nextTransformation}) => nextTransformation(string);

const startState = {
  transformTable,
  string: baseCharArray,
  nextTransformation: startingTransformation,
  nextGoal
};

export default startState;