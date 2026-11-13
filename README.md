# Português - Brasil

# 🌾 PlagueHit

O **PlagueHit** é um aplicativo móvel que une **inteligência artificial**, **visão computacional** e **sensores IoT** para o monitoramento agrícola. Um modelo de deep learning treinado por nós identifica pragas e sintomas em folhas de **feijão**, enquanto sensores medem as condições do solo em tempo real. Um **chatbot** dentro do app orienta o produtor.

## 📱 Telas do App

<p align="center">
  <img src="docs/screenshots/boas-vindas.jpeg" alt="Tela de boas-vindas" width="200"/>
  <img src="docs/screenshots/dashboard.jpeg" alt="Dashboard com análise em tempo real" width="200"/>
  <img src="docs/screenshots/historico.jpeg" alt="Histórico de análises" width="200"/>
  <img src="docs/screenshots/assistente-ia.jpeg" alt="Assistente de IA" width="200"/>
</p>

<p align="center">
  <sub>Boas-vindas · Dashboard em tempo real · Histórico · Assistente de IA</sub>
</p>

---

## 🧠 Inteligência Artificial

### Modelo de detecção de pragas (visão computacional)

Treinamos uma rede neural convolucional (CNN) com **TensorFlow/Keras** para classificar fotos de folhas de feijão em três classes:

| Classe       | Significado                        |
|--------------|------------------------------------|
| mosca_branca | Folha com presença de mosca-branca |
| saudavel     | Folha saudável                     |
| sintomas     | Folha com sintomas visíveis        |

- **Entrada:** imagens redimensionadas para **150x150 px** e normalizadas (0 a 1).
- **Saída:** classe prevista + nível de confiança (%).
- **Arquitetura / técnica:** Transfer Learning utilizando **MobileNetV2** como base para extração de características, combinada a camadas personalizadas de classificação (Global Average Pooling, camada Densa de 256 neurônios com Dropout e Densa final de 3 neurônios).
- **Dataset:** 150 imagens no total, balanceadas com 50 itens para cada classe (`mosca_branca`, `saudavel`, `sintomas`).
- **Resultados:** **87,50% de acurácia** no conjunto de avaliação.
- **Treinamento:** Google Colab, com duas versões do modelo (`modelo_pragas_feijao.keras` e `modelo_pragas_feijao_v2.keras`).

### Explicabilidade com Grad-CAM

Para não entregar um diagnóstico "caixa-preta", o projeto usa **Grad-CAM**: além da classe prevista, o sistema gera um **mapa de calor** sobre a foto original, mostrando quais regiões da folha mais influenciaram a decisão do modelo. Isso ajuda o produtor e o agrônomo a **validar visualmente** o resultado.

O script de diagnóstico (`ia/diagnostico_gradcam.py`) carrega o modelo, lê a resolução esperada automaticamente, localiza a última camada convolucional e exibe a imagem original ao lado do diagnóstico com o mapa de calor.

### Integração com o app

O modelo treinado é exposto através de uma API em Python (Flask) hospedada em uma **instância EC2 (Ubuntu) na AWS**. O hardware do projeto (ESP32-CAM) captura a imagem da folha e a envia para a nuvem. A API salva a imagem em um bucket do **AWS S3**, processa a classificação e grava o resultado no **Firebase Realtime Database**, onde o aplicativo React Native consome os dados e exibe para o usuário em tempo real.

### 🤖 Chatbot

O app conta com um chatbot para apoiar o produtor.

- **Modelo/API utilizado:** **Google Gemini AI**.
- **O que ele faz:** o Assistente IA responde perguntas do produtor usando os dados reais das análises (classe, confiança, data e umidade do solo). Por exemplo, ao perguntar "Como foi minha última análise?", ele resume o diagnóstico, interpreta o resultado e recomenda os próximos passos.

---

## ✨ Funcionalidades Principais

* 🐛 **Detecção de Pragas com IA:** Diagnóstico de folhas de feijão (mosca-branca, saudável ou com sintomas) com nível de confiança e mapa de calor explicativo (Grad-CAM).
* 🤖 **Chatbot Integrado:** Assistente dentro do app para apoiar a decisão do produtor.
* 📊 **Dashboard em Tempo Real:** Visão geral instantânea das métricas da fazenda, com dados diretos de sensores IoT espalhados pela lavoura.
* 🌱 **Análise de Solo e Ambiente:** Acompanhamento de umidade e temperatura (sensor DHT22) para otimizar irrigação e adubação.
* 💬 **Chat:** Canal de comunicação entre equipe de campo, administradores e especialistas agrícolas.
* 📜 **Histórico Completo:** Registro de leituras, alertas e ações, facilitando a análise de tendências.
* 🔐 **Autenticação Segura:** Login, cadastro e recuperação de senha com Firebase Authentication.
* 👤 **Gestão de Perfil:** Área para o usuário gerenciar suas informações e configurações.

