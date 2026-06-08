import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useFocusEffect } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { auth } from "../services/firebaseConfig";

export default function Login({ navigation }: any) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const styles = createStyles(theme);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [biometriaDisponivel, setBiometriaDisponivel] = useState(false);
  
  const jaSolicitouBiometria = useRef(false);

  // Configuração inicial do Google Sign-In
  useEffect(() => {
    if (Platform.OS !== "web") {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
        // Opcional: forceCodeForRefreshToken: true,
      });
    }
  }, []);

  const salvarCredenciais = async (email: string, senha: string) => {
    await SecureStore.setItemAsync("user_email", email);
    await SecureStore.setItemAsync("user_password", senha);
  };

  const realizarLoginBiometrico = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Usar biometria",
      fallbackLabel: "Usar senha",
      disableDeviceFallback: true,
    });

    if (result.success) {
      const emailSalvo = await SecureStore.getItemAsync("user_email");
      const senhaSalva = await SecureStore.getItemAsync("user_password");

      if (emailSalvo && senhaSalva) {
        try {
          await signInWithEmailAndPassword(auth, emailSalvo, senhaSalva);
          navigation.replace("Dashboard");
        } catch (error) {
          Alert.alert("Erro", "Falha ao autenticar com as credenciais salvas.");
        }
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      const iniciarAutoLogin = async () => {
        try {
          const emailSalvo = await SecureStore.getItemAsync("user_email");
          const senhaSalva = await SecureStore.getItemAsync("user_password");

          if (emailSalvo && senhaSalva) {
            setBiometriaDisponivel(true);

            if (!jaSolicitouBiometria.current) {
              jaSolicitouBiometria.current = true;
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

      return () => {
        jaSolicitouBiometria.current = false;
      };
    }, [])
  );

  const handleGoogleLogin = async () => {
    // Fluxo para ambiente Web (Mantido do seu código original)
    if (Platform.OS === "web") {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        // Opcional: navigation.replace("Dashboard");
      } catch (error) {
        console.error("Erro no Google Web:", error);
        Alert.alert("Erro", "Falha na autenticação web com Google.");
      }
      return;
    }

    // Fluxo Nativo (Android/iOS) usando Google Sign-In
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      // Dependendo da versão da biblioteca, o objeto userInfo pode variar ligeiramente
      // O TS pode reclamar de 'data', por isso usamos a verificação em cascata
      const idToken = (userInfo as any)?.data?.idToken || userInfo.idToken;

      if (!idToken) {
        Alert.alert("Erro", "Token de autenticação não recebido do Google.");
        return;
      }

      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
      
      // Opcional: Descomente abaixo se o seu App precisa de um push manual após o Firebase logar
      // navigation.replace("Dashboard");

    } catch (error: any) {
      // O usuário fechou o pop-up do Google antes de logar
      if (error.code === 'SIGN_IN_CANCELLED') {
        console.log("Login com Google cancelado pelo usuário.");
        return;
      }
      
      console.error("Erro no Google Sign-In Nativo:", error);
      Alert.alert("Erro", "Falha ao registrar credencial no Firebase.");
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
                  color={theme.icon}
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="E-mail ou Usuário"
                  placeholderTextColor={theme.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.icon}
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor={theme.textSecondary}
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
                    color={theme.icon}
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
                    uri: "https://static.vecteezy.com/system/resources/previews/022/613/027/non_2x/google-icon-logo-symbol-free-png.png",
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
                  <Ionicons name="finger-print" size={24} color={theme.text} />
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

const createStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundPrimary,
  },
  safeArea: { flex: 1 },
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
    color: theme.text,
    fontWeight: "900",
    top: 90,
  },
  formContainer: { width: "100%" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 55,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
    height: "100%",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: theme.textOnPrimary,
    textDecorationLine: "underline",
    fontSize: 14,
  },
  botaoEntrar: {
    backgroundColor: theme.buttonBackground,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 30,
    borderWidth: theme.buttonBackground === '#1A1A1A' ? 1 : 0,
    borderColor: theme.border,
  },
  textoBotao: {
    fontSize: 20,
    color: theme.buttonText,
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
    backgroundColor: theme.divider,
    opacity: 1,
  },
  dividerText: {
    color: theme.textOnPrimary,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  botaoGoogle: {
    flexDirection: "row",
    backgroundColor: theme.card,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: theme.border,
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
    color: theme.text,
    fontWeight: "600",
  },
  botaoBiometria: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.card,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: theme.border,
    paddingVertical: 12,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  textoBotaoBiometria: {
    color: theme.text,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 10,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  linkText: {
    color: theme.textOnPrimary,
    fontSize: 15,
    textDecorationLine: "underline",
  },
});