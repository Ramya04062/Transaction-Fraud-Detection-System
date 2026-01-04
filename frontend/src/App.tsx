import { useState } from 'react';
import { Toaster } from 'sonner';
import { LandingPage } from './components/LandingPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { SupportPage } from './components/SupportPage';

type Page = 'landing' | 'login' | 'dashboard' | 'support';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigateTo = (page: Page) => {
    if (page === 'dashboard' && !isAuthenticated) {
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('landing');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid rgba(168, 85, 247, 0.3)',
          },
          className: 'toast',
        }}
        richColors
      />
      {currentPage === 'landing' && <LandingPage onNavigate={navigateTo} />}
      {currentPage === 'login' && <AdminLogin onLogin={handleLogin} onNavigate={navigateTo} />}
      {currentPage === 'dashboard' && <AdminDashboard onLogout={handleLogout} onNavigate={navigateTo} />}
      {currentPage === 'support' && <SupportPage onNavigate={navigateTo} />}
    </div>
  );
}

