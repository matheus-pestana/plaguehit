import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ref, onValue } from "firebase/database";
import { database, auth } from "../services/firebaseConfig";
import { signOut } from "firebase/auth";
import * as SecureStore from "expo-secure-store";

interface AnaliseIA {
  confianca: string;
  diagnostico: string;
  data_hora: string;
  url_imagem: string;
}

export default function Dashboard({ navigation }: any) {
  const [analise, setAnalise] = useState<AnaliseIA | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [biometriaDisponivel, setBiometriaDisponivel] = useState(false);

  useEffect(() => {
    const analiseRef = ref(database, "status_atual");

    const unsubscribe = onValue(analiseRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAnalise(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isSaudavel = analise?.diagnostico.toLowerCase().includes("saudável");

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../assets/images/circuit1.png")}
        style={styles.circuitBackground}
      />

      <View style={styles.header}>
        <Text style={styles.title}>PlagueHit</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Botão para ir ao Perfil */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="person-circle-outline" size={28} color="#39FF14" />
          </TouchableOpacity>

          <Ionicons name="notifications-outline" size={24} color="#39FF14" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.centralContainer}>
          <Image
            source={require("../assets/images/chip.png")}
            style={styles.chipIcon}
          />

          <View style={styles.statusContainer}>
            <Text style={styles.statusTitle}>ANÁLISE EM TEMPO REAL</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#39FF14" />
            ) : analise ? (
              <View style={styles.resultDetails}>
                <Ionicons
                  name={isSaudavel ? "checkmark-done-circle" : "alert-circle"}
                  size={60}
                  color={isSaudavel ? "#39FF14" : "#FF3B30"}
                />

                <Text style={styles.diagnosisName}>{analise.diagnostico}</Text>

                <View style={styles.dataGrid}>
                  <View style={styles.dataItem}>
                    <Text style={styles.label}>Confiança</Text>
                    <Text style={styles.value}>{analise.confianca}</Text>
                  </View>
                  <View style={styles.dataItem}>
                    <Text style={styles.label}>Data</Text>
                    <Text style={styles.value}>{analise.data_hora}</Text>
                  </View>
                </View>

                {analise.url_imagem && (
                  <TouchableOpacity
                    style={styles.viewImageButton}
                    onPress={() => setModalVisible(true)}
                  >
                    <Ionicons name="image-outline" size={20} color="#000" />
                    <Text style={styles.viewImageText}>VER IMAGEM</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <Text style={styles.noDataText}>Nenhum dado recebido</Text>
            )}
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Captura da Análise</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={28} color="#FFF" />
                </TouchableOpacity>
              </View>

              {analise?.url_imagem ? (
                <Image
                  source={{ uri: analise.url_imagem }}
                  style={styles.analyzedImage}
                  resizeMode="contain"
                />
              ) : (
                <ActivityIndicator color="#39FF14" />
              )}

              <Text style={styles.imageTimestamp}>Sincronizado via AWS S3</Text>
            </View>
          </Pressable>
        </Modal>

        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>Status do Sistema: Operacional</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  scrollContent: { paddingBottom: 40 },
  circuitBackground: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 150,
    opacity: 0.1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 25,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#39FF14",
    letterSpacing: 2,
  },
  centralContainer: { alignItems: "center", marginTop: 10 },
  chipIcon: { width: 60, height: 60, marginBottom: 20 },
  statusContainer: {
    backgroundColor: "#0A0A0A",
    width: "90%",
    padding: 25,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#1A1A1A",
    alignItems: "center",
  },
  statusTitle: {
    color: "#333",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 3,
    marginBottom: 20,
  },
  resultDetails: { alignItems: "center", width: "100%" },
  diagnosisName: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  dataGrid: {
    width: "100%",
    marginTop: 25,
    borderTopWidth: 1,
    borderTopColor: "#151515",
  },
  dataItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  label: { color: "#555", fontSize: 13 },
  value: { color: "#AAA", fontSize: 13 },

  // Estilo do Botão
  viewImageButton: {
    flexDirection: "row",
    backgroundColor: "#39FF14",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginTop: 25,
    alignItems: "center",
  },
  viewImageText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 14,
    marginLeft: 10,
  },

  // Estilo do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#39FF14",
    fontSize: 16,
    fontWeight: "bold",
  },
  analyzedImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    backgroundColor: "#000",
  },
  imageTimestamp: {
    color: "#444",
    fontSize: 11,
    marginTop: 15,
  },

  noDataText: { color: "#333" },
  footerInfo: { marginTop: 30, alignItems: "center" },
  footerText: { color: "#222", fontSize: 10, fontWeight: "bold" },

  botaoLogout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D9534F", // Vermelho para indicar ação de saída
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 20,
    width: "100%",
  },
  textoLogout: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
