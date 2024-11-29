import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { format } from 'date-fns';
import { auth } from '../services/firebase-config'; // Certifique-se de ajustar o caminho para o seu firebase-config.js

const EventoInfo = ({ route }) => {
  const { eventoId, endereco } = route.params;
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false); // Controle da participação
  const [participacaoId, setParticipacaoId] = useState(null); // Armazena o ID da participação
  const [newDataInicio, setnewDataInicio] = useState('');
  const [newDataFim, setDataFimFormatada] = useState('');

  useEffect(() => {
    fetch(`https://volun-api-eight.vercel.app/eventos/${eventoId}`)
      .then(response => response.json())
      .then(data => {
        setEvento(data);
        setnewDataInicio(format(new Date(data.data_inicio), 'dd/MM/yyyy HH:mm'));
        setDataFimFormatada(format(new Date(data.data_fim), 'dd/MM/yyyy HH:mm'));
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });

    // Verificar participação do usuário assim que o evento for carregado
    verificarParticipacao();
  }, [eventoId]);

  // Função para verificar se o usuário já está participando do evento
  const verificarParticipacao = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      const response = await fetch(
        `https://volun-api-eight.vercel.app/participacao/usuario/${userId}/evento/${eventoId}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data._id) {
          setParticipacaoId(data._id); // Salva o ID próprio do documento
          setIsParticipating(true); // Marca como participante
        }
      }
    } catch (error) {
      console.error("Erro ao verificar participação:", error);
    }
  };

  // Função para cancelar a participação do usuário
  const handleCancelarParticipacao = async () => {
    if (!participacaoId) return;

    try {
      const response = await fetch(
        `https://volun-api-eight.vercel.app/participacao/${participacaoId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        Alert.alert("Sucesso", "Participação cancelada com sucesso!");
        setIsParticipating(false); // Atualiza o estado para refletir a remoção da participação
        setParticipacaoId(null); // Limpa o ID da participação
      } else {
        throw new Error("Erro ao cancelar participação");
      }
    } catch (error) {
      console.error("Erro ao cancelar participação:", error);
    }
  };

  // Função para confirmar a participação do usuário
  const handleParticipar = async () => {
    if (isParticipating) {
      // Se já estiver participando, exibe o modal de confirmação
      setShowModal(true);
      return;
    }

    setIsProcessing(true);
    const userId = auth.currentUser?.uid;
    if (!userId) return console.error("Usuário não está logado");

    const participacaoData = {
      evento_id: eventoId,
      usuario_id: userId,
    };

    try {
      const response = await fetch("https://volun-api-eight.vercel.app/participacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(participacaoData),
      });

      if (response.ok) {
        const data = await response.json();
        setIsParticipating(true); // Marca como participante
        setParticipacaoId(data._id); // Salva o ID do documento
        Alert.alert("Sucesso", "Participação confirmada!");
      } else {
        throw new Error("Erro ao confirmar participação");
      }
    } catch (error) {
      console.error("Erro ao participar:", error);
    } finally {
      setIsProcessing(false);
    }
  };

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

      {/* Botão de Participar ou Cancelar */}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={isParticipating ? handleCancelarParticipacao : handleParticipar}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isParticipating ? "Cancelar Participação" : "Participar"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Informações do Evento */}
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

  button: {
    backgroundColor: '#1F0171',
    paddingVertical: 12,
    paddingHorizontal: 100,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 14,
    color: '#fff',
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
