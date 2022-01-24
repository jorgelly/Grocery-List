import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Button, FlatList, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

// Separated library components from custom components and imports
import ModalInput from '../components/ModalInput';
import InputItems from '../components/InputItems';
import { deleteGrocery, getGroceries } from '../store/Reducers/GroceryReducer';
import CustomHeaderButton from '../components/CustomHeaderButton';
import Colors from '../constants/Colors';

// Start of the Gorcery List Screen Component
const GroceryListScreen = (props) => {
  const [isModal, setIsModal] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const groceries = useSelector((state) => state.groceries);
  const dispatch = useDispatch();
  const identifier = 'groceries';

  //Gets items from DB and places them in store
  const getItems = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(getGroceries());
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    getItems();
  }, [getItems]);

  //Created this for ease of application
  const setModal = (bool) => {
    setIsModal(bool);
  };

  //Sets + button in header
  const { navigation } = props;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title='ADD'
            iconName='ios-add'
            onPress={() => setModal(true)}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  const deleteHandler = (itemId) => {
    dispatch(deleteGrocery(itemId));
  };

  //This is a function for the flatlist component
  const renderedItems = (itemData) => {
    return (
      <InputItems
        item={itemData.item}
        handleDelete={deleteHandler}
        identifier={identifier}
      />
    );
  };

  //Added loading and error checks and displays the return value if one or the other is true
  if (error) {
    return (
      <View style={styles.loadingOrError}>
        <Text>Something went wrong! But don't worry, it's me not you.</Text>
        <Button title='Try Again' color={Colors.mainColor} onPress={getItems} />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingOrError}>
        <ActivityIndicator size='large' color={Colors.mainColor} />
      </View>
    );
  };

  // if loading is false and there is no data in store display the following message
  if (!isLoading && groceries.length === 0) {
    return (
      <View style={styles.loadingOrError}>
        <ModalInput visible={isModal} setModal={setModal} identifier={identifier} />
        <Text>No Grocery Items. Start adding!</Text>
      </View>
    );
  };

  // Main component View
  return (
    <View style={styles.container}>
      <ModalInput visible={isModal} setModal={setModal} identifier={identifier} />
      <FlatList data={groceries} renderItem={renderedItems} />
    </View>
  );
};

//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOrError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default GroceryListScreen;
