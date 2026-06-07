import { NavigationContainer } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, useColorScheme, View } from 'react-native';
import 'react-native-gesture-handler';
import Routes from './src/routes/routes';
import { auth } from './src/services/firebaseConfig';

if (Platform.OS === 'android') {
  const isDark = Platform.constants?.uiMode === 'dark';
  const initialColor = isDark ? '#000000' : '#6C9953';

  NavigationBar.setBackgroundColorAsync(initialColor);
  NavigationBar.setButtonStyleAsync('light');
  SystemUI.setBackgroundColorAsync(initialColor);
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const backgroundColor = isDark ? '#000000' : '#6C9953';
  const indicatorColor = isDark ? '#39FF14' : '#FFFFFF';

  // Este useEffect garante que, caso o usuário troque o tema com o app aberto,
  // as cores das barras se ajustem dinamicamente.
  useEffect(() => {
    const updateNativeBars = async () => {
      await SystemUI.setBackgroundColorAsync(backgroundColor);

      if (Platform.OS === 'android') {
        await NavigationBar.setBackgroundColorAsync(backgroundColor);
        await NavigationBar.setButtonStyleAsync('light');
      }
    };
    updateNativeBars();
  }, [backgroundColor]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribeAuth;
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor }}>
        <ActivityIndicator size="large" color={indicatorColor} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar style="light" backgroundColor={backgroundColor} translucent={false} />

      <NavigationContainer>
        <Routes user={user} />
      </NavigationContainer>
    </View>
  );
}