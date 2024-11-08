import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import TagCard from '../componentes/TagCard';
import algoliasearch from 'algoliasearch';
import algoliaClient from '../services/algolia-config.js'
import { se } from 'date-fns/locale';

const index = algoliaClient.initIndex("eventos");

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  const handleSearch = async (eventCategory) => {
    try {
      setLoading(true);
      const {categoria} = eventCategory;

      const algoliaResponse = await index.search(searchQuery || "", {
        filters: [
          categoria ? `tags:${categoria}` : "",
        ].filter(Boolean).join(" AND ")
      });
    }
    catch (error){
      console.error("Erro ao buscar eventos:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (categoria) => {
    setCategoriaSelecionada(categoria);
    console.log('Categoria selecionada:', categoria);
  };

  return (
    <View style={styles.container} >
      <Text style={styles.title}>Buscar</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua busca"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
      <View
        style={styles.categoriaContainer}
      >
        <TagCard selectCategory={handleSelectCategory} />
        {categoriaSelecionada && (
          <Text style={styles.selectedCategory}>
            Categoria selecionada: {categoriaSelecionada}
          </Text>
        )}
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    height: 500,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#E3E7F0',
    position: "relative",
    height: 40,
    marginVertical: 16,
    paddingHorizontal: 8,
    width: '100%',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  selectedCategory: {
    marginVertical: 20,
    fontSize: 16,
    color: 'green',
  },
  categoriaContainer: {
    textAlign: 'center',
    justifyContent: 'center',
    width: 400,
    height: 400,
    marginHorizontal: 20,
    marginVertical: 20,
  }
});