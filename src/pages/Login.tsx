import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, EyeOff, Github, Facebook } from 'lucide-react';
import Background from '../components/Background';
import { useAuth, UserRole } from '../context/AuthContext';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
        navigate('/tickets');
    } else {
        alert('Invalid email or password');
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    let email = '';
    let password = '';
    
    switch (role) {
        case 'Admin':
            email = 'admin@system.com';
            password = 'admin123';
            break;
        case 'ORG Admin':
            email = 'orgadmin@globaltech.com';
            password = 'orgadmin123';
            break;
        case 'Member':
            email = 'member@globaltech.com';
            password = 'member123';
            break;
    }
    
    const success = login(email, password);
    if (success) {
        navigate('/tickets');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans text-white">
      <Background />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-white/50 rounded flex items-center justify-center text-xl font-light">
              A
            </div>
            <span className="text-2xl font-light tracking-wide text-white/80">Automat Care </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          {/* Form */}
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-medium mb-8">Login</h1>
            
            <form onSubmit={handleLogin} className="space-y-5">
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
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/90">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all pr-12"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-start">
                <Link to="/forgot-password" className="text-sm text-white/80 hover:text-white transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#0A2540] hover:bg-[#113255] text-white rounded-lg font-medium transition-colors shadow-lg"
              >
                Sign in
              </button>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <span className="relative px-4 bg-transparent text-sm text-white/80">
                  or continue with
                </span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <button className="flex items-center justify-center py-2.5 bg-white hover:bg-gray-50 rounded-lg transition-colors shadow-sm">
                  {/* Google Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </button>
                <button className="flex items-center justify-center py-2.5 bg-white hover:bg-gray-50 rounded-lg transition-colors shadow-sm text-gray-900">
                  <Github className="w-5 h-5" />
                </button>
                <button className="flex items-center justify-center py-2.5 bg-white hover:bg-gray-50 rounded-lg transition-colors shadow-sm text-[#1877F2]">
                  <Facebook className="w-5 h-5" fill="currentColor" stroke="none" />
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-white/80">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-white hover:underline font-medium">
                Register for free
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
