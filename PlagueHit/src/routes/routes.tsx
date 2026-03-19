import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../pages/Home';
import Login from '../pages/Login';

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  return (
    // headerShown: false tira a barra preta superior com o nome da tela
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}