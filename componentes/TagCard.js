import React from "react";
import {TouchableOpacity, Text, StyleSheet, FlatList } from "react-native";

export default function TagCard({ selectCategory }) {
    const lista = [
        { id: 1, title: "Educação" },
        { id: 2, title: "Saúde" },
        { id: 3, title: "Tecnologia" },
        { id: 4, title: "Limpeza" },
        { id: 5, title: "Meio-Ambiente" },
        { id: 6, title: "Alimentação" },
        { id: 7, title: "Esporte"},
        { id: 8, title: "Cassino"}
    ];

    return (
        <FlatList
            data={lista}
            keyExtractor={(item) => item.id.toString()} // Ensure id is a string
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.contentContainer}
            renderItem={({ item }) => ( // Destructure item from the render function
                <TouchableOpacity
                    style={styles.touchbutton}
                    onPress={() => selectCategory(item.title)} // Use item.title for onPress
                >
                    <Text style={styles.buttonText}>{item.title}</Text> 
                </TouchableOpacity>
            )}
        />
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        padding: 5,
    },
    row: {
        flex: 1,
        justifyContent: "space-between",
    },
    touchbutton: {
        flex: 1,
        paddingVertical: 80,
        paddingHorizontal: 40,
        backgroundColor: "#E3E7F0",
        margin: 5,
        alignItems: 'center',
        borderRadius: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowRadius: 3.5,
    },
    buttonText: {
        color: '#1F0171',
        fontWeight: "bold",
    }
});
