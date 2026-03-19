import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../services/firebaseConfig';

export default function Register({ navigation }: any) {
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
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          style={{ flex: 1, width: '100%' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.titulo}>Criar Conta</Text>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
                <TextInput 
                  style={styles.input}
                  placeholder="E-mail"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Senha"
                  secureTextEntry
                  value={senha}
                  onChangeText={setSenha}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#666" style={styles.icon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Confirmar Senha"
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

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 35 },
  titulo: { fontSize: 32, color: '#1A2F1A', fontWeight: '900', marginBottom: 40 },
  formContainer: { width: '100%' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#1A2F1A', marginBottom: 15, paddingHorizontal: 15, height: 55 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  botao: { backgroundColor: '#b3d19f', paddingVertical: 15, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  textoBotao: { fontSize: 20, color: '#F4F9F1', fontWeight: 'bold' },
  footer: { marginTop: 30, alignItems: 'center' },
  footerText: { fontSize: 15, color: '#1A2F1A' },
  linkText: { color: '#6e8f5e', fontWeight: 'bold', textDecorationLine: 'underline' }
});