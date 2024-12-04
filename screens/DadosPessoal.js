import React, { useEffect, useState } from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import axios from "axios";
import { getAuth } from "../services/firebase-config";

export default function DadosPessoal({ userData, setUserData, editable }) {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const formatarNome = (nome) =>{
        nome = nome.replace(/[^a-zA-ZáéíóúàèìòùãõâêîôûçÇÁÉÍÓÚÀÈÌÒÙ\s]/g, '');
        return nome;
    }

    const formatarSobrenome = (sobrenome) => {
        sobrenome = sobrenome.replace(/[^a-zA-ZáéíóúàèìòùãõâêîôûçÇÁÉÍÓÚÀÈÌÒÙ\s]/g, '');
        return sobrenome;
    }

    const validarCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

        if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) {
            return false;
        }

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }

        let rev1 = 11 - (soma % 11);
        if (rev1 === 10 || rev1 === 11) rev1 = 0;
        if (rev1 !== parseInt(cpf.charAt(9))) return false;
        
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }

        let rev2 = 11 - (soma % 11);
        if (rev2 === 10 || rev2 === 11) rev2 = 0;
        return rev2 === parseInt(cpf.charAt(10));
    };

    const formatarCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca o primeiro ponto
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca o segundo ponto
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca o hífen
        return cpf;
    }; 
    
    // Função para converter "dd/mm/yyyy" para "yyyy-mm-dd"
    const formatarData = (date) => {
        // Verifica se a data está no formato correto
        const [dia, mes, ano] = date.split('/').map(Number);
        // Verifica se a data é válida
        if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
            throw new Error("Data inválida. A data deve estar no formato dd/mm/yyyy.");
        }
        // Cria um objeto Date com ano, mês (0-indexado), e dia
        const dataConvertida = new Date(ano, mes - 1, dia);
        // Verifica se a data foi criada corretamente
        if (dataConvertida.getDate() !== dia || dataConvertida.getMonth() + 1 !== mes || dataConvertida.getFullYear() !== ano) {
            throw new Error("Data inválida.");
        }
        // Formata a data para o formato "yyyy-mm-dd"
        const dataFormatada = dataConvertida.toISOString().split('T')[0];
        return dataFormatada;
    }

    const formatarDDD = (ddd) => {
        // Remove caracteres não numéricos
        ddd = ddd.replace(/\D/g, '');
        
        // Garantir que o DDD tenha exatamente 2 dígitos
        if (ddd.length === 2) {
            return ddd; // Retorna o DDD formatado corretamente
        } else {
            setError(true); // Retorna uma string vazia se o DDD não for válido
        }
    };

    const formatarTelefone = (telefone) => {
        telefone = telefone.replace(/\D/g, ""); // Remove caracteres não numéricos
        telefone = telefone.replace(/(\d{5})(\d{4})/, "$1-$2"); // Coloca o hífen no número

        return telefone.length != 9 ? setError(true) : telefone 
    }

    return (
        <View style={styles.container}>
            <Text>DadosPessoal</Text>
            <ScrollView style={styles.scrollViewComponent}>
                <View>
                    <View>
                        <TextInput
                            style={[styles.inputNome, styles.componentInput]}
                            placeholder="Nome" 
                            value={userData.nome} 
                            onChangeText={(text) => setUserData({...userData, nome : formatarNome(text) })}
                            editable={editable}
                        />
                    </View>
                    <View>
                        <TextInput
                            style={[styles.inputNome, styles.componentInput]}
                            placeholder="Sobrenome" 
                            value={userData.sobrenome}
                            onChangeText={(text) => setUserData({...userData, sobrenome : formatarSobrenome(text) })}
                            editable={editable}
                        />
                    </View>
                </View>
                <View>
                    <TextInput 
                        style={[styles.inputCPF, styles.componentInput]}
                        placeholder="CPF" 
                        value={userData.cpf}
                        onChangeText={(text) => setUserData({...userData, cpf : formatarCPF(text) })}
                        editable={false}
                    />
                </View>
                <View>
                    <TextInput
                        style={[styles.inputDataNasc, styles.componentInput]}
                        placeholder="Data de Nascimento" 
                        value={userData.dataNasc}
                        onChangeText={(text) => setUserData({...userData, dataNasc : formatarData(text)})}
                        editable={false}
                    />
                </View>
                <View>
                    <View>
                        <TextInput
                            style={[styles.inputDDD, styles.componentInput]}
                            placeholder="DDD" 
                            value={userData.ddd}
                            onChangeText={(text) => setUserData({...userData, ddd : formatarDDD(text)})}
                            editable={editable}
                        />
                    </View>
                    <View>
                        <TextInput
                            style={[styles.inputTelefone, styles.componentInput]}
                            placeholder="Telefone" 
                            value={userData.telefone}
                            onChangeText={(text) => setUserData({...userData, telefone : formatarTelefone(text)})}
                            editable={editable}
                        />
                    </View>
                </View>
                <View>
                    <TextInput
                        style={[styles.inputEmail, styles.componentInput]}
                        placeholder="Email" 
                        value={userData.email} 
                        onChangeText={(text) => setUserData({...userData, email : text})}
                        editable={false}
                    />    
                </View>
            </ScrollView>
            {error && <Text style={styles.error}>Erro ao buscar dados. Tente novamente.</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 50,
    },    
    scrollViewComponent: {
        width: '100%',
        marginBottom: 40,
        paddingBottom: 40,
    },
    componentInput: {
        backgroundColor: '#e5e5e5',
        marginVertical: 10,
        borderRadius: 16,
        paddingLeft: 10,
    },
    inputNome: {
        width: 200,
    },
    inputCPF: {
        width: 160,
    },
    inputDataNasc: {
        width: 100,
    },
    inputDDD: {
        width: 80,
    },
    inputTelefone: {
        width: 100,
    },
    inputEmail: {
        width: 300,
    },
})