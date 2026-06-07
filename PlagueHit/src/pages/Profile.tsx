import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { sendPasswordResetEmail, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { auth } from "../services/firebaseConfig";

export default function Profile({ navigation }: any) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const styles = createStyles(theme);

  const [userName, setUserName] = useState<string>("Usuário");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email || "");
      if (user.displayName) {
        setUserName(user.displayName);
      }
    }
  }, []);

  const handleResetPassword = async () => {
    if (!userEmail) return;

    try {
      await sendPasswordResetEmail(auth, userEmail);
      Alert.alert(
        "E-mail Enviado!",
        "Verifique sua caixa de entrada (e a de spam) para redefinir sua senha.",
      );
    } catch (error: any) {
      Alert.alert(
        "Erro",
        "Não foi possível enviar o e-mail de redefinição. Tente novamente mais tarde.",
      );
    }
  };

  const handleLogout = async () => {
    Alert.alert("Sair da Conta", "Tem certeza que deseja sair?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync("user_email");
            await SecureStore.deleteItemAsync("user_password");

            await signOut(auth);
          } catch (error) {
            Alert.alert("Erro", "Não foi possível realizar o logout.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>

      <Image
        source={require("../assets/images/circuit1.png")}
        style={styles.circuitBackground}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.tint} />
        </TouchableOpacity>
        <Text style={styles.title}>Meu Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={120} color={theme.tint} />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons
              name="person-outline"
              size={20}
              color={theme.icon}
              style={styles.infoIcon}
            />
            <View>
              <Text style={styles.label}>NOME</Text>
              <Text style={styles.value}>{userName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={theme.icon}
              style={styles.infoIcon}
            />
            <View>
              <Text style={styles.label}>E-MAIL</Text>
              <Text style={styles.value}>{userEmail}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleResetPassword}
          >
            <Ionicons name="key-outline" size={20} color={theme.buttonText} />
            <Text style={styles.actionButtonText}>Redefinir Senha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FFF" />
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  circuitBackground: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 200,
    opacity: 0.1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: theme.tint,
    letterSpacing: 2,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
    alignItems: "center",
  },
  avatarContainer: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    backgroundColor: theme.card,
    width: "100%",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 30,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  infoIcon: {
    marginRight: 15,
  },
  label: {
    color: theme.textSecondary,
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: theme.divider,
    marginVertical: 10,
  },
  actionsContainer: {
    width: "100%",
    gap: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.buttonBackground,
    borderWidth: 1,
    borderColor: theme.border,
    paddingVertical: 15,
    borderRadius: 30,
  },
  actionButtonText: {
    color: theme.buttonText,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.danger,
    paddingVertical: 15,
    borderRadius: 30,
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});