import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Modal, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { useDispatch } from 'react-redux';
// import { Picker } from '@react-native-picker/picker';

import { createGrocery } from '../store/Reducers/GroceryReducer';
import Colors from '../constants/Colors.js';

const ModalInput = (props) => {
  const [enteredValue, setEnteredValue] = useState('');
  // const [selectedItem, setSelectedItem] = useState();

  const dispatch = useDispatch();

  const handleChange = (inputText) => {
    setEnteredValue(inputText);
  };

  const cancelAction = () => {
    setEnteredValue('');
    props.setModal(false);
  };

  const addHandler = () => {
    if (enteredValue.match(/^ *$/)) Alert.alert('Invalid Grocery Item', 'Grocery cannot be blank.');
    else {
      dispatch(createGrocery(enteredValue));
      setEnteredValue('');
    };
  };

  // const input = () => {
  //   return (
  //     <TextInput
  //       style={styles.input}
  //       placeholder='Enter Grocery'
  //       onChangeText={handleChange}
  //       value={enteredValue}
  //     />

  //   );
  // };

  return (
    <Modal visible={props.visible} animationType='slide' >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.mainContainer}
      >
        <Image style={styles.image} source={require('../assets/groceryTransparent.png')} />
        <TextInput
          style={styles.input}
          placeholder='Enter Grocery'
          onChangeText={handleChange}
          value={enteredValue}
        />
        {/* <View style={styles.pickerContainer}>
          <Text style={styles.pickerText}>Choose One:</Text>
          <Picker style={styles.picker} selectedValue={selectedItem} onValueChange={(itemVal) => setSelectedItem(itemVal)} >
            <Picker.Item style={{fontFamily: 'virgil'}} label='Refrigerator' value='cold' />
            <Picker.Item label='Pantry' value='dry' />
          </Picker>
        </View> */}
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button color={Colors.mainColor} title='ADD' onPress={addHandler}/>
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
    borderRadius: 15,
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
    marginBottom: 30,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 5, height: 10 },
    resizeMode: 'center'
  }
  // pickerContainer: {
  //   flexDirection: 'row',
  //   width: '95%',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   // backgroundColor: 'white',
  //   // borderRadius: 5,
  //   // shadowColor: 'black',
  //   // shadowOpacity: 0.4,
  //   // shadowOffset: { width: 0, height: 2 },
  //   // shadowRadius: 5,
  // },
  // picker: {
  //   width: '50%',
  // },
  // pickerText: {
  //   fontSize: 18,
  //   fontFamily: 'open-sans-bold'
  // }
});

export default ModalInput;
