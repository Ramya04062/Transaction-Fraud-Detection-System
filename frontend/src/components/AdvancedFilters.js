import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Filter as FilterIcon } from 'lucide-react';
import { toast } from 'sonner';
export function AdvancedFilters({ isOpen, onClose, filters, setFilters, presets, setPresets }) {
    const dateRanges = [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: '7days', label: 'Last 7 Days' },
        { value: '30days', label: 'Last 30 Days' },
        { value: '90days', label: 'Last 90 Days' },
        { value: 'custom', label: 'Custom Range' }
    ];
    const statusOptions = ['approved', 'blocked', 'review'];
    const riskOptions = ['low', 'medium', 'high'];
    const countryOptions = ['India', 'United States', 'United Kingdom', 'Nigeria', 'Pakistan', 'Bangladesh', 'Romania', 'Russia'];
    const toggleMultiSelect = (key, value) => {
        const currentValues = filters[key];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        setFilters({ ...filters, [key]: newValues });
    };
    const savePreset = () => {
        const name = prompt('Enter preset name:');
        if (!name)
            return;
        const newPreset = {
            id: Date.now().toString(),
            name,
            filters: { ...filters }
        };
        setPresets([...presets, newPreset]);
        toast.success('Filter Preset Saved!', {
            description: `"${name}" has been saved successfully.`,
        });
    };
    const loadPreset = (preset) => {
        setFilters(preset.filters);
        toast.success('Preset Loaded!', {
            description: `"${preset.name}" filters have been applied.`,
        });
    };
    const deletePreset = (id) => {
        setPresets(presets.filter(p => p.id !== id));
        toast.success('Preset Deleted!');
    };
    const resetFilters = () => {
        setFilters({
            dateRange: 'all',
            customStartDate: '',
            customEndDate: '',
            minAmount: '',
            maxAmount: '',
            status: [],
            riskLevel: [],
            country: []
        });
        toast.info('Filters Reset');
    };
    const applyFilters = () => {
        toast.success('Filters Applied!', {
            description: 'Dashboard data has been filtered.',
        });
        onClose();
    };
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50", onClick: onClose }), _jsx(motion.div, { initial: { opacity: 0, x: 300 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 300 }, transition: { type: 'spring', damping: 25 }, className: "fixed right-0 top-0 h-full w-[500px] bg-[#1a1a2e] border-l border-white/10 z-50 overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center", children: _jsx(FilterIcon, { className: "w-5 h-5 text-white" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl text-white", children: "Advanced Filters" }), _jsx("p", { className: "text-sm text-gray-400", children: "Refine your data view" })] })] }), _jsx("button", { onClick: onClose, className: "p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5 text-gray-400" }) })] }), presets.length > 0 && (_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-sm text-gray-400 mb-3", children: "Saved Presets" }), _jsx("div", { className: "space-y-2", children: presets.map(preset => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/30 transition-all", children: [_jsx("button", { onClick: () => loadPreset(preset), className: "flex-1 text-left text-sm text-white hover:text-purple-400 transition-colors", children: preset.name }), _jsx("button", { onClick: () => deletePreset(preset.id), className: "p-1.5 hover:bg-red-500/10 rounded-lg transition-colors", children: _jsx(Trash2, { className: "w-4 h-4 text-red-400" }) })] }, preset.id))) })] })), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm text-gray-400 mb-3", children: "Date Range" }), _jsx("div", { className: "grid grid-cols-2 gap-2 mb-3", children: dateRanges.map(range => (_jsx("button", { onClick: () => setFilters({ ...filters, dateRange: range.value }), className: `px-4 py-2.5 rounded-xl text-sm transition-all ${filters.dateRange === range.value
                                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                                : 'bg-white/5 text-gray-300 hover:bg-white/10'}`, children: range.label }, range.value))) }), filters.dateRange === 'custom' && (_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-500 mb-1", children: "Start Date" }), _jsx("input", { type: "date", value: filters.customStartDate, onChange: (e) => setFilters({ ...filters, customStartDate: e.target.value }), className: "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500/50" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-500 mb-1", children: "End Date" }), _jsx("input", { type: "date", value: filters.customEndDate, onChange: (e) => setFilters({ ...filters, customEndDate: e.target.value }), className: "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500/50" })] })] }))] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm text-gray-400 mb-3", children: "Amount Range (\u20B9)" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-500 mb-1", children: "Min Amount" }), _jsx("input", { type: "number", value: filters.minAmount, onChange: (e) => setFilters({ ...filters, minAmount: e.target.value }), placeholder: "1,000", className: "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-500 mb-1", children: "Max Amount" }), _jsx("input", { type: "number", value: filters.maxAmount, onChange: (e) => setFilters({ ...filters, maxAmount: e.target.value }), placeholder: "1,00,000", className: "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" })] })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm text-gray-400 mb-3", children: "Transaction Status" }), _jsx("div", { className: "flex flex-wrap gap-2", children: statusOptions.map(status => (_jsx("button", { onClick: () => toggleMultiSelect('status', status), className: `px-4 py-2 rounded-lg text-sm transition-all ${filters.status.includes(status)
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-white/5 text-gray-300 hover:bg-white/10'}`, children: status }, status))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm text-gray-400 mb-3", children: "Risk Level" }), _jsx("div", { className: "flex flex-wrap gap-2", children: riskOptions.map(risk => (_jsx("button", { onClick: () => toggleMultiSelect('riskLevel', risk), className: `px-4 py-2 rounded-lg text-sm transition-all ${filters.riskLevel.includes(risk)
                                                ? risk === 'high' ? 'bg-red-600 text-white'
                                                    : risk === 'medium' ? 'bg-yellow-600 text-white'
                                                        : 'bg-blue-600 text-white'
                                                : 'bg-white/5 text-gray-300 hover:bg-white/10'}`, children: risk }, risk))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm text-gray-400 mb-3", children: "Country" }), _jsx("div", { className: "flex flex-wrap gap-2", children: countryOptions.map(country => (_jsx("button", { onClick: () => toggleMultiSelect('country', country), className: `px-3 py-2 rounded-lg text-sm transition-all ${filters.country.includes(country)
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-white/5 text-gray-300 hover:bg-white/10'}`, children: country }, country))) })] }), _jsxs("div", { className: "sticky bottom-0 pt-4 pb-2 bg-[#1a1a2e] border-t border-white/10 space-y-3", children: [_jsxs("button", { onClick: savePreset, className: "w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all", children: [_jsx(Save, { className: "w-5 h-5" }), "Save as Preset"] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: resetFilters, className: "flex-1 px-4 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all", children: "Reset" }), _jsx("button", { onClick: applyFilters, className: "flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all", children: "Apply Filters" })] })] })] }) })] })) }));
}
