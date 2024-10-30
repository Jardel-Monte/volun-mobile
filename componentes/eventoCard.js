import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function EventoCard({ evento }) {
    const navigation = useNavigation();

    if (!evento) {
        return null;
    }

    const { _id, titulo, imagem, endereco } = evento;

    return (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('EventoInfo', { eventoId: _id , endereco })}
        >
            <Image source={{ uri: imagem }} style={styles.imagemEvento} />
            <View style={styles.infoContainer}>
                <Text style={styles.localizacao}>
                    {endereco?.bairro} - {endereco?.cidade}, {endereco?.estado}
                </Text>
                <Text style={styles.titulo}>{titulo}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        marginHorizontal: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        elevation: 1,
        overflow: 'hidden',
    },
    imagemEvento: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    infoContainer: {
        padding: 10,
    },
    localizacao: {
        fontSize: 14,
        color: '#888',
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
});
