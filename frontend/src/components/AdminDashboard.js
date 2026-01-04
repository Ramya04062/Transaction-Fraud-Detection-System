import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, LogOut, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Activity, Users, DollarSign, Search, Filter, Bell, Settings, BarChart3, MapPin, Clock, Download, FileText, Table } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from 'sonner';
import { AdvancedFilters } from './AdvancedFilters';
import { SettingsPanel } from './SettingsPanel';
import { AlertManagementPanel } from './AlertManagementPanel';
import {
  fetchStats,
  fetchTransactions,
  fetchAlerts,
  fetchTrends
} from '../api/adminApi';


export function AdminDashboard({ onLogout, onNavigate }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [alertNote, setAlertNote] = useState('');
    // Filter states
    const [filters, setFilters] = useState({
        dateRange: 'all',
        customStartDate: '',
        customEndDate: '',
        minAmount: '',
        maxAmount: '',
        status: [],
        riskLevel: [],
        country: []
    });
    const [filterPresets, setFilterPresets] = useState([
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

    const overviewRef = useRef(null);
    const transactionsRef = useRef(null);
    const alertsRef = useRef(null);

    // Data states
    const [statsData, setStatsData] = useState(null);
    const [trendsData, setTrendsData] = useState([]);
    const [transactionsData, setTransactionsData] = useState([]);
    const [alertsData, setAlertsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper functions
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-IN').format(num);
    };

    const formatTimeAgo = (dateString) => {
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
            change: '+0%',
            trending: 'up',
            icon: Activity,
            color: 'from-purple-600 to-purple-500'
        },
        {
            label: 'Fraud Detected',
            value: formatNumber(statsData.fraud_detected),
            change: '+0%',
            trending: 'down',
            icon: AlertTriangle,
            color: 'from-red-600 to-red-500'
        },
        {
            label: 'Blocked Amount',
            value: formatCurrency(statsData.blocked_amount),
            change: '+0%',
            trending: 'up',
            icon: DollarSign,
            color: 'from-green-600 to-green-500'
        },
        {
            label: 'Active Users',
            value: formatNumber(statsData.active_users),
            change: '+0%',
            trending: 'up',
            icon: Users,
            color: 'from-blue-600 to-blue-500'
        }
    ] : [
        {
            label: 'Transactions Today',
            value: '0',
            change: '+0%',
            trending: 'up',
            icon: Activity,
            color: 'from-purple-600 to-purple-500'
        },
        {
            label: 'Fraud Detected',
            value: '0',
            change: '+0%',
            trending: 'down',
            icon: AlertTriangle,
            color: 'from-red-600 to-red-500'
        },
        {
            label: 'Blocked Amount',
            value: '₹0',
            change: '+0%',
            trending: 'up',
            icon: DollarSign,
            color: 'from-green-600 to-green-500'
        },
        {
            label: 'Active Users',
            value: '0',
            change: '+0%',
            trending: 'up',
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
    const recentAlerts = alertsData.slice(0, 5).map(alert => ({
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
        if (!printWindow)
            return;
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
    return (_jsxs("div", { className: "min-h-screen relative overflow-hidden", children: [_jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none opacity-40", children: [_jsx(motion.div, { className: "absolute top-0 -right-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl", animate: {
                            x: [0, -50, 0],
                            y: [0, 50, 0],
                        }, transition: {
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut"
                        } }), _jsx(motion.div, { className: "absolute top-1/3 -left-48 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl", animate: {
                            x: [0, 80, 0],
                            y: [0, -60, 0],
                        }, transition: {
                            duration: 25,
                            repeat: Infinity,
                            ease: "easeInOut"
                        } }), _jsx(motion.div, { className: "absolute bottom-0 right-1/3 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl", animate: {
                            x: [0, -70, 0],
                            y: [0, 40, 0],
                        }, transition: {
                            duration: 30,
                            repeat: Infinity,
                            ease: "easeInOut"
                        } })] }), _jsx("header", { className: "relative z-10 px-8 py-6 border-b border-white/10 bg-black/20 backdrop-blur-xl", children: _jsxs("div", { className: "max-w-[1600px] mx-auto flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-8", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Shield, { className: "w-8 h-8 text-purple-400" }), _jsx("span", { className: "text-2xl text-white tracking-tight", children: "FraudX" })] }), _jsxs("nav", { className: "flex items-center gap-6", children: [_jsx("button", { onClick: () => { setActiveTab('overview'); overviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, className: `text-sm transition-colors ${activeTab === 'overview' ? 'text-white' : 'text-gray-400 hover:text-white'}`, children: "Overview" }), _jsx("button", { onClick: () => { setActiveTab('transactions'); transactionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, className: `text-sm transition-colors ${activeTab === 'transactions' ? 'text-white' : 'text-gray-400 hover:text-white'}`, children: "Transactions" }), _jsx("button", { onClick: () => { setActiveTab('alerts'); alertsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, className: `text-sm transition-colors ${activeTab === 'alerts' ? 'text-white' : 'text-gray-400 hover:text-white'}`, children: "Alerts" })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setShowExportMenu(!showExportMenu), className: "flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all", children: [_jsx(Download, { className: "w-5 h-5" }), "Export Report"] }), showExportMenu && (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "absolute right-0 mt-2 w-48 bg-[#1a1a2e] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50", children: [_jsxs("button", { onClick: exportToPDF, className: "w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-all", children: [_jsx(FileText, { className: "w-5 h-5 text-purple-400" }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "text-sm", children: "Export as PDF" }), _jsx("div", { className: "text-xs text-gray-500", children: "Print-ready format" })] })] }), _jsxs("button", { onClick: exportToCSV, className: "w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-all border-t border-white/5", children: [_jsx(Table, { className: "w-5 h-5 text-blue-400" }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "text-sm", children: "Export as CSV" }), _jsx("div", { className: "text-xs text-gray-500", children: "Spreadsheet format" })] })] })] }))] }), _jsxs("button", { className: "relative p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors", children: [_jsx(Bell, { className: "w-5 h-5 text-gray-400" }), _jsx("span", { className: "absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" })] }), _jsx("button", { onClick: () => setShowSettings(true), className: "p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors", children: _jsx(Settings, { className: "w-5 h-5 text-gray-400" }) }), _jsxs("button", { onClick: onLogout, className: "flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-gray-300 hover:text-white", children: [_jsx(LogOut, { className: "w-5 h-5" }), "Logout"] })] })] }) }), _jsx(AdvancedFilters, { isOpen: showFilters, onClose: () => setShowFilters(false), filters: filters, setFilters: setFilters, presets: filterPresets, setPresets: setFilterPresets }), _jsx(SettingsPanel, { isOpen: showSettings, onClose: () => setShowSettings(false), settings: settings, setSettings: setSettings }), _jsx(AlertManagementPanel, { isOpen: selectedAlert !== null, onClose: () => setSelectedAlert(null), alert: selectedAlert }), _jsxs("main", { className: "relative z-10 px-8 py-8 max-w-[1600px] mx-auto", children: [_jsx(motion.div, { ref: overviewRef, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "grid grid-cols-4 gap-6 mb-8", children: stats.map((stat, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 }, className: "p-6 bg-gradient-to-br from-purple-950/40 via-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl backdrop-blur-sm hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: `w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`, children: _jsx(stat.icon, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { className: `flex items-center gap-1 text-sm ${stat.trending === 'up' ? 'text-green-400' : 'text-red-400'}`, children: [stat.trending === 'up' ? _jsx(TrendingUp, { className: "w-4 h-4" }) : _jsx(TrendingDown, { className: "w-4 h-4" }), stat.change] })] }), _jsx("div", { className: "text-3xl text-white mb-1", children: stat.value }), _jsx("div", { className: "text-sm text-gray-400", children: stat.label })] }, index))) }), _jsxs("div", { className: "grid grid-cols-3 gap-6 mb-8", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "col-span-2 p-6 bg-gradient-to-br from-purple-950/30 via-white/5 to-white/[0.02] border border-purple-500/20 rounded-2xl backdrop-blur-sm hover:border-purple-400/30 transition-all", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl text-white mb-1", children: "Fraud Detection Trends" }), _jsx("p", { className: "text-sm text-purple-300/60", children: "Last 6 months overview" })] }), _jsx("button", { className: "p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors", children: _jsx(BarChart3, { className: "w-5 h-5 text-purple-400" }) })] }), _jsx(ResponsiveContainer, { width: "100%", height: 280, children: _jsxs(AreaChart, { data: fraudTrendData, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "fraudGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: "#ef4444", stopOpacity: 0.3 }), _jsx("stop", { offset: "100%", stopColor: "#ef4444", stopOpacity: 0 })] }), _jsxs("linearGradient", { id: "blockedGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: "#a855f7", stopOpacity: 0.3 }), _jsx("stop", { offset: "100%", stopColor: "#a855f7", stopOpacity: 0 })] })] }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#ffffff10" }), _jsx(XAxis, { dataKey: "month", stroke: "#6b7280" }), _jsx(YAxis, { stroke: "#6b7280" }), _jsx(Tooltip, { contentStyle: {
                                                        backgroundColor: '#1a1a2e',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: '12px',
                                                        color: '#fff'
                                                    } }), _jsx(Legend, {}), _jsx(Area, { type: "monotone", dataKey: "fraudulent", stroke: "#ef4444", fill: "url(#fraudGradient)", name: "Fraudulent" }), _jsx(Area, { type: "monotone", dataKey: "blocked", stroke: "#a855f7", fill: "url(#blockedGradient)", name: "Amount Blocked (\u20B9)" })] }) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "p-6 bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm", children: [_jsx("h3", { className: "text-xl text-white mb-6", children: "Fraud Types" }), _jsx(ResponsiveContainer, { width: "100%", height: 280, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: fraudTypeData, cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 90, paddingAngle: 5, dataKey: "value", children: fraudTypeData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, { contentStyle: {
                                                        backgroundColor: '#1a1a2e',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: '12px',
                                                        color: '#fff'
                                                    } })] }) }), _jsx("div", { className: "space-y-2 mt-4", children: fraudTypeData.map((item, index) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: item.color } }), _jsx("span", { className: "text-sm text-gray-400", children: item.name })] }), _jsxs("span", { className: "text-sm text-white", children: [item.value, "%"] })] }, index))) })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-6", children: [_jsxs(motion.div, { ref: alertsRef, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, className: "col-span-2 p-6 bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h3", { className: "text-xl text-white", children: "Recent Alerts" }), _jsx("button", { className: "text-sm text-purple-400 hover:text-purple-300 transition-colors", children: "View All" })] }), _jsx("div", { className: "space-y-3", children: recentAlerts.map((alert) => (_jsx(motion.div, { onClick: () => setSelectedAlert(alert), whileHover: { x: 4 }, className: "p-4 bg-gradient-to-r from-purple-500/5 to-white/5 border border-purple-500/10 rounded-xl hover:border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all cursor-pointer", children: _jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: `w-2 h-2 rounded-full mt-2 ${alert.severity === 'high' ? 'bg-red-500 shadow-lg shadow-red-500/50' :
                                                                    alert.severity === 'medium' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 'bg-purple-500 shadow-lg shadow-purple-500/50'}` }), _jsxs("div", { children: [_jsx("h4", { className: "text-white mb-1", children: alert.type }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-400", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Users, { className: "w-3.5 h-3.5" }), alert.user] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(DollarSign, { className: "w-3.5 h-3.5" }), alert.amount] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "w-3.5 h-3.5" }), alert.location] })] })] })] }), _jsx("span", { className: "text-xs text-gray-500", children: alert.time })] }) }, alert.id))) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, className: "p-6 bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm", children: [_jsx("h3", { className: "text-xl text-white mb-6", children: "Top Countries" }), _jsx("div", { className: "space-y-4", children: topCountriesData.map((country, index) => (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm text-gray-300", children: country.country }), _jsx("span", { className: "text-sm text-gray-400", children: country.transactions.toLocaleString() })] }), _jsx("div", { className: "h-2 bg-white/5 rounded-full overflow-hidden", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: `${(country.transactions / 12450) * 100}%` }, transition: { duration: 1, delay: 0.5 + index * 0.1 }, className: "h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full" }) }), _jsxs("div", { className: "flex items-center justify-between mt-1", children: [_jsxs("span", { className: "text-xs text-red-400", children: [country.fraud, " fraud attempts"] }), _jsxs("span", { className: "text-xs text-gray-500", children: [((country.fraud / country.transactions) * 100).toFixed(2), "%"] })] })] }, index))) })] })] }), _jsxs(motion.div, { ref: transactionsRef, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.6 }, className: "mt-6 p-6 bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h3", { className: "text-xl text-white", children: "Recent Transactions" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" }), _jsx("input", { type: "text", placeholder: "Search transactions...", className: "pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50" })] }), _jsx("button", { onClick: () => setShowFilters(true), className: "p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors", children: _jsx(Filter, { className: "w-4 h-4 text-gray-400" }) })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-white/10", children: [_jsx("th", { className: "text-left py-3 px-4 text-sm text-gray-400", children: "Transaction ID" }), _jsx("th", { className: "text-left py-3 px-4 text-sm text-gray-400", children: "User" }), _jsx("th", { className: "text-left py-3 px-4 text-sm text-gray-400", children: "Amount" }), _jsx("th", { className: "text-left py-3 px-4 text-sm text-gray-400", children: "Status" }), _jsx("th", { className: "text-left py-3 px-4 text-sm text-gray-400", children: "Risk Level" }), _jsx("th", { className: "text-left py-3 px-4 text-sm text-gray-400", children: "Time" })] }) }), _jsx("tbody", { children: recentTransactions.map((transaction) => (_jsxs(motion.tr, { whileHover: { backgroundColor: 'rgba(255,255,255,0.02)' }, className: "border-b border-white/5", children: [_jsx("td", { className: "py-4 px-4 text-sm text-gray-300", children: transaction.id }), _jsx("td", { className: "py-4 px-4 text-sm text-gray-300", children: transaction.user }), _jsx("td", { className: "py-4 px-4 text-sm text-white", children: transaction.amount }), _jsx("td", { className: "py-4 px-4", children: _jsxs("span", { className: `inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${transaction.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                                                                transaction.status === 'blocked' ? 'bg-red-500/10 text-red-400' :
                                                                    'bg-yellow-500/10 text-yellow-400'}`, children: [transaction.status === 'approved' && _jsx(CheckCircle, { className: "w-3 h-3" }), transaction.status === 'blocked' && _jsx(AlertTriangle, { className: "w-3 h-3" }), transaction.status] }) }), _jsx("td", { className: "py-4 px-4", children: _jsx("span", { className: `inline-block px-3 py-1 rounded-full text-xs ${transaction.risk === 'low' ? 'bg-blue-500/10 text-blue-400' :
                                                                transaction.risk === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                                                    'bg-red-500/10 text-red-400'}`, children: transaction.risk }) }), _jsxs("td", { className: "py-4 px-4 text-sm text-gray-400 flex items-center gap-1", children: [_jsx(Clock, { className: "w-3.5 h-3.5" }), transaction.time] })] }, transaction.id))) })] }) })] })] })] }));
}