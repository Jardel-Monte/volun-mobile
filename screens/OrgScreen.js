import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
import EventoCard from '../componentes/eventoCard';

export default function OrgScreen() {
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [eventos, setEventos] = useState([]);
    const [categorizedEvents, setCategorizedEvents] = useState({
        upcoming: [],
        ongoing: [],
        past: [],
    });
    const [activeTab, setActiveTab] = useState('upcoming');
    const navigation = useNavigation();
    const isFocused = useIsFocused();


    const fetchOrganizations = async (userId) => {
        try {
            const response = await fetch(`https://volun-api-eight.vercel.app/organizacao/criador/${userId}`);
            const data = await response.json();
            setOrganizations(data);
            if (data.length > 0) {
                setSelectedOrg(data[0]);
            } else {
                setSelectedOrg(null);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const auth = getAuth();
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    fetchOrganizations(user.uid);
                } else {
                    console.error("Usuário não autenticado.");
                    setLoading(false);
                }
            });

            return () => unsubscribe();
        }, [])
    );

    useEffect(() => {
        const fetchEventos = async () => {
            if (selectedOrg) {
                setLoading(true);
                try {
                    const response = await fetch(`https://volun-api-eight.vercel.app/eventos/ong/${selectedOrg._id}`);
                    const data = await response.json();
                    const eventosDetalhes = data.map((evento) => ({
                        _id: evento._id,
                        titulo: evento.titulo,
                        descricao: evento.descricao,
                        ongNome: selectedOrg.nome,
                        dataInicio: evento.data_inicio,
                        dataFim: evento.data_fim,
                        imagem: evento.imagem,
                        vagaLimite: evento.vaga_limite,
                        endereco_id: evento.endereco_id,
                    }));
                    setEventos(eventosDetalhes);
                    categorizeEvents(eventosDetalhes);
                } catch (error) {
                    
                } finally {
                    setLoading(false);
                }
            } else {
                setEventos([]);
                setCategorizedEvents({ upcoming: [], ongoing: [], past: [] });
            }
        };

        fetchEventos();
    }, [selectedOrg]);

    const categorizeEvents = (events) => {
        const now = new Date();
        const categorized = {
            upcoming: [],
            ongoing: [],
            past: [],
        };

        events.forEach((event) => {
            const startDate = new Date(event.dataInicio);
            const endDate = new Date(event.dataFim);

            if (startDate > now) {
                categorized.upcoming.push(event);
            } else if (startDate <= now && endDate >= now) {
                categorized.ongoing.push(event);
            } else {
                categorized.past.push(event);
            }
        });

        setCategorizedEvents(categorized);
    };

    const handleDeleteEvento = async (id) => {
        try {
            await fetch(`https://volun-api-eight.vercel.app/eventos/${id}`, { method: 'DELETE' });
            setEventos((prevEventos) => prevEventos.filter((evento) => evento._id !== id));
            console.log(`Evento ${id} deletado com sucesso.`);
        } catch (error) {
            console.error("Erro ao excluir evento:", error);
        }
    };

    const handleDeleteOrg = async () => {
    Alert.alert(
        "Confirmar exclusão",
        "Tem certeza que deseja excluir esta organização?",
        [
            {
                text: "Cancelar",
                style: "cancel"
            },
            {
                text: "Sim",
                onPress: async () => {
                    try {
                        await fetch(`https://volun-api-eight.vercel.app/organizacao/${selectedOrg._id}`, { method: 'DELETE' });

                        const auth = getAuth();
                        const user = auth.currentUser;

                        if (user) {
                            const updatedOrganizations = await fetchOrganizations(user.uid) || []; // Garante um array mesmo se undefined
                            
                            // Verifica se há organizações restantes
                            if (updatedOrganizations.length === 0) {
                                navigation.replace('HomeScreen'); // Recarrega a tela com mensagem padrão
                            }
                        }
                    } catch (error) {
                        console.error("Erro ao excluir a organização:", error);
                    }
                }
            }
        ]
    );
};

    

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1F0171" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    if (organizations.length === 0) {
        return (
            <View style={styles.noOrgContainer}>
                <Text style={styles.noOrgText}>Você ainda não possui nenhuma organização.</Text>
                <TouchableOpacity 
                    style={styles.createOrgButton} 
                    onPress={() => navigation.navigate('CriarORG')}
                >
                    <Text style={styles.createOrgButtonText}>Criar Organização</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Picker
                    selectedValue={selectedOrg?._id}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                        const org = organizations.find(org => org._id === itemValue);
                        setSelectedOrg(org);
                    }}
                >
                    {organizations.map((org) => (
                        <Picker.Item key={org._id} label={org.nome} value={org._id} />
                    ))}
                </Picker>
                <TouchableOpacity 
                    style={styles.createOrgButton} 
                    onPress={() => navigation.navigate('CriarORG')}
                >
                    <Text style={styles.createOrgButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.layout}>
                <Image source={{ uri: selectedOrg?.img_logo }} style={styles.ongPfp} />
                <Text style={styles.nomeOng}>{selectedOrg?.nome}</Text>
                <Text style={styles.infoOrg}>Fundado em: {selectedOrg?.createdAt ? new Date(selectedOrg.createdAt).toLocaleDateString() : 'Data indefinida'}</Text>
                <Text style={styles.infoOrg}>{selectedOrg?.razao_social}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.addEvent} onPress={() => navigation.navigate('CriarEventos', { orgId: selectedOrg?._id })}>
                        <Text style={styles.buttonText}>Criar Evento</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteOrg} onPress={handleDeleteOrg}>
                        <Text style={styles.buttonText}>Excluir Organização</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.layout}>
                <Text style={styles.titleDesc}>Sobre a ONG:</Text>
                <Text style={styles.textDesc}>{selectedOrg?.descricao}</Text>
            </View>

            <View style={styles.layout}>
                <Text style={styles.titleEvents}>Eventos criados:</Text>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
                        onPress={() => setActiveTab('upcoming')}
                    >
                        <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Próximos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'ongoing' && styles.activeTab]}
                        onPress={() => setActiveTab('ongoing')}
                    >
                        <Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>Em andamento</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'past' && styles.activeTab]}
                        onPress={() => setActiveTab('past')}
                    >
                        <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>Passados</Text>
                    </TouchableOpacity>
                </View>
                {categorizedEvents[activeTab].length > 0 ? (
                    <View style={styles.eventCards}>
                        {categorizedEvents[activeTab].map((evento) => (
                            <EventoCard
                                key={evento._id}
                                evento={evento}
                                onDelete={() => handleDeleteEvento(evento._id)}
                            />
                        ))}
                    </View>
                ) : (
                    <Text style={styles.noEvents}>Não há eventos para mostrar nesta categoria.</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    picker: {
        flex: 1,
        height: 50,
        marginRight: 10,
    },
    layout: {
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center',
        padding: 15,
        margin: 10
    },
    ongPfp: {
        width: 150,
        height: 150,
        borderRadius: 100,
    },
    nomeOng: {
        fontSize: 33,
        color: '#1F0171',
        fontWeight: 'bold'
    },
    infoOrg: {
        fontSize: 23,
        color: '#1F0171',
        fontWeight: 'bold'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    addEvent: {
        backgroundColor: '#1f0171',
        borderRadius: 10,
        padding: 20,
        flex: 1,
        marginRight: 5,
    },
    deleteOrg: {
        backgroundColor: '#FF0000',
        borderRadius: 10,
        padding: 10,
        flex: 1,
        marginLeft: 5,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
    titleDesc: {
        fontSize: 23,
        color: "#1f0171",
        fontWeight: 'bold'
    },
    textDesc: {
        fontSize: 20,
        color: "#1f0171",
        textAlign: "justify"
    },
    titleEvents: {
        fontSize: 23,
        color: "#1f0171",
        fontWeight: 'bold'
    },
    noEvents: {
        fontSize: 19,
        color: "#1f0171",
        padding: 20
    },
    noOrgContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noOrgText: {
        fontSize: 18,
        color: '#1F0171',
        textAlign: 'center',
        marginBottom: 20,
    },
    createOrgButton: {
        backgroundColor: '#1f0171',
        borderRadius: 10,
        padding: 15,
    },
    createOrgButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#1F0171',
    },
    eventCards: {
        width: '100%',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    tab: {
        flex: 1,
        padding: 5,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#f0f0f0',
    },
    activeTab: {
        borderBottomColor: '#1F0171',
    },
    tabText: {
        color: '#888',
        fontSize: 14,
    },
    activeTabText: {
        color: '#1F0171',
        fontWeight: 'bold',
    },
});


