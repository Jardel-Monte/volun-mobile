import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function OrgScreen() {
    
    const navigation = useNavigation();

    const handleNavigate = () => {
        navigation.navigate('CriarEventos');
        console.log('navegar para página de criar ORG.');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Organização</Text>
            <Image
                    source={{ uri: 'https://i.pinimg.com/originals/43/3d/1a/433d1a68bd12261093efbf3c0be54ea2.gif' }}
                    style={styles.gif}
                    resizeMode="contain"
            />
            <Text style={styles.message}>
                Crie sua Organização sem fins lucrativos! gerencie ou organize
                seus próprios Eventos e interaja com a Comunidade já!
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleNavigate}>
                <Text style={styles.buttonText}>Criar evento</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',

        
        padding: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
        lineHeight: 24,
    },
    gif: {
        width: 100,
        height: 80,
        margin: 30,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});