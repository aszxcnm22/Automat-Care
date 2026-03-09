import { motion } from 'motion/react';

export default function Background() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#0047AB] overflow-hidden">
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#003380] via-[#0052D4] to-[#4364F7] opacity-80"></div>
      
      {/* Floating 3D-like shapes */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full bg-gradient-to-br from-blue-300 to-blue-600 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),_10px_10px_20px_rgba(0,0,0,0.3)] opacity-80"
      />
      
      <motion.div
        animate={{ y: [0, 30, 0], x: [0, -20, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] right-[5%] w-64 h-64 rounded-[40%] bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-[inset_-20px_-20px_40px_rgba(0,0,0,0.3),_20px_20px_40px_rgba(0,0,0,0.4)] opacity-70"
      />

      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[20%] right-[15%] w-24 h-64 rounded-full bg-gradient-to-b from-blue-400 to-blue-700 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.3),_10px_10px_20px_rgba(0,0,0,0.4)] rotate-45 opacity-60"
      />
      
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[20%] left-[15%] w-48 h-20 rounded-full bg-gradient-to-r from-blue-300 to-blue-500 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2),_10px_10px_20px_rgba(0,0,0,0.3)] -rotate-12 opacity-80"
      />
      
      {/* Blurred glowing spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-[100px]"></div>
    </div>
  );
}
