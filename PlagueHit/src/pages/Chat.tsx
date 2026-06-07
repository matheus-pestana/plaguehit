import { Ionicons } from "@expo/vector-icons";
import { onValue, push, ref } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { auth, database } from "../services/firebaseConfig";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: number;
}

export default function Chat({ navigation }: any) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const styles = createStyles(theme);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [contextoAnalises, setContextoAnalises] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);

  const user = auth.currentUser;

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!user) return;

    // 1. CARREGAR HISTÓRICO DE MENSAGENS DO USUÁRIO
    const chatRef = ref(database, `chats/${user.uid}`);
    const unsubscribeChat = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Converte o objeto do Firebase em array e ordena por data/hora
        const loadedMessages: Message[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        })).sort((a, b) => a.timestamp - b.timestamp);
        
        setMessages(loadedMessages);
      } else {
        // Se for a primeira vez no chat, cria a mensagem de boas-vindas e salva no Firebase
        const initialMessage = {
          text: "Olá! Sou o assistente do PlagueHit. Analiso suas plantações e estou pronto para tirar suas dúvidas. Como posso ajudar hoje?",
          sender: "bot",
          timestamp: Date.now(),
        };
        push(chatRef, initialMessage);
      }
    });

    // 2. CARREGAR CONTEXTO DAS ÚLTIMAS ANÁLISES (Técnica RAG)
    const historicoRef = ref(database, "historico_analises");
    const unsubscribeHist = onValue(historicoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Pega apenas as 3 análises mais recentes para não sobrecarregar a memória da IA
        const ultimasAnalises = Object.values(data).slice(-3);
        setContextoAnalises(JSON.stringify(ultimasAnalises));
      }
    });

    return () => {
      unsubscribeChat();
      unsubscribeHist();
    };
  }, [user]);

  const sendMessage = async () => {
    if (inputText.trim() === "" || !user) return;

    const userMessage = {
      text: inputText,
      sender: "user",
      timestamp: Date.now(),
    };

    // Salva a mensagem do usuário no Firebase (a tela atualizará automaticamente via onValue)
    const chatRef = ref(database, `chats/${user.uid}`);
    await push(chatRef, userMessage);
    
    setInputText("");
    setLoading(true);

    try {
      // Formata as mensagens passadas para a IA entender o rumo da conversa
      const history = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      // Cria a instrução do sistema injetando dinamicamente os dados do Firebase
      const systemInstruction = `Você é um assistente virtual especialista em agricultura e monitoramento de pragas, integrado ao aplicativo PlagueHit. Responda de forma clara e técnica. 
      INFORMAÇÃO IMPORTANTE DE CONTEXTO: O usuário que você está ajudando teve as seguintes análises de plantas recentes capturadas pelo sistema (em formato JSON):
      ${contextoAnalises || "Nenhuma análise recente registrada no sistema."}
      Se o usuário perguntar sobre a saúde das plantas dele, explique o diagnóstico mais recente presente nesses dados e recomende ações preventivas ou de tratamento cabíveis.`;

      const apiMessages = [
        { role: "system", content: systemInstruction },
        ...history,
        { role: "user", content: userMessage.text },
      ];

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.EXPO_PUBLIC_AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha na API");
      }

      const data = await response.json();
      const botResponseText = data.choices[0].message.content;

      // Salva a resposta da Groq no Firebase
      const botMessage = {
        text: botResponseText,
        sender: "bot",
        timestamp: Date.now(),
      };
      await push(chatRef, botMessage);

    } catch (error) {
      console.error("Erro no Chatbot:", error);
      const errorMessage = {
        text: "Desculpe, tive um problema de conexão. Pode tentar novamente?",
        sender: "bot",
        timestamp: Date.now(),
      };
      await push(chatRef, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === "user";
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color={theme.tint} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ASSISTENTE IA</Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.tint} />
            <Text style={styles.loadingText}>Processando...</Text>
          </View>
        )}

        <View style={[styles.inputContainer, { paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom + 15, 15) : 25 }]}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua dúvida..."
            placeholderTextColor={theme.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
            <Ionicons name="send" size={20} color={theme.buttonText} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, paddingTop: 50, paddingBottom: 15, borderBottomWidth: 1, borderColor: theme.border },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: "900", color: theme.tint, letterSpacing: 2 },
  chatContainer: { flex: 1 },
  listContainer: { padding: 20, flexGrow: 1, justifyContent: "flex-end" },
  messageBubble: { maxWidth: "80%", padding: 15, borderRadius: 20, marginBottom: 15 },
  userBubble: { alignSelf: "flex-end", backgroundColor: theme.buttonBackground, borderBottomRightRadius: 5 },
  botBubble: { alignSelf: "flex-start", backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderBottomLeftRadius: 5 },
  messageText: { fontSize: 15, lineHeight: 22 },
  userText: { color: theme.buttonText, fontWeight: "600" },
  botText: { color: theme.text },
  inputContainer: { flexDirection: "row", padding: 15, borderTopWidth: 1, borderColor: theme.border, backgroundColor: theme.card, alignItems: "center" },
  input: { flex: 1, backgroundColor: theme.background, color: theme.text, borderRadius: 20, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12, maxHeight: 100, borderWidth: 1, borderColor: theme.border },
  sendButton: { backgroundColor: theme.buttonBackground, width: 45, height: 45, borderRadius: 25, justifyContent: "center", alignItems: "center", marginLeft: 10, borderWidth: theme.buttonBackground === '#1A1A1A' ? 1 : 0, borderColor: theme.border },
  loadingContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 25, paddingBottom: 10 },
  loadingText: { color: theme.textSecondary, fontSize: 12, marginLeft: 10, fontStyle: "italic" },
});