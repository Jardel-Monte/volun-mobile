import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { InstantSearch, useSearchBox, useHits } from "react-instantsearch-hooks";
import algoliaClient from "../services/algolia-config";
import EventoCard from "../componentes/eventoCard";  // Importando o EventoCard

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT",
  "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO",
  "RR", "SC", "SP", "SE", "TO"
];

const predefinedTags = [
  "Educação", "Saúde", "Social", "Meio Ambiente", "Cultura", "Arte", "Esporte",
  "Lazer", "Alimentação", "Animais", "Assistência Social", "Música", "Cooperativo",
  "Tecnologia", "Apoio Psicológico", "Reciclagem", "Eventos Religiosos",
  "Treinamentos", "Inclusão Digital", "Capacitação", "Empreendedorismo",
  "Eventos Infantis", "Moradia", "Resgate", "Acessibilidade", "Combate à Fome",
  "Bem-Estar", "Direitos Humanos", "Reforma de Espaços", "Defesa Civil",
  "Combate à Violência", "Saúde Mental", "Outros", "Governamental", "Doação",
  "Urbano", "Rural"
];

function Hits() {
  const { hits } = useHits();

  if (hits.length === 0) {
    return <Text style={styles.noResults}>Nenhum evento encontrado.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.resultsContainer}>
      {hits.map((hit) => (
        <EventoCard key={hit.objectID} evento={hit} />
      ))}
    </ScrollView>
  );
}

function SearchInput({ searchQuery, setSearchQuery }) {
  const { refine } = useSearchBox();

  const handleChange = (query) => {
    setSearchQuery(query);
    refine(query);
  };

  return (
    <TextInput
      style={styles.searchInput}
      placeholder="Digite sua pesquisa"
      value={searchQuery}
      onChangeText={handleChange}
    />
  );
}

export default function SearchScreen() {
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState([]);
  const [cidade, setCidade] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);  // Adicionado o estado de loading

  // Função para adicionar ou remover categorias
  const handleAddRemoveCategory = (categoria) => {
    if (categoriaSelecionada.includes(categoria)) {
      setCategoriaSelecionada(categoriaSelecionada.filter((cat) => cat !== categoria));
    } else if (categoriaSelecionada.length < 5) {
      setCategoriaSelecionada([...categoriaSelecionada, categoria]);
    }
  };

  const handleClearFilters = () => {
    setEstadoSelecionado("");
    setCategoriaSelecionada([]);
    setCidade("");
    setSearchQuery(""); 
  };

  const buscarEventos = async () => {
    try {
      setLoading(true);  // Definindo o estado de carregamento como verdadeiro
      const filters = [
        estadoSelecionado ? `endereco.estado:${estadoSelecionado}` : "",
        cidade ? `endereco.cidade:${cidade}` : "",
        categoriaSelecionada.length > 0
          ? categoriaSelecionada.map(cat => `tags:${cat}`).join(" OR ")
          : "",
      ].filter(Boolean).join(" AND ");

      const algoliaResponse = await algoliaClient.search(searchQuery || "", { filters });

      const eventosAlgolia = algoliaResponse.hits.map((hit) => ({
        ...hit,
        endereco: hit.endereco
          ? `${hit.endereco.bairro}, ${hit.endereco.cidade} - ${hit.endereco.estado}`
          : "Endereço indefinido",
        organizacaoNome: hit.organizacao?.nome || "Organização indefinida",
        organizacaoLogo: hit.organizacao?.imgLogo || "",
      }));

      setEventos(eventosAlgolia);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);  // Definindo o estado de carregamento como falso
    }
  };

  // Chama buscarEventos quando os filtros ou a pesquisa mudam
  useEffect(() => {
    buscarEventos();
  }, [estadoSelecionado, categoriaSelecionada, cidade, searchQuery]);

  return (
    <InstantSearch searchClient={algoliaClient} indexName="eventos">
      <View style={styles.container}>
        <Text style={styles.title}>Busque por seus Eventos aqui!</Text>
        <View style={styles.searchBar}>
          <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </View>

        <TouchableOpacity
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterToggleText}>
            {showFilters ? "Ocultar Filtros ▲" : "Exibir Filtros ▼"}
          </Text>
        </TouchableOpacity>

        {showFilters && (
          <View style={styles.filtersContainer}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Estado:</Text>
              <ScrollView horizontal style={styles.filterOptions}>
                {estados.map((estado, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.filterOption,
                      estadoSelecionado === estado && styles.filterOptionSelected,
                    ]}
                    onPress={() => setEstadoSelecionado(estado)}
                  >
                    <Text
                      style={
                        estadoSelecionado === estado ? styles.selectedText : styles.optionText
                      }
                    >
                      {estado}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.subTitle}>Selecione até 5 Categorias:</Text>
            <ScrollView style={styles.categoriesContainer}>
              {predefinedTags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryOption,
                    categoriaSelecionada.includes(tag) && styles.categoryOptionSelected,
                  ]}
                  onPress={() => handleAddRemoveCategory(tag)}
                >
                  <Text
                    style={
                      categoriaSelecionada.includes(tag) ? styles.selectedText : styles.optionText
                    }
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.clearFiltersButton} onPress={handleClearFilters}>
              <Text style={styles.clearFiltersText}>Limpar Filtros</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />  // Indicador de carregamento
        ) : (
          <Hits />
        )}
      </View>
    </InstantSearch>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  searchBar: { flexDirection: "row", marginBottom: 16 },
  searchInput: { flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 8 },
  filterToggle: { marginBottom: 8 },
  filterToggleText: { color: "#007BFF", textAlign: "center" },
  filtersContainer: { marginTop: 8 },
  filterRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  filterLabel: { marginRight: 8, fontWeight: "bold" },
  filterOptions: { flexDirection: "row" },
  filterOption: { padding: 8, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginRight: 8 },
  filterOptionSelected: { backgroundColor: "#007BFF", borderColor: "#007BFF" },
  optionText: { color: "#000" },
  selectedText: { color: "#fff" },
  categoriesContainer: { flexWrap: "wrap", flexDirection: "grid", marginBottom: 12 },
  categoryOption: { padding: 8, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, margin: 4 },
  categoryOptionSelected: { backgroundColor: "#007BFF", borderColor: "#007BFF" },
  noResults: { textAlign: "center", color: "#888", fontSize: 18, marginTop: 20 },
  resultsContainer: { paddingBottom: 20 },
  clearFiltersButton: {
    backgroundColor: "#FF6347", // Botão de limpar filtro com cor de alerta
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  clearFiltersText: { color: "#fff", fontWeight: "bold" },
  subTitle: { fontSize: 18, marginBottom: 8, fontWeight: "bold" },
});
