import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Toaster } from 'sonner';
import { LandingPage } from './components/LandingPage';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { SupportPage } from './components/SupportPage';
export default function App() {
    const [currentPage, setCurrentPage] = useState('landing');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigateTo = (page) => {
        if (page === 'dashboard' && !isAuthenticated) {
            setCurrentPage('login');
        }
        else {
            setCurrentPage(page);
        }
    };
    const handleLogin = (success) => {
        if (success) {
            setIsAuthenticated(true);
            setCurrentPage('dashboard');
        }
    };
    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentPage('landing');
    };
    return (_jsxs("div", { className: "min-h-screen bg-[#0a0a0f]", children: [_jsx(Toaster, { position: "top-right", toastOptions: {
                    style: {
                        background: '#1a1a2e',
                        color: '#fff',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                    },
                    className: 'toast',
                }, richColors: true }), currentPage === 'landing' && _jsx(LandingPage, { onNavigate: navigateTo }), currentPage === 'login' && _jsx(AdminLogin, { onLogin: handleLogin, onNavigate: navigateTo }), currentPage === 'dashboard' && _jsx(AdminDashboard, { onLogout: handleLogout, onNavigate: navigateTo }), currentPage === 'support' && _jsx(SupportPage, { onNavigate: navigateTo })] }));
}
