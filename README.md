# Português - Brasil

# 🌾 PlagueHit

O **PlagueHit** é um aplicativo móvel inovador desenvolvido para revolucionar o monitoramento agrícola. Integrando tecnologias modernas de desenvolvimento mobile com sensores IoT, o aplicativo permite que agricultores e agrônomos realizem a detecção precoce de pragas e a análise da saúde do solo em tempo real, garantindo colheitas mais seguras, eficientes e sustentáveis.

---

## ✨ Funcionalidades Principais

*   📊 **Dashboard em Tempo Real:** Visão geral instantânea das métricas da sua fazenda, integrando dados diretos de sensores IoT espalhados pela lavoura.
*   🐛 **Detecção e Monitoramento de Pragas:** Ferramentas para identificar, registrar e acompanhar focos de pragas, permitindo uma resposta rápida.
*   🌱 **Análise de Solo:** Acompanhamento dos níveis de umidade, nutrientes e temperatura do solo para otimização da irrigação e adubação.
*   💬 **Chat Integrado:** Canal de comunicação direto entre a equipe de campo, administradores e especialistas agrícolas.
*   📜 **Histórico Completo (History):** Acesso ao registro de leituras passadas, alertas e ações tomadas, facilitando a análise de tendências a longo prazo.
*   🔐 **Autenticação Segura:** Sistema robusto de Login, Cadastro e Recuperação de Senha utilizando Firebase Authentication.
*   👤 **Gestão de Perfil:** Área dedicada para que o usuário gerencie suas informações pessoais e configurações do aplicativo.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

