import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import GroceryReducer from './Reducers/GroceryReducer';
import RefrigeratorReducer from './Reducers/RefrigeratorReducer';
import PantryReducer from './Reducers/PantryReducer';

const rootReducer = combineReducers({
  groceries: GroceryReducer,
  fridgeItems: RefrigeratorReducer,
  pantryItems: PantryReducer
});

export default createStore(rootReducer, applyMiddleware(thunk));
