#!/bin/bash

echo "Forçando deploy das correções de API para Vercel..."

# Adiciona correções críticas
git add api/create-pix-payment.js
git add api/create-card-payment.js
git add client/src/hooks/use-device-detection.tsx
git add replit.md

# Commit com descrição específica do erro
git commit -m "fix: resolve Vercel FUNCTION_INVOCATION_FAILED error

- Add CORS headers and OPTIONS handling for Vercel serverless functions
- Improve error handling to prevent JSON parse failures
- Ensure valid JSON responses in all error scenarios
- Remove desktop redirect to allow all devices access to home
- Fix production deployment issues with proper error boundaries

Resolves: FUNCTION_INVOCATION_FAILED in megaflix-five.vercel.app"

# Push para forçar novo deploy
git push origin main

echo "Deploy iniciado. Aguarde alguns minutos para o Vercel processar."
echo "Monitorar em: https://vercel.com/dashboard"
echo "Site: https://megaflix-five.vercel.app"