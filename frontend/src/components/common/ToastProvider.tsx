import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        className: 'glass text-slate-800 shadow-xl border border-white/40',
        success: {
          iconTheme: { primary: '#4f46e5', secondary: 'white' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: 'white' },
        },
      }}
    />
  );
}
