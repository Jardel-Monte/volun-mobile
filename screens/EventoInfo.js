import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { format } from 'date-fns';

const EventoInfo = ({ route }) => {
  const { eventoId, endereco } = route.params;
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newDataInicio, setnewDataInicio] = useState('');
  const [newDataFim, setDataFimFormatada] = useState('');

  useEffect(() => {
    fetch(`https://volun-api-eight.vercel.app/eventos/${eventoId}`)
      .then(response => response.json())
      .then(data => {
        setEvento(data);

        // Formatação das datas
        setnewDataInicio(format(new Date(data.data_inicio), 'dd/MM/yyyy hh:mm'));
        setDataFimFormatada(format(new Date(data.data_fim), 'dd/MM/yyyy hh:mm'));

        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [eventoId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  if (!evento) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Evento não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: evento.imagem }} style={styles.imagemEvento} />
      <Text style={styles.title}>{evento.titulo}</Text>
      {evento.tags && evento.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {evento.tags.map((tag, index) => (
            <View key={index} style={styles.tagBox}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.organization}>{evento.ong_id?.nome}</Text>
      <Text style={styles.address}>
        {endereco?.logradouro}, {endereco?.cidade} - {endereco?.estado}
      </Text>
      <Text style={styles.cep}>CEP: {endereco?.cep}</Text>
      <Text style={styles.date}>Início: {newDataInicio}</Text>
      <Text style={styles.date}>Fim: {newDataFim}</Text>
      <Text style={styles.description}>{evento.descricao}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagemEvento: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'justify',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  tagBox: {
    backgroundColor: '#007BFF', // Escolha uma cor que combine com o tema
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 14,
    color: '#fff', // Cor do texto branco para contrastar com o fundo
  },
  organization: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  cep: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginBottom: 10,
    padding: 5
  },
  description: {
    fontSize: 16,
    textAlign: 'justify',
    lineHeight: 22,
    marginBottom: 20,
    padding: 10
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default EventoInfo;

