import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings as SettingsIcon, Mail, Sliders, Key, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface SettingsState {
  alertThreshold: number;
  emailNotifications: boolean;
  riskWeights: {
    location: number;
    velocity: number;
    device: number;
    amount: number;
    behavior: number;
  };
  apiKey: string;
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsState;
  setSettings: (settings: SettingsState) => void;
}

export function SettingsPanel({ isOpen, onClose, settings, setSettings }: SettingsPanelProps) {
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

  const updateRiskWeight = (key: keyof typeof settings.riskWeights, value: number) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[80vh] bg-[#1a1a2e] border border-white/10 rounded-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <SettingsIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl text-white">Settings</h2>
                    <p className="text-sm text-gray-400">Configure your fraud detection system</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Alert Threshold */}
              <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <h3 className="text-white">Alert Threshold</h3>
                </div>
                <p className="text-sm text-gray-400 mb-3">Transaction amount (₹) that triggers high-risk alerts</p>
                <input
                  type="number"
                  value={localSettings.alertThreshold}
                  onChange={(e) => setLocalSettings({ ...localSettings, alertThreshold: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                />
                <p className="text-xs text-gray-500 mt-2">Current: ₹{localSettings.alertThreshold.toLocaleString()}</p>
              </div>

              {/* Email Notifications */}
              <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="text-white">Email Notifications</h3>
                      <p className="text-sm text-gray-400">Receive alerts via email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setLocalSettings({ ...localSettings, emailNotifications: !localSettings.emailNotifications })}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      localSettings.emailNotifications ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full"
                      animate={{ x: localSettings.emailNotifications ? 28 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>

              {/* Risk Score Weights */}
              <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Sliders className="w-5 h-5 text-green-400" />
                  <h3 className="text-white">Risk Score Weights</h3>
                </div>
                <p className="text-sm text-gray-400 mb-4">Adjust the importance of each fraud detection factor (must total 100%)</p>
                
                <div className="space-y-4">
                  {Object.entries(localSettings.riskWeights).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm text-gray-300 capitalize">{key}</label>
                        <span className="text-sm text-purple-400">{value}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => updateRiskWeight(key as keyof typeof settings.riskWeights, parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-600 [&::-webkit-slider-thumb]:to-blue-600"
                      />
                    </div>
                  ))}
                </div>

                <div className={`mt-4 p-3 rounded-lg ${totalWeight === 100 ? 'bg-green-500/10 border border-green-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'}`}>
                  <p className={`text-sm ${totalWeight === 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                    Total: {totalWeight}% {totalWeight === 100 ? '✓' : `(must be 100%)`}
                  </p>
                </div>
              </div>

              {/* API Key Management */}
              <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Key className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-white">API Key</h3>
                </div>
                <p className="text-sm text-gray-400 mb-3">Manage your FraudX API credentials</p>
                
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={localSettings.apiKey}
                      readOnly
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white pr-10"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showApiKey ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={generateNewApiKey}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
                >
                  Generate New Key
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={resetToDefaults}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all"
                >
                  Reset to Defaults
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all"
                >
                  <Save className="w-5 h-5" />
                  Save Settings
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
