import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { auth } from '../services/firebase-config'; // Importar Firebase config
import { signOut } from 'firebase/auth'; // Para função de logout
import { theme } from '../styles/theme'; // Importar seu tema global

import InformacaoPessoal from './InformacaoPessoal';
import Historico from './Historico';

export default function PerfilScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null); // Estado para armazenar dados da API
    const [activeComponent, setActiveComponent] = useState("Historico");

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser(currentUser); // Definir o usuário autenticado no estado
            fetchUserData(currentUser.uid); // Buscar dados da API usando o UID
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

    // Função para buscar dados do usuário pela API
    const fetchUserData = async (uid) => {
        try {
            const response = await fetch('https://volun-api-eight.vercel.app/usuarios/' + uid);
            const data = await response.json();
            setUserData(data); // Armazenar os dados retornados da API
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth); // Fazer logout
            Alert.alert('Logout', 'Você foi deslogado com sucesso.');
            navigation.replace('LoginScreen'); // Navegar de volta para a tela de login
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            Alert.alert('Erro', 'Não foi possível deslogar.');
        }
    };

    return (
        <View style={styles.container}>
            {user && (
                <>
                    <Image
                        source={{ uri: user.photoURL || require('../assets/images/photo-perfil.png') }} // Caso não tenha uma imagem, será usado um placeholder
                        style={styles.profileImage}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.userName}>
                            {user.displayName || `${userData?.nome} ${userData?.sobrenome}` || 'Usuário'}
                        </Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                    <View>
                        <View>
                            <TouchableOpacity onPress={() => setActiveComponent("InformacaoPessoal")}>
                                <Text>Informação Pessoal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveComponent("Historico")}>
                                <Text>Histórico</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {toggleActiveComponent()}
                        </ScrollView>
                    </View>
                    
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFE',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    textContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 20,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    userEmail: {
        fontSize: 14,
        color: 'gray',
        marginTop: 5,
    },
    logoutButton: {
        marginTop: 40,
        backgroundColor: theme.colors.primary, // Cor primária do seu tema
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    logoutButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

