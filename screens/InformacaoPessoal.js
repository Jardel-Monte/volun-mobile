import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import DadosPessoal from "./DadosPessoal";
import DadosEndereco from "./DadosEndereco";
import { theme } from "../styles/theme";

export default function InformacaoPessoal() {
    const [editable, setEditable] = useState(false);
    const [activeComponent, setActiveComponent] = useState("DadosPessoal");
    const [userData, setUserData] = useState({
        nome: "",
        sobrenome: "",
        cpf: "",
        data_nascimento: "",
        ddd: "",
        telefone: "",
        email: "",
    });
    const [userAddress, setUserAddress] = useState({
        cep: "",
        logradouro: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toggleEditable = () => {
        setEditable(!editable);
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        setError(null);

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setError("Usuário não autenticado.");
            setLoading(false);
            return;
        }

        const uid = user.uid;
        try {
            if (activeComponent === "DadosPessoal") {
                const updatedUserData = {
                    nome: userData.nome.trim(),
                    sobrenome: userData.sobrenome.trim(),
                    cpf: userData.cpf,
                    data_nascimento: formatarDataISO(userData.data_nascimento),
                    ddd: userData.ddd,
                    telefone: userData.telefone,
                };

                await axios.put(`https://volun-api-eight.vercel.app/usuarios/${uid}`, updatedUserData);
            } else if (activeComponent === "DadosEndereço") {
                const updatedAddressData = {
                    cep: userAddress.cep,
                    logradouro: userAddress.logradouro,
                    numero: userAddress.numero,
                    bairro: userAddress.bairro,
                    cidade: userAddress.cidade,
                    estado: userAddress.estado,
                };

                await axios.put(`https://volun-api-eight.vercel.app/enderecos/${uid}`, updatedAddressData);
            }

            setEditable(false);
        } catch (error) {
            setError("Erro ao salvar alterações.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelChanges = () => {
        setEditable(false);
    };

    const renderActiveComponent = () => {
        if (activeComponent === "DadosPessoal") {
            return <DadosPessoal userData={userData} setUserData={setUserData} editable={editable} />;
        } else if (activeComponent === "DadosEndereço") {
            return <DadosEndereco userAddress={userAddress} setUserAddress={setUserAddress} editable={editable} />;
        }
        return null;
    };

    const formatarDataISO = (date) => {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            throw new Error("Data inválida.");
        }
        const day = dateObj.getUTCDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;
        return `${formattedDay}/${formattedMonth}/${year}`;
    }

    const handleFormUser = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setError("Usuário não autenticado.");
            return;
        }

        const uid = user.uid;
        setLoading(true);

        try {
            const response = await axios.get(`https://volun-api-eight.vercel.app/usuarios/${uid}`);
            const responseData = formatarDataISO(response.data.data_nascimento);
            setUserData({ ...response.data, dataNasc : responseData, email: user.email });

            const enderecoResponse = await axios.get(`https://volun-api-eight.vercel.app/endereco/usuario/${uid}`);
            if (enderecoResponse.data && enderecoResponse.data.length > 0) {
                const endereco = enderecoResponse.data[0];
                setUserAddress({
                    cep: endereco.cep || "",
                    logradouro: endereco.logradouro || "",
                    numero: endereco.numero || "",
                    bairro: endereco.bairro || "",
                    cidade: endereco.cidade || "",
                    estado: endereco.estado || "",
                });
            }
        } catch (error) {
            setError("Erro ao buscar dados do usuário.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        handleFormUser();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeComponent === "DadosPessoal" && styles.activeTab]}
                    onPress={() => setActiveComponent("DadosPessoal")}
                >
                    <Text style={[styles.tabText, activeComponent === "DadosPessoal" && styles.activeTabText]}>Dados Pessoais</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeComponent === "DadosEndereço" && styles.activeTab]}
                    onPress={() => setActiveComponent("DadosEndereço")}
                >
                    <Text style={[styles.tabText, activeComponent === "DadosEndereço" && styles.activeTabText]}>Endereço</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.componentScrollView}>
                {renderActiveComponent()}
            </ScrollView>

            <View style={styles.buttonContainer}>
                {editable ? (
                    <>
                        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
                            <LinearGradient
                                colors={[theme.colors.primary, theme.colors.secondary]}
                                style={styles.buttonGradient}
                            >
                                <Ionicons name="save-outline" size={20} color="#FFF" />
                                <Text style={styles.buttonText}>Salvar</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleCancelChanges}>
                            <LinearGradient
                                colors={[theme.colors.error, theme.colors.errorDark]}
                                style={styles.buttonGradient}
                            >
                                <Ionicons name="close-outline" size={20} color="#FFF" />
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={toggleEditable}>
                        <LinearGradient
                            colors={[theme.colors.primary, theme.colors.secondary]}
                            style={styles.buttonGradient}
                        >
                            <Ionicons name="create-outline" size={20} color="#FFF" />
                            <Text style={styles.buttonText}>Editar</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#FFF',
        borderRadius: 25,
        elevation: 2,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: theme.colors.primary,
        borderRadius: 25,
    },
    tabText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    activeTabText: {
        color: '#FFF',
    },
    componentScrollView: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 25,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    errorText: {
        color: theme.colors.error,
        textAlign: 'center',
        marginTop: 16,
    },
});

