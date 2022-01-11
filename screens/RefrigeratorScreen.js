import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const RefrigeratorScreen = (props) => {
  return (
    <View style={styles.mainContainer}>
      <Text>Refrigerator List!</Text>
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

export default RefrigeratorScreen;
