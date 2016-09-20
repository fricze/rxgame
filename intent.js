import Rx from 'rx';
import replicate from './replicate';

const mainIntent = (view) => {
  const shiftString = new Rx.Subject();
  replicate(view.keysEqual, shiftString);

  return {
    shiftString
  };
}

export default mainIntent;
