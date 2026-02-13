# Reddit Client

> A modern, high-performance Reddit client built with React 18, Redux Toolkit, TypeScript, and Tailwind CSS 4.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.0-764abc.svg)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff.svg)](https://vitejs.dev/)

---

## 🎯 Overview

This is a **learning project** focused on demonstrating best practices in modern web development. The application provides a clean, responsive interface for browsing Reddit content with features like:

- 📱 **Responsive Design** - Mobile-first, works seamlessly on all devices
- ⚡ **High Performance** - Code splitting, lazy loading, optimized bundle size
- 🎨 **Modern UI** - Built with Tailwind CSS 4 utility-first approach
- 🔍 **Search & Filters** - Find posts by keyword, subreddit, or sort type
- 💬 **Comments** - View threaded comment discussions
- ♿ **Accessible** - WCAG AA compliant, keyboard navigation support
- 🧪 **Well Tested** - 80%+ unit test coverage, E2E tests with Playwright

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/reddit-client.git
cd reddit-client

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

---

## 📦 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18 |
| **Build Tool** | Vite 5 |
| **Language** | TypeScript 5 (strict mode) |
| **State Management** | Redux Toolkit 2 + RTK Query |
| **Styling** | Tailwind CSS 4 |
| **Routing** | React Router 6 |
| **Testing** | Vitest + React Testing Library + Playwright |
| **Code Quality** | ESLint + TypeScript ESLint |

---

## 🛠 Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Production build
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking (no emit)

# Testing
npm run test:unit        # Run unit tests with Vitest
npm run test:e2e         # Run E2E tests with Playwright
npm run test:coverage    # Generate coverage report
```

---

## 📁 Project Structure

```
reddit-client/
├── src/
│   ├── app/                    # Redux store configuration
│   ├── features/               # Feature-based organization
│   │   ├── posts/              # Post listing and details
│   │   ├── search/             # Search functionality
│   │   ├── subreddits/         # Subreddit filtering
│   │   └── comments/           # Comment display
│   ├── components/             # Shared components
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # Design system components
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   ├── types/                  # TypeScript type definitions
│   └── routes/                 # Route components
├── e2e/                        # Playwright E2E tests
├── public/                     # Static assets
├── CLAUDE.md                   # AI development guidelines
├── ROADMAP.md                  # Project phases and milestones
└── [config files]              # Vite, TypeScript, Tailwind configs
```

**Organization Principles:**
- **Feature-based structure** - Group by feature, not by file type
- **Co-location** - Tests live next to components
- **Container/Presentation separation** - Logic vs UI components
- **Utility-first CSS** - Tailwind CSS for styling

---

## 🎨 Key Features

### 1. Modern State Management

- **RTK Query** for API data fetching and caching
- **Redux Toolkit** slices for local UI state
- Automatic cache invalidation and refetching
- Optimistic updates for better UX

### 2. Infinite Scroll

- Seamless post loading as you scroll
- Smart caching to avoid redundant API calls
- Merge strategy for paginated results

### 3. Search & Filters

- Debounced search input (500ms)
- Filter by subreddit
- Sort by hot, top, new
- Time filters (hour, day, week, month, year, all)

### 4. Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly UI elements
- Optimized for all screen sizes

### 5. Performance Optimizations

- Code splitting with React.lazy
- Image lazy loading
- Memoized selectors
- Efficient re-render prevention

---

## 🧪 Testing

### Unit Tests (Vitest + React Testing Library)

```bash
npm run test:unit
npm run test:coverage
```

**Coverage targets:**
- Components: 80%+
- Hooks/Utils: 90%+

**What we test:**
- Component rendering
- User interactions
- Conditional rendering (loading, error states)
- Custom hooks behavior
- Utility functions with edge cases

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

**Critical user flows:**
- Browse posts on homepage
- Search for posts
- Filter by subreddit
- View post details
- Navigate between pages

---

## 🎯 Learning Goals

This project demonstrates:

✅ **Modern React patterns** - Hooks, context, suspense
✅ **Advanced Redux** - RTK Query, normalized state, selectors
✅ **TypeScript best practices** - Strict mode, type inference, generics
✅ **Tailwind CSS mastery** - Utility-first, custom config, responsive design
✅ **Testing strategies** - Unit, integration, E2E
✅ **Performance optimization** - Code splitting, lazy loading, memoization
✅ **Accessibility** - WCAG AA compliance, keyboard navigation
✅ **Developer experience** - Fast builds, HMR, type safety

---

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Comprehensive development guidelines for AI agents
  - Code style and conventions
  - Component patterns
  - Redux patterns
  - Testing strategies
  - Pre-commit checklist

- **[ROADMAP.md](./ROADMAP.md)** - Project phases, milestones, and progress tracking

---

## 🔧 Configuration

### Tailwind CSS

Custom theme with Reddit-inspired colors:

```javascript
{
  colors: {
    primary: '#ff4500',          // Reddit Orange
    background: '#0b1416',       // Dark background
    surface: '#1a1a1b',          // Card background
    text: '#d7dadc',             // Primary text
  }
}
```

### TypeScript

Strict mode enabled:
- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- All recommended checks enabled

### Vite

Optimized for development and production:
- Fast HMR with React Fast Refresh
- Optimized chunk splitting
- Asset optimization

---

## 🚦 Project Status

**Current Phase**: Phase 3 - Features Adicionales (see [ROADMAP.md](./ROADMAP.md))

**Completed:**
- ✅ Phase 1: Configuración Inicial
- ✅ Phase 2: Funcionalidad Core
- 🔄 Phase 3: Features Adicionales (in progress)

**Next up:**
- Search system
- Subreddit filters
- Comment threading
- Infinite scroll

---

## 🤝 Contributing

This is a learning project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the guidelines in [CLAUDE.md](./CLAUDE.md)
4. Run tests and linting before committing
5. Commit with conventional commits (`feat:`, `fix:`, `test:`)
6. Push and create a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Reddit API** - For providing free JSON endpoints
- **Redux Toolkit team** - For excellent state management tools
- **Tailwind CSS** - For the utility-first CSS framework
- **Vite team** - For blazing fast build tooling

---

## 📞 Contact

**Project Link**: [https://github.com/yourusername/reddit-client](https://github.com/yourusername/reddit-client)

---

**Built with ❤️ as a learning project to master modern web development**
