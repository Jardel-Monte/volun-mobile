import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { InstantSearch, useSearchBox, useHits, Configure } from "react-instantsearch-hooks";
import algoliaClient from "../services/algolia-config";
import EventoCard from "../componentes/eventoCard";

function Hits() {
  const { hits } = useHits();

  if (hits.length === 0) {
    return <Text style={styles.noResults}>Nenhum evento encontrado.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.resultsContainer}>
      {hits.map((hit) => (
        <EventoCard key={hit.objectID} evento={hit} />
      ))}
    </ScrollView>
  );
}

function SearchInput({ searchQuery, setSearchQuery }) {
  const { refine } = useSearchBox();

  const handleChange = (query) => {
    setSearchQuery(query);
    refine(query);
  };

  return (
    <TextInput
      style={styles.searchInput}
      placeholder="Digite sua pesquisa"
      value={searchQuery}
      onChangeText={handleChange}
    />
  );
}

export default function SearchScreen({ route }) {
  const { categoria } = route.params; // Recebendo a categoria da tela anterior
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <InstantSearch searchClient={algoliaClient} indexName="eventos">
      {/* Configura o Facet Filter para aplicar a categoria */}
      <Configure facetFilters={[`tags:${categoria}`]} />

      <View style={styles.container}>
        <Text style={styles.title}>Categoria: {categoria}</Text>
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Hits />
      </View>
    </InstantSearch>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  searchInput: { borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 8, marginBottom: 16 },
  noResults: { textAlign: "center", color: "#888", fontSize: 18, marginTop: 20 },
  resultsContainer: { paddingBottom: 20 },
});
