import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { storage, StorageKey } from '../services/storage';
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff, Shield, AlertCircle, Fingerprint, Command, Zap } from 'lucide-react';
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
    const [isDemoMode, setIsDemoMode] = useState(false);

    useEffect(() => {
        if (storage.getItem(StorageKey.AUTH_TOKEN, null)) navigate('/dashboard');
        
        // Handle Demo Mode Auto-Fill & Silent Auto-Login
        const params = new URLSearchParams(window.location.search);
        if (params.get('demo') === 'true') {
            setIsDemoMode(true);
            const demoCreds = {
                email: 'guest@nexus-demo.com',
                password: 'nexusdemo'
            };
            setFormData(demoCreds);
            
            // Execute Silent Handshake
            const performAutoLogin = async () => {
                setLoading(true);
                try {
                    const res = await api.post('/auth/login', demoCreds);
                    const { token, refreshToken, user } = res.data;
                    
                    storage.setItem(StorageKey.AUTH_TOKEN, token);
                    if (refreshToken) storage.setItem(StorageKey.REFRESH_TOKEN, refreshToken);
                    storage.setItem(StorageKey.USER, user || {});

                    navigate('/dashboard');
                    toast.success('Demo Space Initialized Successfully');
                } catch (err: any) {
                    setError('Demo Initialization Protocol Failed.');
                } finally {
                    setLoading(false);
                }
            };
            
            // Visual feedback delay before silent redirect
            const timer = setTimeout(performAutoLogin, 800);
            return () => clearTimeout(timer);
        }
    }, [navigate]);

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

            if (user?.role === 'DEV') navigate('/nexus-master-console');
            else navigate('/dashboard');
            
            toast.success('Sign in successful');
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Invalid email or password.');
            toast.error('Sign in failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans selection:bg-blue-500/30">
            {/* ── Visual Atmosphere ────────────────────────────────── */}
            <div className="absolute inset-0 z-0 text-left">
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full bg-blue-500/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[480px] px-6 relative z-10 text-left"
            >
                {/* Navigation Return */}
                <div className="flex justify-center mb-10">
                    <button 
                        onClick={() => navigate('/home')}
                        className="group flex items-center gap-3 px-6 py-3 bg-white hover:bg-slate-950 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all shadow-sm"
                    >
                        <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> 
                        Back to Website
                    </button>
                </div>

                {/* Branding */}
                <div className="flex flex-col items-center mb-10">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-xl mb-6 overflow-hidden relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Command size={32} className="text-slate-900 group-hover:text-white transition-colors relative z-10" />
                    </motion.div>

                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter text-center leading-none mb-3 italic uppercase">
                        NEXUS<span className="text-blue-600">.</span>CORE
                    </h1>
                    
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Secure Staff Access</span>
                    </div>
                </div>

                {/* Login Terminal */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden text-left">
                    {/* Demo Mode Badge */}
                    <AnimatePresence>
                        {isDemoMode && (
                            <motion.div 
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="absolute top-0 right-0 left-0 bg-blue-600 py-2 flex items-center justify-center gap-2"
                            >
                                <Zap size={12} className="text-white fill-white" />
                                <span className="text-[8px] font-black text-white uppercase tracking-[0.3em]">Demo Mode Active: Pre-filled</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mb-10 text-center pt-4">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase italic">Sign In</h2>
                        <p className="text-slate-500 text-sm font-medium mt-2">Enter your work email and password.</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-600"
                            >
                                <AlertCircle size={18} className="flex-shrink-0" />
                                <span className="text-[11px] font-bold uppercase tracking-wider">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleLogin} className="space-y-6 text-left">
                        {/* Email */}
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Work Email</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Mail size={18} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                                    className="w-full h-16 pl-14 pr-6 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 text-slate-900 font-bold transition-all placeholder:text-slate-300"
                                    placeholder="your-email@company.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2 text-left">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Password</label>
                                <button type="button" className="text-[9px] font-black uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors">Forgot?</button>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock size={18} strokeWidth={2.5} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
                                    className="w-full h-16 pl-14 pr-16 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 text-slate-900 font-bold transition-all placeholder:text-slate-300 tracking-[0.2em]"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.01, y: -1 }}
                            whileTap={{ scale: 0.99, y: 0 }}
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-blue-600 hover:bg-blue-700 rounded-2xl flex items-center justify-center font-black uppercase tracking-[0.4em] text-xs text-white shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 group mt-4"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <div className="flex items-center gap-3">
                                    <span>Sign In</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </motion.button>
                    </form>

                    {/* Secondary Access Providers */}
                    <div className="mt-10">
                        <div className="relative flex items-center justify-center mb-6 text-left">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 text-left"></div></div>
                            <div className="relative bg-white px-4 text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 text-left">Trusted Access Only</div>
                        </div>
                        
                        <div className="flex justify-center gap-4">
                            <button className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all group shadow-sm">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-all" alt="Google" />
                            </button>
                            <button onClick={() => navigate('/vault')} className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all group shadow-sm">
                                <Shield className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-all" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Hardware Metrics */}
                <div className="mt-10 flex justify-between items-center px-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nexus Platform Core v4.1.6</span>
                    <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
