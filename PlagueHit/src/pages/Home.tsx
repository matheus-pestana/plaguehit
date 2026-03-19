import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, StatusBar, ImageBackground } from 'react-native';

export default function Home({ navigation }: any) {
  return (
    <ImageBackground 
      source={require('../assets/images/home.jpeg')} 
      style={styles.background}
      resizeMode="cover" 
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.conteudoCentral}>
          <Text style={styles.textoBemVindo}>Bem Vindo</Text>

          <Image 
            source={require('../assets/images/chip.png')} 
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
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.textoBotao}>Entrar</Text>
        </TouchableOpacity>

      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conteudoCentral: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  textoBemVindo: {
    fontSize: 32,
    color: '#F4F9F1',
    fontWeight: '500',
    marginBottom: 25,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 15,
  },
  tituloContainer: {
    flexDirection: 'row',
  },
  textoPlague: {
    fontSize: 34,
    color: '#1A2F1A',
    fontWeight: '900',
  },
  textoHit: {
    fontSize: 34,
    color: '#A6C995',
    fontWeight: 'bold',
  },
  botaoEntrar: {
    backgroundColor: '#d6e5d0',
    paddingVertical: 12,
    paddingHorizontal: 45,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#1A2F1A',
    marginBottom: 200, 
  },
  textoBotao: {
    fontSize: 18,
    color: '#1A2F1A',
    fontWeight: '600',
  },
});