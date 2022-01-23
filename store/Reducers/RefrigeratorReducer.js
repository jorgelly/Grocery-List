//Actions
const SET_FRIDGE_ITEMS = 'SET_FRIDGE_ITEMS';
const CREATE_FRIDGE_ITEM = 'CREATE_FRIDGE_ITEM';
const DELETE_FRIDGE_ITEM = 'DELETE_FRIDGE_ITEM';

//Action creators
export const setFridgeItems = (fridgeItems) => {
  return {
    type: SET_FRIDGE_ITEMS,
    fridgeItems
  };
};

export const createdFridgeItem = (fridgeItem) => {
  return {
    type: CREATE_FRIDGE_ITEM,
    fridgeItem
  };
};

export const deletedFridgeItem = (fridgeItemId) => {
  return {
    type: DELETE_FRIDGE_ITEM,
    fridgeItemId
  };
};

//Thunks
export const getFridgeItems = () => {
  return async (dispatch) => {
    try {
      const response = await fetch('https://grocery-list-project-cd843-default-rtdb.firebaseio.com/refrigerator-items.json');
      if (!response.ok) throw new Error('Something went wrong with Fridge GET request.');
      const resData = await response.json();
      const data = [];
      for (let key in resData) {
        data.push({id: key, name: resData[key].name, expiration: resData[key].expiration, quantity: resData[key].quantity});
      };
      dispatch(setFridgeItems(data));
    } catch (error) {
      console.log('!!Get Fridge Items Error!!', error);
      throw error;
    }
  };
};

export const createFridgeItem = (item) => {
  return async (dispatch) => {
    try {
      const response = await fetch('https://grocery-list-project-cd843-default-rtdb.firebaseio.com/refrigerator-items.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      });
      if (!response.ok) throw new Error('Something went wrong with Fridge POST request.');
      const resData = await response.json();
      const { name, expiration, quantity} = item;
      dispatch(createdFridgeItem({ id: resData.name, name, expiration, quantity }));
    } catch (error) {
      console.log('!!Create Fridge Item Error!!', error);
      throw error;
    }
  };
};

export const deleteFridgeItem = (id) => {
  return async (dispatch) => {
    try {
      await fetch(`https://grocery-list-project-cd843-default-rtdb.firebaseio.com/refrigerator-items/${id}.json`, {
        method: 'DELETE'
      });
      dispatch(deletedFridgeItem(id));
    } catch (error) {
      console.log('!!Delete Fridge Item Error!!', error);
      throw error;
    }
  };
};

// reducer
export default (state = [], action) => {
  switch (action.type) {
    case SET_FRIDGE_ITEMS:
      return action.fridgeItems;
    case CREATE_FRIDGE_ITEM:
      return [...state, action.fridgeItem];
    case DELETE_FRIDGE_ITEM:
      const newState = state.filter((fridgeItem) => fridgeItem.id !== action.fridgeItemId);
      return newState;
    default:
      return state;
  };
};
