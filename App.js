import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import store from './store/Store';
import { enableScreens } from 'react-native-screens';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import * as Notifications from 'expo-notifications'

import PantryScreen from './screens/PantryScreen';
import RefrigeratorScreen from './screens/RefrigeratorScreen';
import GroceryListScreen from './screens/GroceryListScreen';
import Colors from './constants/Colors';

enableScreens();

const Tab = createBottomTabNavigator();

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./fonts/OpenSans-Bold.ttf'),
    'virgil': require('./fonts/Virgil.ttf')
  });
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
  }),
});

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const allowsNotificationsAsync = async () => {
      const settings = await Notifications.getPermissionsAsync();
      if (settings.status !== 'granted') {
        return await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
          },
        });
      };
      if (settings.status !== 'granted') return
    }
    allowsNotificationsAsync();
  }, []);

  useEffect(() => {
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(async response => {
      // console.log(response);
      const id = response.notification.request.identifier
      await Notifications.cancelScheduledNotificationAsync(id);
    });

    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      // console.log(notification);
    });
    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }, []);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, focused }) => {
              let iconName;
              if (route.name === 'Groceries') iconName = focused ? 'cart' : 'cart-outline';
              else if (route.name === 'Refrigerator') iconName = focused ? 'ios-restaurant' : 'ios-restaurant-outline';
              else iconName = focused ? 'ios-list' : 'ios-list-outline'
              return <Ionicons name={iconName} size={22} color={color} />
            },
            tabBarActiveTintColor: Colors.mainColor,
            headerTitleStyle: {
              color: Colors.mainColor,
              fontFamily: 'open-sans-bold'
            }
          })}
          initialRouteName='Groceries'
        >
          <Tab.Screen name="Refrigerator" component={RefrigeratorScreen} />
          <Tab.Screen name='Groceries' component={GroceryListScreen} />
          <Tab.Screen name="Pantry" component={PantryScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
