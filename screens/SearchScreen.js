import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { InstantSearch, useSearchBox, useHits, Configure } from "react-instantsearch-hooks";
import algoliaClient from "../services/algolia-config";
import EventoCardFullWidth from "../componentes/eventoCard2";
import { Ionicons } from '@expo/vector-icons';

function Hits() {
  const { hits } = useHits();

  if (hits.length === 0) {
    return <Text style={styles.noResults}>Nenhum evento encontrado.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.resultsContainer}>
      {hits.map((hit) => (
        <EventoCardFullWidth key={hit.objectID} evento={hit} />
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
    <View style={styles.searchInputContainer}>
      <Ionicons name="search" size={24} color="#888" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Digite sua pesquisa"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={handleChange}
      />
    </View>
  );
}

export default function SearchScreen({ route }) {
  const categoria = route?.params?.categoria;
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <InstantSearch searchClient={algoliaClient} indexName="eventos">
        <Configure facetFilters={[`tags:${categoria}`]} />
        <View style={styles.container}>
          <Text style={styles.title}>Categoria: {categoria}</Text>
          <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <Hits />
        </View>
      </InstantSearch>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1f0171",
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  noResults: {
    textAlign: "center",
    color: "#888",
    fontSize: 18,
    marginTop: 20,
    fontStyle: 'italic',
  },
  resultsContainer: {
    paddingBottom: 20,
    alignItems: "center",
  },
});