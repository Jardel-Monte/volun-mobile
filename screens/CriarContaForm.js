import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image, Dimensions, StyleSheet, TextInput, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from '../services/firebase-config';  // Importação do Firebase Config
import { StatusBar } from 'expo-status-bar';
import { globalStyles, theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CriarContaForm({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [senhaVisivel, setSenhaVisivel] = useState(false);  // Controle de visibilidade
    const [senhaConfirmarVisivel, setSenhaConfirmarVisivel] = useState(false);

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleCriarConta = async () => {
        if (!isValidEmail(email)) {
            Alert.alert('Erro', 'Email inválido.');
            return;
        }
        
        if (senha.length < 6) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        const auth = getAuth(app);
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;
            const uid = user.uid;

            // Navegar para a tela InfoForm passando o UID
            navigation.navigate('InfoForm', { uid });
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Error: ${errorCode}, Message: ${errorMessage}`);
            Alert.alert('Erro', errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Image source={require('../assets/images/input-email.png')} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize='none'
                />
            </View>
            <View style={styles.inputContainer}>
                <Image source={require('../assets/images/input-senha.png')} style={styles.inputIcon} />
                <TextInput
                    style={styles.inputSenha}
                    value={senha}
                    onChangeText={setSenha}
                    placeholder="Senha"
                    secureTextEntry={!senhaVisivel}
                    autoCapitalize='none'
                />
                <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)} style={styles.eyeIcon}>
                    <Ionicons style={styles.senhaIcon} name={senhaVisivel ? "eye" : "eye-off"} size={24} color="gray" />
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <Image source={require('../assets/images/input-senha.png')} style={styles.inputIcon} />
                <TextInput
                    style={styles.inputSenha}
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    placeholder="Confirmar Senha"
                    secureTextEntry={!senhaConfirmarVisivel}
                    autoCapitalize='none'
                />
                <TouchableOpacity onPress={() => setSenhaConfirmarVisivel(!senhaConfirmarVisivel)} style={styles.eyeIcon}>
                    <Ionicons style={styles.senhaIcon} name={senhaConfirmarVisivel ? "eye" : "eye-off"} size={24} color="gray" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.botaoContinuar} onPress={handleCriarConta}>
                <Text style={[styles.botaoContinuarTexto, globalStyles.textBold]}>Continuar</Text>
            </TouchableOpacity>
            <Text style={[styles.termosCondicoes, globalStyles.textRegular]}>
                Ao continuar, você concorda com nossa <TouchableOpacity><Text style={globalStyles.underline}>Política de Privacidade</Text></TouchableOpacity> e <TouchableOpacity><Text style={globalStyles.underline}>Termos & Condições</Text></TouchableOpacity>
            </Text>
            <View style={styles.loginLinkContainer}>
                <Text style={[styles.loginTexto, globalStyles.textSemiBold]}>
                    Já possui uma conta? <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('EntrarConta')}><Text style={[globalStyles.underline, globalStyles.textSemiBold]}>Fazer login</Text></TouchableOpacity>
                </Text>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFE',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 15,
        width: width * 0.8,
        height: 50,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    inputIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        padding: 5,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    termosCondicoes: {
        fontSize: 14,
        textAlign: 'center',
        textAlignVertical: 'top',
        marginBottom: 45,
        marginTop: 5,
    },
    botaoContinuar: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 15,
        borderRadius: 16,
        width: width * 0.8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
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
    loginLinkContainer: {
        justifyContent: 'center',
    },
    loginTexto: {
        fontSize: 16,
    },
    loginLink: {
        color: theme.colors.secondary,
    },
});
