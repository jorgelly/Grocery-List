import React, { useState, useLayoutEffect, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, ActivityIndicator, LayoutAnimation } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import * as Notifications from 'expo-notifications';

import CustomHeaderButton from '../components/CustomHeaderButton';
import Colors from '../constants/Colors';
import ModalInput from '../components/ModalInput';
import InputItems from '../components/InputItems';
import { getFridgeItems, deleteFridgeItem } from '../store/Reducers/RefrigeratorReducer';

const RefrigeratorScreen = (props) => {
  const [isModal, setIsModal] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fridgeItems = useSelector((state) => state.fridgeItems);
  const dispatch = useDispatch();
  const identifier = 'fridge';

  //Gets items from DB and places them in store
  const getItems = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(getFridgeItems());
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    getItems();
  }, [getItems]);

  //!!NOTIFICATION FOR PANTRY SCREEN--------------------------------
  useEffect(() => {
    const notificationFunction = async (itemName) => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Expired Product!',
          body: `${itemName} is expired in your fridge item list`,
          vibrate: true
        },
        trigger: {
          seconds: 60 * 2,
          repeats: true
        },
      });
      //Leave the following if you want to cancel any scheduled notification.
      // Notifications.cancelAllScheduledNotificationsAsync();
    };
    fridgeItems.forEach((item) => {
      if (item.expiration) {
        const dateDiff = new Date(item.expiration) - new Date();
        const dateInDays = Math.round(dateDiff / (1000 * 60 * 60 * 24))
        if (dateInDays < -3) {
          notificationFunction(item.name);
        }
      };
    });
  }, []);
  //----------------------------------------------------------------------

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

  const layoutAnimConfig = {
    duration: 300,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      duration: 100,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  const deleteHandler = (itemId) => {
    dispatch(deleteFridgeItem(itemId));
    LayoutAnimation.configureNext(layoutAnimConfig);
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
  if (!isLoading && fridgeItems.length === 0) {
    return (
      <View style={styles.loadingOrError}>
        <ModalInput visible={isModal} setModal={setModal} identifier={identifier} />
        <Text>No Fridge Items. Start adding!</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ModalInput visible={isModal} setModal={setModal} identifier={identifier} />
      <View style={styles.inventoryContainer}>
        <Text style={[styles.text, {fontSize: 14, fontFamily: 'open-sans', marginLeft: 10}]}>Qty</Text>
        <Text style={[styles.text, {fontSize: 14, fontFamily: 'open-sans'}]}>Item</Text>
        <Text style={[styles.text, {fontSize: 14, fontFamily: 'open-sans', marginRight: 20}]}>Expiration</Text>
      </View>
      <FlatList data={fridgeItems} renderItem={renderedItems} />
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
  },
  inventoryContainer: {
    padding: 5,
    borderRadius: 2,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 22,
    fontFamily: 'virgil',
    color: Colors.mainColor
  },
});

export default RefrigeratorScreen;
