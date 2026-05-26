import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Google from "expo-auth-session/providers/google";
import * as LocalAuthentication from "expo-local-authentication";
import * as NavigationBar from "expo-navigation-bar";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../services/firebaseConfig";

if (Platform.OS !== "web") {
  WebBrowser.maybeCompleteAuthSession();
}

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const salvarCredenciais = async (email: string, senha: string) => {
    await SecureStore.setItemAsync("user_email", email);
    await SecureStore.setItemAsync("user_password", senha);
  };
  const jaSolicitouBiometria = useRef(false);

  const realizarLoginBiometrico = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Usar biometria",
      fallbackLabel: "Usar senha", // Botão para o usuário cancelar a biometria
      disableDeviceFallback: true,
    });

    if (result.success) {
      const emailSalvo = await SecureStore.getItemAsync("user_email");
      const senhaSalva = await SecureStore.getItemAsync("user_password");

      if (emailSalvo && senhaSalva) {
        try {
          await signInWithEmailAndPassword(auth, emailSalvo, senhaSalva);
          navigation.replace("Dashboard"); // Redireciona após o sucesso
        } catch (error) {
          Alert.alert("Erro", "Falha ao autenticar com as credenciais salvas.");
        }
      }
    }
  };

  const [biometriaDisponivel, setBiometriaDisponivel] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const iniciarAutoLogin = async () => {
        try {
          const emailSalvo = await SecureStore.getItemAsync("user_email");
          const senhaSalva = await SecureStore.getItemAsync("user_password");

          if (emailSalvo && senhaSalva) {
            setBiometriaDisponivel(true);

            // Verifica a trava silenciosa
            if (!jaSolicitouBiometria.current) {
              jaSolicitouBiometria.current = true; // Ativa a trava imediatamente
              await realizarLoginBiometrico();
            }
          } else {
            setBiometriaDisponivel(false);
          }
        } catch (error) {
          setBiometriaDisponivel(false);
        }
      };

      iniciarAutoLogin();

      // Quando o usuário sai de vez da tela de Login, resetamos a trava silenciosamente
      return () => {
        jaSolicitouBiometria.current = false;
      };
    }, []), // <- O ARRAY VAZIO AQUI É CRUCIAL. Evita o loop.
  );

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "SEU_CLIENT_ID_IOS.apps.googleusercontent.com",
    androidClientId: "SEU_CLIENT_ID_ANDROID.apps.googleusercontent.com",
    webClientId:
      "628377698907-sa7iouqkim5dbnbrkmn7e4qt0lnevmmj.apps.googleusercontent.com",
  });

  useEffect(() => {
    const configureAndroidBars = async () => {
      if (Platform.OS === "android") {
        await NavigationBar.setBackgroundColorAsync("#6C9953");
        await NavigationBar.setButtonStyleAsync("light");
      }
    };
    configureAndroidBars();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      // Busca o token no objeto authentication (padrão mais recente do Expo) 
      // ou faz o fallback para o params caso esteja rodando em uma versão legada
      const idToken = response.authentication?.idToken || response.params?.id_token;

      if (!idToken) {
        Alert.alert("Erro", "Token de autenticação não recebido do Google.");
        return;
      }

      const credential = GoogleAuthProvider.credential(idToken);

      signInWithCredential(auth, credential)
        .then(() => {
          // Mantemos vazio para evitar a tela branca, o App.tsx fará o redirecionamento
        })
        .catch((error) => {
          console.error("Erro no Firebase:", error);
          Alert.alert("Erro", "Falha ao registrar credencial no Firebase.");
        });
    }
  }, [response]);

  const handleGoogleLogin = async () => {
    if (Platform.OS === "web") {
      // Fluxo específico e seguro para a WEB
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        // Sucesso! O App.tsx fará a navegação automaticamente para o Dashboard
      } catch (error) {
        console.error("Erro no Google Web:", error);
        Alert.alert("Erro", "Falha na autenticação web com Google.");
      }
    } else {
      // Fluxo para Android e iOS usando o Expo Auth Session
      promptAsync();
    }
  };

  const handleLogin = async () => {
    if (email === "" || senha === "") {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, senha);

      await salvarCredenciais(email, senha);
      setBiometriaDisponivel(true);
    } catch (error: any) {
      Alert.alert("Erro de Login", "E-mail ou senha inválidos");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <Image
        source={require("../assets/images/circuit2.png")}
        resizeMode="cover"
        style={styles.background}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1, width: "100%" }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerContainer}>
              <Image
                source={require("../assets/images/chip.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.titulo}>Entrar</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#666"
                  style={styles.icon}
                />
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
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#666"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor="#666"
                  secureTextEntry={!mostrarSenha}
                  value={senha}
                  onChangeText={setSenha}
                />
                <TouchableOpacity
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                >
                  <Ionicons
                    name={mostrarSenha ? "eye-outline" : "eye-off-outline"}
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate("ResetPassword")}>
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
                onPress={handleGoogleLogin}
              >
                <Image
                  source={{
                    uri: "https://www.citypng.com/public/uploads/preview/google-logo-icon-gsuite-hd-701751694791470gzbayltphh.png",
                  }}
                  style={styles.googleImage}
                />
                <Text style={styles.textoGoogle}>Continuar com Google</Text>
              </TouchableOpacity>
              {biometriaDisponivel && (
                <TouchableOpacity
                  onPress={realizarLoginBiometrico}
                  style={styles.botaoBiometria}
                >
                  <Ionicons name="finger-print" size={24} color="#1A2F1A" />
                  <Text style={styles.textoBotaoBiometria}>Usar Biometria</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.footerContainer}>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.linkText}>
                  Não tem uma conta? Cadastre-se
                </Text>
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
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: 35,
  },

  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    width: "100%",
  },

  background: {
    position: "absolute",
    top: 0,
    opacity: 0.2,
  },

  logo: {
    position: "absolute",
    width: 150,
    height: 150,
  },

  titulo: {
    fontSize: 32,
    color: "#1A2F1A",
    fontWeight: "900",
    top: 90,
  },

  formContainer: {
    width: "100%",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1A2F1A",
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
    color: "#333",
    height: "100%",
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },

  forgotPasswordText: {
    color: "white",
    textDecorationLine: "underline",
    fontSize: 14,
  },

  botaoEntrar: {
    backgroundColor: "#b3d19f",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 30,
  },

  textoBotao: {
    fontSize: 20,
    color: "#F4F9F1",
    fontWeight: "bold",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "white",
    opacity: 1,
  },

  dividerText: {
    color: "#3a532d",
    paddingHorizontal: 10,
    fontSize: 14,
  },

  botaoGoogle: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#1A2F1A",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },

  googleImage: {
    width: 18,
    height: 18,
    marginRight: 10,
  },

  textoGoogle: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },

  botaoBiometria: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#1A2F1A",
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },

  textoBotaoBiometria: {
    color: "#1A2F1A",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 10,
  },

  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },

  footerText: {
    color: "#1A2F1A",
    fontSize: 15,
    fontWeight: "500",
  },

  linkText: {
    color: "white",
    fontSize: 15,
    textDecorationLine: "underline",
  },
});
