import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { globalStyles, theme } from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function InfoForm({ route, navigation }) {
    const { uid } = route.params;  // Pegando o UID vindo da rota
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [ddd, setDdd] = useState('');
    const [telefone, setTelefone] = useState('');

    // Função para formatar a data com "/" ao digitar
    const handleDataNascimentoChange = (text) => {
        const cleaned = text.replace(/[^\d]/g, '');
        let formatted = cleaned;

        if (cleaned.length >= 5) {
            formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
        } else if (cleaned.length >= 3) {
            formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        }

        setDataNascimento(formatted);
    };

    // Função para formatar o CPF com pontos e traço
    const handleCpfChange = (text) => {
        const cleaned = text.replace(/[^\d]/g, '');
        let formatted = '';

        if (cleaned.length > 9) {
            formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
        } else if (cleaned.length > 6) {
            formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}`;
        } else if (cleaned.length > 3) {
            formatted = `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}`;
        } else {
            formatted = cleaned;
        }

        setCpf(formatted);
    };

    // Função para formatar telefone e DDD
    const handleTelefoneChange = (text) => {
        const cleaned = text.replace(/[^\d]/g, '');
        let formatted = cleaned;

        if (cleaned.length >= 11) {
            setDdd(cleaned.slice(0, 2)); // Atualiza o DDD
            formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
        } else if (cleaned.length === 10) {
            setDdd(cleaned.slice(0, 2)); // Atualiza o DDD
            formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
        } else if (cleaned.length > 2) {
            formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        } else if (cleaned.length > 0) {
            formatted = `(${cleaned}`;
        }

        setTelefone(formatted);
    };

    const formatarDataParaEnvio = (data) => {
        const partes = data.split('/');
        if (partes.length === 3) {
            const [dia, mes, ano] = partes;
            return `${ano}-${mes}-${dia}`;
        }
        return data;
    };

    const validarCpf = (cpf) => {
        const cleaned = cpf.replace(/[^\d]/g, '');

        if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) {
            return false;
        }

        const calcularDigito = (cpf, pesoInicial) => {
            let soma = 0;
            let peso = pesoInicial;

            for (let i = 0; i < cpf.length; i++) {
                soma += parseInt(cpf[i]) * peso;
                peso--;
            }

            const resto = soma % 11;
            return resto < 2 ? 0 : 11 - resto;
        };

        const primeiroDigito = calcularDigito(cleaned.slice(0, 9), 10);
        const segundoDigito = calcularDigito(cleaned.slice(0, 10), 11);

        return cleaned[9] == primeiroDigito && cleaned[10] == segundoDigito;
    };

    const handleSubmitInfo = async () => {
        const dataFormatada = formatarDataParaEnvio(dataNascimento);

        const userInfo = {
            nome: nome,
            sobrenome: sobrenome,
            cpf: cpf,
            data_nascimento: dataFormatada,
            telefone: telefone.slice(5), // Remove o DDD e mantém apenas o número
            ddd: ddd, // Envia o DDD separado
        };

        for (const key in userInfo) {
            if (userInfo[key] === undefined || userInfo[key] === '') {
                console.error(`Campo ${key} não pode ser vazio ou indefinido.`);
                return;
            }
        }

        if (!validarCpf(cpf)) {
            console.error("CPF inválido.");
            return;
        }

        try {
            const response = await fetch('https://volun-api-eight.vercel.app/usuarios/' + uid + '/info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInfo),
            });

            const data = await response.json();
            console.log("Informações salvas com sucesso:", data);

            const firstLogin = await AsyncStorage.getItem('firstLogin');
            if (firstLogin === null || firstLogin === 'false') {
                await AsyncStorage.setItem('firstLogin', 'true');
                console.log('Navegando para BemVindo');
                navigation.navigate('BemVindo');
            } else {
                console.log('Navegando para HomeScreen');
                navigation.navigate('HomeScreen');
            }
        } catch (error) {
            console.error("Erro ao salvar informações:", error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={[styles.titulo, globalStyles.textBold]}>Insira os dados pessoais</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Nome"
                    autoCapitalize='words'
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={sobrenome}
                    onChangeText={setSobrenome}
                    placeholder="Sobrenome"
                    autoCapitalize='words'
                />
            </View>

            <View style={styles.inputGroup}>
                <View style={styles.inputCPFContainer}>
                    <TextInput
                        style={styles.input}
                        value={cpf}
                        onChangeText={handleCpfChange}
                        placeholder="CPF"
                        keyboardType="numeric"
                        maxLength={14}
                    />
                </View>

                <View style={styles.inputDataNascContainer}>
                    <TextInput
                        style={styles.input}
                        value={dataNascimento}
                        onChangeText={handleDataNascimentoChange}
                        placeholder="Data Nasc."
                        keyboardType="numeric"
                        maxLength={10}
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={telefone}
                    onChangeText={handleTelefoneChange}
                    placeholder="Telefone"
                    keyboardType="numeric"
                    maxLength={15}
                />
            </View>

            <TouchableOpacity style={styles.botaoContinuar} onPress={handleSubmitInfo}>
                <Text style={[styles.botaoContinuarTexto, globalStyles.textBold]}>Continuar</Text>
            </TouchableOpacity>

            <StatusBar style="auto" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#FBFBFE',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 24,
        marginBottom: 30,
    },
    inputContainer: {
        width: width * 0.8,
        marginBottom: 15,
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        paddingHorizontal: 20,
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    inputCPFContainer: {
        width: width * 0.41,
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        marginRight: 15,
        paddingHorizontal: 20,
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    inputDataNascContainer: {
        width: width * 0.35,
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        paddingHorizontal: 20,
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        fontSize: 18,
        textAlignVertical: 'center',
        height: '100%',
        paddingVertical: 10,
    },
    botaoContinuar: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 15,
        borderRadius: 16,
        width: width * 0.8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    botaoContinuarTexto: {
        color: theme.colors.white,
        fontSize: 16,
    },
});
