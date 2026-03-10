import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Home() {
  const { user } = useAuth();

  return (
    <Layout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="min-h-[calc(100vh-4rem)] bg-white text-slate-900 font-sans rounded-2xl overflow-hidden flex items-center justify-center p-8"
      >
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Text Section */}
          <motion.div variants={item}>
            <h1 className="text-7xl font-extrabold tracking-tighter text-slate-900 mb-6">
              Automat Care
            </h1>

            <p className="text-slate-500 text-lg leading-relaxed max-w-md mb-8">
              Centralized Service Request & Incident Management
              {user?.role === 'GUEST' && (
                <>
                  <br /><br />
                  <span className="text-sm text-slate-400">
                    ผู้ใช้จะสามารถเข้าถึงเมนูต่าง ๆ ได้ก็ต่อเมื่อได้รับ Role ก่อนเท่านั้น เมนูต่าง ๆ จะยังไม่แสดงจนกว่าผู้ใช้จะได้รับ Role อย่างใดอย่างหนึ่ง เช่น ORG Admin หรือ Member
                  </span>
                </>
              )}
            </p>

            {/* Button */}
            {user?.role !== 'GUEST' && (
            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link
                to="/tickets"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                View Tickets
                <ArrowRight size={20} />
              </Link>
            </motion.div>
            )}
          </motion.div>

          {/* Image Section */}
          <motion.div
            variants={item}
            className="flex justify-center"
          >
            <img
              src="https://automatconsult.com/wp-content/uploads/2025/02/Robot.png"
              alt="Chatbot illustration"
              className="w-full max-w-lg object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
}