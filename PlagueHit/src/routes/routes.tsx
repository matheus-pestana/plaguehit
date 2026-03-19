import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

const Stack = createNativeStackNavigator();

export default function StackRoutes({ user }: any) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Rotas para usuário logado
        <Stack.Screen name="Dashboard" component={Dashboard} />
      ) : (
        // Rotas para usuário deslogado
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
}