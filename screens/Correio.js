import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { auth } from '../services/firebase-config';
import { theme } from '../styles/theme';

const Correio = () => {
  const [advertencias, setAdvertencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdvertencias = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError('Usuário não autenticado');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://volun-api-eight.vercel.app/advertencias/usuario/${user.uid}`);
        if (response.status === 404) {
          // Treat 404 as "no warnings" instead of an error
          setAdvertencias([]);
        } else if (!response.ok) {
          throw new Error('Falha ao buscar advertências');
        } else {
          const data = await response.json();
          setAdvertencias(data.reverse());
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertencias();
  }, []);

  const renderAdvertencias = () => {
    return advertencias.map((item, index) => (
      <View key={index} style={styles.advertenciaItem}>
        <Text style={styles.advertenciaMotivo}>{item.motivo}</Text>
        <Text style={styles.advertenciaData}>
          Data: {new Date(item.data).toLocaleDateString('pt-BR')}
        </Text>
      </View>
    ));
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  if (advertencias.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>Nenhuma novidade no correio!</Text>
        <Text style={styles.emptySubtitle}>
          Parece que você está em dia com suas responsabilidades. 🎉
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>{renderAdvertencias()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  listContainer: {
    padding: 16,
  },
  advertenciaItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  advertenciaMotivo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  advertenciaData: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default Correio;