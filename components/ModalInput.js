import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Modal, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
// import { Picker } from '@react-native-picker/picker';

import { createGrocery } from '../store/Reducers/GroceryReducer';

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
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Add Groceries:</Text>
        </View>
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
            <Button title='ADD' onPress={addHandler}/>
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
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 20,
    width: '95%',
    borderRadius: 15,
    backgroundColor: '#E9E9E9',
    fontSize: 22,
    fontFamily: 'virgil'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%'
  },
  button: {
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    width: '40%'
  },
  titleContainer: {
    marginBottom: 30
  },
  titleText: {
    fontFamily: 'open-sans-bold',
    fontSize: 22
  },
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
