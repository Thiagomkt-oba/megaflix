#!/bin/bash

echo "🔄 Sincronizando correções do pagamento com Git..."

# Adiciona todos os arquivos modificados
echo "📁 Adicionando arquivos modificados..."
git add api/create-pix-payment.js
git add api/create-card-payment.js  
git add vercel.json
git add replit.md

# Mostra status
echo "📋 Status dos arquivos:"
git status --short

# Commit das correções
echo "💾 Fazendo commit das correções..."
git commit -m "fix: corrige erro de pagamento 'Resposta invalidada do servidor'

- Adiciona validação de CPF e email obrigatórios
- Corrige estrutura da API 4ForPayments conforme documentação
- Adiciona campo tangible nos itens e postbackUrl
- Melhora tratamento de erros e logs detalhados
- Corrige configuração Vercel distDir para dist/public
- Resolve problema de pagamentos PIX e cartão"

# Configura repositório remoto
git remote set-url origin https://github.com/Thiagomkt-oba/megaflix.git

# Push para o repositório
echo "🚀 Enviando para Git..."
git push origin main

echo "✅ Sincronização completa!"
echo ""
echo "Arquivos atualizados:"
echo "- api/create-pix-payment.js (validações + estrutura correta)"
echo "- api/create-card-payment.js (mesmas correções)"  
echo "- vercel.json (configuração deploy corrigida)"
echo "- replit.md (documentação atualizada)"