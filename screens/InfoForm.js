import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { globalStyles, theme } from '../styles/theme';

const { width } = Dimensions.get('window');

export default function InfoForm() {
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [ddd, setDdd] = useState('');
    const [telefone, setTelefone] = useState('');

    const handleSubmitInfo = () => {
        const userInfo = {
            nome,
            sobrenome,
            cpf,
            dataNascimento,
            ddd,
            telefone,
        };

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
                        onChangeText={setDataNascimento}
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
        paddingVertical: 20,
    },
    titulo: {
        fontSize: 24,
        marginTop: 150,
        marginBottom: 40,
        textAlign: 'center',
    },
    inputContainer: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 15,
        width: width * 0.85,
        height: 50,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    inputGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width * 0.85,
        marginBottom: 15,
    },
    inputCPFContainer: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        paddingHorizontal: 10,
        width: '46%', // Ajustado para caber os dois inputs na mesma linha
        height: 50,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    inputDataNascContainer: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        paddingHorizontal: 5,
        width: '48%', // Ajustado para caber os dois inputs na mesma linha
        height: 50,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    inputDDDContainer: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        paddingHorizontal: 10,
        width: '30%',
        height: 50,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    inputTelefoneContainer: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        paddingHorizontal: 10,
        width: '65%',
        height: 50,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    botaoContinuar: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 15,
        borderRadius: 16,
        width: width * 0.85,
        alignItems: 'center',
        marginTop: 30,
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
