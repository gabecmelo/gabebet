# 🎲 GabeBet - Protótipo de Plataforma de Apostas Moderna

*[English version available](README-EN.md) | [Versão em Português](README.md)*

Um protótipo frontend de alta fidelidade para uma plataforma de apostas moderna, construído com **Nuxt 4**, **TypeScript** e **Tailwind CSS**. Este projeto demonstra uma UI/UX completa para uma aplicação de apostas com funcionalidade simulada.

![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css)
![Vitest](https://img.shields.io/badge/Vitest-4.x-6E9F18?logo=vitest)
![Playwright](https://img.shields.io/badge/Playwright-1.x-2EAD33?logo=playwright)

## ⚠️ Aviso Importante

> **IMPORTANTE:** Este é um **protótipo frontend apenas para fins de demonstração**.
>
> Os algoritmos de jogos atualmente implementados são **simulações simplificadas do lado do cliente** projetadas para demonstração de UI/UX. Eles são:
> - Não criptograficamente seguros
> - Não adequados para aplicações de apostas reais
> - Executados inteiramente no navegador (lado do cliente)
>
> **O backend real**, apresentando algoritmos proprietários, mecânicas comprovadamente justas e uma arquitetura de microsserviços (Java/Spring), está em desenvolvimento ativo. O sistema de produção incluirá:
> - Geração de números aleatórios do lado do servidor com segurança criptográfica
> - Sistemas de verificação comprovadamente justos
> - Trilhas de auditoria abrangentes
> - Medidas de conformidade regulatória

## Projeto Online

Disponível em: [GabeBet](https://gabecmelo.github.io/gabebet/)

## 🎯 Objetivo do Projeto

Frontend completo e responsivo para "GabeBet" - uma simulação de plataforma de apostas moderna. O projeto foca em:

- Metodologia **Test-Driven Development (TDD)**
- Arquitetura **modular e escalável**
- Design **premium em modo escuro**
- Interface de usuário em **Português (PT-BR)**
- Código base em **Inglês** (variáveis, comentários, documentação)

## 🚀 Funcionalidades

### Funcionalidades Atuais
- ✅ **Jogo de Dados** - Aposte em maior/menor com multiplicadores dinâmicos
- ✅ **Autenticação Simulada** - Registro/Login com localStorage
- ✅ **Histórico de Apostas** - Rastreie todas as apostas com estatísticas
- ✅ **Layout Responsivo** - Navegação lateral, pronto para mobile
- ✅ **UI Modo Escuro** - Estética premium de jogos

### Em Breve
- 🔜 Jogo Crash
- 🔜 Jogo de Slots
- 🔜 Perfil do Usuário
- 🔜 Internacionalização (i18n)
- 🔜 Backend funcional implementado com microserviços próprios para sistema de apostas

## 🛠️ Stack Tecnológico

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Nuxt 4 (Vue 3, Composition API) |
| Linguagem | TypeScript (Modo estrito) |
| Estilização | Tailwind CSS 4 + Nuxt UI |
| Gerenciamento de Estado | Pinia |
| Testes Unitários | Vitest + Vue Test Utils |
| Testes E2E | Playwright |
| Ícones | Lucide Icons |

## 📁 Estrutura do Projeto

```
gabebet/
├── app/
│   ├── components/        # Componentes Vue reutilizáveis
│   ├── layouts/           # Layouts de página (padrão)
│   ├── logic/
│   │   └── algorithms/    # Algoritmos de jogos (dados, crash, etc.)
│   ├── pages/             # Páginas de rota
│   │   ├── games/         # Páginas de jogos
│   │   └── ...
│   ├── plugins/           # Plugins Nuxt (Pinia)
│   ├── services/          # Serviços simulados (auth)
│   ├── stores/            # Stores Pinia
│   └── types/             # Definições de tipos TypeScript
├── test/
│   └── unit/              # Testes unitários (Vitest)
├── tests/                 # Testes E2E (Playwright)
└── ...arquivos de configuração
```

## 🏃‍♂️ Como Começar

### Pré-requisitos

- Node.js 20.x ou superior
- pnpm (recomendado) ou npm

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/gabecmelo/gabebet.git
cd gabebet

# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev
```

O app estará disponível em `http://localhost:3000`

## 🧪 Testes

### Testes Unitários (Vitest)

```bash
# Executar testes unitários uma vez
pnpm test

# Executar testes em modo observação
pnpm test:watch

# Executar testes com cobertura
pnpm test:coverage
```

### Testes E2E (Playwright)

```bash
# Executar testes E2E
pnpm test:e2e

# Executar testes E2E com UI
pnpm test:e2e:ui

# Instalar navegadores Playwright (apenas primeira vez)
npx playwright install
```

## 📝 Fluxo de Desenvolvimento

Este projeto segue **TDD (Test-Driven Development) rigoroso**:

1. **Vermelho** - Escrever um teste que falha primeiro
2. **Verde** - Implementar código mínimo para passar
3. **Refatorar** - Limpar e otimizar

### Princípios Chave

- ✅ **Compilação Incremental** - Verificar build após cada mudança
- ✅ **Auto-Correção** - Corrigir problemas antes de prosseguir
- ✅ **Não Reinvente a Roda** - Usar bibliotecas existentes quando apropriado
- ✅ **Evitar Sobre-engenharia** - Focar no essencial

## 🎮 Algoritmos de Jogos

Toda lógica de jogo está isolada em `app/logic/algorithms/`:

### Dados (`dice.ts`)

```typescript
// Exemplo de uso
import { placeDiceBet } from '~/logic/algorithms/dice'

const result = placeDiceBet(100, 50, 'over')
// result: { roll: 73, won: true, payout: 198, multiplier: 1.98 }
```

**Nota:** Estes algoritmos são simulações simplificadas. O backend real de apostas usará implementações seguras do lado do servidor.

## 🌐 Internacionalização

A UI está em **Português (PT-BR)**, mas o código base está estruturado para expansão i18n futura:

- Todo texto visível ao usuário está nos componentes
- Definições de tipos e lógica usam Inglês
- Pronto para integração com `@nuxtjs/i18n`

## 🤝 Contribuindo

1. Faça fork do repositório
2. Crie uma branch de funcionalidade (`git checkout -b feature/funcionalidade-incrivel`)
3. Escreva testes primeiro (TDD)
4. Implemente suas mudanças
5. Certifique-se de que todos os testes passam
6. Commit com commits convencionais (`feat:`, `fix:`, `test:`)
7. Push e crie um Pull Request

## 📄 Licença

Este projeto é para fins de demonstração. Todos os direitos reservados.

## 👤 Autor

**Equipe GabeBet (eu mesmo kkkkkkkkkkkkkkkkkk Gabriel Cabral Melo)**

---

<p align="center">
  <strong>🎰 Jogue com responsabilidade. Esta é apenas uma simulação. 🎰</strong>
</p>
