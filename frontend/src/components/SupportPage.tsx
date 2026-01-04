import { motion } from "framer-motion";

import {
  Shield,
  ArrowLeft,
  MessageCircle,
  Mail,
  Phone,
  Book,
  HelpCircle,
  FileText,
  Video,
  Search,
  ChevronRight,
  Clock,
  Users,
  Zap
} from 'lucide-react';
import { useState } from 'react';

type NavigateTo = (page: 'landing' | 'login' | 'dashboard' | 'support') => void;

interface SupportPageProps {
  onNavigate: NavigateTo;
}

export function SupportPage({ onNavigate }: SupportPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      question: 'How does FraudX detect fraudulent transactions?',
      answer: 'FraudX uses advanced machine learning algorithms that analyze hundreds of data points in real-time, including transaction patterns, user behavior, device fingerprinting, and geographic anomalies to identify potential fraud with 99.8% accuracy.'
    },
    {
      question: 'What happens when fraud is detected?',
      answer: 'When our system detects suspicious activity, it immediately flags the transaction, sends real-time alerts to your team, and can automatically block the transaction based on your configured risk thresholds.'
    },
    {
      question: 'Can I customize fraud detection rules?',
      answer: 'Yes! FraudX allows you to create custom rules, set risk thresholds, whitelist trusted users, and configure automated responses based on your specific business needs.'
    },
    {
      question: 'How long does it take to integrate FraudX?',
      answer: 'Most businesses can integrate FraudX within 24-48 hours using our comprehensive API documentation and SDK libraries. Our technical support team is available to assist throughout the process.'
    },
    {
      question: 'What kind of support do you offer?',
      answer: 'We provide 24/7 support through multiple channels including live chat, email, and phone. Enterprise customers receive dedicated account managers and priority support.'
    },
    {
      question: 'Is my data secure with FraudX?',
      answer: 'Absolutely. We use bank-grade encryption (AES-256), comply with PCI DSS standards, and undergo regular security audits. Your data is stored in encrypted databases with multiple redundancy layers.'
    }
  ];

  const resources = [
    {
      icon: Book,
      title: 'Documentation',
      description: 'Comprehensive guides and API references',
      link: '#'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      link: '#'
    },
    {
      icon: FileText,
      title: 'Case Studies',
      description: 'Real-world success stories',
      link: '#'
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Connect with other users',
      link: '#'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    alert('Thank you for contacting us! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
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
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-16 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl text-white mb-4">How Can We Help You?</h1>
          <p className="text-xl text-gray-400 mb-8">Get the support you need, whenever you need it</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles, guides, FAQs..."
              className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
            />
          </div>
        </motion.div>
      </section>

      {/* Contact Methods */}
      <section className="relative z-10 px-8 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: MessageCircle,
              title: 'Live Chat',
              description: 'Chat with our support team',
              info: 'Average response: 2 min',
              color: 'from-purple-600 to-purple-500'
            },
            {
              icon: Mail,
              title: 'Email Support',
              description: 'support@fraudx.com',
              info: 'Response within 24 hours',
              color: 'from-blue-600 to-blue-500'
            },
            {
              icon: Phone,
              title: 'Phone Support',
              description: '+1 (888) 123-4567',
              info: '24/7 availability',
              color: 'from-green-600 to-green-500'
            }
          ].map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="p-8 bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-sm cursor-pointer group"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <method.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl text-white mb-2">{method.title}</h3>
              <p className="text-gray-400 mb-3">{method.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {method.info}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section className="relative z-10 px-8 py-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl text-white mb-4">Helpful Resources</h2>
          <p className="text-gray-400">Everything you need to get started and succeed</p>
        </motion.div>

        <div className="grid grid-cols-4 gap-6 mb-16">
          {resources.map((resource, index) => (
            <motion.a
              key={index}
              href={resource.link}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all group"
            >
              <resource.icon className="w-10 h-10 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white mb-2">{resource.title}</h3>
              <p className="text-sm text-gray-400">{resource.description}</p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 px-8 py-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400">Find answers to common questions</p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <motion.details
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-purple-400" />
                  <h3 className="text-white">{faq.question}</h3>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="mt-4 pl-8 text-gray-400 leading-relaxed">{faq.answer}</p>
            </motion.details>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative z-10 px-8 py-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto p-10 bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-sm"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl text-white mb-3">Still Need Help?</h2>
            <p className="text-gray-400">Send us a message and we'll get back to you within 24 hours</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="How can we help?"
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us more about your question or issue..."
                rows={6}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all flex items-center justify-center gap-2"
            >
              Send Message
              <Zap className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-12 border-t border-white/10 max-w-7xl mx-auto mt-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-purple-400" />
            <span className="text-gray-400">© 2024 FraudX. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={() => onNavigate('landing')} className="text-gray-400 hover:text-white transition-colors">
              Home
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">Privacy</button>
            <button className="text-gray-400 hover:text-white transition-colors">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
