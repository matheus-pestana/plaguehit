import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Dashboard() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerSubtitle}>BECON</Text>
                        <Text style={styles.headerTitle}>DASHBOARD</Text>
                    </View>
                </View>


                <View style={styles.content}>

                    <View style={styles.cardContainer}>
                        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
                            <Text style={styles.sectionTitle}>Índice de saúde do solo</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infos}>
                        <TouchableOpacity style={styles.infosCard} activeOpacity={0.7}>
                            <Text style={styles.sectionTitle}>Última análise</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.infosCard} activeOpacity={0.7}>
                            <Text style={styles.sectionTitle}>Nível de umidade</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.pragas}>
                        <TouchableOpacity style={styles.pragasCard} activeOpacity={0.7}>
                            <Text style={styles.sectionTitle}>Pragas detectadas</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.bottomNav}>
                    <TouchableOpacity style={styles.navItem}>
                        <Ionicons name="home-outline" size={28} color="#00FF00" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem}>
                        <Ionicons name="search-outline" size={28} color="#555" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem}>
                        <Ionicons name="person-outline" size={28} color="#555" />
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#CBEEB8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 15,
    },
    headerSubtitle: {
        color: '#00FF00',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 2,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    headerIconContainer: {
        width: 45,
        height: 45,
        borderRadius: 8,
        backgroundColor: '#111111',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#222222',
    },
    separator: {
        height: 1,
        backgroundColor: '#1A1A1A',
        width: '100%',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'space-around',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 30,
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    card: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 15,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    infos: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    infosCard: {
        width: '40%',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 15,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },

    pragas: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    pragasCard: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 15,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },

    iconWrapper: {
        marginBottom: 20,
    },
    cardText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },

    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    }
});