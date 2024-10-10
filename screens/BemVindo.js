import React from 'react';
import { View, Image, TouchableOpacity, Text, Dimensions, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { globalStyles, theme } from '../styles/theme';

const { width, height } = Dimensions.get('window');

export default function BemVindo( { navigation } ) {
    return(
        <View style={styles.container}>
            <Text style={[styles.tituloBemVindo, globalStyles.textBold]}>Bem-vindo ao Volun!</Text>
            <Text style={[styles.textoBemVindo, globalStyles.textSemiBold]}>O Volun é uma plataforma inovadora dedicada a conectar pessoas que desejam <Text style={globalStyles.orangeFont}>fazer a diferença</Text> com oportunidades de trabalho voluntário em diversas áreas</Text>
            <Image
                source={require('../assets/images/bem-vindo.png')}
                style={styles.imagemBemVindo}
                resizeMode='contain'
            />
            <TouchableOpacity style={styles.botaoEntendi} onPress={() => navigation.navigate('HomeScreen')}><Text style={[styles.botaoEntendiTexto, globalStyles.textBold]}>Entendi</Text></TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Centraliza verticalmente
        alignItems: 'center', // Centraliza horizontalmente
        paddingHorizontal: 20, // Espaçamento nas laterais
    },
    tituloBemVindo: {
        fontSize: 30,
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    textoBemVindo: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 35,
        paddingHorizontal: 15,
    },
    imagemBemVindo: {
        width: width * 0.8, // Aumenta o tamanho da imagem
        height: height * 0.3, // Ajusta a altura proporcionalmente
        marginBottom: 45,
    },
    botaoEntendi: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 15,
        borderRadius: 16,
        width: width * 0.8,
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },  
        shadowOpacity: 0.25,                    
        shadowRadius: 4,                        
        elevation: 5, 
    },
    botaoEntendiTexto: {
        color: theme.colors.white,
        fontSize: 16,
    },
});