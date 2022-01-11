// Actions
const SET_GROCERIES = 'SET_GROCERIES';
const CREATE_GROCERIES = 'CREATE_GROCERIES';
const DELETE_GROCERIES = 'DELETE_GROCERIES';
//Action Creators

export const setGroceries = (groceries) => {
  return {
    type: SET_GROCERIES,
    groceries
  };
};

export const createdGrocery = (grocery) => {
  return {
    type: CREATE_GROCERIES,
    grocery
  };
};

export const deletedGrocery = (groceryId) => {
  return {
    type: DELETE_GROCERIES,
    groceryId
  };
};

//Thunk
export const getGroceries = () => {
  return async (dispatch) => {
    try {
      const response = await fetch('https://grocery-list-project-cd843-default-rtdb.firebaseio.com/groceries.json');
      if (!response.ok) throw new Error('Something went wrong with grocery GET request.');
      const resData = await response.json();
      const data = [];
      for (let key in resData) {
        data.push({id: key, name: resData[key].name});
      };
      dispatch(setGroceries(data));
    } catch (error) {
      console.log('getGroceries Error!!', error);
      throw error;
    }
  };
};

export const createGrocery = (name) => {
  return async (dispatch) => {
    try {
      const response = await fetch('https://grocery-list-project-cd843-default-rtdb.firebaseio.com/groceries.json', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({name})
      });
      if (!response.ok) throw new Error('Something went wrong with grocery POST request');
      const resData = await response.json();
      dispatch(createdGrocery({ id: resData.name, name }));
    } catch (error) {
      console.log('!!CreateGroceries Error!!', error);
      throw error;
    }
  };
};

export const deleteGrocery = (id) => {
  return async (dispatch) => {
    try {
      await fetch(`https://grocery-list-project-cd843-default-rtdb.firebaseio.com/groceries/${id}.json`, {
        method: 'DELETE'
      });
      dispatch(deletedGrocery(id));
    } catch (error) {
      console.log('!!Delete Groceries Request Error', error);
      throw error;
    }
  };
};

//Reducer
export default (state = [], action) => {
  switch (action.type) {
    case SET_GROCERIES:
      return action.groceries;
    case CREATE_GROCERIES:
      return [...state, action.grocery];
    case DELETE_GROCERIES:
      const newState = state.filter((grocery) => grocery.id !== action.groceryId);
      return newState;
    default:
      return state;
  };
};
