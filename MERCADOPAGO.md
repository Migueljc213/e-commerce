# Integração Mercado Pago

Este projeto inclui integração completa com o Mercado Pago para processamento de pagamentos.

## 🎯 Modo de Operação

O sistema funciona em **dois modos**:

### Modo Mock (Padrão - MVP)
Por padrão, o sistema funciona em **modo simulação (mock)**. Isso significa que:
- ✅ Todo o fluxo visual funciona perfeitamente
- ✅ Nenhuma chamada real ao MercadoPago é feita
- ✅ Ideal para demonstrações e MVPs
- ✅ Não requer credenciais do MercadoPago

**O sistema está configurado em modo mock por padrão!** Todas as telas de pagamento, checkout e confirmação funcionam visualmente, mas sem processar pagamentos reais.

### Modo Real (Integração Completa)
Para ativar a integração real com MercadoPago:

1. Defina a variável de ambiente `USE_MERCADOPAGO_REAL=true`
2. Configure as credenciais do MercadoPago (veja abaixo)

## 🔧 Configuração

### 1. Modo Mock (Recomendado para MVP)

Nenhuma configuração necessária! O sistema já está funcionando em modo mock.

### 2. Modo Real - Obter Credenciais

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma conta ou faça login
3. Vá em "Suas integrações" > "Criar aplicação"
4. Copie o **Access Token** (use o token de teste para desenvolvimento)

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

**Para Modo Mock (MVP):**
```env
# Não precisa configurar nada! O modo mock funciona sem credenciais
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Para Modo Real:**
```env
USE_MERCADOPAGO_REAL=true
MERCADOPAGO_ACCESS_TOKEN=TEST-seu_access_token_aqui
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Importante:**
- Use tokens de **TEST** para desenvolvimento
- Use tokens de **PROD** para produção
- Nunca commite tokens no repositório
- Para MVP, não é necessário configurar credenciais

## 📋 Fluxo de Pagamento

### Modo Mock (MVP)

1. **Checkout:** Usuário preenche dados de entrega
2. **Página de Simulação:** Redireciona para página de simulação de pagamento (`/payment/process`)
3. **Pagamento Simulado:** Usuário escolhe método (Cartão, PIX, Boleto) e simula pagamento
4. **Confirmação:** Redireciona para página de sucesso com dados mockados

### Modo Real

1. **Criação de Preferência:**
   - Quando o usuário finaliza o checkout, o sistema cria uma preferência via API
   - Recebe uma URL de checkout do Mercado Pago
   - Redireciona o usuário para o checkout seguro do MercadoPago

2. **Processamento:**
   - O usuário completa o pagamento no checkout do Mercado Pago
   - É redirecionado de volta para o site
   - O status é verificado automaticamente

3. **Webhook:**
   - O Mercado Pago envia notificações via webhook (`/api/payment/webhook`) quando:
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




