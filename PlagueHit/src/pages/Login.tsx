import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as NavigationBar from 'expo-navigation-bar';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../services/firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: 'SEU_CLIENT_ID_IOS.apps.googleusercontent.com',
    androidClientId: 'SEU_CLIENT_ID_ANDROID.apps.googleusercontent.com',
    webClientId: '880310846119-39udf2v1n5is08bdaptv68m1jocki20f.apps.googleusercontent.com',
  });

  useEffect(() => {
    const configureAndroidBars = async () => {
      if (Platform.OS === 'android') {
        await NavigationBar.setBackgroundColorAsync("#6C9953");
        await NavigationBar.setButtonStyleAsync("light");
      }
    };
    configureAndroidBars();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(() => {
          // Navegação ou lógica pós-login
        })
        .catch((error) => {
          Alert.alert('Erro', 'Falha na autenticação com Google');
        });
    }
  }, [response]);

  const handleLogin = async () => {
    if (email === '' || senha === '') {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, senha);
    } catch (error: any) {
      Alert.alert('Erro de Login', 'E-mail ou senha inválidos');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Image
        source={require('../assets/images/circuit2.png')}
        resizeMode='cover'
        style={styles.background}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1, width: '100%' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

            <View style={styles.headerContainer}>
              <Image
                source={require('../assets/images/chip.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.titulo}>Entrar</Text>
            </View>

            <View style={styles.formContainer}>
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
                <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                  <Ionicons name={mostrarSenha ? "eye-outline" : "eye-off-outline"} size={22} color="#666" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoEntrar}
                onPress={handleLogin}
              >
                <Text style={styles.textoBotao}>Entrar</Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>ou entrar com:</Text>
                <View style={styles.line} />
              </View>

              <TouchableOpacity
                style={styles.botaoGoogle}
                activeOpacity={0.7}
                disabled={!request}
                onPress={() => promptAsync()}
              >
                <Image
                  source={{ uri: 'https://www.citypng.com/public/uploads/preview/google-logo-icon-gsuite-hd-701751694791470gzbayltphh.png' }}
                  style={styles.googleImage}
                />
                <Text style={styles.textoGoogle}>Continuar com Google</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footerContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#6C9953",
  },

  safeArea: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 35,
  },

  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    width: '100%',
  },

  background: {
    position: 'absolute',
    top: 0,
    // left: 0,
    // right: 0,
    opacity: 0.2,
  },

  logo: {
    position: 'absolute',
    width: 150,
    height: 150,
  },

  titulo: {
    fontSize: 32,
    color: '#1A2F1A',
    fontWeight: '900',
    top: 90,
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
    color: 'white',
    textDecorationLine: 'underline',
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
    backgroundColor: 'white',
    opacity: 1,
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
  },

  footerText: {
    color: '#1A2F1A',
    fontSize: 15,
    fontWeight: '500',
  },

  linkText: {
    color: 'white',
    fontSize: 15,
    textDecorationLine: 'underline',
  },

});