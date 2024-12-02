import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Button, Modal } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import EventoCard from '../componentes/eventoCard';

export default function OrgScreen() {
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [eventos, setEventos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchOrganizations = async (userId) => {
            try {
                const response = await axios.get(`https://volun-api-eight.vercel.app/organizacao/criador/${userId}`);
                setOrganizations(response.data);
                if (response.data.length > 0) {
                    setSelectedOrg(response.data[0]); // Seleciona a primeira ONG por padrão
                }
            } catch (error) {
                console.error("Erro ao buscar organizações:", error);
            } finally {
                setLoading(false);
            }
        };

        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchOrganizations(user.uid);
            } else {
                console.error("Usuário não autenticado.");
                setLoading(false);
            }
        });
    }, []);

    useEffect(() => {
        const fetchEventos = async () => {
            if (selectedOrg) {
                try {
                    setEventos([]); // Limpa eventos antes de carregar
                    const response = await axios.get(`https://volun-api-eight.vercel.app/eventos/ong/${selectedOrg._id}`);
                    const eventosDetalhes = response.data.map((evento) => ({
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
                }
            } else {
                setEventos([]); // Limpa eventos se nenhuma organização for selecionada
            }
        };

        fetchEventos();
    }, [selectedOrg]);

    const handleDeleteEvento = async (id) => {
        try {
            await axios.delete(`https://volun-api-eight.vercel.app/eventos/${id}`);
            setEventos((prevEventos) => prevEventos.filter((evento) => evento.id !== id));
            console.log(`Evento ${id} deletado com sucesso.`);
        } catch (error) {
            console.error("Erro ao excluir evento:", error);
        }
    };

    const handleDeleteOrg = async () => {
        try {
            await axios.delete(`https://volun-api-eight.vercel.app/organizacao/${selectedOrg._id}`);
            navigation.goBack(); // Volta para a tela anterior
        } catch (error) {
            console.error("Erro ao excluir a organização:", error);
        }
    };

    if (loading) {
        return <Text>Carregando...</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.layout}>
                <Image source={{ uri: selectedOrg?.img_logo }} style={styles.ongPfp} />
                <Text style={styles.nomeOng}>{selectedOrg?.nome}</Text>
                <Text style={styles.infoOrg}>Fundado em: {selectedOrg?.createdAt ? new Date(selectedOrg.createdAt).toLocaleDateString() : 'Data indefinida'}</Text>
                <Text style={styles.infoOrg}>{selectedOrg?.razao_social}</Text>
                <TouchableOpacity style={styles.addEvent} onPress={() => navigation.navigate('CriarEvento', { orgId: selectedOrg?._id })}>
                    <Text style={styles.addEventText}>Criar Evento</Text>
                </TouchableOpacity>
            </View>

            {/* Sobre a ONG */}
            <View style={styles.layout}>
                <Text style={styles.titleDesc}>Sobre a ONG:</Text>
                <Text style={styles.textDesc}>{selectedOrg?.descricao}</Text>
            </View>

            {/* Eventos criados pela ONG */}
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
    layout: {
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center',
        padding: 15,
        margin: 10
    },
    ongBox: {

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
    addEvent: {
        backgroundColor: '#1f0171',
        borderRadius: 10,
        padding: 7,
        marginTop: 7
    },
    addEventText: {
        fontSize: 22,
        color: 'white'
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
    }
})