import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Alert, Animated, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import Colors from '../constants/Colors';

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
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });
    return (
      <View style={styles.renderLeftButton}>
          <Animated.Text style={[styles.swipeText, {transform: [{scale}]}]}>Delete</Animated.Text>
      </View>
    );
  };

  return (
    <Swipeable
      renderLeftActions={renderLeft}
      onSwipeableLeftOpen={() => props.handleDelete(props.item.id)}
    >
      {/* <View style={styles.container}> */}
        <TouchableWithoutFeedback style={styles.touchable} onPress={touchHandler} onLongPress={longPressAlert}>
          <View style={styles.listItems}>
            <Text style={ifTouched}>{props.item.name}</Text>
          </View>
        </TouchableWithoutFeedback>
      {/* </View> */}
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
    borderRadius: 15,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 15,
  },
  text: {
    fontSize: 22,
    fontFamily: 'virgil',
    color: Colors.mainColor
  },
  textIfPressed: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: 'gray',
    fontFamily: 'virgil'
  },
  renderLeftButton: {
    flex: 1,
    backgroundColor: 'red',
    marginVertical: 1,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center'
  },
  swipeText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'open-sans'
  }
});

export default InputItems;
