import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ImageBackground, Button, FlatList, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ModalInput from '../components/ModalInput';
import InputItems from '../components/InputItems';
import { deleteGrocery, getGroceries } from '../store/Reducers/GroceryReducer';
import CustomHeaderButton from '../components/CustomHeaderButton';
import Colors from '../constants/Colors';

const GroceryListScreen = (props) => {
  const [isModal, setIsModal] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const groceries = useSelector((state) => state.groceries);
  const dispatch = useDispatch();

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

  const setModal = (bool) => {
    setIsModal(bool);
  };

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

  const renderedItems = (itemData) => {
    return (
      <InputItems
        item={itemData.item}
        handleDelete={deleteHandler}
      />
    );
  };

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

  if (!isLoading && groceries.length === 0) {
    return (
      <View style={styles.loadingOrError}>
        <ModalInput visible={isModal} setModal={setModal} />
        <Text>No Grocery Items. Start adding!</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <ImageBackground style={styles.imageBackground} source={require('../assets/notebookImage.jpeg')}> */}
      {/* <Button title='Add New Item' onPress={() => setIsModal(true)} /> */}
        <ModalInput visible={isModal} setModal={setModal} />
        <FlatList data={groceries} renderItem={renderedItems} />
      {/* </ImageBackground> */}
    </View>
  );
};

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
