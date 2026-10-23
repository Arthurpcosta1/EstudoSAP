# SAP QA Simulator - Masterboi Edition 🥩🎮

Simulador interativo de testes de qualidade (QA) e homologação de processos SAP nos módulos **MM (Compras e Suprimentos)**, **SD (Vendas e Expedição)**, **FI/CO (Financeiro e Controladoria)** e **Rastreabilidade/SIF**, adaptado especificamente para as operações da **Masterboi**.

---

## 🚀 Como testar agora mesmo (Sem instalar nada)

Você pode enviar este link direto para seus amigos e colegas de equipe testarem no celular ou computador agora mesmo:

👉 **[Acessar Simulador Masterboi](https://ais-pre-nszqnnqjqj6yg3pk7ljnh4-786597741795.us-east1.run.app)**

---

## 🕹️ Modos de Visualização

1. **🎮 Modo Gamer (Arcade 16-Bit / Retro HUD)**:
   - Visual pixel-art futurista com barra de HP/XP, avatar animado, efeitos sonoros (Web Audio API) e diálogos de missão RPG.
   - Ideal para treinamentos dinâmicos, onboarding gamificado e engajamento da equipe.

2. **💼 Modo Executivo (Portal Corporativo Masterboi)**:
   - Layout corporativo limpo, idêntico aos portais de gestão de projetos da Masterboi.
   - KPIs executivos (Total de Casos, Homologados, Pendentes, Taxa de Sucesso, Defeitos Críticos, Esforço QA).
   - Barra de progresso geral e cards de status por departamento.
   - Gaveta de auditoria de evidências de testes (DANFE, MIGO, MIRO, Romaneio SIF) e visualização de logs técnicos SAP.

> **Nota:** O progresso (XP, Nível, Casos Concluídos e Status) é compartilhado e sincronizado em tempo real entre os dois modos!

---

## 📦 Como Subir no GitHub

Abra o seu terminal na pasta do projeto e execute os seguintes comandos:

```bash
# 1. Inicialize o repositório Git (se ainda não tiver feito)
git init

# 2. Adicione todos os arquivos
git add .

# 3. Crie o primeiro commit
git commit -m "feat: Simulador SAP Masterboi com Modo Gamer e Modo Executivo"

# 4. Crie um novo repositório no seu GitHub (ex: sap-qa-masterboi) e vincule:
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# 5. Envie para o GitHub
git branch -M main
git push -u origin main
```

---

## ⚡ Como Publicar na Vercel

O projeto já inclui o arquivo `vercel.json` pré-configurado para o Vite SPA.

### Opção 1: Direto pelo Dashboard da Vercel (Recomendado)
1. Acesse **[vercel.com](https://vercel.com)** e faça login com sua conta do GitHub.
2. Clique em **"Add New..."** > **"Project"**.
3. Selecione o repositório que você subiu no GitHub (`SEU_REPOSITORIO`).
4. A Vercel detectará automaticamente o framework como **Vite**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Clique em **"Deploy"** e em menos de 1 minuto seu site estará no ar com link público permanente (ex: `seu-projeto.vercel.app`)!

### Opção 2: Pelo Terminal (CLI da Vercel)
```bash
# Instale a CLI da Vercel globalmente
npm i -g vercel

# Na raiz do projeto, execute
vercel

# Para deploy em produção definitivo:
vercel --prod
```

---

## 🛠️ Tecnologias Utilizadas

- **React 19** + **TypeScript**
- **Vite 8** (Build rápido e otimizado)
- **Tailwind CSS 4** (Estilização responsiva e temas)
- **Motion (Framer Motion)** (Animações fluidas e transições de modo)
- **Lucide Icons** (Ícones corporativos e retro)
- **Web Audio API** (Efeitos sonoros nativos gerados via código, sem arquivos pesados de áudio)
