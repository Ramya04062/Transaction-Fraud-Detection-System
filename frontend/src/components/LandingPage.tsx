import { motion } from 'framer-motion';
import { Shield, Zap, Lock, BarChart3, Bell, Brain, ChevronRight, Activity, TrendingDown, Users } from 'lucide-react';

type NavigateTo = (page: 'landing' | 'login' | 'dashboard' | 'support') => void;

interface LandingPageProps {
  onNavigate: NavigateTo;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms identify fraudulent patterns in real-time with 99.8% accuracy.'
    },
    {
      icon: Zap,
      title: 'Real-Time Monitoring',
      description: 'Instant alerts and continuous monitoring of all transactions across multiple channels.'
    },
    {
      icon: Lock,
      title: 'Bank-Grade Security',
      description: 'Enterprise-level encryption and security protocols to protect your sensitive data.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards with actionable insights and detailed fraud pattern analysis.'
    },
    {
      icon: Bell,
      title: 'Instant Alerts',
      description: 'Get notified immediately when suspicious activity is detected across your platform.'
    },
    {
      icon: Activity,
      title: 'Behavioral Analysis',
      description: 'Track user behavior patterns to identify anomalies and prevent fraud before it happens.'
    }
  ];

  const stats = [
    { value: '99.8%', label: 'Detection Accuracy' },
    { value: '<100ms', label: 'Response Time' },
    { value: '50M+', label: 'Transactions Analyzed' },
    { value: '$2.4B', label: 'Fraud Prevented' }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Shield className="w-8 h-8 text-purple-400" />
          <span className="text-2xl text-white tracking-tight">FraudX</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <button onClick={() => onNavigate('support')} className="text-gray-300 hover:text-white transition-colors">
            Support
          </button>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all"
          >
            Admin Login
          </button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-24 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Next-Gen Fraud Protection</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl text-white mb-6 tracking-tight"
          >
            Protect Your Business from{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Fraud in Real-Time
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-400 mb-12 leading-relaxed"
          >
            Advanced AI-powered fraud detection system that identifies suspicious activities
            instantly, protecting your revenue and building customer trust.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <button
              onClick={() => onNavigate('login')}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all flex items-center gap-2"
            >
              Get Started
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('support')}
              className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition-all"
            >
              Learn More
            </button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-4 gap-8 mt-24 max-w-5xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm"
            >
              <div className="text-3xl text-white mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-8 py-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl text-white mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-400">Everything you need to detect and prevent fraud</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="p-8 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm group cursor-pointer"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-8 py-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl text-white mb-4">How FraudX Works</h2>
          <p className="text-xl text-gray-400">Simple, fast, and effective fraud prevention</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-12">
          {[
            { icon: Users, title: 'Monitor Activity', desc: 'Track all user transactions and behavior patterns across your platform' },
            { icon: Brain, title: 'AI Analysis', desc: 'Advanced algorithms analyze patterns and detect anomalies in milliseconds' },
            { icon: TrendingDown, title: 'Block & Alert', desc: 'Automatically block suspicious activities and alert your team instantly' }
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <step.icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl text-purple-500/30 mb-4">0{index + 1}</div>
              <h3 className="text-2xl text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-8 py-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden p-16 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-3xl text-center"
        >
          <div className="relative z-10">
            <h2 className="text-4xl text-white mb-4">Ready to Protect Your Business?</h2>
            <p className="text-xl text-gray-300 mb-8">Join thousands of companies using FraudX to prevent fraud</p>
            <button
              onClick={() => onNavigate('login')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all inline-flex items-center gap-2"
            >
              Get Started Now
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <motion.div
            className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-12 border-t border-white/10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-purple-400" />
            <span className="text-gray-400">© 2025 FraudX. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={() => onNavigate('support')} className="text-gray-400 hover:text-white transition-colors">
              Support
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">Privacy</button>
            <button className="text-gray-400 hover:text-white transition-colors">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