*   **[React Native](https://reactnative.dev/):** Framework para desenvolvimento de aplicativos móveis nativos utilizando React.
*   **[Expo](https://expo.dev/):** Plataforma para desenvolvimento universal React, facilitando testes e deploy.
*   **[Firebase](https://firebase.google.com/):** Backend as a Service (BaaS) utilizado para Autenticação e Banco de Dados (Firestore/Realtime DB).
*   **[TypeScript](https://www.typescriptlang.org/):** Superset do JavaScript que adiciona tipagem estática ao projeto.
*   **Sensores IoT:** (Integração de hardware via APIs/Backend para alimentar os dados do Dashboard).

---

## 📂 Estrutura do Projeto

A estrutura principal de diretórios do projeto está organizada da seguinte forma:

```text
PlagueHit/
├── App.tsx                     # Ponto de entrada principal do aplicativo
├── app.json                    # Configurações do Expo
├── src/
│   ├── assets/                 # Imagens, ícones e fontes (ex: home.jpeg, chip.png)
│   ├── components/             # Componentes reutilizáveis de UI
│   ├── pages/                  # Telas da aplicação
│   │   ├── Chat.tsx
│   │   ├── Dashboard.tsx
│   │   ├── History.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Profile.tsx
│   │   ├── Register.tsx
│   │   └── ResetPassword.tsx
│   ├── routes/                 # Configuração de navegação (routes.tsx)
│   └── services/               # Serviços externos
│       └── firebaseConfig.js   # Configuração e inicialização do Firebase
└── package.json                # Dependências do projeto
```

---

## 🚀 Como Executar o Projeto

Siga as instruções abaixo para configurar e rodar o projeto em seu ambiente de desenvolvimento local.

### Pré-requisitos

Antes de começar, você precisará ter as seguintes ferramentas instaladas em sua máquina:
*   [Node.js](https://nodejs.org/)
*   [Git](https://git-scm.com/)
*   [Expo CLI](https://docs.expo.dev/get-started/installation/)
*   Um smartphone com o aplicativo [Expo Go](https://expo.dev/client) instalado (ou um emulador Android/iOS configurado no computador).

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/plaguehit.git
cd plaguehit
```

### 2. Instale as dependências

Você pode utilizar o `npm` ou `yarn`:

```bash
# Usando npm
npm install

# Usando yarn
yarn install
```

### 3. Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Habilite a **Autenticação** (E-mail/Senha) e o **Firestore Database** (ou Realtime Database).
3. Registre um aplicativo Web no console do Firebase para obter suas chaves de configuração.
4. Abra o arquivo `src/services/firebaseConfig.js` e substitua as variáveis de ambiente pelas credenciais do seu projeto:

```javascript
// Exemplo em src/services/firebaseConfig.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export default app;
```

### 4. Execute a aplicação

Inicie o servidor de desenvolvimento do Expo:

```bash
npx expo start
```

*   Um QR Code será exibido no terminal e no navegador.
*   Abra o aplicativo **Expo Go** no seu celular, escaneie o QR Code e aguarde o carregamento do aplicativo (certifique-se de que o celular e o computador estejam na mesma rede Wi-Fi).

---

## 🤝 Como Contribuir

Contribuições são muito bem-vindas! Se você deseja ajudar a melhorar o PlagueHit, siga estes passos:

1. Faça um **Fork** do projeto.
2. Crie uma nova branch com a sua feature: `git checkout -b minha-feature`
3. Salve suas alterações e crie uma mensagem de commit detalhando o que foi feito: `git commit -m "feat: adiciona nova funcionalidade X"`
4. Envie suas alterações: `git push origin minha-feature`
5. Abra um **Pull Request**.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.



# English

# 🌾 PlagueHit

**PlagueHit** is an innovative mobile application designed to revolutionize agricultural monitoring. By integrating modern mobile development technologies with IoT sensors (such as the ESP32-CAM and DHT22), the app allows farmers and agronomists to perform early pest detection and real-time soil health analysis. This ensures safer, more efficient, and sustainable harvests.

---

## ✨ Key Features

*   📊 **Real-Time Dashboard:** Get an instant overview of your farm's metrics, integrating live data directly from IoT sensors deployed in the field.
*   🐛 **Pest Detection & Monitoring:** Leverage IoT camera integrations (ESP32-CAM) and logging tools to identify, record, and track pest outbreaks, enabling a rapid and targeted response.
*   🌱 **Soil Analysis:** Monitor soil moisture, nutrients, and temperature (utilizing sensors like the DHT22) to optimize irrigation and fertilization schedules.
*   💬 **Integrated Chat:** A direct communication channel connecting field staff, farm administrators, and agricultural experts.
*   📜 **Comprehensive History:** Access a full log of past sensor readings, alerts, and actions taken, making long-term trend analysis effortless.
*   🔐 **Secure Authentication:** Robust Login, Registration, and Password Recovery systems powered by Firebase Authentication.
*   👤 **Profile Management:** A dedicated section for users to manage their personal information and customize app settings.

---

## 🛠️ Tech Stack

This project is built using the following technologies:

*   **[React Native](https://reactnative.dev/):** A framework for building native mobile applications using React.
*   **[Expo](https://expo.dev/):** An open-source platform for making universal native apps for Android, iOS, and the web with JavaScript and React.
*   **[Firebase](https://firebase.google.com/):** Backend-as-a-Service (BaaS) used for Authentication and Database management (Firestore/Realtime DB).
*   **[TypeScript](https://www.typescriptlang.org/):** A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
*   **IoT Hardware:** Integration with microcontrollers and sensors (e.g., **ESP32-CAM** for image capture, **DHT22** for temperature and humidity) via backend APIs to feed data to the dashboard.

---

## 📂 Project Structure

The main directory structure of the project is organized as follows:

```text
PlagueHit/
├── App.tsx                     # Main entry point of the application
├── app.json                    # Expo configuration file
├── src/
│   ├── assets/                 # Images, icons, and fonts (e.g., home.jpeg, chip.png)
│   ├── components/             # Reusable UI components
│   ├── pages/                  # Application screens
│   │   ├── Chat.tsx
│   │   ├── Dashboard.tsx
│   │   ├── History.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Profile.tsx
│   │   ├── Register.tsx
│   │   └── ResetPassword.tsx
│   ├── routes/                 # Navigation configuration (routes.tsx)
│   └── services/               # External services integration
│       └── firebaseConfig.js   # Firebase initialization and setup
└── package.json                # Project dependencies and scripts
```

---

## 🚀 Getting Started

Follow the instructions below to set up and run the project in your local development environment.

### Prerequisites

Before you begin, ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [Git](https://git-scm.com/)
*   [Expo CLI](https://docs.expo.dev/get-started/installation/)
*   A smartphone with the [Expo Go](https://expo.dev/client) app installed (or a configured Android/iOS emulator on your computer).

### 1. Clone the repository

```bash
git clone https://github.com/your-username/plaguehit.git
cd plaguehit
```

### 2. Install dependencies

You can use either `npm` or `yarn`:

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Firebase Configuration

1. Create a new project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password provider) and **Firestore Database** (or Realtime Database, depending on your preference).
3. Register a Web App in the Firebase console to generate your configuration keys.
4. Open the `src/services/firebaseConfig.js` file and replace the placeholder variables with your project's actual credentials:

```javascript
// Example in src/services/firebaseConfig.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export default app;
```

### 4. Run the application

Start the Expo development server:

```bash
npx expo start
```

*   A QR Code will appear in your terminal and in the Expo DevTools browser window.
*   Open the **Expo Go** app on your physical device, scan the QR Code, and wait for the app to bundle and load (ensure your phone and computer are connected to the same Wi-Fi network).

---

## 🤝 Contributing

Contributions are very welcome! If you'd like to help improve PlagueHit, please follow these steps:

1. **Fork** the project.
2. Create a new branch for your feature: `git checkout -b feature/my-new-feature`
3. Commit your changes with a descriptive message: `git commit -m "feat: add amazing new feature"`
4. Push your branch to your fork: `git push origin feature/my-new-feature`
5. Open a **Pull Request**.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
