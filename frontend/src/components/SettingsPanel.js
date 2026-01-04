import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings as SettingsIcon, Mail, Sliders, Key, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
export function SettingsPanel({ isOpen, onClose, settings, setSettings }) {
    const [showApiKey, setShowApiKey] = useState(false);
    const [localSettings, setLocalSettings] = useState(settings);
    const handleSave = () => {
        // Validate risk weights sum to 100
        const total = Object.values(localSettings.riskWeights).reduce((a, b) => a + b, 0);
        if (total !== 100) {
            toast.error('Invalid Configuration', {
                description: 'Risk weights must sum to 100%',
            });
            return;
        }
        setSettings(localSettings);
        toast.success('Settings Saved!', {
            description: 'Your configuration has been updated successfully.',
        });
        onClose();
    };
    const updateRiskWeight = (key, value) => {
        setLocalSettings({
            ...localSettings,
            riskWeights: {
                ...localSettings.riskWeights,
                [key]: value
            }
        });
    };
    const resetToDefaults = () => {
        setLocalSettings({
            alertThreshold: 5000,
            emailNotifications: true,
            riskWeights: {
                location: 30,
                velocity: 25,
                device: 20,
                amount: 15,
                behavior: 10
            },
            apiKey: 'sk_live_••••••••••••••••••••••••'
        });
        toast.info('Reset to Defaults');
    };
    const generateNewApiKey = () => {
        const newKey = `sk_live_${Math.random().toString(36).substring(2, 26)}`;
        setLocalSettings({ ...localSettings, apiKey: newKey });
        toast.success('New API Key Generated!', {
            description: 'Make sure to save this key securely.',
        });
    };
    const totalWeight = Object.values(localSettings.riskWeights).reduce((a, b) => a + b, 0);
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50", onClick: onClose }), _jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { type: 'spring', damping: 25 }, className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[80vh] bg-[#1a1a2e] border border-white/10 rounded-2xl z-50 overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center", children: _jsx(SettingsIcon, { className: "w-5 h-5 text-white" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl text-white", children: "Settings" }), _jsx("p", { className: "text-sm text-gray-400", children: "Configure your fraud detection system" })] })] }), _jsx("button", { onClick: onClose, className: "p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5 text-gray-400" }) })] }), _jsxs("div", { className: "mb-6 p-4 bg-white/5 border border-white/10 rounded-xl", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Mail, { className: "w-5 h-5 text-purple-400" }), _jsx("h3", { className: "text-white", children: "Alert Threshold" })] }), _jsx("p", { className: "text-sm text-gray-400 mb-3", children: "Transaction amount (\u20B9) that triggers high-risk alerts" }), _jsx("input", { type: "number", value: localSettings.alertThreshold, onChange: (e) => setLocalSettings({ ...localSettings, alertThreshold: parseInt(e.target.value) || 0 }), className: "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50" }), _jsxs("p", { className: "text-xs text-gray-500 mt-2", children: ["Current: \u20B9", localSettings.alertThreshold.toLocaleString()] })] }), _jsx("div", { className: "mb-6 p-4 bg-white/5 border border-white/10 rounded-xl", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Mail, { className: "w-5 h-5 text-blue-400" }), _jsxs("div", { children: [_jsx("h3", { className: "text-white", children: "Email Notifications" }), _jsx("p", { className: "text-sm text-gray-400", children: "Receive alerts via email" })] })] }), _jsx("button", { onClick: () => setLocalSettings({ ...localSettings, emailNotifications: !localSettings.emailNotifications }), className: `relative w-14 h-7 rounded-full transition-colors ${localSettings.emailNotifications ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-600'}`, children: _jsx(motion.div, { className: "absolute top-1 left-1 w-5 h-5 bg-white rounded-full", animate: { x: localSettings.emailNotifications ? 28 : 0 }, transition: { type: 'spring', stiffness: 500, damping: 30 } }) })] }) }), _jsxs("div", { className: "mb-6 p-4 bg-white/5 border border-white/10 rounded-xl", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Sliders, { className: "w-5 h-5 text-green-400" }), _jsx("h3", { className: "text-white", children: "Risk Score Weights" })] }), _jsx("p", { className: "text-sm text-gray-400 mb-4", children: "Adjust the importance of each fraud detection factor (must total 100%)" }), _jsx("div", { className: "space-y-4", children: Object.entries(localSettings.riskWeights).map(([key, value]) => (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("label", { className: "text-sm text-gray-300 capitalize", children: key }), _jsxs("span", { className: "text-sm text-purple-400", children: [value, "%"] })] }), _jsx("input", { type: "range", min: "0", max: "100", value: value, onChange: (e) => updateRiskWeight(key, parseInt(e.target.value)), className: "w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-600 [&::-webkit-slider-thumb]:to-blue-600" })] }, key))) }), _jsx("div", { className: `mt-4 p-3 rounded-lg ${totalWeight === 100 ? 'bg-green-500/10 border border-green-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'}`, children: _jsxs("p", { className: `text-sm ${totalWeight === 100 ? 'text-green-400' : 'text-yellow-400'}`, children: ["Total: ", totalWeight, "% ", totalWeight === 100 ? '✓' : `(must be 100%)`] }) })] }), _jsxs("div", { className: "mb-6 p-4 bg-white/5 border border-white/10 rounded-xl", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Key, { className: "w-5 h-5 text-yellow-400" }), _jsx("h3", { className: "text-white", children: "API Key" })] }), _jsx("p", { className: "text-sm text-gray-400 mb-3", children: "Manage your FraudX API credentials" }), _jsx("div", { className: "flex gap-2 mb-3", children: _jsxs("div", { className: "flex-1 relative", children: [_jsx("input", { type: showApiKey ? 'text' : 'password', value: localSettings.apiKey, readOnly: true, className: "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white pr-10" }), _jsx("button", { onClick: () => setShowApiKey(!showApiKey), className: "absolute right-3 top-1/2 -translate-y-1/2", children: showApiKey ? (_jsx(EyeOff, { className: "w-4 h-4 text-gray-400" })) : (_jsx(Eye, { className: "w-4 h-4 text-gray-400" })) })] }) }), _jsx("button", { onClick: generateNewApiKey, className: "w-full px-4 py-2.5 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all", children: "Generate New Key" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: resetToDefaults, className: "flex-1 px-4 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all", children: "Reset to Defaults" }), _jsxs("button", { onClick: handleSave, className: "flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all", children: [_jsx(Save, { className: "w-5 h-5" }), "Save Settings"] })] })] }) })] })) }));
}
