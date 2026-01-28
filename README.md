<div align="center">
  <img src="https://www.mynu.com.br/build/assets/logo-HQgeMKuK.png" alt="Mynu Logo" width="120">
  <h1>Mynu</h1>
  <p><strong>Uma plataforma moderna para criação e gerenciamento de cardápios digitais.</strong></p>
</div>

---


## 🚀 Sobre o Projeto

O **Mynu** é uma solução completa (SaaS) que permite a restaurantes, bares e estabelecimentos comerciais criarem, personalizarem e gerenciarem seus cardápios de forma totalmente digital. A plataforma foi construída com uma stack de tecnologia moderna, focando em performance, escalabilidade e uma excelente experiência de usuário.

Com o Mynu, proprietários de estabelecimentos podem facilmente montar seus cardápios, organizá-los em seções, adicionar pratos com fotos e descrições, e gerar um QR Code para que seus clientes possam acessar o cardápio diretamente de seus smartphones.

## ✨ Principais Funcionalidades

- **Autenticação de Usuários:** Sistema completo de registro e login com suporte a autenticação de dois fatores (2FA).
- **Gerenciamento de Lojas:** Cada usuário pode gerenciar uma ou mais lojas (estabelecimentos).
- **Construtor de Cardápios:** Crie múltiplos cardápios por loja, ideais para diferentes ocasiões (cardápio principal, de sobremesas, de vinhos, etc.).
- **Organização Flexível:** Organize os pratos em seções personalizáveis (Entradas, Pratos Principais, Bebidas).
- **Gerenciamento de Pratos:** Adicione e edite pratos com nome, descrição, preço e fotos.
- **Sistema de Assinaturas:** Integração com Stripe via Laravel Cashier para gerenciar planos e assinaturas.
- **Dashboard Analítico:** Painel com métricas de visitas e performance do cardápio.
- **QR Code (implantação futura):** Funcionalidade para gerar QR Codes para cada cardápio.

## 💻 Stack Tecnológica

O projeto é construído com as seguintes tecnologias:

- **Backend:**
  - [Laravel 12](https://laravel.com/docs/12.x)
  - [PHP 8.4](https://www.php.net/)
  - [Laravel Sail](https://laravel.com/docs/12.x/sail) (Ambiente de desenvolvimento com Docker)
  - [Laravel Fortify](https://laravel.com/docs/12.x/fortify) (Autenticação)
  - [Laravel Cashier (Stripe)](https://laravel.com/docs/12.x/billing) (Pagamentos)
  - [Pest](https://pestphp.com/) (Testes)

- **Frontend:**
  - [React 19](https://react.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Inertia.js v2](https://inertiajs.com/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Vite](https://vitejs.dev/)

- **Banco de Dados:**
  - MySQL (padrão no Sail, mas pode ser alterado)

## ✅ Pré-requisitos

Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas em sua máquina:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/) (geralmente já vem com o Docker Desktop)

**Opcional:**
- [Composer](https://getcomposer.org/) (para facilitar a execução de alguns comandos iniciais)
- [Node.js](https://nodejs.org/en/) e npm

> **Nota:** O uso do Laravel Sail (Docker) abstrai a necessidade de ter PHP, Composer, Node.js e MySQL instalados localmente.

---


## 🛠️ Guia de Instalação

Siga os passos abaixo para configurar e executar o projeto em seu ambiente de desenvolvimento.

**1. Clonar o Repositório**

```bash
git clone https://github.com/seu-usuario/mynu.git
cd mynu
```

**2. Configurar o Ambiente**

Copie o arquivo de exemplo `.env.example` para criar seu próprio arquivo de configuração `.env`.

```bash
cp .env.example .env
```
> **Importante:** Abra o arquivo `.env` e configure as variáveis do banco de dados e outras que forem necessárias, como as chaves do Stripe para o Laravel Cashier.

**3. Instalar Dependências do Composer**

Se você **não tem o Composer instalado localmente**, pode usar o Docker para instalá-las:
```bash
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v $(pwd):/app \
    -w /app \
    laravelsail/php84-composer \
    composer install --ignore-platform-reqs
```

Se você **tem o Composer instalado**, pode simplesmente rodar:
```bash
composer install
```

**4. Iniciar os Contêineres do Sail**

Use o Laravel Sail para "subir" todos os serviços Docker necessários.

```bash
vendor/bin/sail up -d
```
> O `-d` executa os contêineres em modo "detached" (em segundo plano).

**5. Gerar a Chave da Aplicação**

Este comando é essencial para qualquer aplicação Laravel.

```bash
vendor/bin/sail artisan key:generate
```

**6. Instalar Dependências do Frontend**

```bash
vendor/bin/sail npm install
```

**7. Compilar os Assets do Frontend**

Execute o servidor de desenvolvimento do Vite para compilar os assets e habilitar o Hot Module Replacement (HMR).

```bash
vendor/bin/sail npm run dev
```

**8. Executar as Migrations e Seeders**

Para criar as tabelas no banco de dados e popular com dados de exemplo, execute:

```bash
vendor/bin/sail artisan migrate --seed
```

**Pronto! 🎉**

A aplicação deve estar rodando e acessível em [http://localhost](http://localhost) (ou na porta que você configurou no seu arquivo `.env`).

---


## ⚙️ Comandos Úteis

Todos os comandos devem ser prefixados com `vendor/bin/sail` para serem executados dentro do ambiente Docker.

- **Iniciar o ambiente:**
  ```bash
  vendor/bin/sail up -d
  ```

- **Parar o ambiente:**
  ```bash
  vendor/bin/sail stop
  ```

- **Executar testes automatizados:**
  ```bash
  # Rodar todos os testes
  vendor/bin/sail artisan test

  # Rodar um arquivo de teste específico
  vendor/bin/sail artisan test tests/Feature/DashboardTest.php
  ```

- **Executar o Tinker (REPL do Laravel):**
  ```bash
  vendor/bin/sail artisan tinker
  ```

- **Verificar e corrigir o estilo do código (Laravel Pint):**
  ```bash
  vendor/bin/sail pint
  ```

- **Executar um comando npm:**
  ```bash
  vendor/bin/sail npm <comando>
  ```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
