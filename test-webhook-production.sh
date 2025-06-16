#!/bin/bash

echo "Testando webhook em produção..."

# Teste do webhook em produção
curl -X POST https://megaflix-five.vercel.app/api/webhook-for4payments \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_webhook_production_123",
    "transactionId": "test_webhook_production_123", 
    "status": "APPROVED",
    "event": "onBuyApproved",
    "amount": 2990,
    "paymentMethod": "PIX",
    "customer": {
      "name": "João Teste Produção",
      "email": "joao.producao@teste.com",
      "document": "12345678901"
    },
    "createdAt": "2025-06-16T20:45:00.000Z",
    "approvedAt": "2025-06-16T20:45:30.000Z"
  }' \
  -w "\n\nStatus HTTP: %{http_code}\nTempo: %{time_total}s\n"

echo ""
echo "Teste do setup automático do webhook..."

# Teste do setup webhook
curl -X POST https://megaflix-five.vercel.app/api/setup-webhook \
  -H "Content-Type: application/json" \
  -d '{}' \
  -w "\n\nStatus HTTP: %{http_code}\nTempo: %{time_total}s\n"

echo ""
echo "Testes de produção concluídos."