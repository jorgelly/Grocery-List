import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Modal, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import NumericInput from 'react-native-numeric-input'

import { createGrocery } from '../store/Reducers/GroceryReducer';
import { createFridgeItem } from '../store/Reducers/RefrigeratorReducer';
import { createPantryItem } from '../store/Reducers/PantryReducer';
import Colors from '../constants/Colors.js';

const ModalInput = (props) => {
  const [enteredValue, setEnteredValue] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState();
  const [open, setOpen] = useState(false);
  const isDate = date ? date.toDateString() : 'Choose an Exp. Date';
  const dispatch = useDispatch();

  const handleChange = (inputText) => {
    setEnteredValue(inputText);
  };

  const cancelAction = () => {
    setEnteredValue('');
    setDate();
    setQuantity(1);
    props.setModal(false);
  };

  const addHandler = () => {
    if (enteredValue.match(/^ *$/)) Alert.alert('Invalid Item', 'Field cannot be blank.');
    else {
      if (props.identifier === 'fridge') {
        dispatch(createFridgeItem({ name: enteredValue, expiration: date, quantity: quantity }))
        setEnteredValue('');
        setDate();
        setQuantity(1);
      } else if (props.identifier === 'pantry') {
        dispatch(createPantryItem({ name: enteredValue, expiration: date, quantity: quantity }))
        setEnteredValue('');
        setDate();
        setQuantity(1);
      } else {
        dispatch(createGrocery(enteredValue));
        setEnteredValue('');
      }
    };
  };

  if (props.identifier === 'fridge' || props.identifier === 'pantry') {
    const bgColor = props.identifier === 'fridge' ? '#E5F3FE' : '#FFF4EC';
    const imageSource = props.identifier === 'fridge' ? require('../assets/fridgeIcon.png') : require('../assets/pantryIcon.png');
    return (
    <Modal visible={props.visible} animationType='slide' >
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={50}
      style={[styles.mainContainer, { backgroundColor: bgColor }]}
    >
      <Image style={styles.image} source={imageSource} />
      <View style={styles.quantityContainer}>
        <Text style={{fontFamily: 'open-sans-bold', fontSize: 14}}>Quantity:</Text>
        <NumericInput
          value={quantity}
          initValue={quantity}
          onChange={(val) => setQuantity(val)}
          minValue={1}
          maxValue={10}
          iconStyle={{color: 'white'}}
          rounded={true}
          containerStyle={{backgroundColor: 'white', width: 200}}
          inputStyle={{width: 120}}
          rightButtonBackgroundColor={Colors.mainColor}
          leftButtonBackgroundColor={Colors.mainColor}
        />
      </View>
      <View style={{alignItems: 'center', width: '100%', marginBottom: 20}}>
        <DateTimePickerModal
          isVisible={open}
          date={date}
          mode='date'
          onConfirm={(date) => {
            setOpen(false);
            setDate(date);
          }}
          onCancel={() => setOpen(false)}
        />
        { date ? (
          <View>
            <Text style={{fontFamily: 'open-sans-bold', fontSize: 14}}>Expires on:</Text>
            <View style={styles.textContainer}>
              <Text onPress={() => setOpen(true)} style={styles.text}>{isDate}</Text>
            </View>
          </View> ) :
          <View style={[styles.button, { width: '60%', marginTop: 10 }]}>
            <Button title='SET EXPIRATION DATE' color={Colors.mainColor} onPress={() => setOpen(true)} />
          </View>}
      </View>
      <TextInput
        style={styles.input}
        placeholder='Enter Inventory Item'
        placeholderTextColor='#D5D5D5'
        onChangeText={handleChange}
        value={enteredValue}
      />
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button color={Colors.mainColor} title='SUBMIT' onPress={addHandler}/>
        </View>
        <View style={styles.button}>
          <Button color='red' title='CANCEL' onPress={cancelAction}/>
        </View>
      </View>
    </KeyboardAvoidingView>
  </Modal>);
  };

  return (
    <Modal visible={props.visible} animationType='slide' >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.mainContainer}
      >
        <Image style={styles.image} source={require('../assets/groceryTransparent.png')} />
        <TextInput
          style={styles.input}
          placeholder='Enter Grocery Item'
          placeholderTextColor='#D5D5D5'
          onChangeText={handleChange}
          value={enteredValue}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button color={Colors.mainColor} title='SUBMIT' onPress={addHandler}/>
          </View>
          <View style={styles.button}>
            <Button color='red' title='CANCEL' onPress={cancelAction}/>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFD0'

  },
  input: {
    borderColor: 'black',
    borderBottomWidth: 2,
    marginBottom: 10,
    padding: 20,
    width: '95%',
    borderRadius: 10,
    backgroundColor: 'white',
    fontSize: 22,
    fontFamily: 'virgil',
    color: Colors.mainColor,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 2, height: 5 },
    shadowRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%'
  },
  button: {
    marginTop: 30,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 2, height: 5 },
    shadowRadius: 5,
    width: '40%',
    padding: 5
  },
  image: {
    height: 200,
    width: 300,
    marginBottom: 10,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 5, height: 10 },
    resizeMode: 'center'
  },
  pickerContainer: {
    height: 50,
    backgroundColor: 'white',
    width: '50%'
  },
  textContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 2, height: 5 },
    shadowRadius: 5,
  },
  text: {
    fontSize: 20,
    fontFamily: 'virgil',
    color: Colors.mainColor
  },
  quantityContainer: {
    marginVertical: 15,
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 2, height: 5 },
    shadowRadius: 5,
  },
});

export default ModalInput;
