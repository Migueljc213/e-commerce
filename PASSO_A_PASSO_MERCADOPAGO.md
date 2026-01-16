# 🚀 Passo a Passo Completo - Integração Mercado Pago

Este guia detalhado vai te ajudar a configurar e testar a integração do Mercado Pago no seu e-commerce.

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Inicial](#configuração-inicial)
3. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
4. [Configuração do Mercado Pago](#configuração-do-mercado-pago)
5. [Testando a Integração](#testando-a-integração)
6. [Fluxo Completo de Pagamento](#fluxo-completo-de-pagamento)
7. [Configuração para Produção](#configuração-para-produção)
8. [Troubleshooting](#troubleshooting)

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter:

- ✅ Node.js instalado (versão 18 ou superior)
- ✅ Conta no Mercado Pago (crie em [mercadopago.com.br](https://www.mercadopago.com.br))
- ✅ Git instalado (opcional)
- ✅ Editor de código (VS Code recomendado)

---

## 🔧 Configuração Inicial

### Passo 1: Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

Isso vai instalar todas as dependências necessárias, incluindo:
- Next.js
- Prisma (banco de dados)
- SDK do Mercado Pago
- React e outras bibliotecas

### Passo 2: Verificar Estrutura do Projeto

Certifique-se de que os seguintes arquivos existem:

```
ecommerce/
├── app/
│   ├── api/
│   │   └── payment/
│   │       ├── create-preference/
│   │       ├── status/
│   │       └── webhook/
│   ├── checkout/
│   └── payment/
│       ├── success/
│       ├── failure/
│       └── pending/
├── lib/
│   ├── db.ts
│   └── orders.ts
├── prisma/
│   └── schema.prisma
└── package.json
```

---

## 💾 Configuração do Banco de Dados

### Passo 3: Criar Arquivo de Variáveis de Ambiente

Crie um arquivo `.env.local` na **raiz do projeto** (mesmo nível do `package.json`):

```env
# Banco de Dados
DATABASE_URL="file:./dev.db"

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=TEST-seu_access_token_aqui
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:** 
- O arquivo `.env.local` não deve ser commitado no Git
- Use tokens de **TEST** para desenvolvimento
- Use tokens de **PROD** apenas em produção

### Passo 4: Inicializar o Banco de Dados

Execute os seguintes comandos no terminal:

```bash
# 1. Gerar o cliente Prisma
npx prisma generate

# 2. Criar o banco de dados e as tabelas
npx prisma migrate dev --name init
```

**O que acontece:**
- ✅ Cria o arquivo `prisma/dev.db` (banco SQLite)
- ✅ Cria todas as tabelas: `users`, `orders`, `order_items`, `payments`
- ✅ Gera o cliente Prisma para usar no código

**Se der erro:** Verifique se o arquivo `.env.local` foi criado corretamente.

### Passo 5: Verificar o Banco de Dados (Opcional)

Para visualizar o banco de dados de forma gráfica:

```bash
npx prisma studio
```

Isso abre uma interface web no navegador (geralmente em `http://localhost:5555`) onde você pode ver todas as tabelas e dados.

---

## 💳 Configuração do Mercado Pago

### Passo 6: Obter Access Token do Mercado Pago

1. **Acesse o painel do Mercado Pago:**
   - Vá para [https://www.mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
   - Faça login com sua conta

2. **Criar uma aplicação:**
   - Clique em **"Suas integrações"** (menu lateral)
   - Clique em **"Criar aplicação"**
   - Preencha:
     - **Nome:** E-commerce (ou qualquer nome)
     - **Plataforma:** Web
   - Clique em **"Criar"**

3. **Copiar o Access Token:**
   - Na página da aplicação, você verá duas opções:
     - **Credenciais de teste** (para desenvolvimento)
     - **Credenciais de produção** (para produção)
   - Clique em **"Credenciais de teste"**
   - Copie o **Access Token** (começa com `TEST-`)

4. **Atualizar o `.env.local`:**
   ```env
   MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-abc-def-ghi-jkl-mno-pqr-stu-vwx-yz-1234567890-abc-def-ghi-jkl-mno-pqr-stu-vwx-yz
   ```
   (Substitua pelo seu token real)

### Passo 7: Verificar Configuração

Certifique-se de que o arquivo `.env.local` está assim:

```env
DATABASE_URL="file:./dev.db"
MERCADOPAGO_ACCESS_TOKEN=TEST-seu_token_aqui
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 🧪 Testando a Integração

### Passo 8: Iniciar o Servidor

No terminal, execute:

```bash
npm run dev
```

O servidor vai iniciar em `http://localhost:3000`

### Passo 9: Testar o Fluxo de Pagamento

1. **Acesse o site:**
   - Abra `http://localhost:3000` no navegador

2. **Adicione produtos ao carrinho:**
   - Navegue até a página de produtos
   - Adicione alguns produtos ao carrinho

3. **Vá para o checkout:**
   - Clique no carrinho
   - Clique em "Finalizar Compra"

4. **Preencha os dados:**
   - Nome completo
   - Email
   - Telefone
   - Endereço completo (rua, cidade, estado, CEP)

5. **Clique em "Ir para Pagamento"**

6. **Você será redirecionado para o Mercado Pago**

### Passo 10: Testar Pagamento com Cartão de Teste

No checkout do Mercado Pago (ambiente de teste), use:

**Cartão Aprovado:**
- **Número:** `5031 4332 1540 6351`
- **CVV:** `123`
- **Validade:** `11/25`
- **Nome:** `APRO`

**Cartão Rejeitado:**
- **Número:** `5031 4332 1540 6351`
- **CVV:** `123`
- **Validade:** `11/25`
- **Nome:** `OTHE`

**Outros cartões de teste:**
- Consulte: [Cartões de Teste - Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards)

### Passo 11: Verificar Resultado

Após o pagamento:

1. **Você será redirecionado de volta para o site:**
   - `/payment/success` - se aprovado
   - `/payment/failure` - se rejeitado
   - `/payment/pending` - se pendente

2. **Verificar no banco de dados:**
   ```bash
   npx prisma studio
   ```
   - Verifique a tabela `orders` - deve ter um novo pedido
   - Verifique a tabela `payments` - deve ter um novo pagamento

---

## 🔄 Fluxo Completo de Pagamento

Entenda como funciona o fluxo completo:

### 1. Usuário Finaliza Checkout

```
Usuário preenche formulário → Clica em "Ir para Pagamento"
```

### 2. Sistema Cria Pedido

```
Frontend → POST /api/payment/create-preference
  ↓
Backend cria pedido no banco de dados
  ↓
Backend cria preferência no Mercado Pago
  ↓
Retorna URL de checkout
```

### 3. Redirecionamento

```
Frontend recebe URL → Redireciona para Mercado Pago
```

### 4. Pagamento no Mercado Pago

```
Usuário paga no checkout do Mercado Pago
  ↓
Mercado Pago processa pagamento
```

### 5. Retorno ao Site

```
Mercado Pago redireciona para:
  - /payment/success?payment_id=123 (aprovado)
  - /payment/failure (rejeitado)
  - /payment/pending (pendente)
```

### 6. Webhook (Notificação)

```
Mercado Pago → POST /api/payment/webhook
  ↓
Sistema busca informações do pagamento
  ↓
Sistema salva/atualiza pagamento no banco
  ↓
Sistema atualiza status do pedido
```

---

## 🚀 Configuração para Produção

### Passo 12: Preparar para Produção

1. **Obter Token de Produção:**
   - No painel do Mercado Pago, vá em **"Credenciais de produção"**
   - Copie o Access Token (começa com `APP_USR-`)

2. **Atualizar `.env.local` (ou variáveis de ambiente do servidor):**
   ```env
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu_token_de_producao
   NEXT_PUBLIC_BASE_URL=https://seudominio.com
   ```

3. **Configurar Webhook:**
   - No painel do Mercado Pago, vá em **"Webhooks"**
   - Adicione a URL: `https://seudominio.com/api/payment/webhook`
   - Selecione os eventos: `payment`

4. **Mudar Banco de Dados (Recomendado):**
   - SQLite é apenas para desenvolvimento
   - Para produção, use PostgreSQL ou MySQL
   - Atualize `prisma/schema.prisma`:
     ```prisma
     datasource db {
       provider = "postgresql"  // ou "mysql"
       url      = env("DATABASE_URL")
     }
     ```
   - Atualize `DATABASE_URL` no `.env`:
     ```env
     DATABASE_URL="postgresql://usuario:senha@host:5432/banco"
     ```
   - Execute:
     ```bash
     npx prisma migrate deploy
     ```

5. **Build e Deploy:**
   ```bash
   npm run build
   npm start
   ```

---

## 🔍 Troubleshooting

### Problema: "Prisma Client has not been generated"

**Solução:**
```bash
npx prisma generate
```

### Problema: "Database does not exist"

**Solução:**
```bash
npx prisma migrate dev
```

### Problema: "MERCADOPAGO_ACCESS_TOKEN is not defined"

**Solução:**
1. Verifique se o arquivo `.env.local` existe na raiz
2. Verifique se o token está correto
3. Reinicie o servidor (`npm run dev`)

### Problema: Pedidos não aparecem no banco

**Solução:**
1. Verifique os logs do servidor (terminal)
2. Verifique se o `.env.local` está configurado
3. Verifique se o banco foi inicializado (`npx prisma migrate dev`)

### Problema: Webhook não funciona localmente

**Solução:**
- Webhooks precisam de uma URL pública
- Para testar localmente, use [ngrok](https://ngrok.com/):
  ```bash
  ngrok http 3000
  ```
- Use a URL do ngrok no webhook do Mercado Pago

### Problema: Pagamento não atualiza status

**Solução:**
1. Verifique se o webhook está configurado
2. Verifique os logs do servidor
3. Verifique se a URL do webhook está correta no `.env.local`

---

## ✅ Checklist Final

Antes de considerar a integração completa, verifique:

- [ ] Arquivo `.env.local` criado com todas as variáveis
- [ ] Banco de dados inicializado (`npx prisma migrate dev`)
- [ ] Access Token do Mercado Pago configurado
- [ ] Servidor iniciando sem erros (`npm run dev`)
- [ ] Pedido sendo criado no banco ao finalizar checkout
- [ ] Redirecionamento para Mercado Pago funcionando
- [ ] Pagamento de teste funcionando
- [ ] Retorno do pagamento funcionando
- [ ] Webhook recebendo notificações (verificar logs)
- [ ] Pagamento sendo salvo no banco
- [ ] Status do pedido sendo atualizado

---

## 📚 Recursos Adicionais

- **Documentação Mercado Pago:** [developers.mercadopago.com.br](https://www.mercadopago.com.br/developers)
- **SDK Node.js:** [github.com/mercadopago/sdk-nodejs](https://github.com/mercadopago/sdk-nodejs)
- **Cartões de Teste:** [Documentação Oficial](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards)
- **Prisma Docs:** [prisma.io/docs](https://www.prisma.io/docs)

---

## 🎉 Pronto!

Sua integração com Mercado Pago está configurada e pronta para uso!

Se tiver dúvidas ou problemas, consulte a seção de Troubleshooting ou a documentação oficial do Mercado Pago.


