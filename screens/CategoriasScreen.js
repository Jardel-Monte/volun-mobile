import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const predefinedTags = [
  "Educação", "Saúde", "Social", "Meio Ambiente", "Cultura", "Arte", "Esporte",
  "Lazer", "Alimentação", "Animais", "Assistência Social", "Música", "Cooperativo",
  "Tecnologia", "Apoio Psicológico", "Reciclagem", "Eventos Religiosos",
  "Treinamentos", "Inclusão Digital", "Capacitação", "Empreendedorismo",
  "Eventos Infantis", "Moradia", "Resgate", "Acessibilidade", "Combate à Fome",
  "Bem-Estar", "Direitos Humanos", "Reforma de Espaços", "Defesa Civil",
  "Combate à Violência", "Saúde Mental", "Rural", "Governamental", "Doação",
  "Urbano", "Outros"
];

export default function CategoriasScreen() {
  const navigation = useNavigation();

  const handleCategoryPress = (categoria) => {
    navigation.navigate("SearchScreen", { categoria });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione uma Categoria</Text>
      <ScrollView contentContainerStyle={styles.categoriesContainer}>
        {predefinedTags.map((tag, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryOption}
            onPress={() => handleCategoryPress(tag)}
          >
            <Text style={styles.categoryText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 23, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  categoriesContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  categoryOption: {
    backgroundColor: "#1F0171",
    padding: 10,
    borderRadius: 8,
    margin: 8,
    width: "45%",
    alignItems: "center",
  },
  categoryText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
