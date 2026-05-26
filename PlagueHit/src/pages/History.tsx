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
import { database } from "../services/firebaseConfig";

interface AnaliseIA {
  id: string;
  confianca: string;
  diagnostico: string;
  data_hora: string;
  url_imagem: string;
}

export default function History({ navigation }: any) {
  const [historico, setHistorico] = useState<AnaliseIA[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Referencia o nó que armazena todas as análises passadas
    const historicoRef = ref(database, "historico_analises");

    const unsubscribe = onValue(historicoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Converte o objeto de dicionários do Firebase em uma matriz estruturada
        const lista: AnaliseIA[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        
        // Inverte o array para posicionar os registros cronologicamente mais novos no topo
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
            color={isSaudavel ? "#39FF14" : "#FF3B30"}
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
            <Ionicons name="image-outline" size={16} color="#000" />
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
          <Ionicons name="arrow-back" size={26} color="#39FF14" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HISTÓRICO</Text>
        <View style={{ width: 26 }} /> 
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#39FF14" />
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

      {/* Visualizador de Imagens Antigas */}
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
                <Ionicons name="close" size={28} color="#FFF" />
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: "#111",
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: "900", color: "#39FF14", letterSpacing: 2 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContainer: { padding: 20, paddingBottom: 40 },
  noDataText: { color: "#444", fontSize: 14, fontWeight: "bold" },
  card: {
    backgroundColor: "#0A0A0A",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1A1A1A",
    padding: 20,
    marginBottom: 15,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cardTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  cardBody: { borderTopWidth: 1, borderTopColor: "#151515", paddingTop: 10, marginBottom: 15 },
  label: { color: "#555", fontSize: 13, marginBottom: 4 },
  value: { color: "#AAA", fontSize: 13 },
  viewImageButton: {
    flexDirection: "row",
    backgroundColor: "#39FF14",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  viewImageText: { color: "#000", fontWeight: "900", fontSize: 11, marginLeft: 6 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "90%", backgroundColor: "#111", borderRadius: 20, padding: 20, alignItems: "center", borderWidth: 1, borderColor: "#333" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 20 },
  modalTitle: { color: "#39FF14", fontSize: 16, fontWeight: "bold" },
  modalImage: { width: "100%", height: 300, borderRadius: 10, backgroundColor: "#000" },
});