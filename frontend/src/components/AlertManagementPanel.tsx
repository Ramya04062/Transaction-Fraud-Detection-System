import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, MessageSquare, UserPlus, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface AlertNote {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

interface Alert {
  id: number;
  type: string;
  user: string;
  amount: string;
  location: string;
  time: string;
  severity: string;
  status?: 'new' | 'investigating' | 'resolved' | 'false-positive';
  notes?: AlertNote[];
  assignedTo?: string;
}

interface AlertManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
  alert: Alert | null;
}

export function AlertManagementPanel({ isOpen, onClose, alert }: AlertManagementPanelProps) {
  const [status, setStatus] = useState<Alert['status']>(alert?.status || 'new');
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<AlertNote[]>(alert?.notes || []);
  const [assignedTo, setAssignedTo] = useState(alert?.assignedTo || '');

  if (!alert) return null;

  const statusOptions: { value: Alert['status']; label: string; color: string }[] = [
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

    const newNote: AlertNote = {
      id: Date.now().toString(),
      text: noteText,
      author: 'Admin',
      timestamp: new Date().toLocaleString()
    };

    setNotes([...notes, newNote]);
    setNoteText('');
    toast.success('Note Added!');
  };

  const handleStatusChange = (newStatus: Alert['status']) => {
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-h-[85vh] bg-[#1a1a2e] border border-white/10 rounded-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    alert.severity === 'high' ? 'bg-red-600' :
                    alert.severity === 'medium' ? 'bg-yellow-600' : 'bg-purple-600'
                  }`}>
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl text-white">Alert Management</h2>
                    <p className="text-sm text-gray-400">#{alert.id} • {alert.type}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Alert Details */}
              <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="text-white mb-3">Alert Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">User</p>
                    <p className="text-sm text-white">{alert.user}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                    <p className="text-sm text-white">{alert.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-sm text-white">{alert.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Time</p>
                    <p className="text-sm text-white">{alert.time}</p>
                  </div>
                </div>
              </div>

              {/* Status Selection */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-3">Alert Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {statusOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusChange(option.value)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm transition-all ${
                        status === option.value
                          ? `${option.color} text-white shadow-lg`
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {status === option.value && <Check className="w-4 h-4" />}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assign to Team Member */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-3">Assign to Team Member</label>
                <div className="flex gap-2">
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="">Select team member</option>
                    {teamMembers.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssign}
                    className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Assign
                  </button>
                </div>
                {assignedTo && (
                  <p className="text-xs text-gray-400 mt-2">Currently assigned to: <span className="text-purple-400">{assignedTo}</span></p>
                )}
              </div>

              {/* Notes Section */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-3">Notes & Investigation Log</label>
                
                {/* Existing Notes */}
                {notes.length > 0 && (
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {notes.map(note => (
                      <div key={note.id} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-purple-400">{note.author}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {note.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{note.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Note */}
                <div className="flex gap-2">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add investigation notes..."
                    rows={3}
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                  />
                  <button
                    onClick={addNote}
                    className="px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Add Note
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
