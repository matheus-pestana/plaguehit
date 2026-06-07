import { Ionicons } from "@expo/vector-icons";
import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { database } from "../services/firebaseConfig";

interface AnaliseIA {
  confianca: string;
  diagnostico: string;
  data_hora: string;
  url_imagem: string;
}

export default function Dashboard({ navigation }: any) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const styles = createStyles(theme);

  const [analise, setAnalise] = useState<AnaliseIA | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

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

          <TouchableOpacity
            onPress={() => navigation.navigate("History")}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="time-outline" size={26} color={theme.tint} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Chat")}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="chatbubbles-outline" size={26} color={theme.tint} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="person-circle-outline" size={28} color={theme.tint} />
          </TouchableOpacity>

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
              <ActivityIndicator size="large" color={theme.tint} />
            ) : analise ? (
              <View style={styles.resultDetails}>
                <Ionicons
                  name={isSaudavel ? "checkmark-done-circle" : "alert-circle"}
                  size={60}
                  color={isSaudavel ? theme.statusIcon : theme.danger}
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
                    <Ionicons name="image-outline" size={20} color={theme.background} />
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
                  <Ionicons name="close" size={28} color={theme.text} />
                </TouchableOpacity>
              </View>

              {analise?.url_imagem ? (
                <Image
                  source={{ uri: analise.url_imagem }}
                  style={styles.analyzedImage}
                  resizeMode="contain"
                />
              ) : (
                <ActivityIndicator color={theme.tint} />
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

const createStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
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
    color: theme.tint,
    letterSpacing: 2,
  },
  centralContainer: { alignItems: "center", marginTop: 10 },
  chipIcon: { width: 60, height: 60, marginBottom: 20 },
  statusContainer: {
    backgroundColor: theme.card,
    width: "90%",
    padding: 25,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: "center",
  },
  statusTitle: {
    color: theme.textSecondary,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 3,
    marginBottom: 20,
  },
  resultDetails: { alignItems: "center", width: "100%" },
  diagnosisName: {
    color: theme.text,
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  dataGrid: {
    width: "100%",
    marginTop: 25,
    borderTopWidth: 1,
    borderTopColor: theme.divider,
  },
  dataItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  label: { color: theme.textSecondary, fontSize: 13 },
  value: { color: theme.textSecondary, fontSize: 13 },
  viewImageButton: {
    flexDirection: "row",
    backgroundColor: theme.tint,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginTop: 25,
    alignItems: "center",
  },
  viewImageText: {
    color: theme.background,
    fontWeight: "900",
    fontSize: 14,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  modalTitle: {
    color: theme.tint,
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
    color: theme.textSecondary,
    fontSize: 11,
    marginTop: 15,
  },
  noDataText: { color: theme.textSecondary },
  footerInfo: { marginTop: 30, alignItems: "center" },
  footerText: { color: theme.textSecondary, fontSize: 10, fontWeight: "bold" },
});