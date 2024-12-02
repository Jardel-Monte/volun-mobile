import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TagCard from '../componentes/TagCard';
import algoliaClient from '../services/algolia-config.js';
import EventoCard from '../componentes/eventoCard';

const index = algoliaClient.initIndex("eventos");

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [eventos, setEventos] = useState([]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery && !categoriaSelecionada) {
      Alert.alert('Atenção', 'Por favor, insira um termo de busca ou selecione uma categoria.');
      return;
    }

    try {
      setLoading(true);
      const algoliaResponse = await index.search(searchQuery, {
        filters: categoriaSelecionada ? `tags:${categoriaSelecionada}` : '',
      });

      const eventosAlgolia = algoliaResponse.hits.map(hit => ({
        ...hit,
        endereco: 'Carregando...'
      }));

      const eventosComEnderecos = await Promise.all(
        eventosAlgolia.map(async (evento) => {
          if (!evento.objectID) return evento;

          try {
            const enderecoResponse = await fetch(
              `https://volun-api-eight.vercel.app/endereco/evento/${evento.objectID}`
            );
            const enderecoData = await enderecoResponse.json();

            const endereco = Array.isArray(enderecoData) && enderecoData.length > 0
              ? `${enderecoData[0].cidade}, ${enderecoData[0].estado}`
              : 'Endereço indefinido';

            return { ...evento, endereco };
          } catch {
            return { ...evento, endereco: 'Endereço indefinido' };
          }
        })
      );

      setEventos(eventosComEnderecos);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao buscar os eventos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoriaSelecionada]);

  const handleSelectCategory = useCallback((categoria) => {
    setCategoriaSelecionada(categoria);
    console.log('Categoria selecionada:', categoria);
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Reset state when screen comes into focus
      setSearchQuery('');
      setCategoriaSelecionada(null);
      setEventos([]);
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Eventos</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua busca"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Buscar</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.categoriaContainer}>
        <TagCard selectCategory={handleSelectCategory} />
        {categoriaSelecionada && (
          <Text style={styles.selectedCategory}>
            Categoria selecionada: {categoriaSelecionada}
          </Text>
        )}
      </View>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.objectID}
        renderItem={({ item }) => (
          <EventoCard evento={item} />
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>
            {loading ? 'Buscando eventos...' : 'Nenhum evento encontrado.'}
          </Text>
        )}
        contentContainerStyle={styles.eventList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FBFBFE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#E3E7F0',
    paddingHorizontal: 8,
    borderRadius: 5,
    marginRight: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoriaContainer: {
    marginBottom: 16,
  },
  selectedCategory: {
    marginTop: 8,
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
  },
  eventList: {
    flexGrow: 1,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

