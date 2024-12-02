import React, { useState, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import axios from "axios";
import { getAuth } from "firebase/auth";

import DadosPessoal from "./DadosPessoal";
import DadosEndereco from "./DadosEndereco";

export default function InformacaoPessoal() {
    const [editable, setEditable] = useState(false);
    const [activeComponent, setActiveComponent] = useState("DadosPessoal");
    const [userData, setUserData] = useState({
        nome: "",
        sobrenome: "",
        cpf: "",
        dataNasc: "",
        ddd: "",
        telefone: "",
        email: "",
    });
    const [userAddress, setUserAddress] = useState({
        cep: "",
        endereco: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const toggleEditable = () => {
        setEditable(!editable);
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        setError(false);

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setError("Usuário não autenticado.");
            setLoading(false);
            return;
        }

        const uid = user.uid;

        try {
            if (activeComponent === "DadosPessoal") {
                const updatedUserData = {
                    nome: userData.nome.trim(),
                    sobrenome: userData.sobrenome.trim(),
                    cpf: userData.cpf,
                    data_nascimento: userData.dataNasc,
                    ddd: userData.ddd,
                    telefone: userData.telefone,
                };

                await axios.put(`https://volun-api-eight.vercel.app/usuarios/${uid}`, updatedUserData);
            } else if (activeComponent === "DadosEndereço") {
                const updatedAddressData = {
                    cep: userAddress.cep,
                    endereco: userAddress.endereco,
                    numero: userAddress.numero,
                    bairro: userAddress.bairro,
                    cidade: userAddress.cidade,
                    estado: userAddress.estado,
                };

                await axios.put(`https://volun-api-eight.vercel.app/enderecos/${uid}`, updatedAddressData);
            }

            setEditable(false);
        } catch (error) {
            setError("Erro ao salvar alterações.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelChanges = () => {
        setEditable(false);
    };

    const renderActiveComponent = () => {
        if (activeComponent === "DadosPessoal") {
            return <DadosPessoal userData={userData} setUserData={setUserData} editable={editable} />;
        } else if (activeComponent === "DadosEndereço") {
            return <DadosEndereco userAddress={userAddress} setUserAddress={setUserAddress} editable={editable} />;
        }
        return null;
    };

    const handleFormUser = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setError("Usuário não autenticado.");
            return;
        }

        const uid = user.uid;
        setLoading(true);

        try {
            const response = await axios.get(`https://volun-api-eight.vercel.app/usuarios/${uid}`);
            setUserData({ ...response.data, email: user.email });

            const enderecoResponse = await axios.get(`https://volun-api-eight.vercel.app/endereco/usuario/${uid}`);
            if (enderecoResponse.data && enderecoResponse.data.length > 0) {
                const endereco = enderecoResponse.data[0];
                setUserAddress({
                    cep: endereco.cep || "",
                    endereco: endereco.endereco || "",
                    numero: endereco.numero || "",
                    bairro: endereco.bairro || "",
                    cidade: endereco.cidade || "",
                    estado: endereco.estado || "",
                });
            }
        } catch (error) {
            setError("Erro ao buscar dados do usuário.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFormUser();
    }, []);

    return (
        <View>
            <ScrollView>
                {renderActiveComponent()}
            </ScrollView>
            <View>
                <TouchableOpacity onPress={() => setActiveComponent("DadosPessoal")}>
                    <Text>Dados Pessoais</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveComponent("DadosEndereço")}>
                    <Text>Endereço</Text>
                </TouchableOpacity>
            </View>
            <View>
                {editable ? (
                    <View>
                        <TouchableOpacity onPress={handleSaveChanges}>
                            <Text>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCancelChanges}>
                            <Text>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={toggleEditable}>
                        <Text>Editar</Text>
                    </TouchableOpacity>
                )}
            </View>
            {loading && <Text>Carregando...</Text>}
            {error && <Text>{error}</Text>}
        </View>
    );
}
