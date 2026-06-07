import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { auth } from '../services/firebaseConfig';

export default function Register({ navigation }: any) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const styles = createStyles(theme);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleRegister = async () => {
    if (email === '' || senha === '') {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro no Cadastro', 'Não foi possível criar a conta. Verifique os dados.');
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/images/home.jpeg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={[styles.overlay]} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={{ flex: 1, width: '100%' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.titulo}>Criar Conta</Text>

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
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={theme.icon} style={styles.icon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry
                  value={senha}
                  onChangeText={setSenha}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="checkmark-circle-outline" size={20} color={theme.icon} style={styles.icon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Confirmar Senha"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                />
              </View>

              <TouchableOpacity style={styles.botao} onPress={handleRegister}>
                <Text style={styles.textoBotao}>Cadastrar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.footer}>
                <Text style={styles.footerText}>Já tem uma conta? <Text style={styles.linkText}>Entrar</Text></Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const createStyles = (theme: typeof Colors.light) => StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.backgroundPrimary,
  },
  safeArea: { flex: 1 },
  scrollContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 35 },
  titulo: { fontSize: 32, color: theme.textOnPrimary, fontWeight: '900', marginBottom: 40 },
  formContainer: { width: '100%' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderRadius: 12, borderWidth: 1, borderColor: theme.border, marginBottom: 15, paddingHorizontal: 15, height: 55 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: theme.text },
  botao: { backgroundColor: theme.buttonBackground, borderWidth: theme.buttonBackground === '#1A1A1A' ? 1 : 0, borderColor: theme.border, paddingVertical: 15, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  textoBotao: { fontSize: 20, color: theme.buttonText, fontWeight: 'bold' },
  footer: { marginTop: 30, alignItems: 'center' },
  footerText: { fontSize: 15, color: theme.textOnPrimary },
  linkText: { color: theme.tint, fontWeight: 'bold', textDecorationLine: 'underline' }
});