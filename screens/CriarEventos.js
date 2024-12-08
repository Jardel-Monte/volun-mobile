import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, ScrollView, View, StyleSheet, Image, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Chip } from 'react-native-paper';
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage
import uuid from 'react-native-uuid'; // Para gerar nomes únicos de arquivos (instale com `npm install react-native-uuid`)
import { useRoute } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native';

const CriarEventos = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [descricao2, setDescricao2] = useState('');
  const [tags, setTags] = useState('');
  const [vagaLimite, setVagaLimite] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cep, setCEP] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [numero, setNumero] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFinalPicker, setShowFinalPicker] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([
    "Educação", "Saúde", "Social", "Meio Ambiente", "Cultura", "Arte", "Esporte",
  "Lazer", "Alimentação", "Animais", "Assistência Social", "Música", "Cooperativo",
  "Tecnologia", "Apoio Psicológico", "Reciclagem", "Eventos Religiosos",
  "Treinamentos", "Inclusão Digital", "Capacitação", "Empreendedorismo",
  "Eventos Infantis", "Moradia", "Resgate", "Acessibilidade", "Combate à Fome",
  "Bem-Estar", "Direitos Humanos", "Reforma de Espaços", "Defesa Civil",
  "Combate à Violência", "Saúde Mental", "Rural", "Governamental", "Doação",
  "Urbano", "Outros", // Tags disponíveis
  ]);
  const route = useRoute();
  const orgId = route.params?.orgId;
  const navigation = useNavigation();
  const storage = getStorage(); // Inicializa o Firebase Storage

  const buscarCep = async () => {
    if (!cep) {
      Alert.alert('Erro', 'Por favor, insira um CEP válido com 8 dígitos.');
      return;
    }

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const data = response.data;

      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado. Verifique e tente novamente.');
        return;
      }

      setLogradouro(data.logradouro || '');
      setBairro(data.bairro || '');
      setCidade(data.localidade || '');
      setEstado(data.uf || '');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao buscar o CEP. Tente novamente.');
    }
  };

  const handleSelectTag = (tag) => {
    if (selectedTags.length < 5 && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };


  const parseDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split(' ');
    if (parts.length !== 2) return null;
    
    const [datePart, timePart] = parts;
    const [day, month, year] = datePart.split('/');
    const [hour, minute] = timePart.split(':');
    
    return new Date(year, month - 1, day, hour, minute);
  };

  const formatInputDate = (text) => {
    // Remove todos os caracteres não numéricos
    const numbers = text.replace(/\D/g, '');
    
    let formattedText = '';
    let day = numbers.slice(0, 2);
    let month = numbers.slice(2, 4);
    let year = numbers.slice(4, 8);
    let hour = numbers.slice(8, 10);
    let minute = numbers.slice(10, 12);

    // Validação e formatação do dia
    if (day.length === 2) {
      day = Math.min(Math.max(parseInt(day), 1), 31).toString().padStart(2, '0');
    }
    
    // Validação e formatação do mês
    if (month.length === 2) {
      month = Math.min(Math.max(parseInt(month), 1), 12).toString().padStart(2, '0');
    }
    
    // Validação e formatação da hora
    if (hour.length === 2) {
      hour = Math.min(Math.max(parseInt(hour), 0), 23).toString().padStart(2, '0');
    }
    
    // Validação e formatação do minuto
    if (minute.length === 2) {
      minute = Math.min(Math.max(parseInt(minute), 0), 59).toString().padStart(2, '0');
    }

    // Montagem da data formatada
    if (day) formattedText += day;
    if (month) formattedText += '/' + month;
    if (year) formattedText += '/' + year;
    if (hour) formattedText += ' ' + hour;
    if (minute) formattedText += ':' + minute;

    return formattedText;
  };

  const isValidDate = (dateString) => {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    const date = new Date(year, month - 1, day);
    return date.getFullYear() == year && date.getMonth() == month - 1 && date.getDate() == day;
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Você precisa permitir o acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {

      if (!titulo.trim()) {
        Alert.alert('Erro', 'Por favor, insira um título para o evento.');
        return;
      }

      if (!descricao.trim()) {
        Alert.alert('Erro', 'Por favor, insira uma descrição para o evento.');
        return;
      }

      if (!dataInicio || !dataFinal) {
        Alert.alert('Erro', 'Por favor, insira as datas de início e término do evento.');
        return;
      }

      if (!vagaLimite || parseInt(vagaLimite) <= 0) {
        Alert.alert('Erro', 'Por favor, insira um número válido de vagas para voluntários.');
        return;
      }

      if (!selectedImage) {
        Alert.alert('Erro', 'Por favor, selecione uma imagem para o evento.');
        return;
      }

      if (selectedTags.length === 0) {
        Alert.alert('Erro', 'Por favor, selecione pelo menos uma tag para o evento.');
        return;
      }

      if (!selectedImage) {
        alert("Selecione uma imagem antes de criar o evento.");
        return;
      }
  
      // 1. Fazer o upload da imagem para o Firebase Storage
      const imageName = `${uuid.v4()}.jpg`; // Nome único para a imagem
      const imageRef = ref(storage, `eventos/${imageName}`);
  
      const response = await fetch(selectedImage);
      const blob = await response.blob();
  
      console.log("Fazendo upload da imagem...");
      await uploadBytes(imageRef, blob);
  
      // 2. Obter a URL da imagem
      const imageUrl = await getDownloadURL(imageRef);
      console.log("URL da imagem carregada:", imageUrl);

  
      // Dados para criação do endereço
      const enderecoData = {
        logradouro: logradouro, // Rua
        bairro: bairro,
        cep: cep,
        cidade: cidade,
        estado: estado,
        numero: numero,
      };
  
      console.log("Dados do endereço a serem enviados:", enderecoData);
  
      // 1. Criar endereço
      const enderecoResponse = await fetch('https://volun-api-eight.vercel.app/endereco', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enderecoData),
      });
  
      if (!enderecoResponse.ok) {
        throw new Error('Erro ao criar endereço.');
      }
  
      // Resposta da API para criação do endereço
      const enderecoResponseText = await enderecoResponse.text();
      console.log("Resposta bruta da API para criação do endereço:", enderecoResponseText);
  
      let enderecoCriado;
      try {
        // Tenta converter para JSON
        enderecoCriado = JSON.parse(enderecoResponseText);
      } catch (e) {
        // Se não for JSON, trata como uma mensagem simples
        enderecoCriado = { endereco: { _id: enderecoResponseText } };
      }
  
      console.log("Resposta da API para criação do endereço:", enderecoCriado);
  
      const enderecoId = enderecoCriado.endereco?._id;
  
      if (!enderecoId) {
        throw new Error('O ID do endereço não foi encontrado na resposta da API.');
      }
  
      // Função para converter datas no formato "dd/MM/yyyy HH:mm" para ISO
      const convertToISO = (dateString) => {
        const [datePart, timePart] = dateString.split(" ");
        const [day, month, year] = datePart.split("/").map(Number);
        const [hours, minutes] = timePart.split(":").map(Number);
        return new Date(year, month - 1, day, hours, minutes).toISOString();
      };
  
      const dataInicioISO = convertToISO(dataInicio);
      const dataFimISO = convertToISO(dataFinal);
  
      // Dados para criação do evento
      const eventoData = {
        titulo: titulo,
        descricao: descricao,
        descricao_2: descricao2,
        tags: selectedTags,
        data_inicio: dataInicioISO,
        data_fim: dataFimISO,
        vaga_limite: Number(vagaLimite),
        ong_id: orgId,
        endereco_id: enderecoId,
        imagem: imageUrl,
      };
  
      console.log("Dados do evento a serem enviados:", eventoData);
  
      // 2. Criar evento
      const eventoResponse = await fetch('https://volun-api-eight.vercel.app/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventoData),
      });
  
      if (!eventoResponse.ok) {
        throw new Error('Erro ao criar evento.');
      }
  
  
      alert('Evento criado com sucesso!');
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Erro ao salvar:', error.message);
      alert('Ocorreu um erro ao salvar. Tente novamente.');
    }
  };
  
  
  
  

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDateChange = (setDate, setShowPicker) => (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(formatDate(selectedDate));
    }
  };

  const handleInputChange = (text, setDate) => {
    const formattedText = formatInputDate(text);
    setDate(formattedText);
    
    // Validação adicional para datas completas
    if (formattedText.length === 16) {
      if (!isValidDate(formattedText)) {
        alert('Data inválida. Por favor, verifique e tente novamente.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Novo Evento</Text>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Qual será o local do seu evento?</Text>

        <TextInput
          style={styles.input}
          placeholder="Número"
          value={numero}
          onChangeText={setNumero}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="CEP"
          value={cep}
          onChangeText={setCEP}
          keyboardType="numeric"
        />

        <Button title="Buscar CEP" onPress={buscarCep} />
        
        <TextInput
          style={styles.input}
          placeholder="Logradouro"
          value={logradouro}
          editable={false} // Campo desabilitado
        />
        <TextInput
          style={styles.input}
          placeholder="Bairro"
          value={bairro}
          editable={false} // Campo desabilitado
        />
        <TextInput
          style={styles.input}
          placeholder="Cidade"
          value={cidade}
          editable={false} // Campo desabilitado
        />
        <TextInput
          style={styles.input}
          placeholder="Estado"
          value={estado}
          editable={false} // Campo desabilitado
        />
      </View>


      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalhes do Evento</Text>
        <TextInput
          style={styles.input}
          placeholder="Título do Evento"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={styles.textArea}
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />
        <TextInput
          style={styles.textArea}
          placeholder="Descrição"
          value={descricao2}
          onChangeText={setDescricao2}
          multiline
        />
      </View>

      <View style={styles.divider} />

      <Text style={styles.tagsLabel}>Tags Selecionadas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedTags}>
        {selectedTags.map((tag) => (
          <Chip
            key={tag}
            onClose={() => handleRemoveTag(tag)}
            style={styles.chip}
          >
            {tag}
          </Chip>
        ))}
      </ScrollView>

      {/* Tags Disponíveis */}
      <Text style={styles.tagsLabel}>Selecione as Tags</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.availableTags}>
        {availableTags.map((tag) => (
          <Chip
            key={tag}
            onPress={() => handleSelectTag(tag)}
            style={styles.chip}
          >
            {tag}
          </Chip>
        ))}
      </ScrollView>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data e hora do evento</Text>

        <TouchableOpacity onPress={() => setShowInicioPicker(true)}>
          <TextInput
            style={styles.input}
            placeholder="data e hora de inicio 01/02/1234 12/00"
            value={dataInicio}
            onChangeText={(text) => handleInputChange(text, setDataInicio)}
            editable={true}
            keyboardType="numeric"
          />
        </TouchableOpacity>
        {showInicioPicker && (
          <DateTimePicker
            value={parseDate(dataInicio) || new Date()}
            mode="datetime"
            display="default"
            onChange={handleDateChange(setDataInicio, setShowInicioPicker)}
          />
        )}

        <TouchableOpacity onPress={() => setShowFinalPicker(true)}>
          <TextInput
            style={styles.input}
            placeholder="Data e hora de término 01/02/1234 23:59"
            value={dataFinal}
            onChangeText={(text) => handleInputChange(text, setDataFinal)}
            editable={true}
            keyboardType="numeric"
          />
        </TouchableOpacity>
        {showFinalPicker && (
          <DateTimePicker
            value={parseDate(dataFinal) || new Date()}
            mode="datetime"
            display="default"
            onChange={handleDateChange(setDataFinal, setShowFinalPicker)}
          />
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vagas para Voluntários</Text>
        <TextInput
          style={styles.input}
          placeholder="Quantidade de Vagas"
          value={vagaLimite}
          onChangeText={setVagaLimite}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Galeria</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePickerText}>Toque para adicionar uma imagem</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('HomeScreen')}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: "#f5f5ff", 
  },
  divider: {
    height: 1, 
    backgroundColor: "#ccc", 
    marginVertical: 15, 
    marginBottom: 40,
    opacity: 1, 
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3c3c99", 
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3c3c99",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    height: 120,
    fontSize: 16,
    color: "#333",
  },
  imagePicker: {
    backgroundColor: "#e9e9ff", 
    height: 220,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 15,
  },
  imagePickerText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#3c3c99", // Botão roxo
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#ff6961", // Botão de cancelar em vermelho
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },
  imagePreview: {
    width: 250,
    height: 190,
    resizeMode: "cover",
    borderRadius: 8,
  },
  tagsLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  selectedTags: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  availableTags: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  chip: {
    marginRight: 5,
    marginBottom: 5,
  },
  addTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default CriarEventos;
