# Reddit Client

> A modern Reddit client built with React 18, Redux Toolkit (RTK Query), TypeScript, and Tailwind CSS 4.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Phase Progress](#-phase-progress)
- [Documentation](#-documentation)

---

## ✨ Features

### ✅ Implemented (Phase 1-3)

- **Search System** with debouncing (500ms delay)
  - Real-time search across all subreddits
  - Minimum 3 characters validation
  - Loading and error states
  - Clear search button

- **RTK Query Integration**
  - Automatic caching and request deduplication
  - Type-safe API calls
  - Auto-generated React hooks

- **Custom Hooks**
  - `useDebounce` - Optimizes rapid input changes

- **Modern UI**
  - Dark mode design
  - Responsive layout
  - Tailwind CSS 4 utility classes

### 🔄 In Progress (Phase 3)

- Subreddit filters
- Comments system with nested threading
- Animations and transitions

### ⏳ Planned (Phase 4-5)

- Unit tests (Vitest + React Testing Library)
- E2E tests (Playwright)
- Performance optimization
- Accessibility (WCAG AA)
- Deployment to Netlify

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18 with TypeScript 5 |
| **Build Tool** | Vite 8 |
| **State Management** | Redux Toolkit 2 + RTK Query |
| **Styling** | Tailwind CSS 4 |
| **Testing** | Vitest + React Testing Library + Playwright (planned) |
| **Linting** | ESLint + TypeScript ESLint |
| **Package Manager** | npm |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd reddit_client

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
reddit-client/
├── src/
│   ├── app/                    # Redux store configuration
│   │   ├── store.ts            # Store setup with RTK Query
│   │   └── hooks.ts            # Typed useAppDispatch/useAppSelector
│   ├── features/               # Feature-based organization
│   │   ├── posts/
│   │   │   └── postsApi.ts     # RTK Query API endpoints
│   │   └── search/
│   │       └── SearchBar.tsx   # Search component with debouncing
│   ├── hooks/                  # Custom React hooks
│   │   └── useDebounce.ts      # Debounce hook for search
│   ├── components/             # Shared components
│   ├── types/                  # TypeScript type definitions
│   │   └── reddit.ts           # Reddit API types
│   ├── utils/                  # Utility functions
│   │   ├── cn.ts               # Tailwind class merger
│   │   └── formatters.ts       # Data formatters
│   └── App.tsx                 # Main app component
├── CLAUDE.md                   # Development guidelines
├── ROADMAP.md                  # Project phases and progress
└── package.json
```

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Production build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking

# Testing (planned)
npm run test:unit        # Run unit tests with Vitest
npm run test:e2e         # Run E2E tests with Playwright
```

### Development Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following [CLAUDE.md](./CLAUDE.md) guidelines
3. Run pre-commit checks: `npm run lint && npm run type-check`
4. Commit with conventional commits: `feat:`, `fix:`, `test:`, `docs:`
5. Push and create pull request

---

## 📊 Phase Progress

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 1: Initial Setup | ✅ Complete | 100% |
| Phase 2: Core Functionality | ✅ Complete | 100% |
| Phase 3: Additional Features | 🔄 In Progress | 60% |
| Phase 4: Testing & Quality | ⏳ Pending | 0% |
| Phase 5: Polish & Deploy | ⏳ Pending | 0% |

See [ROADMAP.md](./ROADMAP.md) for detailed task breakdown.

---

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Comprehensive development guidelines
  - Code style and conventions
  - TypeScript patterns
  - Tailwind CSS usage
  - Redux patterns
  - Testing guidelines

- **[ROADMAP.md](./ROADMAP.md)** - Project roadmap and progress tracking
  - Phase breakdown
  - Task status
  - Milestones
  - Learning goals

---

## 🎯 Key Learning Concepts

This project demonstrates:

1. **Debouncing** - Optimize API calls during rapid user input
2. **RTK Query** - Modern data fetching with automatic caching
3. **TypeScript Generics** - Type-safe reusable components
4. **Custom Hooks** - Encapsulate reusable logic
5. **Feature-based Architecture** - Organize code by feature, not type
6. **Tailwind CSS** - Utility-first styling approach

---

## 📝 License

MIT

---

## 👤 Author

**Your Name**

---

**Last Updated**: 2026-02-14
**Current Phase**: Phase 3 (60% complete)
