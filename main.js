import Intent from './intent';
import View from './view';
import Model from './model';
import renderer from './renderer';

Intent.observe(View);
Model.observe(Intent);
View.observe(Model);

renderer(View.viewTree);

// MODEL
