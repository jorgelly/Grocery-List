import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import GroceryReducer from './Reducers/GroceryReducer';

const rootReducer = combineReducers({
  groceries: GroceryReducer,
});

export default createStore(rootReducer, applyMiddleware(thunk));
