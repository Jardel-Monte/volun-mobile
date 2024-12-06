import React from 'react';
import { View, Image, TouchableOpacity, Text, Dimensions, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { globalStyles, theme } from '../styles/theme';

const { width } = Dimensions.get('window');

export default function CriarConta( { navigation } ) {
    return(
        <View style={styles.container}>
            <Text style={[styles.tituloCriarConta, globalStyles.textBold]}>Criar Conta</Text>
            <Text style={[styles.termosCondicoes, globalStyles.textRegular]}>Ao continuar, você concorda com nossa <TouchableOpacity><Text style={globalStyles.underline}>Política de Privacidade</Text></TouchableOpacity> e <TouchableOpacity><Text style={globalStyles.underline}>Termos & Condições</Text></TouchableOpacity></Text>
            <View style={styles.botoesContinuarContainer}>
                <TouchableOpacity style={styles.botaoContinuar} onPress={() => navigation.navigate('CriarContaForm')}>
                    <Image source={require('../assets/images/email.png')} style={styles.icon} resizeMode="contain" />
                    <Text style={[styles.botaoContinuarTexto, globalStyles.textBold]}>Continuar com Email</Text>
                </TouchableOpacity>
            </View>
            <Text style={[styles.loginTexto, globalStyles.textSemiBold]}>Já possui uma conta? <TouchableOpacity style={styles.loginLink}><Text style={[globalStyles.underline, globalStyles.textSemiBold]} onPress={() => navigation.navigate('EntrarConta')}>Fazer login</Text></TouchableOpacity></Text>
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
    tituloCriarConta: {
        fontSize: 30,
        marginBottom: 20,
        marginLeft: 25,
        alignSelf: 'flex-start',
    },
    termosCondicoes: {
        fontSize: 14,
        textAlign: 'center',
        textAlignVertical: 'top',
        marginBottom: 45,
        marginTop: 35,
    },
    botoesContinuarContainer: {
        width: '90%',
        marginBottom: 40,
    },
    botaoContinuar: {
        backgroundColor: theme.colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 16,
        width: '100%',
        marginBottom: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },  
        shadowOpacity: 0.25,                    
        shadowRadius: 4,                        
        elevation: 5, 
    },
    icon: {
        width: 24,
        height: 24,
        marginLeft: 20,
        marginRight: 15,
    },
    botaoContinuarTexto: {
        fontSize: 16,
        textAlign: 'center',
        color: theme.colors.primary,
    },
    loginTexto: {
        fontSize: 16,
    },
    loginLink: {
        color: theme.colors.secondary,
    },
});