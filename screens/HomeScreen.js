import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from "react-native";

export default function EventosScreen({ navigation }) {
  const [eventos, setEventos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setIsLoading(true); // Indica que os dados estão carregando
        const response = await fetch(
          "https://volun-api-eight.vercel.app/eventos"
        );
        const data = await response.json();

        // Mapeia os dados e inverte a ordem dos eventos
        const eventosDetalhes = data.reverse().map((evento) => ({
          id: evento._id,
          titulo: evento.titulo,
          descricao: evento.descricao,
          ongNome: evento.ong_id?.nome || "ONG não especificada",
          dataInicio: evento.data_inicio,
          imgUrl: evento.imagem,
          vagaLimite: evento.vaga_limite,
          endereco: evento.endereco_id
            ? `${evento.endereco_id.bairro}, ${evento.endereco_id.cidade} - ${evento.endereco_id.estado}`
            : "Endereço não disponível",
          eventoCompleto: evento, // Adiciona o evento completo para detalhes
        }));

        setEventos(eventosDetalhes);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      } finally {
        setIsLoading(false); // Fim do carregamento
      }
    };

    fetchEventos();
  }, []);

  // Navega para a página de detalhes do evento
  const handleEventoPress = (eventoCompleto) => {
    navigation.navigate("EventoInfo", { evento: eventoCompleto }); // Altere o nome da rota para "EventoInfo"
  };

  // Renderiza cada item do evento
  const renderEvento = ({ item }) => (
    <TouchableOpacity onPress={() => handleEventoPress(item.eventoCompleto)}>
      <View style={styles.eventCard}>
        <Image source={{ uri: item.imgUrl }} style={styles.eventImage} />
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{item.titulo}</Text>
          <Text style={styles.eventOng}>ONG: {item.ongNome}</Text>
          <Text style={styles.eventDescription}>{item.descricao}</Text>
          <Text style={styles.eventAddress}>{item.endereco}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => item.id}
          renderItem={renderEvento}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.noEventosText}>
              Nenhum evento disponível no momento.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 15,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  eventInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  eventOng: {
    fontSize: 14,
    color: "#666",
  },
  eventDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  eventAddress: {
    fontSize: 14,
    color: "#6200ee",
    marginTop: 5,
  },
  noEventosText: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});
