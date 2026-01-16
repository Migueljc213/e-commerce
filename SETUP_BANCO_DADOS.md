# 🗄️ Configuração do Banco de Dados e Integração Mercado Pago

Este documento contém todas as instruções para completar a integração do sistema de pagamento com Mercado Pago e o banco de dados.

## ✅ O que foi implementado

1. **Schema do Banco de Dados (Prisma)**
   - Tabela `users` - Usuários do sistema
   - Tabela `orders` - Pedidos
   - Tabela `order_items` - Itens dos pedidos
   - Tabela `payments` - Pagamentos do Mercado Pago

2. **Funções de Banco de Dados**
   - Criação de pedidos
   - Atualização de status de pedidos
   - Criação e atualização de pagamentos
   - Busca de pedidos e pagamentos

3. **APIs Atualizadas**
   - `/api/payment/create-preference` - Agora salva o pedido no banco antes de criar a preferência
   - `/api/payment/webhook` - Salva e atualiza pagamentos e status dos pedidos automaticamente

## 📋 Passos para Completar a Integração

### 1. Configurar Variáveis de Ambiente

Crie ou atualize o arquivo `.env.local` na raiz do projeto:

```env
# Banco de Dados
DATABASE_URL="file:./dev.db"

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=TEST-seu_access_token_aqui
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Importante:**
- Para desenvolvimento, use `DATABASE_URL="file:./dev.db"` (SQLite)
- Para produção, use uma URL de PostgreSQL ou MySQL
- Use tokens de **TEST** para desenvolvimento
- Use tokens de **PROD** para produção

### 2. Inicializar o Banco de Dados

Execute os seguintes comandos no terminal:

```bash
# Gerar o cliente Prisma
npx prisma generate

# Criar o banco de dados e aplicar as migrações
npx prisma migrate dev --name init

# (Opcional) Abrir o Prisma Studio para visualizar os dados
npx prisma studio
```

### 3. Obter Credenciais do Mercado Pago

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma conta ou faça login
3. Vá em "Suas integrações" > "Criar aplicação"
4. Copie o **Access Token** (use o token de teste para desenvolvimento)
5. Cole no arquivo `.env.local`

### 4. Configurar Webhook (Produção)

Para produção, você precisa configurar o webhook no painel do Mercado Pago:

1. Acesse o painel do Mercado Pago
2. Vá em "Suas integrações" > Sua aplicação
3. Configure a URL do webhook: `https://seudominio.com/api/payment/webhook`
4. Salve as configurações

**Nota:** Para desenvolvimento local, você pode usar ferramentas como [ngrok](https://ngrok.com/) para expor sua aplicação local.

### 5. Testar a Integração

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Faça um pedido de teste:
   - Adicione produtos ao carrinho
   - Vá para o checkout
   - Preencha os dados
   - Finalize o pedido

3. Use os cartões de teste do Mercado Pago:
   - **Cartão Aprovado:** 5031 4332 1540 6351, CVV: 123, Validade: 11/25, Nome: APRO
   - **Cartão Rejeitado:** 5031 4332 1540 6351, CVV: 123, Validade: 11/25, Nome: OTHE

4. Verifique no banco de dados:
```bash
npx prisma studio
```

Você deve ver:
- O pedido criado na tabela `orders`
- Os itens na tabela `order_items`
- O pagamento na tabela `payments` (após o webhook ser processado)

## 🔍 Verificações Importantes

### ✅ Checklist de Verificação

- [ ] Arquivo `.env.local` criado com todas as variáveis
- [ ] Banco de dados inicializado (`npx prisma migrate dev`)
- [ ] Cliente Prisma gerado (`npx prisma generate`)
- [ ] Access Token do Mercado Pago configurado
- [ ] Teste de criação de pedido funcionando
- [ ] Webhook recebendo notificações (verificar logs)
- [ ] Dados sendo salvos no banco corretamente

### 🔧 Comandos Úteis do Prisma

```bash
# Visualizar dados no navegador
npx prisma studio

# Criar nova migração após alterar o schema
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações em produção
npx prisma migrate deploy

# Resetar o banco de dados (CUIDADO: apaga todos os dados)
npx prisma migrate reset
```

## 🚀 Migração para Produção

### Opção 1: PostgreSQL (Recomendado)

1. Crie um banco PostgreSQL (ex: no [Supabase](https://supabase.com) ou [Railway](https://railway.app))

2. Atualize o schema do Prisma:
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Atualize `.env.local`:
```env
DATABASE_URL="postgresql://usuario:senha@host:porta/database"
```

4. Execute as migrações:
```bash
npx prisma migrate deploy
```

### Opção 2: MySQL

1. Atualize o schema:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

2. Configure a URL de conexão MySQL

## 📊 Estrutura do Banco de Dados

### Tabela: `orders`
- `id` - ID único do pedido
- `externalReference` - Referência usada no Mercado Pago
- `preferenceId` - ID da preferência do Mercado Pago
- `status` - Status do pedido (pending, processing, shipped, delivered, cancelled)
- `paymentStatus` - Status do pagamento (pending, approved, rejected, refunded, cancelled)
- `total`, `subtotal`, `discount`, `shipping` - Valores financeiros
- Dados do cliente e endereço de entrega

### Tabela: `order_items`
- `id` - ID único do item
- `orderId` - Referência ao pedido
- `productId`, `productName`, `price`, `quantity` - Dados do produto

### Tabela: `payments`
- `id` - ID único do pagamento
- `orderId` - Referência ao pedido
- `mercadoPagoId` - ID do pagamento no Mercado Pago
- `status` - Status do pagamento
- `transactionAmount` - Valor da transação

## 🔐 Segurança

- ✅ Tokens armazenados apenas em variáveis de ambiente
- ✅ Validação de dados no servidor
- ✅ Webhook verificado pelo Mercado Pago
- ✅ HTTPS obrigatório em produção
- ✅ Banco de dados com relacionamentos e constraints

## 🐛 Troubleshooting

### Erro: "Prisma Client has not been generated"
```bash
npx prisma generate
```

### Erro: "Database does not exist"
```bash
npx prisma migrate dev
```

### Webhook não está recebendo notificações
- Verifique se a URL está correta no painel do Mercado Pago
- Para desenvolvimento local, use ngrok ou similar
- Verifique os logs do servidor

### Pedidos não estão sendo salvos
- Verifique se o banco de dados está inicializado
- Verifique os logs do servidor para erros
- Confirme que o Prisma Client foi gerado

## 📚 Próximos Passos Sugeridos

1. **Autenticação de Usuários**
   - Integrar o sistema de autenticação com a tabela `users`
   - Salvar `userId` nos pedidos

2. **Histórico de Pedidos**
   - Criar página para visualizar pedidos do usuário
   - Filtrar pedidos por status

3. **Notificações por Email**
   - Enviar email quando pedido é criado
   - Enviar email quando pagamento é aprovado

4. **Dashboard Administrativo**
   - Visualizar todos os pedidos
   - Gerenciar status dos pedidos
   - Relatórios de vendas

5. **Estoque**
   - Atualizar estoque quando pedido é aprovado
   - Alertas de estoque baixo

## 📞 Suporte

Para mais informações:
- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação Mercado Pago](https://www.mercadopago.com.br/developers)
- [Documentação Next.js](https://nextjs.org/docs)