---

## 🛠️ Tecnologias Utilizadas

**Inteligência Artificial**
* **Python, TensorFlow / Keras:** treinamento e inferência do modelo de classificação.
* **OpenCV, NumPy, Matplotlib:** pré-processamento de imagens e visualização do Grad-CAM.
* **Google Colab:** ambiente de treinamento.

**Aplicativo**
* **[React Native](https://reactnative.dev/)** e **[Expo](https://expo.dev/):** aplicativo mobile.
* **[TypeScript](https://www.typescriptlang.org/):** tipagem estática.
* **[Firebase](https://firebase.google.com/):** autenticação e banco de dados (Firestore/Realtime DB).

**Hardware / IoT**
* **ESP32-CAM:** captura de imagens.
* **DHT22:** temperatura e umidade.
* **AWS (EC2 e S3):** processamento em nuvem e armazenamento de imagens.

---

## 📂 Estrutura do Projeto

```text
PlagueHit/
├── App.tsx                     # Ponto de entrada principal do aplicativo
├── app.json                    # Configurações do Expo
├── ia/                         # Notebook/script de treino e diagnóstico (Grad-CAM)
├── src/
│   ├── assets/                 # Imagens, ícones e fontes
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
│   └── services/
│       └── firebaseConfig.js   # Configuração e inicialização do Firebase
└── package.json                # Dependências do projeto
🚀 Como Executar o Projeto
Pré-requisitos
[Node.js](https://nodejs.org/)
[Git](https://git-scm.com/)
[Expo CLI](https://docs.expo.dev/get-started/installation/)
Smartphone com o app [Expo Go](https://expo.dev/client) (ou emulador Android/iOS).
1. Clone o repositório
Bash
git clone https://github.com/matheus-pestana/plaguehit.git
cd plaguehit
2. Instale as dependências
Bash
npm install
3. Configure o Firebase
Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
Habilite Authentication (E-mail/Senha) e o Firestore Database (ou Realtime Database).
Registre um app Web para obter suas chaves.
Preencha src/services/firebaseConfig.js com as credenciais do seu projeto:
JavaScript
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
4. Execute o app
Bash
npx expo start
Escaneie o QR Code com o Expo Go (celular e computador na mesma rede Wi-Fi).

5. (Opcional) Teste o modelo de IA
No Google Colab, coloque o arquivo modelo_pragas_feijao_v2.keras no seu Google Drive, execute o script ia/diagnostico_gradcam.py e envie a foto de uma folha. O resultado mostra o diagnóstico, a confiança e o mapa de calor.

👥 Autores
Matheus Pestana — Desenvolvimento do aplicativo, banco de dados e chatbot.
Luis Augusto Silva — Treinamento do modelo de IA, parte de hardware do projeto e instância EC2 na AWS.
Eduardo Couto — Design do projeto.
🤝 Como Contribuir
Faça um Fork do projeto.
Crie uma branch: git checkout -b minha-feature
Commit: git commit -m "feat: adiciona nova funcionalidade X"
Push: git push origin minha-feature
Abra um Pull Request.
📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE [blocked] para mais detalhes.

English
🌾 PlagueHit
PlagueHit is a mobile app that combines artificial intelligence, computer vision and IoT sensors for agricultural monitoring. A deep learning model we trained identifies pests and symptoms on common bean (feijão) leaves, while sensors track field conditions in real time. An in-app chatbot guides the farmer.

📱 App Screens

Welcome · Real-time Dashboard · History · AI Assistant

🧠 Artificial Intelligence
Pest detection model (computer vision)
We trained a convolutional neural network (CNN) with TensorFlow/Keras to classify bean leaf photos into three classes:

Class	Meaning
mosca_branca	Leaf with whitefly present
saudavel	Healthy leaf
sintomas	Leaf with visible symptoms
Input: images resized to 150x150 px and normalized (0 to 1).
Output: predicted class + confidence score (%).
Architecture / technique: Transfer learning using MobileNetV2 as the base feature extractor, paired with custom classification layers (Global Average Pooling, a 256-unit Dense layer with Dropout, and a final 3-unit Dense layer).
Dataset: 150 total images, evenly balanced with 50 images per class (mosca_branca, saudavel, sintomas).
Results: 87.50% accuracy on the evaluation set.
Training: Google Colab, with two model versions (modelo_pragas_feijao.keras and modelo_pragas_feijao_v2.keras).
Explainability with Grad-CAM
To avoid a "black-box" diagnosis, the project uses Grad-CAM: besides the predicted class, the system generates a heatmap over the original photo showing which regions of the leaf most influenced the model's decision. This lets farmers and agronomists visually validate the result.

The diagnosis script (ia/diagnostico_gradcam.py) loads the model, reads the expected input resolution automatically, finds the last convolutional layer, and displays the original image next to the diagnosis with the heatmap.

App integration
The trained model is served by a Python (Flask) API hosted on an AWS EC2 (Ubuntu) instance. The project's hardware (ESP32-CAM) captures the leaf image and sends it to the cloud. The API stores the image in an AWS S3 bucket, processes the classification, and writes the result to the Firebase Realtime Database, which the React Native app then consumes and displays to the user in real time.

🤖 Chatbot
The app includes a chatbot to support the farmer.

Model/API used: Google Gemini AI.
What it does: the AI Assistant answers the farmer's questions using real analysis data (class, confidence, date and soil moisture). For example, when asked "How was my last analysis?", it summarizes the diagnosis, interprets the result and recommends next steps.
✨ Key Features
🐛 AI Pest Detection: Diagnoses bean leaves (whitefly, healthy or symptomatic) with a confidence score and an explanatory heatmap (Grad-CAM).
🤖 Integrated Chatbot: In-app assistant to support the farmer's decisions.
📊 Real-Time Dashboard: Instant overview of farm metrics with live data from IoT sensors in the field.
🌱 Soil & Environment Analysis: Tracks moisture and temperature (DHT22 sensor) to optimize irrigation and fertilization.
💬 Chat: Communication channel between field staff, administrators and agricultural experts.
📜 Comprehensive History: Log of readings, alerts and actions for long-term trend analysis.
🔐 Secure Authentication: Login, registration and password recovery with Firebase Authentication.
👤 Profile Management: Section to manage personal information and settings.
🛠️ Tech Stack
Artificial Intelligence

Python, TensorFlow / Keras: model training and inference.
OpenCV, NumPy, Matplotlib: image preprocessing and Grad-CAM visualization.
Google Colab: training environment.
App

[React Native](https://reactnative.dev/) and [Expo](https://expo.dev/): mobile app.
[TypeScript](https://www.typescriptlang.org/): static typing.
[Firebase](https://firebase.google.com/): authentication and database (Firestore/Realtime DB).
Hardware / IoT

ESP32-CAM: image capture.
DHT22: temperature and humidity.
AWS (EC2 and S3): cloud processing and image storage.
📂 Project Structure
Texto
PlagueHit/
├── App.tsx                     # Main entry point of the application
├── app.json                    # Expo configuration file
├── ia/                         # Training/diagnosis notebook or script (Grad-CAM)
├── src/
│   ├── assets/                 # Images, icons, and fonts
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
│   └── services/
│       └── firebaseConfig.js   # Firebase initialization and setup
└── package.json                # Project dependencies and scripts
🚀 Getting Started
Prerequisites
[Node.js](https://nodejs.org/) (LTS recommended)
[Git](https://git-scm.com/)
[Expo CLI](https://docs.expo.dev/get-started/installation/)
A smartphone with [Expo Go](https://expo.dev/client) (or an Android/iOS emulator).
1. Clone the repository
Bash
git clone https://github.com/matheus-pestana/plaguehit.git
cd plaguehit
2. Install dependencies
Bash
npm install
3. Configure Firebase
Create a project in the [Firebase Console](https://console.firebase.google.com/).
Enable Authentication (Email/Password) and Firestore Database (or Realtime Database).
Register a Web App to get your keys.
Fill in src/services/firebaseConfig.js with your project's credentials:
JavaScript
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
4. Run the app
Bash
npx expo start
Scan the QR Code with Expo Go (phone and computer on the same Wi-Fi network).

5. (Optional) Try the AI model
In Google Colab, place modelo_pragas_feijao_v2.keras in your Google Drive, run ia/diagnostico_gradcam.py and upload a leaf photo. The output shows the diagnosis, confidence and heatmap.

👥 Authors
Matheus Pestana — App development, database and chatbot.
Luis Augusto Silva — AI model training, project hardware and AWS EC2 instance.
Eduardo Couto — Project design.
🤝 Contributing
Fork the project.
Create a branch: git checkout -b feature/my-new-feature
Commit: git commit -m "feat: add amazing new feature"
Push: git push origin feature/my-new-feature
Open a Pull Request.
📄 License
This project is licensed under the MIT License. See the LICENSE [blocked] file for details.

Texto

Basta copiar todo o conteúdo acima e colar no arquivo `README.md` do repositório.
