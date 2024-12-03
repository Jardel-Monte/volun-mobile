import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function EventoCard({ evento }) {
    const navigation = useNavigation();

    if (!evento) {
        return null;
    }

    const eventId = evento._id ;
    const {titulo, imagem, endereco_id, data_inicio } = evento;

    const handlePress = () => {
        console.log('ID do evento:', eventId); // Log para confirmar que o ID está correto

        if (eventId) {
            navigation.navigate('EventoInfo', { eventoId: eventId });
        } else {
            console.error('Missing id for navigation');
        }
    };
    

    return (
        <TouchableOpacity 
            style={styles.card}
            onPress={handlePress}
        >
            <Image 
                source={{ uri: imagem || 'https://via.placeholder.com/150' }} 
                style={styles.imagemEvento} 
            />
            <View style={styles.infoContainer}>
                <Text style={styles.localizacao}>
                    {endereco_id?.bairro || 'Bairro não informado'} - {endereco_id?.cidade || 'Cidade não informada'}, {endereco_id?.estado || 'Estado não informado'}
                </Text>
                <Text style={styles.titulo}>{titulo || 'Título não disponível'}</Text>
                {data_inicio && (
                    <Text style={styles.data}>
                        {new Date(data_inicio).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })}
                    </Text>
                )}
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
    data: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
});

