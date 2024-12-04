import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, ScrollView, View, StyleSheet, Alert, Image } from 'react-native';
import { auth } from '../services/firebase-config';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';


const CriarORG = () => {
  const [nome, setNome] = useState('');
  const [razao_social, setRazaoSocial] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cnpj, setCNPJ] = useState('');
  const [ddd, setDDD] = useState('');
  const [telefone, setTelefone] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();


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

  const handleSubmit = async () => {
    if (!nome || !razao_social || !descricao || !cnpj || !ddd || !telefone || !selectedImage) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos e adicione uma imagem.');
      return;
    }

    try {
      const storage = getStorage();
      const imageName = `${uuid.v4()}.jpg`;
      const imageRef = ref(storage, `logo_organizacao/${imageName}`);

      const response = await fetch(selectedImage);
      const blob = await response.blob();

      console.log('Fazendo upload da imagem...');
      await uploadBytes(imageRef, blob);

      const imageUrl = await getDownloadURL(imageRef);
      console.log('URL da imagem carregada:', imageUrl);

      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Erro', 'Usuário não está logado.');
        return;
      }

      const organizacaoData = {
        nome,
        razao_social,
        descricao,
        cnpj: parseInt(cnpj, 10),
        ddd: parseInt(ddd, 10),
        telefone,
        img_logo: imageUrl,
        criador_id: userId,
      };

      const apiResponse = await fetch('https://volun-api-eight.vercel.app/organizacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(organizacaoData),
      });

      if (apiResponse.ok) {
        Alert.alert('Sucesso', 'Organização criada com sucesso!');
        // Redirecionar o usuário para a tela HomeScreen
        navigation.navigate('HomeScreen');
      } else {
        const errorText = await apiResponse.text();
        Alert.alert('Erro', `Erro ao criar organização: ${errorText}`);
      }
    } catch (error) {
      Alert.alert('Erro', `Erro ao criar organização: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Criar Organização</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da Organização"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Razão Social"
        value={razao_social}
        onChangeText={setRazaoSocial}
      />

      <TextInput
        style={styles.textArea}
        placeholder="Descrição"
        value={descricao}
        onChangeText={(text) => {
          if (text.length <= 500) {
           setDescricao(text);
          }
        }}
      multiline
      />


      <TextInput
        style={styles.input}
        placeholder="CNPJ (somente números)"
        value={cnpj}
        onChangeText={(text) => setCNPJ(text.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="DDD (somente números)"
        value={ddd}
        onChangeText={(text) => setDDD(text.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="numeric"
      />

        <Text style={styles.sectionTitle}>Galeria</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePickerText}>Toque para adicionar uma imagem</Text>
          )}
        </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Criar Organização</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: '#f5f5ff',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3c3c99',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    height: 120,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#3c3c99',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imagePicker: {
    backgroundColor: "#e9e9ff", 
    height: 190,
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
  imagePreview: {
    width: 190,
    height: 190,
    resizeMode: "cover",
    borderRadius: 100,
  },

});

export default CriarORG;
