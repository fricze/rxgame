import Rx from 'rx';
const modelSubject = new Rx.Subject();

const mainModel = (intent) => {
  return {
    shiftString: intent.keysEqual
  };
}

export default mainModel;
