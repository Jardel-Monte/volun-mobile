import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../services/firebase-config';

export default function HomeScreen({ navigation }) {
    const handleLogout = () => {
            auth.signOut()
            .then(() => {
                console.log('Usuário desconectado');
                navigation.navigate('EntrarConta'); // Redireciona para a tela de login
            })
            .catch(error => {
                console.error('Erro ao desconectar:', error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Bem-vindo à Home Screen!</Text>
            <Button title="Sair" onPress={handleLogout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FBFBFE',
    },
    welcomeText: {
        fontSize: 24,
        marginBottom: 20,
    },
});
