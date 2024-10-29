import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function TagCard({ selectCategory }) {
    const lista = {
        1: "Educação",
        2: "Saúde",
        3: "Tecnologia",
        4: "Limpeza",
        5: "Meio-Ambiente",
        6: "Alimentação"
    };

    return (
        <View>
            <View>
                {Object.entries(lista).map(([key, value]) => (
                    <TouchableOpacity
                        key={key}
                        style={styles.touchbutton}
                        onPress={() => selectCategory(value)}
                    >
                        <Text>{value}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    touchbutton: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        backgroundColor: "#c5c5c5",
        marginHorizontal: 20,
        marginVertical: 10,
        display: "flex",
        textAlign: "center",
        justifyContent: "center"
    }
});
