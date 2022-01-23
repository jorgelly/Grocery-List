import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import GroceryReducer from './Reducers/GroceryReducer';
import RefrigeratorReducer from './Reducers/RefrigeratorReducer';

const rootReducer = combineReducers({
  groceries: GroceryReducer,
  fridgeItems: RefrigeratorReducer
});

export default createStore(rootReducer, applyMiddleware(thunk));
