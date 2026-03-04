import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import Background from '../components/Background';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans text-white">
      <Background />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 relative z-10"
      >
        <Link to="/" className="inline-flex items-center text-sm text-white/80 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to login
        </Link>

        <h1 className="text-3xl font-medium mb-2">Reset Password</h1>
        <p className="text-white/70 mb-8 text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/90">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@gmail.com"
                className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 mt-2 bg-[#0A2540] hover:bg-[#113255] text-white rounded-lg font-medium transition-colors shadow-lg"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center"
          >
            <p className="text-green-100">
              Check your email! We've sent a password reset link to <strong>{email}</strong>.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
