import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Briefcase, ArrowRight, Loader2, Sparkles, Zap, Building2, CheckCircle2 } from 'lucide-react';

const ROLES = [
  {
    id: 'md',
    title: 'Managing Director',
    icon: <Shield className="w-6 h-6" />,
    desc: 'Total organization oversight. Strategic analytics, financial health, and enterprise resolution.',
    color: 'from-nexus-blue-500 to-nexus-blue-700',
    capabilities: ['Executive Analytics', 'Strategic Payroll Control', 'Organization Scaling']
  },
  {
    id: 'manager',
    title: 'Department Manager',
    icon: <Briefcase className="w-6 h-6" />,
    desc: 'Operational leadership. Team performance tracking, leave approvals, and shift rotations.',
    color: 'from-emerald-500 to-emerald-700',
    capabilities: ['Performance Cortex', 'Attendance Intelligence', 'Team Resource Planning']
  },
  {
    id: 'staff',
    title: 'Standard Employee',
    icon: <Users className="w-6 h-6" />,
    desc: 'Personalized workspace. Self-service requests, biometric sync, and talent growth maps.',
    color: 'from-slate-500 to-slate-700',
    capabilities: ['Dynamic Self-Service', 'Transparent Paystubs', 'Growth Roadmaps']
  }
];

export const DemoLauncher = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLaunch = async (role: string) => {
    setLoading(role);
    try {
      // In a real environment, this would call /api/auth/demo-login
      // For the marketing site, we will redirect to the client with the demo flag
      // simulating a quick handshake
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        // Redirecting to the main platform with the demo session
        window.location.href = `https://nexus-hrm.web.app/auth/demo?role=${role}`;
      }, 1000);
    } catch (err) {
      console.error('Demo launch failed', err);
      setLoading(null);
    }
  };

  return (
    <div className="relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ROLES.map((role) => (
          <motion.div
            key={role.id}
            whileHover={{ y: -10 }}
            className="group relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-nexus-blue-600/20 to-emerald-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative h-full flex flex-col p-10 glass-card bg-nexus-slate-900/80">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white mb-10 shadow-lg shadow-nexus-blue-900/20`}>
                {role.icon}
              </div>
              
              <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4">{role.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed mb-8 h-20">
                {role.desc}
              </p>

              <div className="space-y-4 mb-10 flex-grow">
                {role.capabilities.map((cap) => (
                  <div key={cap} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={!!loading}
                onClick={() => handleLaunch(role.id)}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all
                  ${loading === role.id ? 'bg-white/10 text-white' : 'btn-primary'}
                  disabled:opacity-50`}
              >
                {loading === role.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Initializing Workspace...
                  </>
                ) : success ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Launching Exhibit...
                  </>
                ) : (
                  <>
                    Simulate Role
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
