# Integração Mercado Pago

Este projeto inclui integração completa com o Mercado Pago para processamento de pagamentos.

## 🔧 Configuração

### 1. Obter Credenciais

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma conta ou faça login
3. Vá em "Suas integrações" > "Criar aplicação"
4. Copie o **Access Token** (use o token de teste para desenvolvimento)

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
MERCADOPAGO_ACCESS_TOKEN=TEST-seu_access_token_aqui
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Importante:**
- Use tokens de **TEST** para desenvolvimento
- Use tokens de **PROD** para produção
- Nunca commite tokens no repositório

## 📋 Fluxo de Pagamento

### 1. Criação de Preferência

Quando o usuário finaliza o checkout, o sistema:

1. Cria uma preferência de pagamento via API (`/api/payment/create-preference`)
2. Recebe uma URL de checkout do Mercado Pago
3. Redireciona o usuário para o checkout seguro

### 2. Processamento

O usuário:
1. Completa o pagamento no checkout do Mercado Pago
2. É redirecionado de volta para o site
3. O status é verificado automaticamente

### 3. Webhook

O Mercado Pago envia notificações via webhook (`/api/payment/webhook`) quando:
- O pagamento é aprovado
- O pagamento é rejeitado
- O status muda

## 🧪 Teste de Pagamentos

### Cartões de Teste

Use estes cartões para testar no ambiente sandbox:

**Cartão Aprovado:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Validade: `11/25`
- Nome: `APRO`

**Cartão Rejeitado:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Validade: `11/25`
- Nome: `OTHE`

**Mais cartões de teste:** [Documentação Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards)

### PIX de Teste

Para testar PIX, use o QR Code gerado no checkout. No ambiente de teste, o pagamento é aprovado automaticamente após alguns segundos.

## 🔒 Segurança

- ✅ Tokens armazenados apenas em variáveis de ambiente
- ✅ Validação de dados no servidor
- ✅ Webhook verificado pelo Mercado Pago
- ✅ HTTPS obrigatório em produção

## 📝 Endpoints da API

### POST `/api/payment/create-preference`

Cria uma preferência de pagamento.

**Request:**
```json
{
  "items": [
    {
      "id": "1",
      "name": "Produto",
      "price": 100.00,
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "Rua Exemplo",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  },
  "user": {
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "11999999999"
  }
}
```

**Response:**
```json
{
  "id": "preference_id",
  "init_point": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
  "sandbox_init_point": "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
}
```

### POST `/api/payment/webhook`

Recebe notificações do Mercado Pago sobre mudanças no status do pagamento.

### GET `/api/payment/status?payment_id=123`

Consulta o status de um pagamento específico.

## 🚀 Produção

Para usar em produção:

1. Obtenha um Access Token de produção
2. Configure o webhook no painel do Mercado Pago
3. Atualize `NEXT_PUBLIC_BASE_URL` com sua URL de produção
4. Teste todos os fluxos de pagamento
5. Configure monitoramento e alertas

## 📚 Documentação Oficial

- [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
- [SDK Node.js](https://github.com/mercadopago/sdk-nodejs)
- [API Reference](https://www.mercadopago.com.br/developers/pt/reference)




