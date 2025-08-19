# 🐄 SGPR - Sistema de Gestão de Propriedades Rurais

Sistema web moderno e gratuito para gestão completa de propriedades rurais.

## 🌟 Características

- **100% Web**: Acesse de qualquer dispositivo
- **Gratuito**: Hospedagem no GitHub Pages
- **Completo**: Animais, finanças e relatórios
- **Seguro**: Dados no Google Sheets
- **Responsivo**: Funciona em mobile e desktop

## 🚀 Funcionalidades

### 🐄 Gestão de Animais
- Cadastro completo do rebanho
- Controle de peso e GMD
- Genealogia e histórico
- Busca e filtros avançados

### 💰 Controle Financeiro
- 22 categorias de despesas
- Receitas detalhadas
- Relatórios financeiros
- Análise de fluxo de caixa

### 📊 Relatórios e Fichas
- Fichas de campo em PDF
- Relatórios zootécnicos
- Estatísticas do rebanho
- Análises de reprodução

## 📋 Pré-requisitos

- Conta Google (Gmail)
- Conta GitHub (gratuita)
- Navegador moderno

## ⚙️ Configuração

### 1. Configure o Google Apps Script
1. Acesse [script.google.com](https://script.google.com)
2. Crie novo projeto
3. Cole o código de `docs/google-apps-script.js`
4. Configure as variáveis CONFIG
5. Publique como Web App

### 2. Configure as Planilhas
1. Crie planilha "SGPR_Master" no Google Sheets
2. Adicione abas "Usuarios" e "Propriedades"
3. Crie pasta "SGPR_Propriedades" no Google Drive

### 3. Configure o Frontend
1. Edite `js/config.js`
2. Substitua `API_URL` pela URL do Google Apps Script
3. Faça commit das alterações

### 4. Ative GitHub Pages
1. Vá em Settings → Pages
2. Selecione branch "main"
3. Aguarde deploy

## 📖 Manual Completo

Consulte o arquivo `MANUAL_INSTALACAO_LEIGO.md` para instruções detalhadas passo a passo.

## 🔐 Segurança

- Dados ficam nas suas planilhas Google
- Autenticação via Google Apps Script
- Sem informações sensíveis no código frontend
- Controle de acesso por propriedade

## 📱 Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Windows, Mac, Linux
- ✅ Android, iOS
- ✅ Tablets e smartphones

## 🆘 Suporte

- **Email**: suporte@sgpr.com
- **WhatsApp**: (63) 99999-9999
- **Documentação**: Consulte os arquivos .md

## 📄 Licença

MIT License - Use livremente para fins comerciais e pessoais.

## 🏆 Créditos

Desenvolvido para a pecuária brasileira com ❤️

**SGPR - Tecnologia a serviço do campo**

