import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  LogOut,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Activity,
  Users,
  DollarSign,
  Search,
  Filter,
  Bell,
  Settings,
  BarChart3,
  MapPin,
  Clock,
  Download,
  FileText,
  Table
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from 'sonner';
import { AdvancedFilters } from './AdvancedFilters';
import { SettingsPanel } from './SettingsPanel';
import { AlertManagementPanel } from './AlertManagementPanel';
import { fetchStats, fetchTransactions, fetchAlerts, fetchTrends, type StatsResponse, type TransactionResponse, type AlertResponse, type TrendResponse } from '../api/adminApi';

type NavigateTo = (page: 'landing' | 'login' | 'dashboard' | 'support') => void;

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigate: NavigateTo;
}

interface FilterPreset {
  id: string;
  name: string;
  filters: FilterState;
}

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

export function AdminDashboard({ onLogout, onNavigate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'alerts'>('overview');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [alertNote, setAlertNote] = useState('');
  
  // Refs for smooth scrolling navigation
  const overviewRef = useRef<HTMLDivElement>(null);
  const transactionsRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);
  
  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'all',
    customStartDate: '',
    customEndDate: '',
    minAmount: '',
    maxAmount: '',
    status: [],
    riskLevel: [],
    country: []
  });
  
  const [filterPresets, setFilterPresets] = useState<FilterPreset[]>([
    { id: '1', name: 'High Risk Transactions', filters: { ...filters, riskLevel: ['high'], minAmount: '100000' } },
    { id: '2', name: 'Last 7 Days', filters: { ...filters, dateRange: '7days' } }
  ]);
  const [presetName, setPresetName] = useState('');
  
  // Settings states
  const [settings, setSettings] = useState({
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

  // Data states
  const [statsData, setStatsData] = useState<StatsResponse | null>(null);
  const [trendsData, setTrendsData] = useState<TrendResponse[]>([]);
  const [transactionsData, setTransactionsData] = useState<TransactionResponse[]>([]);
  const [alertsData, setAlertsData] = useState<AlertResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatTimeAgo = (dateString: string | null): string => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
  };

  // Fetch data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [stats, trends, transactions, alerts] = await Promise.all([
          fetchStats(),
          fetchTrends(),
          fetchTransactions(100),
          fetchAlerts(100)
        ]);
        
        setStatsData(stats);
        setTrendsData(trends);
        setTransactionsData(transactions);
        setAlertsData(alerts);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data', {
          description: 'Please check your connection and try again.',
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Transform stats data for display
  const stats = statsData ? [
    {
      label: 'Transactions Today',
      value: formatNumber(statsData.transactions_today),
      change: '+0%', // TODO: Calculate from historical data
      trending: 'up' as const,
      icon: Activity,
      color: 'from-purple-600 to-purple-500'
    },
    {
      label: 'Fraud Detected',
      value: formatNumber(statsData.fraud_detected),
      change: '+0%', // TODO: Calculate from historical data
      trending: 'down' as const,
      icon: AlertTriangle,
      color: 'from-red-600 to-red-500'
    },
    {
      label: 'Blocked Amount',
      value: formatCurrency(statsData.blocked_amount),
      change: '+0%', // TODO: Calculate from historical data
      trending: 'up' as const,
      icon: DollarSign,
      color: 'from-green-600 to-green-500'
    },
    {
      label: 'Active Users',
      value: formatNumber(statsData.active_users),
      change: '+0%', // TODO: Calculate from historical data
      trending: 'up' as const,
      icon: Users,
      color: 'from-blue-600 to-blue-500'
    }
  ] : [
    {
      label: 'Transactions Today',
      value: '0',
      change: '+0%',
      trending: 'up' as const,
      icon: Activity,
      color: 'from-purple-600 to-purple-500'
    },
    {
      label: 'Fraud Detected',
      value: '0',
      change: '+0%',
      trending: 'down' as const,
      icon: AlertTriangle,
      color: 'from-red-600 to-red-500'
    },
    {
      label: 'Blocked Amount',
      value: '₹0',
      change: '+0%',
      trending: 'up' as const,
      icon: DollarSign,
      color: 'from-green-600 to-green-500'
    },
    {
      label: 'Active Users',
      value: '0',
      change: '+0%',
      trending: 'up' as const,
      icon: Users,
      color: 'from-blue-600 to-blue-500'
    }
  ];

  // Transform trends data
  const fraudTrendData = trendsData.length > 0 ? trendsData.map(trend => ({
    month: trend.month,
    fraudulent: trend.fraudulent,
    legitimate: trend.legitimate,
    blocked: trend.blocked
  })) : [
    { month: 'Jan', fraudulent: 0, legitimate: 0, blocked: 0 },
    { month: 'Feb', fraudulent: 0, legitimate: 0, blocked: 0 },
    { month: 'Mar', fraudulent: 0, legitimate: 0, blocked: 0 },
    { month: 'Apr', fraudulent: 0, legitimate: 0, blocked: 0 },
    { month: 'May', fraudulent: 0, legitimate: 0, blocked: 0 },
    { month: 'Jun', fraudulent: 0, legitimate: 0, blocked: 0 }
  ];

  // Fraud type distribution (placeholder - can be enhanced with backend data)
  const fraudTypeData = [
    { name: 'UPI Fraud', value: 35, color: '#a855f7' },
    { name: 'Account Takeover', value: 28, color: '#3b82f6' },
    { name: 'Identity Theft', value: 22, color: '#ef4444' },
    { name: 'Payment Fraud', value: 15, color: '#f59e0b' }
  ];

  // Transform alerts data
  const recentAlerts: Alert[] = alertsData.slice(0, 5).map(alert => ({
    id: alert.id,
    type: alert.type,
    user: alert.user,
    amount: formatCurrency(alert.amount),
    location: alert.location,
    time: formatTimeAgo(alert.time),
    severity: alert.severity
  }));

  // Transform transactions data
  const recentTransactions = transactionsData.slice(0, 6).map(tx => ({
    id: tx.id,
    user: tx.user,
    amount: formatCurrency(tx.amount),
    status: tx.status,
    risk: tx.risk,
    time: formatTimeAgo(tx.time)
  }));

  // Top countries data (placeholder - can be enhanced with backend data)
  const topCountriesData = [
    { country: 'India', transactions: 12450, fraud: 45 },
    { country: 'United States', transactions: 8230, fraud: 32 },
    { country: 'United Kingdom', transactions: 5680, fraud: 18 },
    { country: 'United Arab Emirates', transactions: 4290, fraud: 15 },
    { country: 'Singapore', transactions: 3850, fraud: 12 }
  ];

  // Export functions
  const exportToCSV = () => {
    // Prepare CSV content
    let csvContent = "FraudX Dashboard Report\n\n";
    
    // Add stats
    csvContent += "Dashboard Statistics\n";
    csvContent += "Metric,Value,Change\n";
    stats.forEach(stat => {
      csvContent += `${stat.label},${stat.value},${stat.change}\n`;
    });
    
    csvContent += "\n\nRecent Transactions\n";
    csvContent += "Transaction ID,User,Amount,Status,Risk Level,Time\n";
    recentTransactions.forEach(txn => {
      csvContent += `${txn.id},${txn.user},${txn.amount},${txn.status},${txn.risk},${txn.time}\n`;
    });
    
    csvContent += "\n\nRecent Alerts\n";
    csvContent += "Alert Type,User,Amount,Location,Severity,Time\n";
    recentAlerts.forEach(alert => {
      csvContent += `${alert.type},${alert.user},${alert.amount},${alert.location},${alert.severity},${alert.time}\n`;
    });
    
    csvContent += "\n\nTop Countries by Transactions\n";
    csvContent += "Country,Transactions,Fraud Attempts,Fraud Rate\n";
    topCountriesData.forEach(country => {
      const fraudRate = ((country.fraud / country.transactions) * 100).toFixed(2);
      csvContent += `${country.country},${country.transactions},${country.fraud},${fraudRate}%\n`;
    });
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `FraudX_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
    
    // Show success toast
    toast.success('CSV Report Downloaded!', {
      description: 'Your report has been exported successfully.',
      duration: 3000,
    });
  };

  const exportToPDF = () => {
    // Create PDF content using HTML
    const printWindow = window.open('', '', 'height=800,width=800');
    if (!printWindow) return;
    
    printWindow.document.write('<html><head><title>FraudX Dashboard Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
      h1 { color: #8b5cf6; border-bottom: 3px solid #8b5cf6; padding-bottom: 10px; }
      h2 { color: #6366f1; margin-top: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
      .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
      .stat-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; background: #f9fafb; }
      .stat-value { font-size: 24px; font-weight: bold; color: #8b5cf6; }
      .stat-label { color: #6b7280; font-size: 14px; margin-top: 5px; }
      .stat-change { font-size: 12px; margin-top: 5px; }
      .change-positive { color: #10b981; }
      .change-negative { color: #ef4444; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      th { background: #8b5cf6; color: white; padding: 12px; text-align: left; font-weight: 600; }
      td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
      tr:nth-child(even) { background: #f9fafb; }
      .alert-high { color: #ef4444; font-weight: bold; }
      .alert-medium { color: #f59e0b; font-weight: bold; }
      .alert-low { color: #3b82f6; font-weight: bold; }
      .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
      @media print { body { padding: 20px; } }
    `);
    printWindow.document.write('</style></head><body>');
    
    // Header
    printWindow.document.write('<h1>🛡️ FraudX Dashboard Report</h1>');
    printWindow.document.write(`<p><strong>Generated on:</strong> ${new Date().toLocaleString('en-IN')}</p>`);
    
    // Stats
    printWindow.document.write('<h2>Dashboard Statistics</h2>');
    printWindow.document.write('<div class="stats-grid">');
    stats.forEach(stat => {
      const changeClass = stat.trending === 'up' ? 'change-positive' : 'change-negative';
      printWindow.document.write(`
        <div class="stat-card">
          <div class="stat-value">${stat.value}</div>
          <div class="stat-label">${stat.label}</div>
          <div class="stat-change ${changeClass}">${stat.change}</div>
        </div>
      `);
    });
    printWindow.document.write('</div>');
    
    // Recent Transactions
    printWindow.document.write('<h2>Recent Transactions</h2>');
    printWindow.document.write('<table>');
    printWindow.document.write('<tr><th>Transaction ID</th><th>User</th><th>Amount</th><th>Status</th><th>Risk Level</th><th>Time</th></tr>');
    recentTransactions.forEach(txn => {
      printWindow.document.write(`
        <tr>
          <td>${txn.id}</td>
          <td>${txn.user}</td>
          <td>${txn.amount}</td>
          <td>${txn.status}</td>
          <td>${txn.risk}</td>
          <td>${txn.time}</td>
        </tr>
      `);
    });
    printWindow.document.write('</table>');
    
    // Recent Alerts
    printWindow.document.write('<h2>Recent Fraud Alerts</h2>');
    printWindow.document.write('<table>');
    printWindow.document.write('<tr><th>Alert Type</th><th>User</th><th>Amount</th><th>Location</th><th>Severity</th><th>Time</th></tr>');
    recentAlerts.forEach(alert => {
      const severityClass = `alert-${alert.severity}`;
      printWindow.document.write(`
        <tr>
          <td>${alert.type}</td>
          <td>${alert.user}</td>
          <td>${alert.amount}</td>
          <td>${alert.location}</td>
          <td class="${severityClass}">${alert.severity.toUpperCase()}</td>
          <td>${alert.time}</td>
        </tr>
      `);
    });
    printWindow.document.write('</table>');
    
    // Top Countries
    printWindow.document.write('<h2>Geographic Distribution</h2>');
    printWindow.document.write('<table>');
    printWindow.document.write('<tr><th>Country</th><th>Transactions</th><th>Fraud Attempts</th><th>Fraud Rate</th></tr>');
    topCountriesData.forEach(country => {
      const fraudRate = ((country.fraud / country.transactions) * 100).toFixed(2);
      printWindow.document.write(`
        <tr>
          <td>${country.country}</td>
          <td>${country.transactions.toLocaleString()}</td>
          <td>${country.fraud}</td>
          <td>${fraudRate}%</td>
        </tr>
      `);
    });
    printWindow.document.write('</table>');
    
    // Footer
    printWindow.document.write('<div class="footer">');
    printWindow.document.write('<p>© 2024 FraudX. All rights reserved. | Confidential Report</p>');
    printWindow.document.write('</div>');
    
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    
    // Trigger print dialog
    setTimeout(() => {
      printWindow.print();
    }, 250);
    
    setShowExportMenu(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <motion.div
          className="absolute top-0 -right-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 -left-48 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/3 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -70, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-6 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              <span className="text-2xl text-white tracking-tight">FraudX</span>
            </div>
            <nav className="flex items-center gap-6">
              <button
                onClick={() => {
                  setActiveTab('overview');
                  overviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`text-sm transition-colors ${
                  activeTab === 'overview' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => {
                  setActiveTab('transactions');
                  transactionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`text-sm transition-colors ${
                  activeTab === 'transactions' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => {
                  setActiveTab('alerts');
                  alertsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`text-sm transition-colors ${
                  activeTab === 'alerts' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Alerts
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all"
              >
                <Download className="w-5 h-5" />
                Export Report
              </button>
              
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-[#1a1a2e] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
                >
                  <button
                    onClick={exportToPDF}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                  >
                    <FileText className="w-5 h-5 text-purple-400" />
                    <div className="text-left">
                      <div className="text-sm">Export as PDF</div>
                      <div className="text-xs text-gray-500">Print-ready format</div>
                    </div>
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-all border-t border-white/5"
                  >
                    <Table className="w-5 h-5 text-blue-400" />
                    <div className="text-left">
                      <div className="text-sm">Export as CSV</div>
                      <div className="text-xs text-gray-500">Spreadsheet format</div>
                    </div>
                  </button>
                </motion.div>
              )}
            </div>
            <button className="relative p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Advanced Filters Panel */}
      <AdvancedFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        presets={filterPresets}
        setPresets={setFilterPresets}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        setSettings={setSettings}
      />

      {/* Alert Management Panel */}
      <AlertManagementPanel
        isOpen={selectedAlert !== null}
        onClose={() => setSelectedAlert(null)}
        alert={selectedAlert}
      />

      {/* Main Content */}
      <main className="relative z-10 px-8 py-8 max-w-[1600px] mx-auto">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-400">Loading dashboard data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <motion.div
          ref={overviewRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-gradient-to-br from-purple-950/40 via-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl backdrop-blur-sm hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trending === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.trending === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Fraud Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-2 p-6 bg-gradient-to-br from-purple-950/30 via-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl backdrop-blur-sm hover:border-purple-400/30 transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl text-white mb-1">Fraud Detection Trends</h3>
                <p className="text-sm text-purple-300/60">Last 6 months overview</p>
              </div>
              <button className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={fraudTrendData}>
                <defs>
                  <linearGradient id="fraudGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="fraudulent" stroke="#ef4444" fill="url(#fraudGradient)" name="Fraudulent" />
                <Area type="monotone" dataKey="blocked" stroke="#a855f7" fill="url(#blockedGradient)" name="Amount Blocked (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Fraud Type Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm"
          >
            <h3 className="text-xl text-white mb-6">Fraud Types</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={fraudTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {fraudTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {fraudTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-400">{item.name}</span>
                  </div>
                  <span className="text-sm text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Alerts */}
          <motion.div
            ref={alertsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-2 p-6 bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-white">Recent Alerts</h3>
              <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">View All</button>
            </div>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  whileHover={{ x: 4 }}
                  className="p-4 bg-gradient-to-r from-purple-500/5 to-white/5 border border-purple-500/10 rounded-xl hover:border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.severity === 'high' ? 'bg-red-500 shadow-lg shadow-red-500/50' :
                        alert.severity === 'medium' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 'bg-purple-500 shadow-lg shadow-purple-500/50'
                      }`}></div>
                      <div>
                        <h4 className="text-white mb-1">{alert.type}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {alert.user}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5" />
                            {alert.amount}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {alert.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Geographic Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm"
          >
            <h3 className="text-xl text-white mb-6">Top Countries</h3>
            <div className="space-y-4">
              {topCountriesData.map((country, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">{country.country}</span>
                    <span className="text-sm text-gray-400">{country.transactions.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(country.transactions / 12450) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-red-400">{country.fraud} fraud attempts</span>
                    <span className="text-xs text-gray-500">
                      {((country.fraud / country.transactions) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          ref={transactionsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-6 bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl text-white">Recent Transactions</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <button 
                onClick={() => setShowFilters(true)}
                className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Filter className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm text-gray-400">Transaction ID</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400">User</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400">Amount</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400">Risk Level</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <motion.tr
                    key={transaction.id}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                    className="border-b border-white/5"
                  >
                    <td className="py-4 px-4 text-sm text-gray-300">{transaction.id}</td>
                    <td className="py-4 px-4 text-sm text-gray-300">{transaction.user}</td>
                    <td className="py-4 px-4 text-sm text-white">{transaction.amount}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                        transaction.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                        transaction.status === 'blocked' ? 'bg-red-500/10 text-red-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {transaction.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                        {transaction.status === 'blocked' && <AlertTriangle className="w-3 h-3" />}
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                        transaction.risk === 'low' ? 'bg-blue-500/10 text-blue-400' :
                        transaction.risk === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {transaction.risk}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {transaction.time}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}