import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../../services/firebase';
import { signInWithPopup } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Terminal, Activity, ChevronRight, Globe, Server, Database, AlertTriangle } from 'lucide-react';

const DevLogin = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [telemetry, setTelemetry] = useState<string[]>([]);
  const navigate = useNavigate();

  // Simulated NOC Telemetry
  useEffect(() => {
    const logs = [
      'Initialize Identity Shield v4.1...',
      'Protocol bypass check: PENDING',
      'Satellite uplink: STABLE',
      'Deep-packet inspection active...',
      'Awaiting Google Federation challenge...'
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setTelemetry(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${logs[i]}`]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      
      const sessionLog = `[SUCCESS] Identity confirmed for ${result.user.email}`;
      setTelemetry(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${sessionLog}`]);

      // Persistence Layer
      localStorage.setItem('nexus_dev_firebase_token', token);
      localStorage.setItem('nexus_dev_user', JSON.stringify({
        email: result.user.email,
        name: result.user.displayName,
        uid: result.user.uid,
        photo: result.user.photoURL
      }));
      localStorage.setItem('nexus_dev_mode', 'true');
      
      // Delay for "Bridge established" effect
      setTimeout(() => navigate('/nexus-master-console'), 1000);
    } catch (err: any) {
      console.error('Google Login Error:', err);
      setError(err.message || 'Identity Federation Failed');
      setTelemetry(prev => [...prev, `[ERROR] Blocked: ${err.message}`]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center p-6 selection:bg-emerald-500/30 overflow-hidden font-sans italic selection:not-italic">
      {/* ── Dynamic Atomic Background ──────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 mix-blend-overlay" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full animate-pulse delay-700" />
        
        {/* Subtle Grid System */}
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
               animate={{ 
                  boxShadow: ['0 0 0px var(--emerald-500)', '0 0 20px rgba(16,185,129,0.2)', '0 0 0px var(--emerald-500)'] 
               }}
               transition={{ duration: 4, repeat: Infinity }}
               className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 relative overflow-hidden group"
            >
                <Shield className="text-emerald-400 group-hover:scale-110 transition-transform duration-500" size={32} />
                <motion.div 
                    animate={{ x: ['-100%', '200%'] }} 
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" 
                />
            </motion.div>
            
            <h1 className="text-3xl font-black tracking-[-0.04em] text-white">NEXUS MASTER</h1>
            <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-1">
                    {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-emerald-500/50" />)}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500/60 leading-none">Global Control Node</span>
                <div className="flex gap-1">
                    {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-emerald-500/50" />)}
                </div>
            </div>
        </div>

        {/* ── NOC Terminal Card ────────────────────────────────────────────── */}
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] overflow-hidden shadow-[0_25px_100px_-20px_rgba(0,0,0,0.8)]">
            
            {/* Control Bar */}
            <div className="px-6 py-4 bg-white/[0.02] border-b border-white/[0.05] flex items-center justify-between">
                <div className="flex gap-1.5 font-mono">
                    <Terminal size={12} className="text-slate-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">Identity-Proxy: Secure-Bridge-Alpha</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-amber-500/80 animate-pulse" />
                   <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Active Link</span>
                </div>
            </div>

            <div className="p-10 space-y-10">
                {/* Telemetry Stream */}
                <div className="space-y-1 mt-2 min-h-[140px] font-mono p-4 bg-black/40 rounded-2xl border border-white/[0.04]">
                   {telemetry.map((log, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={idx} 
                        className="text-[10px] leading-relaxed flex gap-3 group"
                      >
                         <span className="text-slate-600 opacity-50">{idx + 1}</span>
                         <span className={idx === telemetry.length - 1 ? "text-emerald-400 font-bold" : "text-slate-400"}>
                            {log}
                         </span>
                      </motion.div>
                   ))}
                   <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-4 bg-emerald-500/50 inline-block ml-10 mt-1" />
                </div>

                {/* Secure Auth Trigger */}
                <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Federated identity required</p>
                        <h2 className="text-lg font-bold text-white tracking-tight">Initiate Secure Handshake</h2>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full relative group bg-white/[0.03] border border-white/[0.1] hover:border-emerald-500/50 p-5 rounded-2xl flex items-center justify-between transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-2.5 shadow-xl shadow-black/40">
                                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-full h-full object-contain" />
                            </div>
                            <div className="text-left">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Provider: Google.com</p>
                                <p className="text-sm font-black tracking-tight text-white">{loading ? 'Syncing...' : 'Sign in as Root Admin'}</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all">
                            <ChevronRight size={18} />
                        </div>
                    </motion.button>

                    <AnimatePresence>
                      {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4"
                        >
                            <AlertTriangle className="text-rose-500 shrink-0" size={18} />
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 leading-relaxed">{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Hardware Status Strip */}
            <div className="px-10 py-6 bg-white/[0.02] border-t border-white/[0.05] grid grid-cols-3 gap-6">
                {[
                  { icon: Globe, label: 'Geo-Proxy', val: 'Active' },
                  { icon: Server, label: 'Compute', val: 'Low Lat' },
                  { icon: Database, label: 'Vault', val: 'Locked' }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                     <div className="flex items-center gap-2">
                        <item.icon size={10} className="text-slate-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                     </div>
                     <p className="text-[10px] font-bold text-slate-300 pl-4">{item.val}</p>
                  </div>
                ))}
            </div>
        </div>

        {/* ── Footer Metadata ──────────────────────────────────────────────── */}
        <div className="mt-12 text-center space-y-4">
            <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 group cursor-help">
                    <Activity size={10} className="text-emerald-500" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600 transition-colors">Cluster: Nexus-Gamma-4</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-800" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">v5.1.0 STABLE</span>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">
               Secured by BlackCore Protocols · {new Date().getFullYear()}
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DevLogin;
