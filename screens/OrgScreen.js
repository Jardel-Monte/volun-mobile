import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import EventoCard from '../componentes/eventoCard';

export default function OrgScreen() {
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [eventos, setEventos] = useState([]);
    const navigation = useNavigation();

    const fetchOrganizations = async (userId) => {
        try {
            const response = await fetch(`https://volun-api-eight.vercel.app/organizacao/criador/${userId}`);
            const data = await response.json();
            setOrganizations(data);
            if (data.length > 0) {
                setSelectedOrg(data[0]); // Seleciona a primeira ONG por padrão
            } else {
                setSelectedOrg(null);
            }
        } catch (error) {
            console.error("Erro ao buscar organizações:", error);
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
                    setEventos([]); // Limpa eventos antes de carregar
                    const response = await fetch(`https://volun-api-eight.vercel.app/eventos/ong/${selectedOrg._id}`);
                    const responseText = await response.text();
                    console.log('Raw API response:', responseText);

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    let data;
                    try {
                        data = JSON.parse(responseText);
                    } catch (parseError) {
                        console.error('Error parsing JSON:', parseError);
                        console.error('Response that caused the error:', responseText);
                        throw new Error('Invalid JSON response from server');
                    }

                    const eventosDetalhes = data.map((evento) => ({
                        id: evento._id,
                        titulo: evento.titulo,
                        descricao: evento.descricao,
                        ongNome: selectedOrg.nome,
                        dataInicio: evento.data_inicio,
                        imgUrl: evento.imagem,
                        vagaLimite: evento.vaga_limite,
                        endereco: evento.endereco_id
                            ? `${evento.endereco_id.bairro}, ${evento.endereco_id.cidade} - ${evento.endereco_id.estado}`
                            : "Endereço Indefinido",
                    }));
                    setEventos(eventosDetalhes);
                } catch (error) {
                    console.error("Erro ao buscar eventos:", error);
                    Alert.alert("Erro", "Não foi possível carregar os eventos. Por favor, tente novamente mais tarde.");
                } finally {
                    setLoading(false);
                }
            } else {
                setEventos([]); // Limpa eventos se nenhuma organização for selecionada
            }
        };

        fetchEventos();
    }, [selectedOrg]);

    const handleDeleteEvento = async (id) => {
        try {
            await fetch(`https://volun-api-eight.vercel.app/eventos/${id}`, { method: 'DELETE' });
            setEventos((prevEventos) => prevEventos.filter((evento) => evento.id !== id));
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
                                fetchOrganizations(user.uid);
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
                {eventos.length > 0 ? (
                    <View style={styles.eventCards}>
                        {eventos.map((evento) => (
                            <EventoCard
                                key={evento.id}
                                evento={evento}
                                onDelete={() => handleDeleteEvento(evento.id)}
                            />
                        ))}
                    </View>
                ) : (
                    <Text style={styles.noEvents}>Não há eventos para mostrar.</Text>
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
        padding: 10,
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
});

