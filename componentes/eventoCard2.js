import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ErrorPage from './ErrorPage';

const { width } = Dimensions.get('window');

export default function EventoCardFullWidth({ evento }) {
    const navigation = useNavigation();
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!evento) {
            setError("Não foi possível carregar as informações do evento.");
            return;
        }

        if (!evento.objectID) {
            setError("ID do evento não encontrado.");
            return;
        }
    }, [evento]);

    if (error) {
        return <ErrorPage/>;
    }

    const { objectID: eventId, titulo, imagem, endereco, dataInicio } = evento;

    const handlePress = () => {
        navigation.navigate('EventoInfo', { eventoId: eventId });
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={handlePress}
            activeOpacity={0.9}
        >
            <Image
                source={{ uri: imagem || 'https://via.placeholder.com/150' }}
                style={styles.imagemEvento}
            />
            <View style={styles.overlay} />
            <View style={styles.infoContainer}>
                <Text style={styles.titulo} numberOfLines={2}>
                    {titulo || 'Título não disponível'}
                </Text>
                <View style={styles.detailsContainer}>
                    {endereco && (
                        <View style={styles.locationContainer}>
                            <Text style={styles.icon}>📍</Text>
                            <Text style={styles.localizacao} numberOfLines={1}>
                                {endereco.bairro || 'Bairro'} - {endereco.cidade || 'Cidade'}, {endereco.estado || 'Estado'}
                            </Text>
                        </View>
                    )}
                    {dataInicio && (
                        <View style={styles.dateContainer}>
                            <Text style={styles.icon}>📅</Text>
                            <Text style={styles.data}>
                                {new Date(dataInicio).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                })}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        height: 250,
        borderRadius: 16,
        marginBottom: 16,
        marginHorizontal: 16,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imagemEvento: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 16,
    },
    infoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        fontSize: 14,
        marginRight: 4,
    },
    localizacao: {
        fontSize: 14,
        color: '#fff',
    },
    data: {
        fontSize: 14,
        color: '#fff',
    },
});

