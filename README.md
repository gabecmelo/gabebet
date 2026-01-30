# 🎲 GabeBet - Modern Betting Platform Prototype

A high-fidelity frontend prototype for a modern betting platform, built with **Nuxt 3**, **TypeScript**, and **Tailwind CSS**. This project demonstrates a complete UI/UX for a betting application with simulated functionality.

![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css)
![Vitest](https://img.shields.io/badge/Vitest-4.x-6E9F18?logo=vitest)
![Playwright](https://img.shields.io/badge/Playwright-1.x-2EAD33?logo=playwright)

## ⚠️ Important Disclaimer

> **IMPORTANT:** This is a **frontend prototype for demonstration purposes only**.
>
> The game algorithms currently implemented are **simplified client-side simulations** designed for UI/UX demonstration. They are:
> - Not cryptographically secure
> - Not suitable for real betting applications
> - Running entirely in the browser (client-side)
>
> **The real backend**, featuring proprietary algorithms, provably fair mechanics, and a microservices architecture (Java/Spring), is under active development. The production system will include:
> - Server-side random number generation with cryptographic security
> - Provably fair verification systems
> - Comprehensive audit trails
> - Regulatory compliance measures

## 🎯 Project Goal

Build a complete, responsive frontend for "GabeBet" - a modern betting platform simulation. The project focuses on:

- **Test-Driven Development (TDD)** methodology
- **Modular and scalable** architecture
- **Premium dark mode** design (inspired by Stake, Blaze)
- **Portuguese (PT-BR)** user interface
- **English** codebase (variables, comments, documentation)

## 🚀 Features

### Current Features
- ✅ **Dice Game** - Bet over/under with dynamic multipliers
- ✅ **Mock Authentication** - Register/Login with localStorage
- ✅ **Bet History** - Track all bets with statistics
- ✅ **Responsive Layout** - Sidebar navigation, mobile-ready
- ✅ **Dark Mode UI** - Premium gaming aesthetic

### Coming Soon
- 🔜 Crash Game
- 🔜 Slots Game
- 🔜 User Profile
- 🔜 Internationalization (i18n)

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Nuxt 4 (Vue 3, Composition API) |
| Language | TypeScript (Strict mode) |
| Styling | Tailwind CSS 4 + Nuxt UI |
| State Management | Pinia |
| Unit Testing | Vitest + Vue Test Utils |
| E2E Testing | Playwright |
| Icons | Lucide Icons |

## 📁 Project Structure

```
gabebet/
├── app/
│   ├── components/        # Reusable Vue components
│   ├── layouts/           # Page layouts (default)
│   ├── logic/
│   │   └── algorithms/    # Game algorithms (dice, crash, etc.)
│   ├── pages/             # Route pages
│   │   ├── games/         # Game pages
│   │   └── ...
│   ├── plugins/           # Nuxt plugins (Pinia)
│   ├── services/          # Mock services (auth)
│   ├── stores/            # Pinia stores
│   └── types/             # TypeScript type definitions
├── test/
│   └── unit/              # Unit tests (Vitest)
├── tests/                 # E2E tests (Playwright)
└── ...config files
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 20.x or higher
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/gabebet.git
cd gabebet

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

## 🧪 Testing

### Unit Tests (Vitest)

```bash
# Run unit tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Install Playwright browsers (first time only)
npx playwright install
```

## 📝 Development Workflow

This project follows **strict TDD (Test-Driven Development)**:

1. **Red** - Write a failing test first
2. **Green** - Implement minimum code to pass
3. **Refactor** - Clean up and optimize

### Key Principles

- ✅ **Incremental Compilation** - Verify build after each change
- ✅ **Self-Correction** - Fix breaks before proceeding
- ✅ **Don't Reinvent the Wheel** - Use existing libraries when appropriate
- ✅ **Avoid Overengineering** - Focus on essentials

## 🎮 Game Algorithms

All game logic is isolated in `app/logic/algorithms/`:

### Dice (`dice.ts`)

```typescript
// Example usage
import { placeDiceBet } from '~/logic/algorithms/dice'

const result = placeDiceBet(100, 50, 'over')
// result: { roll: 73, won: true, payout: 198, multiplier: 1.98 }
```

**Note:** These algorithms are simplified simulations. The actual betting backend will use secure server-side implementations.

## 🌐 Internationalization

The UI is in **Portuguese (PT-BR)**, but the codebase is structured for future i18n expansion:

- All user-facing text is in components
- Type definitions and logic use English
- Ready for `@nuxtjs/i18n` integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests first (TDD)
4. Implement your changes
5. Ensure all tests pass
6. Commit with conventional commits (`feat:`, `fix:`, `test:`)
7. Push and create a Pull Request

## 📄 License

This project is for demonstration purposes. All rights reserved.

## 👤 Author

**GabeBet Team**

---

<p align="center">
  <strong>🎰 Play responsibly. This is a simulation only. 🎰</strong>
</p>
