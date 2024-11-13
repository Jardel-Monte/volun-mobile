import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import TagCard from '../componentes/TagCard';
import algoliaClient from '../services/algolia-config.js';

const index = algoliaClient.initIndex("eventos");

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [eventos, setEventos] = useState([]); // Estado para armazenar os eventos buscados

  const handleSearch = async () => {
    try {
      setLoading(true);
      const { estadoSelecionado, categoria, cidade, searchQuery } = filtros;

      // Realiza a busca no Algolia aplicando apenas os filtros preenchidos
      const algoliaResponse = await index.search(searchQuery || "", {
          filters: [
              categoria ? `tags:${categoria}` : ""
          ].filter(Boolean).join(" AND "),
      });

      // Processa os resultados do Algolia
      const eventosAlgolia = algoliaResponse.hits.map(hit => ({
          ...hit,
          categoria: "Carregando..." // Endereço será buscado depois
      }));

      // Para cada evento com objectID válido, busca o endereço no MongoDB
      const eventosComEnderecos = await Promise.all(
          eventosAlgolia.map(async (evento) => {
              if (!evento.objectID) return evento; // Ignora se objectID estiver indefinido

              try {
                  const enderecoResponse = await fetch(
                      `https://volun-api-eight.vercel.app/endereco/evento/${evento.objectID}`
                  );
                  const enderecoData = await enderecoResponse.json();

                  const endereco = Array.isArray(enderecoData) && enderecoData.length > 0
                      ? `${enderecoData[0].cidade}, ${enderecoData[0].estado}`
                      : "Endereço indefinido";

                  return { ...evento, endereco };
              } catch {
                  return { ...evento, endereco: "Endereço indefinido" };
              }
          })
      );

      setEventos(eventosComEnderecos);
  } catch (error) {
      console.error("Erro ao buscar eventos:", error);
  } finally {
      setLoading(false);
      setCurrentPage(1);
  }
};

  const handleSelectCategory = (categoria) => {
    setCategoriaSelecionada(categoria);
    console.log('Categoria selecionada:', categoria);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua busca"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>{loading ? "Buscando..." : "Buscar"}</Text>
      </TouchableOpacity>
      <View style={styles.categoriaContainer}>
        <TagCard selectCategory={handleSelectCategory} />
        {categoriaSelecionada && (
          <Text style={styles.selectedCategory}>
            Categoria selecionada: {categoriaSelecionada}
          </Text>
        )}
      </View>

      {/* Exibir eventos */}
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.objectID}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text>{item.endereco}</Text>
          </View>
        )}
      />
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