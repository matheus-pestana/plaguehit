import React from "react";
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

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

const styles = StyleSheet.create({

  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#6C9953",
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
    color: "#F4F9F1",
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
    color: "#1A2F1A",
    fontWeight: "900",
  },

  textoHit: {
    fontSize: 34,
    color: "#A6C995",
    fontWeight: "bold",
  },
  
  botaoEntrar: {
    backgroundColor: "#d6e5d0",
    paddingVertical: 12,
    paddingHorizontal: 45,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#1A2F1A",
    marginBottom: 200,
  },

  textoBotao: {
    fontSize: 18,
    color: "#1A2F1A",
    fontWeight: "600",
  },

});