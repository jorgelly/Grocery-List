import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, Text, View, Button, Modal, Alert } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import NumericInput from 'react-native-numeric-input';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import { createFridgeItem } from '../store/Reducers/RefrigeratorReducer';
import { createPantryItem } from '../store/Reducers/PantryReducer';

const ModalInventoryInput = (props) => {
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState();
  const [open, setOpen] = useState(false);
  const isDate = date ? date.toDateString() : 'Choose an Exp. Date';
  const dispatch = useDispatch();

  const cancelAction = () => {
    setDate();
    setQuantity(1);
    props.setModal(false);
    props.swipeRef.current.close();
  };

  const addHandler = (buttonType) => {
    if (buttonType === 'fridge') {
      dispatch(createFridgeItem({ name: props.item.name, expiration: date, quantity: quantity }));
    } else if (buttonType === 'pantry') {
      dispatch(createPantryItem({ name: props.item.name, expiration: date, quantity: quantity }));
    }
    setDate();
    setQuantity(1);
    props.handleDelete(props.item.id);
    props.setModal(false);
  };
  const isGrocery =
    (
      <View style={{alignItems: 'center'}}>
        <View style={styles.iconContainer}>
          <View style={styles.icon}>
            {/* <Button color={Colors.mainColor} title=' SEND TO FRIDGE' onPress={() => addHandler('fridge')}/> */}
            <Ionicons name="ios-restaurant" size={42} color={Colors.mainColor} onPress={() => addHandler('fridge')} />
            <Text style={styles.iconText}>Fridge</Text>
          </View>
          <View style={styles.icon}>
            {/* <Button color={Colors.mainColor} title='SEND TO PANTRY' onPress={() => addHandler('pantry')} /> */}
            <Ionicons name="ios-list-circle" size={42} color={Colors.mainColor} onPress={() => addHandler('pantry')} />
            <Text style={styles.iconText}>Pantry</Text>
          </View>
        </View>
        <View style={styles.icon}>
          <Button color='red' title='CANCEL' onPress={cancelAction}/>
        </View>
      </View>
    );

  return (
    <Modal visible={props.visible} animationType='slide' presentationStyle='pageSheet'>
      <View  style={styles.mainContainer}>
        <View style={[styles.quantityContainer, {marginBottom: 30}]}>
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
            <View style={[styles.icon, { width: '60%' }]}>
              <Button title='SET EXPIRATION DATE' color={Colors.mainColor} onPress={() => setOpen(true)} />
            </View>}
        </View>
        {props.identifier === 'groceries' && isGrocery}
      </View>
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
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  icon: {
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 2, height: 5 },
    shadowRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  iconText: {
    fontFamily: 'open-sans',
    color: Colors.mainColor,
    fontSize: 14
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

export default ModalInventoryInput;
