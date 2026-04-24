import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { storage, StorageKey } from '../services/storage';
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff, Shield, AlertCircle, Fingerprint, Command } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toast } from '../utils/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { settings } = useTheme();
    const [formData, setFormData] = useState({ email: '', password: '' });

    useEffect(() => {
        if (storage.getItem(StorageKey.AUTH_TOKEN, null)) navigate('/dashboard');
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', formData);
            const { token, refreshToken, user } = res.data;
            
            storage.setItem(StorageKey.AUTH_TOKEN, token);
            if (refreshToken) storage.setItem(StorageKey.REFRESH_TOKEN, refreshToken);
            storage.setItem(StorageKey.USER, user || {});

            if (user?.role === 'DEV') navigate('/dev/dashboard');
            else navigate('/dashboard');
            
            toast.success('System Access Granted');
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Access Denied. Check credentials.');
            toast.error('Identity Verification Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden font-sans selection:bg-indigo-500/30">
            {/* ── High-Fidelity Atmospheric Effects ────────────────────────────────── */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-indigo-600/10 blur-[160px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-blue-600/5 blur-[140px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 mix-blend-overlay pointer-events-none" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[520px] px-6 relative z-10"
            >
                {/* Branding Core */}
                <div className="flex flex-col items-center mb-12">
                    <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="w-24 h-24 rounded-[3rem] bg-gradient-to-tr from-indigo-600 to-blue-500 p-[1px] shadow-2xl shadow-indigo-500/20 mb-8"
                    >
                        <div className="w-full h-full rounded-[2.9rem] bg-black flex items-center justify-center">
                            <Command size={40} className="text-white" />
                        </div>
                    </motion.div>

                    <h1 className="text-5xl font-black text-white tracking-tighter text-center leading-none mb-4 italic uppercase">
                        Nexus<span className="text-indigo-500">.</span>Platform
                    </h1>
                    
                    <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl">
                        <Fingerprint size={14} className="text-emerald-500" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Identity Control Unit</span>
                    </div>
                </div>

                {/* Main Auth Terminal */}
                <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[3.5rem] border border-white/10 p-10 md:p-14 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-700" />
                    
                    <div className="mb-10">
                        <h2 className="text-2xl font-black text-white tracking-tight leading-tight">Access Your Suite</h2>
                        <p className="text-slate-400 text-sm font-medium mt-1">Enter your global credentials below.</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="mb-8 p-5 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-4 text-rose-400"
                            >
                                <AlertCircle size={20} className="flex-shrink-0" />
                                <span className="text-xs font-bold uppercase tracking-widest">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleLogin} className="space-y-8">
                        {/* Email Input */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-2">Enterprise Email</label>
                            <div className="relative group/field">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/field:text-indigo-400 transition-all duration-300">
                                    <Mail size={20} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                                    className="w-full h-20 pl-16 pr-8 bg-black/40 border border-white/5 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 text-white font-bold transition-all placeholder:text-slate-700 text-lg"
                                    placeholder="john@nexus.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Security Key</label>
                                <button type="button" className="text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">Recover</button>
                            </div>
                            <div className="relative group/field">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/field:text-indigo-400 transition-all duration-300">
                                    <Lock size={20} strokeWidth={2.5} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
                                    className="w-full h-20 pl-16 pr-20 bg-black/40 border border-white/5 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 text-white font-bold transition-all placeholder:text-slate-700 text-lg tracking-[0.5em]"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                            </div>
                        </div>

                        {/* Submission */}
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98, y: 0 }}
                            type="submit"
                            disabled={loading}
                            className="w-full h-20 bg-indigo-600 hover:bg-indigo-500 rounded-[2rem] flex items-center justify-center font-black uppercase tracking-[0.5em] text-xs text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all disabled:opacity-50 group"
                        >
                            {loading ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <div className="flex items-center gap-4">
                                    <span>Initialize Access</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                </div>
                            )}
                        </motion.button>
                    </form>

                    {/* Secondary Access Providers */}
                    <div className="mt-12">
                        <div className="relative flex items-center justify-center mb-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                            <div className="relative bg-[#0d0d0d] px-6 text-[8px] font-black uppercase tracking-[0.3em] text-slate-600">Secure Network Links</div>
                        </div>
                        
                        <div className="flex justify-center gap-6">
                            <button className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="Google" />
                            </button>
                            <button className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group">
                                <img src="https://www.svgrepo.com/show/475668/microsoft-color.svg" className="w-6 h-6 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="Microsoft" />
                            </button>
                            <button onClick={() => navigate('/vault')} className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group">
                                <Shield className="w-6 h-6 text-slate-600 group-hover:text-indigo-400 transition-all" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Hardware Metrics */}
                <div className="mt-12 flex justify-between items-center px-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Nexus Core v4.1.1</span>
                        <span className="text-[8px] font-bold text-slate-400/30 uppercase mt-0.5">SOC-2 Type II Certified</span>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
