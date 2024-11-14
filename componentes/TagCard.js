import React from "react";
import { TouchableOpacity, Text, StyleSheet, FlatList, View } from "react-native";

export default function TagCard({ selectCategory }) {
    let lista = [
        { id: 1, title: "Educação" },
        { id: 2, title: "Saúde" },
        { id: 3, title: "Tecnologia" },
        { id: 4, title: "Limpeza" },
        { id: 5, title: "Meio-Ambiente" },
        { id: 6, title: "Alimentação" },
        { id: 7, title: "Esporte" },
    ];

    // Verifique se o comprimento da lista é ímpar; se for, adicione um item vazio como um espaço reservado
    if (lista.length % 2 !== 0) {
        lista = [...lista, { id: "placeholder", title: "" }];
    }

    return (
        <FlatList
            data={lista}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.contentContainer}
            renderItem={({ item }) => (
                item.title ? (
                    <TouchableOpacity
                        style={styles.touchbutton}
                        onPress={() => selectCategory(item.title)}
                        accessibilityLabel={`Select category ${item.title}`}
                    >
                        <Text style={styles.buttonText}>{item.title}</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={[styles.touchbutton, styles.placeholder]} /> // Placeholder item
                )
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
        alignItems: "center",
        borderRadius: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    buttonText: {
        color: "#1F0171",
        fontWeight: "bold",
    },
    placeholder: {
        backgroundColor: "transparent", // Make placeholder transparent
        elevation: 0, // Remove shadow
    }
});
