import Intent from './intent';
import View from './view';
import Model from './model';
import renderer from './renderer';

import { exampleString } from 'data';

renderer(View.viewData$);

View.observe(Model);
Model.observe(Intent);
Intent.observe(View);

Model.currentString$.onNext(exampleString);
