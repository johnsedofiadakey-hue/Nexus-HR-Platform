import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Terminal, Activity, ChevronRight, Globe, Server, Database, Lock, Delete, Hash } from 'lucide-react';

const DevLogin = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [telemetry, setTelemetry] = useState<string[]>([]);
  const navigate = useNavigate();

  const MASTER_PIN = '564669';

  // Simulated NOC Telemetry
  useEffect(() => {
    const logs = [
      'Initialize Master Vault Access...',
      'Port synchronization: COMPLETE',
      'Satellite uplink: SECURE',
      'Awaiting override credentials...'
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setTelemetry(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${logs[i]}`]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 600);
    
    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (val: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + val);
      setError('');
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (pin === MASTER_PIN) {
        setLoading(true);
        setTelemetry(prev => [...prev, `[${new Date().toLocaleTimeString()}] ACCESS GRANTED: Global Override active.`]);
        
        // Persistence Layer
        localStorage.setItem('nexus_dev_key', pin);
        localStorage.setItem('nexus_dev_mode', 'true');
        localStorage.removeItem('nexus_dev_firebase_token'); // Clear old Google session if any
        
        setTimeout(() => navigate('/nexus-master-console'), 1000);
    } else {
        setError('CRITICAL: ACCESS DENIED');
        setTelemetry(prev => [...prev, `[${new Date().toLocaleTimeString()}] INVALID KEY: Identity challenge failed.`]);
        setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center p-6 selection:bg-emerald-500/30 overflow-hidden font-sans italic selection:not-italic">
      {/* ── Dynamic Atomic Background ──────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 mix-blend-overlay" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full animate-pulse delay-700" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px] z-10"
      >
        {/* ── Brand Header ─────────────────────────────────────────────────── */}
        <div className="text-center mb-10 flex flex-col items-center">
            <motion.div
               animate={{ boxShadow: ['0 0 0px var(--emerald-500)', '0 0 20px rgba(16,185,129,0.2)', '0 0 0px var(--emerald-500)'] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 relative overflow-hidden"
            >
                <Database className="text-emerald-400" size={32} />
            </motion.div>
            
            <h1 className="text-3xl font-black tracking-[-0.04em] text-white">NEXUS VAULT</h1>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500/60 leading-none mt-2">Central Security Node</span>
        </div>

        {/* ── Master Key Card ─────────────────────────────────────────────── */}
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] overflow-hidden shadow-[0_25px_100px_-20px_rgba(0,0,0,0.8)]">
            
            {/* Control Bar */}
            <div className="px-6 py-4 bg-white/[0.02] border-b border-white/[0.05] flex items-center justify-between">
                <div className="flex gap-1.5 font-mono">
                    <Terminal size={12} className="text-slate-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Security-Bypass: ACTIVE</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
                   <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Bridged</span>
                </div>
            </div>

            <div className="p-8 space-y-8">
                {/* Digit Display */}
                <div className="p-6 bg-black/60 rounded-3xl border border-white/[0.04] text-center">
                    <div className="flex justify-center gap-3">
                        {[0,1,2,3,4,5].map(i => (
                            <div key={i} className="w-10 h-10 rounded-xl border border-white/[0.1] bg-white/[0.02] flex items-center justify-center">
                                <motion.div 
                                    initial={false}
                                    animate={{ scale: pin[i] ? 1 : 0.5, opacity: pin[i] ? 1 : 0.2 }}
                                    className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                                />
                            </div>
                        ))}
                    </div>
                    {error && <motion.p animate={{ x: [-2, 2, -2, 2, 0] }} className="text-[10px] text-rose-500 font-black mt-4 uppercase tracking-[0.2em]">{error}</motion.p>}
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-3">
                    {[1,2,3,4,5,6,7,8,9].map(num => (
                        <motion.button
                            key={num}
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleKeyPress(num.toString())}
                            className="h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xl font-black text-white hover:border-emerald-500/40 transition-colors"
                        >
                            {num}
                        </motion.button>
                    ))}
                    <button onClick={handleDelete} className="h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-500 hover:text-rose-400">
                        <Delete size={20} />
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleKeyPress('0')}
                        className="h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xl font-black text-white hover:border-emerald-500/40"
                    >
                        0
                    </motion.button>
                    <button 
                        onClick={handleSubmit}
                        disabled={pin.length < 6 || loading}
                        className={`h-16 rounded-2xl flex items-center justify-center transition-all ${pin.length === 6 ? 'bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-white/5 text-slate-600'}`}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Telemetry Stream */}
                <div className="space-y-1 font-mono p-4 bg-black/40 rounded-2xl border border-white/[0.04] h-[80px] overflow-hidden">
                   {telemetry.slice(-3).map((log, idx) => (
                      <div key={idx} className="text-[9px] leading-relaxed flex gap-3 text-slate-500">
                         <span>{log}</span>
                      </div>
                   ))}
                </div>
            </div>

            {/* Hardware Status Strip */}
            <div className="px-10 py-6 bg-white/[0.02] border-t border-white/[0.05] grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                    <Globe size={10} className="text-emerald-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Uplink Stable</span>
                </div>
                <div className="flex items-center gap-3 justify-end">
                    <Activity size={10} className="text-emerald-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">System: Nominal</span>
                </div>
            </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <p className="mt-8 text-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">
           Secured by BlackCore Protocols · 2026-X
        </p>
      </motion.div>
    </div>
  );
};

export default DevLogin;
