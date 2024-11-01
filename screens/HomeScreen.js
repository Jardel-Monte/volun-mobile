import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { auth } from '../services/firebase-config';
import EventoCard from '../componentes/eventoCard'; // Certifique-se de que o caminho está correto

export default function HomeScreen({ navigation }) {
    const [eventos, setEventos] = useState([]);

    // Função para fazer logout
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

    // Função para buscar os eventos e endereços
    useEffect(() => {
        const fetchEventos = async () => {
            try {
                // Busca de eventos
                const eventosResponse = await fetch('https://volun-api-eight.vercel.app/eventos');
                const eventosData = await eventosResponse.json();

                // Busca de endereços
                const enderecosResponse = await fetch('https://volun-api-eight.vercel.app/endereco');
                const enderecosData = await enderecosResponse.json();

                // Relacionar eventos com endereços
                const eventosComEndereco = eventosData.map(evento => {
                    const endereco = enderecosData.find(e => e.evento_id === evento._id);
                    return { ...evento, endereco: endereco || {} }; // Define um objeto vazio se não houver endereço
                });

                setEventos(eventosComEndereco);
            } catch (error) {
                console.error('Erro ao carregar eventos e endereços:', error);
            }
        };

        fetchEventos();
    }, []);

    return (
        <View style={styles.container}>
            <Button title="Sair" onPress={handleLogout} />

            <ScrollView style={styles.scrollContainer}>
                {eventos.length > 0 ? (
                    eventos.map((evento) => {
                        return (
                            <EventoCard
                                key={evento._id}
                                evento={evento} // Passa o objeto evento completo
                            />
                        );
                    })
                ) : (
                    <Text style={styles.noEventosText}>Nenhum evento disponível no momento.</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFE',
    },
    scrollContainer: {
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 15,
    },
    welcomeText: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 20,
    },
    noEventosText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});
