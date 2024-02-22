import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DevicesScreen from './components/DevicesScreen';
import Home from './components/Home';
import LoginScreen from './components/LoginScreen';
import CameraComponent from './components/CameraComponent';
import LockSys from './components/LockSys';
import SignupScreen from './components/SignupScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Devices">
        <Stack.Screen name="Devices" component={DevicesScreen} options={{ headerLeft: null }} />
      
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerLeft: null }} />
        <Stack.Screen name="Camera" component={CameraComponent} options={{ headerLeft: null }} />
        <Stack.Screen name="LockSys" component={LockSys}  />
        <Stack.Screen name="Signup" component={SignupScreen}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
