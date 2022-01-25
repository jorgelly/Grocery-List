//Actions
const SET_PANTRY_ITEMS = 'SET_PANTRY_ITEMS';
const CREATE_PANTRY_ITEM = 'CREATE_PANTRY_ITEM';
const DELETE_PANTRY_ITEM = 'DELETE_PANTRY_ITEM';

//Action creators
export const setPantryItems = (pantryItems) => {
  return {
    type: SET_PANTRY_ITEMS,
    pantryItems
  };
};

export const createdPantryItem = (pantryItem) => {
  return {
    type: CREATE_PANTRY_ITEM,
    pantryItem
  };
};

export const deletedPantryItem = (pantryItemId) => {
  return {
    type: DELETE_PANTRY_ITEM,
    pantryItemId
  };
};

//Thunks
export const getPantryItems = () => {
  return async (dispatch) => {
    try {
      const response = await fetch('https://grocery-list-project-cd843-default-rtdb.firebaseio.com/pantry-items.json');
      if (!response.ok) throw new Error('Something went wrong with Pantry GET request.');
      const resData = await response.json();
      const data = [];
      for (let key in resData) {
        data.push({id: key, name: resData[key].name, expiration: resData[key].expiration, quantity: resData[key].quantity});
      };
      dispatch(setPantryItems(data));
    } catch (error) {
      console.log('!!Get Pantry Items Error!!', error);
      throw error;
    }
  };
};

export const createPantryItem = (item) => {
  return async (dispatch) => {
    try {
      const response = await fetch('https://grocery-list-project-cd843-default-rtdb.firebaseio.com/pantry-items.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      });
      if (!response.ok) throw new Error('Something went wrong with Pantry POST request.');
      const resData = await response.json();
      const { name, expiration, quantity} = item;
      dispatch(createdPantryItem({ id: resData.name, name, expiration, quantity }));
    } catch (error) {
      console.log('!!Create Pantry Item Error!!', error);
      throw error;
    }
  };
};

export const deletePantryItem = (id) => {
  return async (dispatch) => {
    try {
      await fetch(`https://grocery-list-project-cd843-default-rtdb.firebaseio.com/pantry-items/${id}.json`, {
        method: 'DELETE'
      });
      dispatch(deletedPantryItem(id));
    } catch (error) {
      console.log('!!Delete Pantry Item Error!!', error);
      throw error;
    }
  };
};

// reducer
export default (state = [], action) => {
  switch (action.type) {
    case SET_PANTRY_ITEMS:
      return action.pantryItems;
    case CREATE_PANTRY_ITEM:
      return [...state, action.pantryItem];
    case DELETE_PANTRY_ITEM:
      const newState = state.filter((pantryItem) => pantryItem.id !== action.pantryItemId);
      return newState;
    default:
      return state;
  };
};
