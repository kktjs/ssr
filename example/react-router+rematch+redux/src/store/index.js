import { init } from '@rematch/core';
import * as models from '../models/global';

const store = init({
  models: {
    global: models.default,
  },
});

export default store;
