import { Ionicons } from "@expo/vector-icons";
import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { database } from "../services/firebaseConfig";

interface AnaliseIA {
  id: string;
  confianca: string;
  diagnostico: string;
  data_hora: string;
  url_imagem: string;
}

export default function History({ navigation }: any) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const styles = createStyles(theme);

  const [historico, setHistorico] = useState<AnaliseIA[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const historicoRef = ref(database, "historico_analises");

    const unsubscribe = onValue(historicoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista: AnaliseIA[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        
        setHistorico(lista.reverse());
      } else {
        setHistorico([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }: { item: AnaliseIA }) => {
    const isSaudavel = item.diagnostico.toLowerCase().includes("saudável");

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons
            name={isSaudavel ? "checkmark-done-circle" : "alert-circle"}
            size={24}
            color={isSaudavel ? theme.statusIcon : theme.danger}
          />
          <Text style={styles.cardTitle}>{item.diagnostico}</Text>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.label}>
            Confiança: <Text style={styles.value}>{item.confianca}</Text>
          </Text>
          <Text style={styles.label}>
            Data/Hora: <Text style={styles.value}>{item.data_hora}</Text>
          </Text>
        </View>

        {item.url_imagem && (
          <TouchableOpacity
            style={styles.viewImageButton}
            onPress={() => {
              setSelectedImage(item.url_imagem);
              setModalVisible(true);
            }}
          >
            <Ionicons name="image-outline" size={16} color={theme.background} />
            <Text style={styles.viewImageText}>VER CAPTURA</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color={theme.tint} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HISTÓRICO</Text>
        <View style={{ width: 26 }} /> 
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.tint} />
        </View>
      ) : historico.length > 0 ? (
        <FlatList
          data={historico}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.center}>
          <Text style={styles.noDataText}>Nenhum registro encontrado no histórico.</Text>
        </View>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Captura Salva</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={theme.text} />
              </TouchableOpacity>
            </View>

            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />
            )}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: theme.border,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: "900", color: theme.tint, letterSpacing: 2 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContainer: { padding: 20, paddingBottom: 40 },
  noDataText: { color: theme.textSecondary, fontSize: 14, fontWeight: "bold" },
  card: {
    backgroundColor: theme.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 20,
    marginBottom: 15,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cardTitle: { color: theme.text, fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  cardBody: { borderTopWidth: 1, borderTopColor: theme.divider, paddingTop: 10, marginBottom: 15 },
  label: { color: theme.textSecondary, fontSize: 13, marginBottom: 4 },
  value: { color: theme.textSecondary, fontSize: 13 },
  viewImageButton: {
    flexDirection: "row",
    backgroundColor: theme.tint,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  viewImageText: { color: theme.background, fontWeight: "900", fontSize: 11, marginLeft: 6 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "90%", backgroundColor: theme.card, borderRadius: 20, padding: 20, alignItems: "center", borderWidth: 1, borderColor: theme.border },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 20 },
  modalTitle: { color: theme.tint, fontSize: 16, fontWeight: "bold" },
  modalImage: { width: "100%", height: 300, borderRadius: 10, backgroundColor: "#000" },
});