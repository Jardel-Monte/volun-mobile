import React, {useEffect, useState} from "react";
import axios from "axios";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function DadosEndereco({ userAddress, setUserAddress, editable  }) {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const buscarCEP = async (e) => {
        e.preventDefault();
        const cep = enderecoData.cep.replace(/\D/g,"");
        if (cep.length >= 8){
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (!data.erro){
                   setEnderecoData({
                        ...enderecoData,
                        logradouro : data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        estado: data.uf,
                   }); 
                }
                else {
                    alert("CEP não encontrado.");
                }
            }
            catch (error){
                alert(`Erro ao buscar CEP. Tente novamente., ${error}`);
            }
        } else {
            alert("CEP inválido.");
        }
    };

    return (
        <View>
            <Text>Dados Endereço</Text>
            <View>
                <TextInput 
                    placeholder="CEP"
                    value={userAddress.cep}
                    onChangeText={(text) => setUserAddress({...userAddress, cep : text})}
                    editable={editable}
                />
                <TouchableOpacity onPress={buscarCEP}>
                    <Text>Buscar</Text>
                </TouchableOpacity>
            </View>
            <View>
                <View>
                    <TextInput 
                        placeholder="Endereço"
                        value={userAddress.endereco}
                        onChangeText={(text) => setUserAddress({...userAddress, endereco : text})}
                        editable={false}
                    />
                </View>
                <View>
                    <TextInput 
                        placeholder="Numero"
                        value={userAddress.numero}
                        onChangeText={(text) => setUserAddress({...userAddress, numero : text})}
                        editable={editable}
                    />
                </View>
            </View>
            <View>
                <TextInput 
                    placeholder="Bairro"
                    value={userAddress.bairro}
                    onChangeText={(text) => setUserAddress({...userAddress, bairro : text})}
                    editable={false}
                />
            </View>
            <View>
                <View>
                    <TextInput 
                        placeholder="Cidade"
                        value={userAddress.cidade}
                        onChangeText={(text) => setUserAddress({...userAddress, cidade : text})}
                        editable={false}
                    />
                </View>
                <View>
                    <TextInput 
                        placeholder="Estado"
                        value={userAddress.estado}
                        onChangeText={(text) => setUserAddress({...userAddress, estado : text})}
                        editable={false}
                    />
                </View>
            </View>
        </View>
    );
}