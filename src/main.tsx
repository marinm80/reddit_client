/**
 * Punto de entrada de la aplicación
 *
 * Aquí configuramos el Provider de Redux para que toda la app
 * tenga acceso al store global.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Provider de Redux: da acceso al store a toda la app */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
