import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function DadosEndereco({ userAddress, setUserAddress, editable }) {

    return (
        <View>
            <Text>Dados Endereço</Text>
            <View>
                <TextInput 
                    placeholder="CEP"
                    value={userAddress.cep}
                    onChangeText={(text) => setUserAddress({...userAddress, cep : text})}
                    editable={!editable}
                />
                <TouchableOpacity>
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
                        editable={!editable}
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