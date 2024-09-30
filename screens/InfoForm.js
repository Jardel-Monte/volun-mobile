import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { globalStyles, theme } from '../styles/theme';

const { width } = Dimensions.get('window');

export default function InfoForm({ route }) {
    const { uid } = route.params;  // Pegando o UID vindo da rota
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [ddd, setDdd] = useState('');
    const [telefone, setTelefone] = useState('');
    
    // Função para formatar a data com "/" ao digitar
    const handleDataNascimentoChange = (text) => {
        // Remover tudo que não for número
        const cleaned = text.replace(/[^\d]/g, '');
        
        let formatted = cleaned;

        // Inserir "/" no formato DD/MM/AAAA
        if (cleaned.length >= 5) {
            formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
        } else if (cleaned.length >= 3) {
            formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        }

        // Atualiza o campo com a formatação
        setDataNascimento(formatted);
    };

    // Função para converter a data do formato DD/MM/AAAA para YYYY-MM-DD
    const formatarDataParaEnvio = (data) => {
        const partes = data.split('/');
        if (partes.length === 3) {
            const [dia, mes, ano] = partes;
            return `${ano}-${mes}-${dia}`; // Retorna a data no formato YYYY-MM-DD
        }
        return data; // Retorna a data sem modificação se não estiver no formato esperado
    };



    const handleSubmitInfo = () => {

        const dataFormatada = formatarDataParaEnvio(dataNascimento);

        const userInfo = {
            nome: nome,
            sobrenome: sobrenome,
            cpf: cpf,
            data_nascimento: dataFormatada,
            ddd: ddd,
            telefone: telefone
        };

        // Verifica se todos os campos estão preenchidos
        for (const key in userInfo) {
            if (userInfo[key] === undefined || userInfo[key] === '') {
                console.error(`Campo ${key} não pode ser vazio ou indefinido.`);
                return; // Retorna sem fazer a requisição
            }
        }

        fetch(`https://volun-api-eight.vercel.app/usuarios/${uid}/info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Informações salvas com sucesso:", data);
            // Navegar para a próxima tela ou mostrar uma mensagem de sucesso
        })
        .catch(error => {
            console.error("Erro ao salvar informações:", error);
        });
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
                        onChangeText={setCpf}
                        placeholder="CPF"
                        keyboardType="numeric"
                        maxLength={11}
                    />
                </View>

                <View style={styles.inputDataNascContainer}>
                    <TextInput
                        style={styles.input}
                        value={dataNascimento}
                        onChangeText={handleDataNascimentoChange}
                        placeholder="Data de Nascimento"
                        keyboardType="numeric"
                        maxLength={10}
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <View style={styles.inputDDDContainer}>
                    <TextInput
                        style={styles.input}
                        value={ddd}
                        onChangeText={setDdd}
                        placeholder="DDD"
                        keyboardType="numeric"
                        maxLength={2}
                    />
                </View>

                <View style={styles.inputTelefoneContainer}>
                    <TextInput
                        style={styles.input}
                        value={telefone}
                        onChangeText={setTelefone}
                        placeholder="Telefone"
                        keyboardType="numeric"
                        maxLength={9}
                    />
                </View>
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
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    inputCPFContainer: {
        width: width * 0.45,
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
    inputDDDContainer: {
        width: width * 0.2,
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
    inputTelefoneContainer: {
        width: width * 0.55,
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
