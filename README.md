# Best Servd - Sistema de Agendamento de Reservas de Mesas em Restaurantes

**Best Servd** é uma aplicação web que conecta restaurantes e clientes, facilitando o agendamento de reservas de mesas de forma simples e rápida.

## 📋 Funcionalidades Principais

- **Gerenciar disponibilidade de mesas (Restaurante)**  
- **Reservar mesa**  
- **Buscar restaurantes**  
- **Cancelar reserva**   
- **Atualizar perfil**  
- **Avaliar restaurante**  
- **Cadastrar cliente**  
- **Cadastrar restaurante**  
- **Visualizar disponibilidade de mesas**  
- **Visualizar cardápio do restaurante**  
- **Visualizar cardápio do restaurante**

## **🛠️ Tecnologias Utilizadas**

- **Node.js** – Plataforma de execução JavaScript no servidor  
- **Express.js** – Framework para criação de rotas e middleware  
- **Prisma** – ORM configurado para trabalhar com **MongoDB**  
- **MongoDB** – Banco de dados NoSQL para armazenamento de usuários, reservas, restaurantes, etc.  
- **JWT (JSON Web Token)** – Autenticação baseada em token  
- **bcrypt / bcryptjs** – Hash seguro de senhas antes de salvar no banco

## **🚀 Como Rodar o Projeto**

Este guia descreve os passos necessários para configurar e executar o projeto localmente. O projeto é dividido em **backend (api)** e **frontend**, que devem ser executados em terminais separados.

### 1. Configuração do Backend (API)

O backend gerencia a lógica da aplicação e a conexão com o banco de dados.

1.  **Abra um terminal** e navegue até o diretório da API:
    ```bash
    cd "C:\caminho\para\seu\projeto\Best-Served-master\api"
    ```

2.  **Crie o arquivo de ambiente**:
    Na pasta `api`, crie um arquivo chamado `.env` e cole o conteúdo abaixo. Este arquivo armazena as chaves e configurações sensíveis.

    ```env
    # URL de conexão com o banco de dados MongoDB
    DATABASE_URL="mongodb+srv://dahekevinrf:P3bJaUTgun0qmQnL@users.ybsabac.mongodb.net/Users?retryWrites=true&w=majority&appName=Users"

    # Chave secreta para autenticação JWT
    JWT_SECRET="8027f31a452b15a2f69c976d351dcd54bdc050758c01acaaa5104999c9a455f7"
    
    # Porta em que o servidor irá rodar
    PORT=3000
    ```

3.  **Gere o cliente do Prisma**:
    Este comando lê seu schema do banco de dados e gera o código necessário para a aplicação interagir com ele.
    ```bash
    npx prisma generate
    ```

4.  **Inicie o servidor do backend**:
    O comando abaixo inicia o servidor e o reinicia automaticamente a cada alteração nos arquivos (`--watch`).
    ```bash
    node --watch server.js
    ```
    Após executar, mantenha este terminal aberto.

---

### 2. Configuração do Frontend

O frontend é a interface visual da aplicação. **Abra um novo terminal** para executar estes passos.

1.  Navegue até o diretório do `frontend`:
    ```bash
    cd "C:\caminho\para\seu\projeto\Best-Served-master\frontend"
    ```

2.  **Instale as dependências**:
    Este comando baixa todas as bibliotecas necessárias para o frontend.
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm run dev
    ```
    Acesse a URL fornecida no terminal (geralmente `http://localhost:5173`) no seu navegador para ver a aplicação.

---

### 3. (Opcional) Visualizar o Banco de Dados

O Prisma Studio fornece uma interface gráfica para visualizar e editar os dados.

1.  **Abra um terceiro terminal** e navegue novamente até o diretório da `api`:
    ```bash
    cd "C:\caminho\para\seu\projeto\Best-Served-master\api"
    ```

2.  **Inicie o Prisma Studio**:
    ```bash
    npx prisma studio
    ```
    Isso abrirá uma nova aba no seu navegador, permitindo que você gerencie o banco de dados facilmente.
## 🌆 Imagens
