import { Ionicons } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { auth } from '../services/firebaseConfig';

export default function ResetPassword({ navigation }: any) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const styles = createStyles(theme);

  const [email, setEmail] = useState('');

  const handleReset = async () => {
    if (email === '') {
      Alert.alert('Erro', 'Por favor, insira o e-mail cadastrado.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Sucesso', 'Um link de redefinição de senha foi enviado para o seu e-mail.');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível enviar o e-mail. Verifique se o endereço está correto e cadastrado.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"} />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={{ flex: 1, width: '100%' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color={theme.textOnPrimary} />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
              <Text style={styles.titulo}>Redefinir Senha</Text>
              <Text style={styles.subtitulo}>Insira seu e-mail abaixo para receber um link de recuperação.</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={theme.icon} style={styles.icon} />
                <TextInput 
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor={theme.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <TouchableOpacity style={styles.botao} onPress={handleReset}>
                <Text style={styles.textoBotao}>Enviar Link</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundPrimary,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 35,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  titulo: {
    fontSize: 32,
    color: theme.textOnPrimary,
    fontWeight: '900',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: theme.textOnPrimary,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 25,
    paddingHorizontal: 15,
    height: 55,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
    height: '100%',
  },
  botao: {
    backgroundColor: theme.buttonBackground,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: theme.buttonBackground === '#1A1A1A' ? 1 : 0,
    borderColor: theme.border,
  },
  textoBotao: {
    fontSize: 20,
    color: theme.buttonText,
    fontWeight: 'bold',
  },
});