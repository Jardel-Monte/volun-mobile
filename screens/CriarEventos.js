import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, ScrollView, View, StyleSheet, Image, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Chip } from 'react-native-paper';
import axios from 'axios';


const CriarEventos = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
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
    'Solidariedade', 'Educação', 'Saúde', 'Meio Ambiente', 'Cultura', 'Voluntariado', 'Tecnologia', // Tags disponíveis
  ]);

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
      const formattedTags = tags.split(',').map(tag => tag.trim());

      const eventoData = {
        titulo,
        descricao,
        tags: formattedTags,
        dataInicio,
        dataFinal,
        imagem: selectedImage,
        vaga_limite: parseInt(vagaLimite),
      };

      const enderecoData = {
        logradouro,
        bairro,
        cep,
        cidade,
        estado,
        numero: parseInt(numero),
      };

      const responseEvento = await fetch('https://volun-api-eight.vercel.app/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventoData),
      });

      const eventoResult = await responseEvento.json();
      if (!responseEvento.ok) {
        throw new Error(`Erro ao criar evento: ${eventoResult.message || 'Erro desconhecido'}`);
      }

      const responseEndereco = await fetch('https://volun-api-eight.vercel.app/endereco', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...enderecoData, evento_id: eventoResult._id }),
      });

      const enderecoResult = await responseEndereco.json();
      if (!responseEndereco.ok) {
        throw new Error(`Erro ao criar endereço: ${enderecoResult.message || 'Erro desconhecido'}`);
      }

      alert("Evento criado com sucesso!");
    } catch (error) {
      alert(`Erro ao criar evento: ${error.message}`);
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
            placeholder="Data de Início"
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
            placeholder="Data de Término"
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

      <TouchableOpacity style={styles.cancelButton} onPress={handleSave}>
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
