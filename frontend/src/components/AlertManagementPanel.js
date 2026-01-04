import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, MessageSquare, UserPlus, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
export function AlertManagementPanel({ isOpen, onClose, alert }) {
    const [status, setStatus] = useState(alert?.status || 'new');
    const [noteText, setNoteText] = useState('');
    const [notes, setNotes] = useState(alert?.notes || []);
    const [assignedTo, setAssignedTo] = useState(alert?.assignedTo || '');
    if (!alert)
        return null;
    const statusOptions = [
        { value: 'new', label: 'New', color: 'bg-blue-600' },
        { value: 'investigating', label: 'Investigating', color: 'bg-yellow-600' },
        { value: 'resolved', label: 'Resolved', color: 'bg-green-600' },
        { value: 'false-positive', label: 'False Positive', color: 'bg-gray-600' }
    ];
    const teamMembers = ['Admin', 'John Doe', 'Sarah Smith', 'Mike Wilson'];
    const addNote = () => {
        if (!noteText.trim()) {
            toast.error('Please enter a note');
            return;
        }
        const newNote = {
            id: Date.now().toString(),
            text: noteText,
            author: 'Admin',
            timestamp: new Date().toLocaleString()
        };
        setNotes([...notes, newNote]);
        setNoteText('');
        toast.success('Note Added!');
    };
    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        toast.success('Status Updated!', {
            description: `Alert marked as ${newStatus}`,
        });
    };
    const handleAssign = () => {
        if (!assignedTo) {
            toast.error('Please select a team member');
            return;
        }
        toast.success('Alert Assigned!', {
            description: `Assigned to ${assignedTo}`,
        });
    };
    const handleSave = () => {
        toast.success('Changes Saved!', {
            description: 'Alert has been updated successfully.',
        });
        onClose();
    };
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50", onClick: onClose }), _jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { type: 'spring', damping: 25 }, className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-h-[85vh] bg-[#1a1a2e] border border-white/10 rounded-2xl z-50 overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center ${alert.severity === 'high' ? 'bg-red-600' :
                                                    alert.severity === 'medium' ? 'bg-yellow-600' : 'bg-purple-600'}`, children: _jsx(AlertTriangle, { className: "w-5 h-5 text-white" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl text-white", children: "Alert Management" }), _jsxs("p", { className: "text-sm text-gray-400", children: ["#", alert.id, " \u2022 ", alert.type] })] })] }), _jsx("button", { onClick: onClose, className: "p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5 text-gray-400" }) })] }), _jsxs("div", { className: "mb-6 p-4 bg-white/5 border border-white/10 rounded-xl", children: [_jsx("h3", { className: "text-white mb-3", children: "Alert Details" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "User" }), _jsx("p", { className: "text-sm text-white", children: alert.user })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Amount" }), _jsx("p", { className: "text-sm text-white", children: alert.amount })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Location" }), _jsx("p", { className: "text-sm text-white", children: alert.location })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Time" }), _jsx("p", { className: "text-sm text-white", children: alert.time })] })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm text-gray-400 mb-3", children: "Alert Status" }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: statusOptions.map(option => (_jsxs("button", { onClick: () => handleStatusChange(option.value), className: `flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm transition-all ${status === option.value
                                                ? `${option.color} text-white shadow-lg`
                                                : 'bg-white/5 text-gray-300 hover:bg-white/10'}`, children: [status === option.value && _jsx(Check, { className: "w-4 h-4" }), option.label] }, option.value))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm text-gray-400 mb-3", children: "Assign to Team Member" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("select", { value: assignedTo, onChange: (e) => setAssignedTo(e.target.value), className: "flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50", children: [_jsx("option", { value: "", children: "Select team member" }), teamMembers.map(member => (_jsx("option", { value: member, children: member }, member)))] }), _jsxs("button", { onClick: handleAssign, className: "px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center gap-2", children: [_jsx(UserPlus, { className: "w-4 h-4" }), "Assign"] })] }), assignedTo && (_jsxs("p", { className: "text-xs text-gray-400 mt-2", children: ["Currently assigned to: ", _jsx("span", { className: "text-purple-400", children: assignedTo })] }))] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm text-gray-400 mb-3", children: "Notes & Investigation Log" }), notes.length > 0 && (_jsx("div", { className: "space-y-3 mb-4 max-h-48 overflow-y-auto", children: notes.map(note => (_jsxs("div", { className: "p-3 bg-white/5 border border-white/10 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-sm text-purple-400", children: note.author }), _jsxs("span", { className: "text-xs text-gray-500 flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3" }), note.timestamp] })] }), _jsx("p", { className: "text-sm text-gray-300", children: note.text })] }, note.id))) })), _jsxs("div", { className: "flex gap-2", children: [_jsx("textarea", { value: noteText, onChange: (e) => setNoteText(e.target.value), placeholder: "Add investigation notes...", rows: 3, className: "flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none" }), _jsxs("button", { onClick: addNote, className: "px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center gap-2", children: [_jsx(MessageSquare, { className: "w-4 h-4" }), "Add Note"] })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: onClose, className: "flex-1 px-4 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all", children: "Cancel" }), _jsx("button", { onClick: handleSave, className: "flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all", children: "Save Changes" })] })] }) })] })) }));
}
