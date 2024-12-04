import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import axios from "axios";
import { getAuth } from "firebase/auth";

import DadosPessoal from "./DadosPessoal";
import DadosEndereco from "./DadosEndereco";
import { globalStyles, theme } from "../styles/theme";

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
    const [error, setError] = useState(false);

    const toggleEditable = () => {
        setEditable(!editable);
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        setError(false);

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
        // Verifica se a data é válida
        if (isNaN(dateObj.getTime())) {
            throw new Error("Data inválida.");
        }
        const day = dateObj.getUTCDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        // Adiciona zero à esquerda para dia e mês, se necessário
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
            <ScrollView style={styles.componentScrollView}>
                {renderActiveComponent()}
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonContent} onPress={() => setActiveComponent("DadosPessoal")}>
                    <Text style={styles.buttonTextContent}>Dados Pessoais</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContent} onPress={() => setActiveComponent("DadosEndereço")}>
                    <Text style={styles.buttonTextContent}>Endereço</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.generateButtonContainer}>
                {editable ? (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonContent} onPress={handleSaveChanges}>
                            <Text style={styles.buttonTextContent}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonContent} onPress={handleCancelChanges}>
                            <Text style={styles.buttonTextContent}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.buttonContent} onPress={toggleEditable}>
                        <Text style={styles.buttonTextContent}>Editar</Text> 
                    </TouchableOpacity>
                )}
            </View>
            {loading && <Text>Carregando...</Text>}
            {error && <Text>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 'auto',
        height: 'auto',
        paddingBottom: 100,
    },
    componentScrollView: {
        height: 'auto',
    },
    generateButtonContainer: {
        marginVertical: 10,
        marginHorizontal: 'auto',
        display: 'flex',
        flexDirection: 'row',
    },
    buttonContainer: {
        margin: 'auto',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 10,
    },
    buttonContent: {
        backgroundColor: theme.colors.primary,
        width: 100,
        paddingVertical: 12,
        marginHorizontal: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonTextContent: {
        color: theme.colors.white,
        textAlign: 'center',
    }
})