import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Alert, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';

import Colors from '../constants/Colors';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

const InputItems = (props) => {
  const [isPressed, setIsPressed] = useState(false);

  const touchHandler = () => {
    setIsPressed((curVal) => !curVal);
  };

  const longPressAlert = () => {
    Alert.alert(
      'Send or Delete',
      'Send to inventory OR Delete item.',
      [
        { text: 'Send', style: 'default', onPress: () => {} },
        { text: 'Delete', style: 'destructive', onPress: () => props.handleDelete(props.item.id) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const ifTouched = isPressed ? styles.textIfPressed : styles.text;

  const renderLeft = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <View style={styles.renderLeftButton}>
          <Animated.Text style={[styles.swipeText, {transform: [{translateX: trans}]}]}>Delete</Animated.Text>
      </View>
    );
  };

  const renderRight = (progress, dragX) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [25, 0],
    });
    return (
      <Animated.View style={{transform: [{translateX: trans}]}}>
        <RectButton style={styles.renderRightButton} onPress={() => Alert.alert('Send', 'Sending to Inventory')}>
          <Text style={styles.swipeText}>Send</Text>
        </RectButton>
      </Animated.View>
    )
  }

  if (props.identifier === 'fridge') {
    const diffDate = new Date(props.item.expiration) - new Date();
    const expDays = Math.round(diffDate / (1000 * 60 * 60 * 24));
    return (
      <Swipeable
        renderLeftActions={renderLeft}
        leftThreshold={100}
        renderRightActions={renderRight}
        onSwipeableLeftOpen={() => props.handleDelete(props.item.id)}
        overshootFriction={10}
        friction={2}
      >
      <TouchableWithoutFeedback style={styles.touchable} onPress={touchHandler} onLongPress={longPressAlert}>
        <View style={[styles.listItems, styles.inventoryContainer]}>
          <Text style={styles.text}>{props.item.quantity}</Text>
          <Text style={styles.text}>{props.item.name}</Text>
          <Text style={styles.text}>{expDays} days</Text>
        </View>
      </TouchableWithoutFeedback>
    </Swipeable>
    );
  };

  return (
    <Swipeable
      renderLeftActions={renderLeft}
      leftThreshold={100}
      renderRightActions={renderRight}
      onSwipeableLeftOpen={() => props.handleDelete(props.item.id)}
      overshootFriction={10}
      friction={2}
    >
      <TouchableWithoutFeedback style={styles.touchable} onPress={touchHandler} onLongPress={longPressAlert}>
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
    backgroundColor: 'rgba(74,135, 249, 0.8)',
    width: 100,
    alignItems: 'center'
  },
  inventoryContainer: {
    flexDirection: 'row',
    backgroundColor: '#D1E1FF',
    justifyContent: 'space-between',
  }
});

export default InputItems;
