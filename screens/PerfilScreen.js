import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { auth } from '../services/firebase-config';
import { signOut } from 'firebase/auth';
import { globalStyles, theme } from '../styles/theme';
import InformacaoPessoal from './InformacaoPessoal';
import Historico from './Historico';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function PerfilScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [activeComponent, setActiveComponent] = useState("Historico");

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser(currentUser);
            fetchUserData(currentUser.uid);
        }
    }, []);

    const toggleActiveComponent = () => {
        if (activeComponent === "Historico"){
            return <Historico />
        }
        else if (activeComponent === "InformacaoPessoal"){
            return <InformacaoPessoal />
        }
    }

    const fetchUserData = async (uid) => {
        try {
            const response = await fetch('https://volun-api-eight.vercel.app/usuarios/' + uid);
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Alert.alert('Logout', 'Você foi deslogado com sucesso.');
            navigation.replace('LoginScreen');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            Alert.alert('Erro', 'Não foi possível deslogar.');
        }
    };

    return (
        <View style={styles.container}>
            {user && (
                <>
                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.secondary]}
                        style={styles.headerGradient}
                    >
                        <View style={styles.profileComponent}>
                        <Image
                            source={{
                                uri: 'https://firebasestorage.googleapis.com/v0/b/volun-api.appspot.com/o/avatar.png?alt=media&token=1e4c52e5-4498-43cd-ba8c-41b4744662c3',
                            }}
                            style={styles.profileImage}
                        />

                            <View style={styles.textContainer}>
                                <Text style={styles.userName}>
                                    {user.displayName || `${userData?.nome} ${userData?.sobrenome}` || 'Usuário'}
                                </Text>
                                <Text style={styles.userEmail}>{user.email}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                    
                    <View style={styles.contentContainer}>
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <Ionicons name="log-out-outline" size={24} color="#FFF" />
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        </TouchableOpacity>

                        <View style={styles.componentContainer}>
                            <View style={styles.componentView}>
                                <TouchableOpacity 
                                    style={[styles.componentButton, activeComponent === "InformacaoPessoal" && styles.activeComponentButton]}
                                    onPress={() => setActiveComponent("InformacaoPessoal")}
                                >
                                    <Text style={[styles.componentText, activeComponent === "InformacaoPessoal" && styles.activeComponentText]}>Informação Pessoal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.componentButton, activeComponent === "Historico" && styles.activeComponentButton]}
                                    onPress={() => setActiveComponent("Historico")}
                                >
                                    <Text style={[styles.componentText, activeComponent === "Historico" && styles.activeComponentText]}>Histórico</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <ScrollView style={styles.componentScrollView}>
                        {toggleActiveComponent()}
                    </ScrollView>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    headerGradient: {
        paddingTop: 60,
        paddingBottom: 30,
    },
    profileComponent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#FFF',
    },
    textContainer: {
        marginLeft: 20,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    userEmail: {
        fontSize: 14,
        color: '#E0E0E0',
        marginTop: 5,
    },
    contentContainer: {
        padding: 20,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 20,
        elevation: 3,
    },
    logoutButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    componentContainer: {
        marginTop: 20,
    },
    componentView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    componentButton: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingVertical: 12,
        borderRadius: 20,
        marginHorizontal: 5,
        elevation: 2,
    },
    activeComponentButton: {
        backgroundColor: theme.colors.primary,
    },
    componentText: {
        color: '#333',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    activeComponentText: {
        color: '#FFF',
    },
    componentScrollView: {
        flex: 1,
        marginTop: 20,
    }
});