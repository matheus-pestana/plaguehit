import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../services/firebaseConfig";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import * as SecureStore from "expo-secure-store";

export default function Profile({ navigation }: any) {
  const [userName, setUserName] = useState<string>("Usuário");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    // Busca os dados do usuário atualmente logado no Firebase
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email || "");
      // O displayName pode ser nulo dependendo de como o cadastro foi feito
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
      {/* Background Decorativo */}
      <Image
        source={require("../assets/images/circuit1.png")}
        style={styles.circuitBackground}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#39FF14" />
        </TouchableOpacity>
        <Text style={styles.title}>Meu Perfil</Text>
        <View style={{ width: 24 }} />{" "}
        {/* Espaçador para centralizar o título */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={120} color="#39FF14" />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#555"
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
              color="#555"
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
            <Ionicons name="key-outline" size={20} color="#FFF" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
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
    color: "#39FF14",
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
    backgroundColor: "#0A0A0A",
    width: "100%",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1A1A1A",
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
    color: "#555",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#151515",
    marginVertical: 10,
  },
  actionsContainer: {
    width: "100%",
    gap: 15, // Espaçamento entre os botões
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#333",
    paddingVertical: 15,
    borderRadius: 30,
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D9534F",
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
