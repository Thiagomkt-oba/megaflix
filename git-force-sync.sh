#!/bin/bash

echo "Resolvendo conflito Git e sincronizando correções..."

# Backup das correções
echo "Criando backup das correções..."
mkdir -p backup-corrections
cp api/create-pix-payment.js backup-corrections/
cp api/create-card-payment.js backup-corrections/
cp vercel.json backup-corrections/
cp replit.md backup-corrections/

# Configura repositório
git remote set-url origin https://github.com/Thiagomkt-oba/megaflix.git

# Baixa mudanças do remoto
echo "Baixando mudanças do repositório remoto..."
git fetch origin

# Faz merge das mudanças remotas
echo "Integrando mudanças remotas..."
git pull origin main --no-rebase

# Restaura as correções caso tenham sido sobrescritas
echo "Restaurando correções de pagamento..."
cp backup-corrections/create-pix-payment.js api/ 2>/dev/null || echo "Arquivo PIX mantido"
cp backup-corrections/create-card-payment.js api/ 2>/dev/null || echo "Arquivo cartão mantido"
cp backup-corrections/vercel.json ./ 2>/dev/null || echo "Vercel config mantida"
cp backup-corrections/replit.md ./ 2>/dev/null || echo "Documentação mantida"

# Adiciona todas as correções
echo "Adicionando correções..."
git add api/create-pix-payment.js
git add api/create-card-payment.js
git add vercel.json
git add replit.md

# Verifica se há mudanças para commit
if git diff --cached --quiet; then
    echo "Nenhuma mudança para enviar."
else
    # Commit das correções
    echo "Fazendo commit das correções..."
    git commit -m "fix: resolve payment API errors and deployment config

- Fix CPF/email validation in payment APIs
- Correct 4ForPayments API structure with required fields
- Fix Vercel deployment configuration (distDir: dist/public)
- Resolve 'Resposta invalidada do servidor de pagamento' error
- Update documentation with changes"

    # Push final
    echo "Enviando correções para GitHub..."
    git push origin main

    echo "Sincronização completa!"
fi

echo "Backup das correções salvo em: backup-corrections/"