import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, ScrollView, View, StyleSheet, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

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
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFinalPicker, setShowFinalPicker] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.uri);
    }
  };

  const handleTagsChange = (input) => {
    setTags(input.replace(/[^a-zA-Z0-9, ]/g, '')); // Apenas letras, números e vírgulas
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Novo Evento</Text>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre a Organização</Text>
        <TextInput
          style={styles.input}
          placeholder="Categorias (separadas por vírgula)"
          value={tags}
          onChangeText={handleTagsChange}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Qual será o local do seu evento?</Text>
        <TextInput
          style={styles.input}
          placeholder="Logradouro"
          value={logradouro}
          onChangeText={setLogradouro}
        />
        <TextInput
          style={styles.input}
          placeholder="Número"
          value={numero}
          onChangeText={setNumero}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Bairro"
          value={bairro}
          onChangeText={setBairro}
        />
        <TextInput
          style={styles.input}
          placeholder="CEP"
          value={cep}
          onChangeText={setCEP}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Cidade"
          value={cidade}
          onChangeText={setCidade}
        />
        <TextInput
          style={styles.input}
          placeholder="Estado"
          value={estado}
          onChangeText={setEstado}
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data e hora do evento</Text>
        <TouchableOpacity onPress={() => setShowInicioPicker(true)}>
          <Text>Data de Início: {dataInicio.toLocaleString()}</Text>
        </TouchableOpacity>
        {showInicioPicker && (
          <DateTimePicker
            value={dataInicio}
            mode="datetime"
            display="default"
            onChange={(event, selectedDate) => {
              setShowInicioPicker(false);
              if (selectedDate) setDataInicio(selectedDate);
            }}
          />
        )}
        <TouchableOpacity onPress={() => setShowFinalPicker(true)}>
          <Text>Data de Término: {dataFinal.toLocaleString()}</Text>
        </TouchableOpacity>
        {showFinalPicker && (
          <DateTimePicker
            value={dataFinal}
            mode="datetime"
            display="default"
            onChange={(event, selectedDate) => {
              setShowFinalPicker(false);
              if (selectedDate) setDataFinal(selectedDate);
            }}
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
            <Image source={{ uri: selectedImage }} style={styles.image} />
          ) : (
            <Text style={styles.imagePickerText}>Selecione uma imagem</Text>
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
    padding: 20,
    height: 140,
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
  tag: {
    backgroundColor: "#e9e9ff",
    padding: 8,
    borderRadius: 8,
    marginRight: 5,
    fontSize: 14,
    color: "#3c3c99",
  },
});

export default CriarEventos;
