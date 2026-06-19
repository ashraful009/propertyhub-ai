import { BrowserRouter } from 'react-router-dom';
import ToastProvider from './components/common/ToastProvider';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;