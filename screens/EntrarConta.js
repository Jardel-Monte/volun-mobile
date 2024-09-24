import React from 'react';
import { View, TouchableOpacity, Text, Dimensions, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { globalStyles, theme } from '../styles/theme';

const { width } = Dimensions.get('window');

export default function EntrarConta() {
    return(
        <View style={styles.container}>
            <Text style={[styles.tituloEntrarConta, globalStyles.textBold]}>Entrar</Text>
            <TextInput
            style={styles.inputEmail}
            icon={require('../assets/images/input-email.png')}
            value={email}
            placeholder="Email"
            keyboardType="email-address"
            />
            <TextInput
            style={styles.inputSenha}
            icon={require('../assets/images/input-senha.png')}
            value={text}
            placeholder="Senha"
            keyboardType="visible-password"
            />
            <TouchableOpacity style={styles.botaoEntrar}>
                <Text style={[styles.botaoEntrarTexto, globalStyles.textSemiBold]}>Entrar</Text>
            </TouchableOpacity>
            <Text style={[styles.esqueciSenha, globalStyles.textSemiBold, globalStyles.underline]}><TouchableOpacity>Esqueci minha senha</TouchableOpacity></Text>
            <View style={styles.botoesAuthContainer}>
            <BotaoAuth icon={require('../assets/images/google.png')} />
            <BotaoAuth icon={require('../assets/images/facebook.png')} />
            </View>
            <Text style={[styles.cadastroTexto, globalStyles.textSemiBold]}>Não tem cadastro? <TouchableOpacity style={styles.cadastroLink}><Text style={[globalStyles.underline, globalStyles.textSemiBold]}>Cadastre-se</Text></TouchableOpacity></Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFE',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    tituloEntrarConta: {
        fontSize: 30,
        marginBottom: 20,
        marginLeft: 25,
        alignSelf: 'flex-start',
    },
    botaoEntrar: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 15,
        borderRadius: 16,
        width: width * 0.62,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },  
        shadowOpacity: 0.25,                    
        shadowRadius: 4,                        
        elevation: 5,                           
    },
    botaoEntrarTexto: {
        color: theme.colors.white,
        fontSize: 16,
    },
    esqueciSenha: {
        fontSize: 16,
    },
    cadastroTexto: {
        fontSize: 16,
    },
    botoesAuthContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        marginTop: 120,
    },
    botaoEntrarTexto: {
        color: theme.colors.white,
        fontSize: 16,
    },
    inputEmail: {

    },
    inputSenha: {

    },
});