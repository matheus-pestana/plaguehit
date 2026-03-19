import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Image, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../services/firebaseConfig';


export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = async () => {
    if (email === '' || senha === '') {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      // O Firebase cuidará do estado de autenticação
    } catch (error: any) {
      Alert.alert('Erro de Login', 'E-mail ou senha inválidos');
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
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

            {/* Cabeçalho com o Logo do Chip e Título "Entrar" */}
            <View style={styles.headerContainer}>
              <Image
                source={require('../assets/images/chip.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.titulo}>Entrar</Text>
            </View>

            {/* Início do Formulário */}
            <View style={styles.formContainer}>

              {/* Input de E-mail (Caixa Branca Arredondada) */}
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="E-mail ou Usuário"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>

              {/* Input de Senha (Caixa Branca Arredondada) */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor="#666"
                  secureTextEntry={!mostrarSenha}
                  value={senha}
                  onChangeText={setSenha}
                />
                {/* Botão opcional para mostrar/esconder senha, caso queira manter a funcionalidade */}
                <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                  <Ionicons name={mostrarSenha ? "eye-outline" : "eye-off-outline"} size={22} color="#666" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
              </TouchableOpacity>

              {/* Botão de Entrar principal */}
              <TouchableOpacity
                style={styles.botaoEntrar}
                onPress={handleLogin}
              >
                <Text style={styles.textoBotao}>Entrar</Text>
              </TouchableOpacity>

              {/* Divisor "ou entrar com:" */}
              <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>ou entrar com:</Text>
                <View style={styles.line} />
              </View>

              {/* Botão do Google */}
              <TouchableOpacity style={styles.botaoGoogle} activeOpacity={0.7}>
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                  style={styles.googleImage}
                />
                <Text style={styles.textoGoogle}>Continuar com Google</Text>
              </TouchableOpacity>

            </View>

            {/* Rodapé: Não tem conta? Cadastre-se (Ajustado) */}
            <View style={styles.footerContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 35,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  titulo: {
    fontSize: 32,
    color: '#1A2F1A',
    fontWeight: '900',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A2F1A',
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 55,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#6e8f5e',
    fontSize: 14,
  },
  botaoEntrar: {
    backgroundColor: '#b3d19f',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  textoBotao: {
    fontSize: 20,
    color: '#F4F9F1',
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#6e8f5e',
    opacity: 0.5,
  },
  dividerText: {
    color: '#3a532d',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  botaoGoogle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#1A2F1A',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  googleImage: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  textoGoogle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  footerText: {
    color: '#1A2F1A',
    fontSize: 15,
    fontWeight: '500',
  },
  linkText: {
    color: '#6e8f5e',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});