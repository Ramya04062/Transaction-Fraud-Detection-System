import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from "framer-motion";
import { Shield, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
export function AdminLogin({ onLogin, onNavigate }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await fetch("http://localhost:8000/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            const data = await res.json();
            if (data.success) {
                onLogin(true);
            }
            else {
                setError(data.message || "Login failed");
            }
        }
        catch (err) {
            setError("Server not reachable");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen relative overflow-hidden flex items-center justify-center px-8 py-12", children: [_jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [_jsx(motion.div, { className: "absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl", animate: {
                            x: [0, 100, 0],
                            y: [0, -50, 0],
                        }, transition: {
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut"
                        } }), _jsx(motion.div, { className: "absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl", animate: {
                            x: [0, -100, 0],
                            y: [0, 50, 0],
                        }, transition: {
                            duration: 25,
                            repeat: Infinity,
                            ease: "easeInOut"
                        } })] }), _jsxs("button", { onClick: () => onNavigate('landing'), className: "absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-10", children: [_jsx(ArrowLeft, { className: "w-5 h-5" }), "Back to Home"] }), _jsxs(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, className: "relative z-10 w-full max-w-md", children: [_jsxs("div", { className: "p-10 bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-xl", children: [_jsxs("div", { className: "flex items-center justify-center gap-3 mb-8", children: [_jsx("div", { className: "w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center", children: _jsx(Shield, { className: "w-8 h-8 text-white" }) }), _jsx("span", { className: "text-3xl text-white tracking-tight", children: "FraudX" })] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-2xl text-white mb-2", children: "Admin Login" }), _jsx("p", { className: "text-gray-400", children: "Access your fraud detection dashboard" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [error && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center", children: error })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-2", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx(User, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "admin@fraudx.com", className: "w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-400 mb-2", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" }), _jsx("input", { type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors", children: showPassword ? _jsx(EyeOff, { className: "w-5 h-5" }) : _jsx(Eye, { className: "w-5 h-5" }) })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", className: "w-4 h-4 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500/50" }), _jsx("span", { className: "text-sm text-gray-400", children: "Remember me" })] }), _jsx("button", { type: "button", className: "text-sm text-purple-400 hover:text-purple-300 transition-colors", children: "Forgot password?" })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(motion.div, { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full", animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: "linear" } }), "Signing in..."] })) : ('Sign In') })] }), _jsx("div", { className: "mt-8 text-center" })] }), _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.5 }, className: "mt-6 flex items-center justify-center gap-2 text-sm text-gray-500", children: [_jsx(Lock, { className: "w-4 h-4" }), _jsx("span", { children: "Secured with 256-bit encryption" })] })] })] }));
}
