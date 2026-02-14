/**
 * Main application component
 *
 * This is a simplified version to test the Search System.
 * In later phases we will add routing, complete layout, etc.
 */
import { SearchBar } from '@/features/search/SearchBar';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-background text-text p-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Reddit Client
        </h1>
        <p className="text-text-secondary">
          Phase 3: Search System with Debouncing
        </p>
      </header>

      {/* Main Content */}
      <main>
        <SearchBar />
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-text-secondary">
        <p>
          Real-time search using{' '}
          <span className="text-primary">RTK Query</span> +{' '}
          <span className="text-primary">useDebounce</span>
        </p>
        <p className="mt-2">
          💡 Type at least 3 characters to search
        </p>
      </footer>
    </div>
  );
}

export default App;
