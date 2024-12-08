import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image, Dimensions, } from 'react-native';
import { format } from 'date-fns';
import { auth } from '../services/firebase-config';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const EventoInfo = ({ route }) => {
  const { eventoId } = route.params;
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);
  const [participacaoId, setParticipacaoId] = useState(null);
  const [newDataInicio, setNewDataInicio] = useState('');
  const [newDataFim, setNewDataFim] = useState('');
  const navigation = useNavigation();
  const [participationCount, setParticipationCount] = useState(0);
  const [eventEnded, setEventEnded] = useState(false);

  const Recarregarpage = () => {
    navigation.replace('EventoInfo', { eventoId });
  };

  useEffect(() => {
    fetchEventoDetails();
    verificarParticipacao();
    fetchParticipationCount();

    const checkEventEnded = () => {
      if (evento) {
        const currentDate = new Date();
        const eventEndDate = new Date(evento.data_fim);
        setEventEnded(currentDate > eventEndDate);
      }
    };

    checkEventEnded();
    const timer = setInterval(checkEventEnded, 60000); // Check every minute

    return () => clearInterval(timer);
  }, [eventoId, evento]);

  const fetchParticipationCount = async () => {
    try {
      const response = await fetch(`https://volun-api-eight.vercel.app/participacao/evento/${eventoId}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar participações');
      }
      const data = await response.json();
      setParticipationCount(data.length);
    } catch (error) {
      console.error("Erro ao buscar participações:", error);
    }
  };

  const progressPercentage = Math.min(
    (participationCount / (evento?.vaga_limite || 0)) * 100,
    100
  );
  const isOverLimit = participationCount > (evento?.vaga_limite || 0);

  const fetchEventoDetails = async () => {
    try {
      const response = await fetch(`https://volun-api-eight.vercel.app/eventos/${eventoId}`);
      const data = await response.json();
      setEvento(data);
      setNewDataInicio(format(new Date(data.data_inicio), 'dd/MM/yyyy HH:mm'));
      setNewDataFim(format(new Date(data.data_fim), 'dd/MM/yyyy HH:mm'));
    } catch (error) {
      console.error("Erro ao buscar detalhes do evento:", error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes do evento.");
    } finally {
      setLoading(false);
    }
  };

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
          setParticipacaoId(data._id);
          setIsParticipating(true);
        }
      }
    } catch (error) {
      console.error("Erro ao verificar participação:", error);
    }
  };

  const handleCancelarParticipacao = async () => {
    if (!participacaoId) return;

    try {
      const response = await fetch(
        `https://volun-api-eight.vercel.app/participacao/${participacaoId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        Alert.alert("Sucesso", "Participação cancelada com sucesso!");
        setIsParticipating(false);
        setParticipacaoId(null);
        Recarregarpage();
      } else {
        throw new Error("Erro ao cancelar participação");
      }
    } catch (error) {
      console.error("Erro ao cancelar participação:", error);
      Alert.alert("Erro", "Não foi possível cancelar a participação.");
    }
  };

  const handleParticipar = async () => {
    if (isParticipating) {
      Alert.alert(
        "Cancelar Participação",
        "Tem certeza que deseja cancelar sua participação?",
        [
          { text: "Não", style: "cancel" },
          { text: "Sim", onPress: handleCancelarParticipacao }
        ]
      );
      return;
    }

    setIsProcessing(true);
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("Erro", "Você precisa estar logado para participar.");
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch("https://volun-api-eight.vercel.app/participacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evento_id: eventoId, usuario_id: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsParticipating(true);
        setParticipacaoId(data._id);
        Alert.alert("Sucesso", "Participação confirmada!");
        Recarregarpage();
      } else {
        throw new Error("Erro ao confirmar participação");
      }
    } catch (error) {
      console.error("Erro ao participar:", error);
      Alert.alert("Erro", "Não foi possível confirmar sua participação.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1F0171" />
        <Text style={styles.loadingText}>Carregando detalhes do evento...</Text>
      </View>
    );
  }

  if (!evento) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Evento não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: evento.imagem }} style={styles.imagemEvento} />
      <View style={styles.contentContainer}>
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

        <TouchableOpacity
          style={[
            styles.button,
            isParticipating && styles.cancelButton,
            eventEnded && styles.disabledButton
          ]}
          onPress={handleParticipar}
          disabled={isProcessing || eventEnded}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {eventEnded
                ? "Evento finalizado"
                : isParticipating
                ? "Cancelar Participação"
                : "Participar"}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.progressSection}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View 
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercentage}%` },
                  isOverLimit && styles.progressBarOverLimit
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {isOverLimit 
                ? `Limite excedido: ${participationCount}/${evento.vaga_limite} vagas`
                : `${participationCount}/${evento.vaga_limite} vagas preenchidas`
              }
            </Text>
          </View>
        </View>


        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="business-outline" size={24} color="#1F0171" />
            <Text style={styles.infoText}>{evento.ong_id?.nome}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={24} color="#1F0171" />
            <Text style={styles.infoText}>
              {evento.endereco_id?.logradouro}, {evento.endereco_id?.cidade} - {evento.endereco_id?.estado}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={24} color="#1F0171" />
            <Text style={styles.infoText}>CEP: {evento.endereco_id?.cep}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={24} color="#1F0171" />
            <View>
              <Text style={styles.infoText}>Início: {newDataInicio}</Text>
              <Text style={styles.infoText}>Fim: {newDataFim}</Text>
            </View>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Sobre o Evento</Text>
          <Text style={styles.description}>{evento.descricao}</Text>
          <Text style={styles.description}>{evento.descricao_2}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#1F0171',
  },
  contentContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#1F0171',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  disabledButton: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagemEvento: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#1F0171',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
  },
  tagBox: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    margin: 3,
  },
  tagText: {
    fontSize: 12,
    color: '#1F0171',
  },
  infoSection: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  descriptionContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F0171',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  progressSection: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  progressContainer: {
    width: '100%',
  },
  progressBarBg: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1F0171',
    borderRadius: 10,
  },
  progressBarOverLimit: {
    backgroundColor: '#FF3B30',
  },
  progressText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default EventoInfo;
