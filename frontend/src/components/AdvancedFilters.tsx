import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Save, Trash2, Filter as FilterIcon } from 'lucide-react';
import { toast } from 'sonner';

interface FilterState {
  dateRange: string;
  customStartDate: string;
  customEndDate: string;
  minAmount: string;
  maxAmount: string;
  status: string[];
  riskLevel: string[];
  country: string[];
}

interface FilterPreset {
  id: string;
  name: string;
  filters: FilterState;
}

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  presets: FilterPreset[];
  setPresets: (presets: FilterPreset[]) => void;
}

export function AdvancedFilters({ isOpen, onClose, filters, setFilters, presets, setPresets }: AdvancedFiltersProps) {
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

  const toggleMultiSelect = (key: keyof FilterState, value: string) => {
    const currentValues = filters[key] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setFilters({ ...filters, [key]: newValues });
  };

  const savePreset = () => {
    const name = prompt('Enter preset name:');
    if (!name) return;

    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name,
      filters: { ...filters }
    };

    setPresets([...presets, newPreset]);
    toast.success('Filter Preset Saved!', {
      description: `"${name}" has been saved successfully.`,
    });
  };

  const loadPreset = (preset: FilterPreset) => {
    setFilters(preset.filters);
    toast.success('Preset Loaded!', {
      description: `"${preset.name}" filters have been applied.`,
    });
  };

  const deletePreset = (id: string) => {
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
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-[500px] bg-[#1a1a2e] border-l border-white/10 z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <FilterIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl text-white">Advanced Filters</h2>
                    <p className="text-sm text-gray-400">Refine your data view</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Saved Presets */}
              {presets.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm text-gray-400 mb-3">Saved Presets</h3>
                  <div className="space-y-2">
                    {presets.map(preset => (
                      <div
                        key={preset.id}
                        className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/30 transition-all"
                      >
                        <button
                          onClick={() => loadPreset(preset)}
                          className="flex-1 text-left text-sm text-white hover:text-purple-400 transition-colors"
                        >
                          {preset.name}
                        </button>
                        <button
                          onClick={() => deletePreset(preset.id)}
                          className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Range */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-3">Date Range</label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {dateRanges.map(range => (
                    <button
                      key={range.value}
                      onClick={() => setFilters({ ...filters, dateRange: range.value })}
                      className={`px-4 py-2.5 rounded-xl text-sm transition-all ${
                        filters.dateRange === range.value
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>

                {filters.dateRange === 'custom' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={filters.customStartDate}
                        onChange={(e) => setFilters({ ...filters, customStartDate: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Date</label>
                      <input
                        type="date"
                        value={filters.customEndDate}
                        onChange={(e) => setFilters({ ...filters, customEndDate: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Amount Range */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-3">Amount Range (₹)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Min Amount</label>
                    <input
                      type="number"
                      value={filters.minAmount}
                      onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                      placeholder="1,000"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max Amount</label>
                    <input
                      type="number"
                      value={filters.maxAmount}
                      onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                      placeholder="1,00,000"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-3">Transaction Status</label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <button
                      key={status}
                      onClick={() => toggleMultiSelect('status', status)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        filters.status.includes(status)
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Risk Level Filter */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-3">Risk Level</label>
                <div className="flex flex-wrap gap-2">
                  {riskOptions.map(risk => (
                    <button
                      key={risk}
                      onClick={() => toggleMultiSelect('riskLevel', risk)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        filters.riskLevel.includes(risk)
                          ? risk === 'high' ? 'bg-red-600 text-white'
                            : risk === 'medium' ? 'bg-yellow-600 text-white'
                            : 'bg-blue-600 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Country Filter */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-3">Country</label>
                <div className="flex flex-wrap gap-2">
                  {countryOptions.map(country => (
                    <button
                      key={country}
                      onClick={() => toggleMultiSelect('country', country)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        filters.country.includes(country)
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 pt-4 pb-2 bg-[#1a1a2e] border-t border-white/10 space-y-3">
                <button
                  onClick={savePreset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all"
                >
                  <Save className="w-5 h-5" />
                  Save as Preset
                </button>
                
                <div className="flex gap-3">
                  <button
                    onClick={resetFilters}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all"
                  >
                    Reset
                  </button>
                  <button
                    onClick={applyFilters}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}