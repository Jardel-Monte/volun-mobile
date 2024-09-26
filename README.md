```markdown
# Volun-Mobile

Volun-Mobile é um aplicativo mobile para facilitar a conexão entre voluntários e organizações que precisam de ajuda. O objetivo é criar uma plataforma simples e intuitiva onde usuários podem se cadastrar, procurar por oportunidades de voluntariado, e se conectar com instituições.

## 📱 Funcionalidades

- Cadastro de novos usuários
- Login para usuários existentes
- Formulário para inserção de informações pessoais
- Conexão com Firebase para autenticação e armazenamento de dados
- Interface amigável e moderna, seguindo as melhores práticas de design mobile

## 🚀 Tecnologias Utilizadas

- React Native: para o desenvolvimento da interface mobile
- Expo: para facilitar o desenvolvimento e a execução do app
- Firebase: para autenticação e banco de dados
- JavaScript (ES6+)
- Vercel: para hospedar a API do backend

## 📦 Instalação

Siga as etapas abaixo para rodar o projeto localmente:

### Pré-requisitos
- Node.js (versão recomendada: >= 14)
- Expo CLI (`npm install -g expo-cli`)
- Firebase SDK

### Clonar o repositório

```bash
git clone https://github.com/seu-usuario/volun-mobile.git
cd volun-mobile
```

### Instalar dependências

```bash
npm install
```

### Rodar o projeto

```bash
npx expo start
```

## 🔧 Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Adicione um app para Android e/ou iOS.
3. Copie as credenciais de configuração e coloque-as no arquivo `firebase-config.js` do projeto.

## 📂 Estrutura do Projeto

```bash
volun-mobile/
├── assets/               # Assets estáticos como imagens
├── components/           # Componentes reutilizáveis da interface
├── hooks/                # Recursos reutilizáveis do React
├── screens/              # Telas principais do app (Login, Splash, etc.)
├── styles/               # Definições de estilos globais
├── services/             # Configurações do Firebase
├── App.js                # Componente raiz da aplicação
├── app.json              # Configurações do projeto Expo
└── package.json          # Dependências do projeto
```

## 🔧 Customizações

### Estilos
O projeto utiliza uma estrutura de estilos centralizada no arquivo `theme.js`, dentro da pasta `styles`. Esse arquivo permite personalizar temas e fontes, como a fonte Poppins, amplamente utilizada no app.

### Autenticação
O app utiliza o Firebase Authentication para gerenciar login e cadastro de usuários.

## 🛠️ Melhorias Futuras

- Integração com mapas para localizar oportunidades de voluntariado
- Funcionalidade de chat para comunicação entre voluntários e organizações
- Notificações push para alertar sobre novas oportunidades

## 🧑‍💻 Contribuindo

Sinta-se à vontade para contribuir com o desenvolvimento do Volun-Mobile! Veja abaixo como você pode contribuir:

1. Faça um fork do repositório
2. Crie uma nova branch (`git checkout -b minha-nova-feature`)
3. Faça suas alterações e faça o commit (`git commit -m 'Minha nova feature'`)
4. Envie para a branch original (`git push origin minha-nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para obter mais detalhes.

---

Desenvolvido por:
 - [Jardel Monte](https://github.com/Jardel-Monte)
 - [Thaina Lima](https://github.com/Judethebuilder)
```
