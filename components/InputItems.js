import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import ModalInventoryInput from './ModalInventoryInput';
import { createGrocery } from '../store/Reducers/GroceryReducer';
import { createFridgeItem } from '../store/Reducers/RefrigeratorReducer';
import { createPantryItem } from '../store/Reducers/PantryReducer';

const InputItems = (props) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const swipeableRef = useRef(null);
  const dispatch = useDispatch();

  const setModal = (bool) => {
    setIsModal(bool);
  };

  const sendHandler = (buttonName) => {
    if (buttonName === 'groceryButton') {
      dispatch(createGrocery(props.item.name));
    } else if (buttonName === 'pantryButton') {
      dispatch(createPantryItem(props.item));
    } else if (buttonName === 'fridgeButton') {
      dispatch(createFridgeItem(props.item));
    }
    props.handleDelete(props.item.id);
  };

  const touchHandler = () => {
    setIsPressed((curVal) => !curVal);
  };

  const ifTouched = isPressed ? styles.textIfPressed : styles.text;

  const renderLeft = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <View style={styles.renderLeftButton}>
          <Animated.View style={{transform: [{translateX: trans}]}}><MaterialIcons name="delete-forever" size={28} color="white" /></Animated.View>
      </View>
    );
  };

  const renderRightAction = (name, color, x, cbParam, callBack, progress, dragX) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    return (
      <Animated.View style={{flex: 1, transform: [{translateX: trans}]}}>
        <RectButton style={[styles.renderRightButton, {backgroundColor: color}]} onPress={() => callBack(cbParam)}>
          <MaterialIcons name={name} size={24} color='white' />
        </RectButton>
      </Animated.View>
    );
  }

  const renderRight = progress => {
    if (props.identifier === 'fridge') {
      return (
        <View style={{ width: 160, flexDirection: 'row' }}>
          {renderRightAction('format-list-bulleted', '#6336CB', 160, 'pantryButton', sendHandler, progress)}
          {renderRightAction('local-grocery-store', 'rgb(74, 135, 249)', 80, 'groceryButton', sendHandler, progress)}
        </View>
      );
    };
    if (props.identifier === 'pantry') {
      return (
        <View style={{ width: 160, flexDirection: 'row' }}>
          {renderRightAction('kitchen', '#6336CB', 160, 'fridgeButton', sendHandler, progress)}
          {renderRightAction('local-grocery-store', 'rgb(74, 135, 249)', 80, 'groceryButton', sendHandler, progress)}
        </View>
      );
    };
    return (
      <View style={{ width: 100, flexDirection: 'row' }}>
        {renderRightAction('send', 'rgba(74, 135, 249, 0.8)', 25, true, setModal, progress)}
      </View>
    );
  };

  if (props.identifier === 'fridge' || props.identifier === 'pantry') {
    const bgColor = props.identifier === 'fridge' ? '#E5F3FE' : '#FFF4EC';
    const diffDate = new Date(props.item.expiration) - new Date();
    const expDays = Math.round(diffDate / (1000 * 60 * 60 * 24));

    // If expired show red expiration date
    const isExpired = (
      expDays <= 0 ?
        <Text style={[styles.text, {color: 'red'}]}>{expDays} dys</Text> :
        <Text style={styles.text}>{expDays} dys</Text>
    );

    // If no expiration is used show a placeholder
    const expirationView = (
      expDays ?
        isExpired :
        // <Text style={[styles.text, {marginRight: 30}]}>__</Text>
        <FontAwesome5 style={{marginRight: 30}} name="hand-middle-finger" size={24} color={Colors.mainColor} />
    );
    return (
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={renderLeft}
        leftThreshold={100}
        renderRightActions={renderRight}
        onSwipeableLeftOpen={() => props.handleDelete(props.item.id)}
        overshootFriction={10}
        friction={2}
      >
      <TouchableWithoutFeedback style={styles.touchable} onPress={touchHandler}>
        <View style={[styles.listItems, styles.inventoryContainer, {backgroundColor: bgColor}]}>
          <Text style={styles.text}>{props.item.quantity}</Text>
          <Text style={[styles.text, {marginHorizontal: 50}]}>{props.item.name}</Text>
          {expirationView}
        </View>
      </TouchableWithoutFeedback>
    </Swipeable>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={renderLeft}
      leftThreshold={100}
      renderRightActions={renderRight}
      onSwipeableLeftOpen={() => props.handleDelete(props.item.id)}
      overshootFriction={10}
      friction={2}
    >
      <ModalInventoryInput visible={isModal} setModal={setModal} identifier={props.identifier} handleDelete={props.handleDelete} item={props.item} swipeRef={swipeableRef} />
        <TouchableWithoutFeedback style={styles.touchable} onPress={touchHandler}>
          <View style={styles.listItems}>
            <Text style={ifTouched}>{props.item.name}</Text>
          </View>
        </TouchableWithoutFeedback>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  touchable: {
    width: '100%'
  },
  listItems: {
    padding: 20,
    marginVertical: 1,
    backgroundColor: '#FFFFD0',
    borderRadius: 2,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
  text: {
    fontSize: 22,
    fontFamily: 'virgil',
    color: Colors.mainColor
  },
  textIfPressed: {
    padding: 2.5,
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: '#C9C9C9',
    fontFamily: 'virgil'
  },
  renderLeftButton: {
    flex: 1,
    backgroundColor: 'red',
    marginVertical: 1,
    borderRadius: 2,
    padding: 20,
    justifyContent: 'center'
  },
  swipeText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'open-sans'
  },
  renderRightButton: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 1,
    borderRadius: 2,
    padding: 20,
    alignItems: 'center'
  },
  inventoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default InputItems;
