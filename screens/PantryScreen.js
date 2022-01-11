import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PantryScreen = (props) => {
  return (
    <View style={styles.mainContainer}>
      <Text>Pantry List!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default PantryScreen;
