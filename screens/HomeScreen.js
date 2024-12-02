import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { auth } from '../services/firebase-config';
import { Ionicons } from '@expo/vector-icons';
import CategorySlider from '../componentes/CategorySlider';

export default function HomeScreen({ navigation }) {
    const [eventos, setEventos] = useState([]);
    const [featuredEventos, setFeaturedEventos] = useState([]);
    const [upcomingEventos, setUpcomingEventos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [groupedEventos, setGroupedEventos] = useState({});

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                console.log('Usuário desconectado');
                navigation.navigate('EntrarConta');
            })
            .catch(error => {
                console.error('Erro ao desconectar:', error);
            });
    };

    const handleSearch = () => {
        navigation.navigate('Pesquisar', { query: searchQuery });
    };

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const eventosResponse = await fetch('https://volun-api-eight.vercel.app/eventos');
                const eventosData = await eventosResponse.json();

                const enderecosResponse = await fetch('https://volun-api-eight.vercel.app/endereco');
                const enderecosData = await enderecosResponse.json();

                const eventosComEndereco = eventosData.map(evento => {
                    const endereco = enderecosData.find(e => e.evento_id === evento._id);
                    return { ...evento, endereco: endereco || {} };
                });

                setEventos(eventosComEndereco);

                // Set featured events (using the first 5 events if no 'featured' field exists)
                const featured = eventosComEndereco.filter(evento => evento.featured).slice(0, 5);
                setFeaturedEventos(featured.length > 0 ? featured : eventosComEndereco.slice(0, 5));

                // Set upcoming events (using the next 5 events if no 'date' field exists)
                const currentDate = new Date();
                const upcoming = eventosComEndereco
                    .filter(evento => new Date(evento.date) > currentDate)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 5);
                setUpcomingEventos(upcoming.length > 0 ? upcoming : eventosComEndereco.slice(5, 10));

                // Group eventos by category
                const grouped = eventosComEndereco.reduce((acc, evento) => {
                    const category = evento.categoria || 'Outros';
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(evento);
                    return acc;
                }, {});

                // Ensure each category has at least 3 events
                Object.keys(grouped).forEach(category => {
                    if (grouped[category].length < 3) {
                        const additionalEvents = eventosComEndereco
                            .filter(e => e.categoria !== category)
                            .slice(0, 3 - grouped[category].length);
                        grouped[category] = [...grouped[category], ...additionalEvents];
                    }
                });

                setGroupedEventos(grouped);
            } catch (error) {
                console.error('Erro ao carregar eventos e endereços:', error);
            }
        };

        fetchEventos();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar eventos..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                    <Ionicons name="search" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <Button title="Sair" onPress={handleLogout} />

            <ScrollView style={styles.scrollContainer}>
                {featuredEventos.length > 0 && (
                    <CategorySlider category="Eventos em Destaque" eventos={featuredEventos} />
                )}
                {upcomingEventos.length > 0 && (
                    <CategorySlider category="Próximos Eventos" eventos={upcomingEventos} />
                )}
                {Object.entries(groupedEventos).map(([category, categoryEventos]) => (
                    <CategorySlider key={category} category={category} eventos={categoryEventos} />
                ))}
                {Object.keys(groupedEventos).length === 0 && (
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: '#FFFFFF',
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    searchButton: {
        padding: 10,
    },
    scrollContainer: {
        flex: 1,
        marginTop: 20,
    },
    noEventosText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});

