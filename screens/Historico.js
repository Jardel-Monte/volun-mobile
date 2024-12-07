import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import EventoCard from './../componentes/eventoCard';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');

const Historico = () => {
  const [userId, setUserId] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.error("Usuário não está logado.");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchEventos = async () => {
        try {
          const response = await fetch(
            `https://volun-api-eight.vercel.app/participacao/usuario/${userId}`
          );
          const participacoes = await response.json();

          const eventosDetalhes = await Promise.all(
            participacoes.map(async (participacao) => {
              const eventoId = participacao.evento_id?._id;
              if (!eventoId) return null;

              const eventoResponse = await fetch(
                `https://volun-api-eight.vercel.app/eventos/${eventoId}`
              );
              const evento = await eventoResponse.json();

              return {
                ...evento,
                _id: evento._id,
                titulo: evento.titulo,
                imagem: evento.imagem,
                endereco_id: evento.endereco_id,
                data_inicio: evento.data_inicio,
                data_fim: evento.data_fim,
              };
            })
          );

          setEventos(eventosDetalhes.filter((evento) => evento !== null));
        } catch (error) {
          console.error("Erro ao buscar eventos:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchEventos();
    }
  }, [userId]);

  const categorizeEvents = () => {
    const now = new Date();
    const upcoming = eventos.filter(evento => new Date(evento.data_inicio) > now);
    const ongoing = eventos.filter(evento => {
      const start = new Date(evento.data_inicio);
      const end = new Date(evento.data_fim);
      return start <= now && end >= now;
    });
    const past = eventos.filter(evento => new Date(evento.data_fim) < now);
    return { upcoming, ongoing, past };
  };

  const { upcoming, ongoing, past } = categorizeEvents();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const renderEventos = (eventList) => {
    if (eventList.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Não há eventos nesta categoria.</Text>
        </View>
      );
    }

    return eventList.map((evento) => (
      <EventoCard key={evento._id} evento={evento} />
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Histórico</Text>
      <Text style={styles.subtitle}>Confira aqui os últimos eventos que você se inscreveu ou participou!</Text>
      
      {eventos.length > 0 ? (
        <View>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "upcoming" && styles.activeTabButton]}
              onPress={() => setActiveTab("upcoming")}
            >
              <Text style={[styles.tabButtonText, activeTab === "upcoming" && styles.activeTabButtonText]}>Não iniciados</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "ongoing" && styles.activeTabButton]}
              onPress={() => setActiveTab("ongoing")}
            >
              <Text style={[styles.tabButtonText, activeTab === "ongoing" && styles.activeTabButtonText]}>Em andamento</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "past" && styles.activeTabButton]}
              onPress={() => setActiveTab("past")}
            >
              <Text style={[styles.tabButtonText, activeTab === "past" && styles.activeTabButtonText]}>Finalizados</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.eventosContainer}>
            {activeTab === "upcoming" && renderEventos(upcoming)}
            {activeTab === "ongoing" && renderEventos(ongoing)}
            {activeTab === "past" && renderEventos(past)}
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você ainda não participou de nenhum evento.</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: theme.colors.primary,
  },
  tabButtonText: {
    fontSize: 14,
    color: '#333',
  },
  activeTabButtonText: {
    color: '#FFF',
  },
  eventosContainer: {
    marginTop: 16,
  },
  emptyContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default Historico;

