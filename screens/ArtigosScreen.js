// ArtigosScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ArtigosScreen() {
    return (
        <View style={styles.container}>
            <Text>Artigos</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});