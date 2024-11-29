import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import DadosPessoal from "./DadosPessoal";
import DadosEndereco from "./DadosEndereco";

export default function InformacaoPessoal() {
    const [editable, setEditable] = useState(false);
    const [activeComponent, setActiveComponent] = useState("DadosPessoal");
    const [userData, setUserData] = useState({
        nome : "",
        sobrenome : "",
        cpf : "",
        dataNasc : "",
        ddd : "",
        telefone : "",
        email : ""
    });
    const [userAddress, setUserAddress] = useState({
        cep : "",
        endereco : "",
        numero : "",
        bairro : "",
        cidade : "",
        estado : ""
    });

    const toggleEditable = () => {
        setEditable(true);
    }

    const renderActivateComponent = () => {
        if (activeComponent === "DadosPessoal"){
            return <DadosPessoal 
                userData={userData}
                setUserData={setUserData}
                editable={editable}
            />
        }
        else if (activeComponent === "DadosEndereço"){
            return <DadosEndereco 
                userAddress={userAddress}
                setUserAddress={setUserAddress}
                editable={editable}
            />
        }
        else {
            return null;
        }        
    }

    return(
        <View>
            <ScrollView>
                {renderActivateComponent()}
            </ScrollView>
            <View>
                <TouchableOpacity
                    onPress={() => setActiveComponent("DadosPessoal")}
                >
                    <Text>Dados Pessoais</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveComponent("DadosEndereço")}
                >
                    <Text>Endereço</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={toggleEditable}>
                    <Text>Editar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}