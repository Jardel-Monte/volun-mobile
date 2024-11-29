import React from "react";
import { Text, TextInput, View } from "react-native";

export default function DadosPessoal({ userData, setUserData, editable}) {
    return (
        <View>
            <Text>DadosPessoal</Text>
            <View>
                <View>
                    <TextInput 
                        placeholder="Nome" 
                        value={userData.nome} 
                        onChangeText={(text) => setUserData({...userData, nome : text})}
                        editable={!editable}
                    />
                </View>
                <View>
                    <TextInput 
                        placeholder="Sobrenome" 
                        value={userData.sobrenome}
                        onChangeText={(text) => setUserData({...userData, sobrenome : text})}
                        editable={!editable}
                    />
                </View>
            </View>
            <View>
                <TextInput 
                    placeholder="CPF" 
                    value={userData.cpf}
                    onChangeText={(text) => setUserData({...userData, cpf : text})}
                    editable={false}
                />
            </View>
            <View>
                <TextInput 
                    placeholder="Data de Nascimento" 
                    value={userData.dataNasc}
                    onChangeText={(text) => setUserData({...userData, dataNasc : text})}
                    editable={false}
                />
            </View>
            <View>
                <View>
                    <TextInput 
                        placeholder="DDD" 
                        value={userData.ddd}
                        onChangeText={(text) => setUserData({...userData, ddd : text})}
                        editable={!editable}
                    />
                </View>
                <View>
                    <TextInput 
                        placeholder="Telefone" 
                        value={userData.telefone}
                        onChangeText={(text) => setUserData({...userData, telefone : text})}
                        editable={!editable}
                    />
                </View>
            </View>
            <View>
                <TextInput 
                    placeholder="Email" 
                    value={userData.email} 
                    onChangeText={(text) => setUserData({...userData, email : text})}
                    editable={false}
                />    
            </View>
        </View>
    );
}