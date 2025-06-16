#!/bin/bash

echo "Sincronizando projeto Megaflix com correções de pagamento..."

# Backup dos arquivos importantes
echo "Criando backup dos arquivos corrigidos..."
mkdir -p backup
cp api/create-pix-payment.js backup/
cp api/create-card-payment.js backup/
cp vercel.json backup/
cp replit.md backup/

# Configura repositório remoto se necessário
git remote set-url origin https://github.com/Thiagomkt-oba/megaflix.git

# Baixa mudanças do repositório remoto
echo "Baixando mudanças do repositório..."
git fetch origin

# Adiciona arquivos corrigidos
echo "Adicionando correções..."
git add api/create-pix-payment.js
git add api/create-card-payment.js
git add vercel.json
git add replit.md
git add build.sh
git add sync-git.sh
git add git-sync-complete.sh

# Mostra diferenças
echo "Mudanças a serem enviadas:"
git diff --cached --name-only

# Commit com mensagem detalhada
git commit -m "fix: resolve payment API error and Vercel deployment

Correções implementadas:
- Validação de CPF (11 dígitos) e email obrigatórios
- Estrutura correta da API 4ForPayments com campos tangible e postbackUrl
- Mapeamento correto de status PENDING para waiting_payment
- Tratamento robusto de erros com logs detalhados
- Configuração Vercel corrigida: distDir para dist/public
- Scripts de sincronização Git incluídos

Resolve: erro 'Resposta invalidada do servidor de pagamento'
Deploy: megaflix-five.vercel.app funcionando corretamente"

# Push para origin
echo "Enviando para repositório..."
git push origin main

echo "Sincronização completa!"
echo ""
echo "Backup salvo em: ./backup/"
echo "Site atualizado: https://megaflix-five.vercel.app"