# Instruções para Deploy das Correções - FUNCTION_INVOCATION_FAILED

## Problema Resolvido
O erro "FUNCTION_INVOCATION_FAILED" no Vercel foi causado por:
- Headers CORS ausentes nas funções serverless
- Estrutura incorreta da API 4ForPayments
- Tratamento de erro inadequado que retornava HTML em vez de JSON

## Arquivos Corrigidos

### api/create-pix-payment.js
✅ Adicionado headers CORS para Vercel
✅ Corrigida estrutura do payload 4ForPayments
✅ Melhorado tratamento de erro com JSON válido sempre
✅ Removido Bearer token (4ForPayments usa chave direta)

### api/create-card-payment.js  
✅ Mesmas correções aplicadas para consistência

## Como Fazer o Deploy

1. **Via Git Command Line:**
```bash
git add api/create-pix-payment.js api/create-card-payment.js
git commit -m "fix: resolve Vercel FUNCTION_INVOCATION_FAILED error - add CORS headers and fix 4ForPayments API structure"
git push origin main
```

2. **Via Interface Git:**
- Adicionar os arquivos modificados
- Fazer commit com a mensagem acima
- Push para origin/main

## Testes Realizados
✅ API PIX funcionando localmente - retorna QR Code válido
✅ Estrutura JSON correta na resposta
✅ Headers CORS configurados para Vercel serverless

## Próximos Passos Após Deploy
1. Aguardar 2-3 minutos para Vercel processar
2. Testar em https://megaflix-five.vercel.app
3. Verificar se checkout PIX funciona sem FUNCTION_INVOCATION_FAILED

## Estrutura Corrigida da API 4ForPayments
```json
{
  "name": "Nome Cliente",
  "email": "email@exemplo.com", 
  "cpf": "11144477735",
  "phone": "11999999999",
  "paymentMethod": "PIX",
  "amount": 2990,
  "traceable": true,
  "items": [...]
}
```

Com headers:
```json
{
  "Content-Type": "application/json",
  "Authorization": "API_KEY_DIRETA",
  "Accept": "application/json"
}
```