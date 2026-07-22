import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './Router';

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color:       '#f3f4f6',
            border:      '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize:    '14px',
          },
          success: { iconTheme: { primary: '#4ade80', secondary: '#1a1a2e' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#1a1a2e' } },
          duration: 4000,
        }}
      />
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
