import React, {useState} from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { theme } from "../styles/theme";

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
            <View style={styles.alignItemsComponent}>
                <View>
                    <TextInput
                        style={[styles.inputCPF,styles.componentInput]}
                        placeholder="CEP"
                        value={userAddress.cep}
                        onChangeText={(text) => setUserAddress({...userAddress, cep : text})}
                        editable={editable}
                    />
                </View>
                <View>
                    <TouchableOpacity style={styles.buttonContent} onPress={buscarCEP}>
                        <Text style={styles.buttonTextContent}>Buscar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.alignItemsComponent}>
                <View >
                    <TextInput
                        style={[styles.inputEndereco, styles.componentInput]}
                        placeholder="Endereço"
                        value={userAddress.logradouro}
                        onChangeText={(text) => setUserAddress({...userAddress, logradouro : text})}
                        editable={false}
                    />
                </View>
                <View>
                    <TextInput
                        style={[styles.inputNumero, styles.componentInput]}
                        placeholder="Numero"
                        value={userAddress.numero}
                        onChangeText={(text) => setUserAddress({...userAddress, numero : text})}
                        editable={editable}
                    />
                </View>
            </View>
            <View>
                <TextInput
                    style={[styles.inputBairro, styles.componentInput]}
                    placeholder="Bairro"
                    value={userAddress.bairro}
                    onChangeText={(text) => setUserAddress({...userAddress, bairro : text})}
                    editable={false}
                />
            </View>
            <View style={styles.alignItemsComponent}>
                <View>
                    <TextInput
                        style={[styles.inputCidade, styles.componentInput]}
                        placeholder="Cidade"
                        value={userAddress.cidade}
                        onChangeText={(text) => setUserAddress({...userAddress, cidade : text})}
                        editable={false}
                    />
                </View>
                <View>
                    <TextInput
                        style={[styles.inputEstado, styles.componentInput]}
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

const styles = StyleSheet.create({
    componentInput: {
        backgroundColor: '#e5e5e5',
        marginVertical: 10,
        borderRadius: 16,
        paddingLeft: 10,
    },
    alignItemsComponent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    inputCPF: {
        width: 100,
    },
    inputEndereco: {
        width: 200,
    },
    inputNumero: {
        width: 80,
        marginLeft: 10,
    },
    inputBairro: {
        width: 180,
    },
    inputCidade: {
        width: 180
    },
    inputEstado: {
        width: 80,
        marginLeft: 10,
    },
    buttonContent: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 12,
        width: 100,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginLeft: 15,
    },
    buttonTextContent: {
        color: theme.colors.white,
        textAlign: 'center',
    },
});