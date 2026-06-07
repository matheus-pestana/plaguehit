import React from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";

export default function Home({ navigation }: any) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.imagensTop}>
          <Image
            style={{ opacity: 0.5 }}
            source={require("../assets/images/circuit3.png")}
          />
          <Image source={require("../assets/images/vine.png")} />
        </View>
        <View style={styles.conteudoCentral}>
          <Text style={styles.textoBemVindo}>Bem Vindo</Text>

          <Image
            source={require("../assets/images/chip.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.tituloContainer}>
            <Text style={styles.textoPlague}>PLAGUE</Text>
            <Text style={styles.textoHit}>HIT</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.botaoEntrar}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.textoBotao}>Entrar</Text>
        </TouchableOpacity>
        <View style={styles.imagensBottom}>
          <Image source={require("../assets/images/vine2.png")} />
          <Image
            style={{ opacity: 0.5 }}
            source={require("../assets/images/circuit1.png")}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.backgroundPrimary,
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  conteudoCentral: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  imagensTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imagensBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  textoBemVindo: {
    fontSize: 38,
    color: theme.textOnPrimary,
    fontWeight: "500",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  tituloContainer: {
    flexDirection: "row",
  },
  textoPlague: {
    fontSize: 34,
    color: theme.text,
    fontWeight: "900",
  },
  textoHit: {
    fontSize: 34,
    color: theme.tint,
    fontWeight: "bold",
  },
  botaoEntrar: {
    backgroundColor: theme.card,
    paddingVertical: 12,
    paddingHorizontal: 45,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: theme.border,
    marginBottom: 200,
  },
  textoBotao: {
    fontSize: 18,
    color: theme.text,
    fontWeight: "600",
  },
});