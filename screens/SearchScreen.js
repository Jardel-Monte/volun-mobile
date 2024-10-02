// screens/SearchScreen.js
import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = () => {
    // Lógica de busca aqui
    console.log('Buscando por:', searchQuery);
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
      <Button title="Buscar" onPress={handleSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    width: '100%',
  },
});