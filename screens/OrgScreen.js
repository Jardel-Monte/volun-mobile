import {React, useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EventoCard from '../componentes/eventoCard';
import Sapo from '../assets/images/download.jpg';

export default function OrgScreen() {
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
        <ScrollView>
            <View style={styles.layout}>
                <Image source={Sapo} style={styles.ongPfp} />
                <Text style={styles.nomeOng}>Fanáticos por Sapos</Text>
                <Text style={styles.infoOrg}>Fundado em: 01/11/2024</Text>
                <Text style={styles.infoOrg}>Natureza</Text>
                <TouchableOpacity style={styles.addEvent}>
                    <Text style={styles.addEventText}>Criar Evento</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.layout}>
                <Text style={styles.titleDesc}>Sobre a ONG:</Text>
                <Text style={styles.textDesc}>Somos uma organização não governamental dedicada à pesquisa, estudo e preservação dos sapos e outros anfíbios, criaturas essenciais para o equilíbrio ambiental. Fundada por biólogos apaixonados pela natureza, a ONG busca conscientizar a sociedade sobre a importância desses animais na cadeia alimentar e no controle de pragas, além de atuar na proteção de seus habitats ameaçados pela ação humana.</Text>
            </View>

            <View style={styles.layout}>
                <Text style={styles.titleEvents}>Eventos criados:</Text>
                {!eventos.length > 0 ? ( // Deixei essa exclamação para exibir o texto invés de eventos, para exibir eventos retire a exclamação
                    eventos.map((evento) => {
                        return (
                            <EventoCard
                                key={evento._id}
                                evento={evento} // Passa o objeto evento completo
                            />
                        );
                    })
                ) : (
                    <Text style={styles.noEvents}>Nenhum evento disponível</Text>
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