import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, Ticket, User, LogOut as LogOutIcon, LogOut, Menu, X, ShieldAlert, Settings, Home as HomeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useIssues } from '../context/IssueContext';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userProfile } = useIssues();
  const { user } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userProfilePic');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
      
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col hidden md:flex z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div>
              <motion.h1 
                whileHover={{ scale: 1.05, originX: 0 }}
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700"
              >
                Automat Care
              </motion.h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide">Event Management System</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/home">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 ${isActive('/home') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-blue-50/80 hover:text-blue-700'}`}
            >
              <HomeIcon size={20} className={isActive('/home') ? 'text-white' : 'text-slate-500'} />
              <span className="font-medium">Home</span>
            </motion.div>
          </Link>
          {user?.role === 'Admin' && (
          <Link to="/dashboard">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 ${isActive('/dashboard') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-blue-50/80 hover:text-blue-700'}`}
            >
              <LayoutGrid size={20} className={isActive('/dashboard') ? 'text-white' : 'text-slate-500'} />
              <span className="font-medium">Dashboard</span>
            </motion.div>
          </Link>
          )}
          <Link to="/tickets">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 ${isActive('/tickets') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-blue-50/80 hover:text-blue-700'}`}
            >
              <Ticket size={20} className={isActive('/tickets') ? 'text-white' : 'text-slate-500'} />
              <span className="font-medium">Tickets</span>
            </motion.div>
          </Link>
          <Link to="/access-management">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 ${isActive('/access-management') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-blue-50/80 hover:text-blue-700'}`}
            >
              <ShieldAlert size={20} className={isActive('/access-management') ? 'text-white' : 'text-slate-500'} />
              <span className="font-medium">Access Management</span>
            </motion.div>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200/60 bg-slate-50/50">
          <div className="flex items-center justify-between mb-4 px-2 group">
            <Link to="/profile" className="flex items-center gap-3 overflow-hidden flex-1 hover:opacity-80 transition-all duration-200">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg overflow-hidden shrink-0 shadow-sm ring-2 ring-white"
              >
                {userProfile.profilePic ? (
                  <img src={userProfile.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  userProfile.name.charAt(0)
                )}
              </motion.div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 truncate">{userProfile.name}</p>
                <p className="text-xs text-slate-500 truncate">{userProfile.email}</p>
              </div>
            </Link>
            <Link 
              to="/profile"
              className={`p-2 rounded-lg transition-all duration-200 active:scale-90 shrink-0 ${isActive('/profile') ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-200/50 hover:text-slate-700 active:bg-slate-300/50'}`}
              title="ตั้งค่าโปรไฟล์"
            >
              <Settings size={20} />
            </Link>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 rounded-xl transition-colors duration-200 font-medium shadow-sm"
          >
            <LogOutIcon size={18} />
            ออกจากระบบ
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 md:hidden shrink-0">
          <div className="px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Automat Care</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-all duration-200 active:scale-90"
              >
                <LogOut size={18} />
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-500 hover:text-slate-900 transition-all duration-200 active:scale-90"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-xl z-10 md:hidden"
            >
              <nav className="p-4 space-y-2">
                <Link 
                  to="/home" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 active:scale-95 ${isActive('/home') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-blue-50/80 hover:text-blue-700 active:bg-blue-100'}`}
                >
                  <HomeIcon size={20} className={isActive('/home') ? 'text-white' : 'text-slate-500'} />
                  <span className="font-medium">Home</span>
                </Link>
                {user?.role === 'Admin' && (
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 active:scale-95 ${isActive('/dashboard') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-blue-50/80 hover:text-blue-700 active:bg-blue-100'}`}
                >
                  <LayoutGrid size={20} className={isActive('/dashboard') ? 'text-white' : 'text-slate-500'} />
                  <span className="font-medium">Dashboard</span>
                </Link>
                )}
                <Link 
                  to="/tickets" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 active:scale-95 ${isActive('/tickets') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-blue-50/80 hover:text-blue-700 active:bg-blue-100'}`}
                >
                  <Ticket size={20} className={isActive('/tickets') ? 'text-white' : 'text-slate-500'} />
                  <span className="font-medium">Tickets</span>
                </Link>
                <Link 
                  to="/access-management" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 active:scale-95 ${isActive('/access-management') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-blue-50/80 hover:text-blue-700 active:bg-blue-100'}`}
                >
                  <ShieldAlert size={20} className={isActive('/access-management') ? 'text-white' : 'text-slate-500'} />
                  <span className="font-medium">Access Management</span>
                </Link>
              </nav>
              
              <div className="p-4 border-t border-slate-200/60 bg-slate-50/50">
                <div className="flex items-center justify-between mb-4 px-2">
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 overflow-hidden flex-1 active:scale-95 transition-transform"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg overflow-hidden shrink-0 shadow-sm ring-2 ring-white">
                      {userProfile.profilePic ? (
                        <img src={userProfile.profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        userProfile.name.charAt(0)
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-slate-900 truncate">{userProfile.name}</p>
                      <p className="text-xs text-slate-500 truncate">{userProfile.email}</p>
                    </div>
                  </Link>
                  <Link 
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-2 rounded-lg transition-all duration-200 active:scale-90 shrink-0 ${isActive('/profile') ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-200/50 hover:text-slate-700'}`}
                  >
                    <Settings size={20} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
