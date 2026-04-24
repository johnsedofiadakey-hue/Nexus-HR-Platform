import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Delete, ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { storage, StorageKey } from '../../services/storage';

const DevLogin = () => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [useRedirect, setUseRedirect] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const checkRedirect = async () => {
            try {
                const { getRedirectResult } = await import('firebase/auth');
                const { auth } = await import('../../services/firebase');
                const result = await getRedirectResult(auth);
                if (result) {
                    setLoading(true);
                    const idToken = await result.user.getIdToken();
                    const res = await api.post('/dev/verify-google', { idToken });
                    const { token } = res.data;
                    
                    storage.setItem(StorageKey.DEV_TOKEN, token);
                    storage.setItem(StorageKey.DEV_MODE, 'true');
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    navigate('/nexus-master-console');
                }
            } catch (err: any) {
                console.error('[DevAuth] Redirect result error:', err);
                setError('Identity Sync Failed. Try again.');
            } finally {
                setLoading(false);
            }
        };
        checkRedirect();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key >= '0' && e.key <= '9') handleKeyPress(e.key);
            if (e.key === 'Backspace') handleDelete();
            if (e.key === 'Enter') handleSubmit();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pin, loading]);

    const handleKeyPress = (val: string) => {
        if (pin.length < 8) { 
            setPin(prev => prev + val);
            setError('');
        }
    };

    const handleDelete = () => setPin(prev => prev.slice(0, -1));

    const handleSubmit = async () => {
        if (pin.length < 4) {
            setError('Code must be at least 4 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await api.post('/dev/verify-pin', { pin });
            const { token } = res.data;

            storage.setItem(StorageKey.DEV_TOKEN, token);
            storage.setItem(StorageKey.DEV_MODE, 'true');
            storage.removeItem(StorageKey.DEV_FIREBASE_TOKEN);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setTimeout(() => navigate('/nexus-master-console'), 600);
        } catch (err: any) {
            const data = err.response?.data;
            setError(data?.error || 'Access Denied: Invalid Master Key');
            setAttemptsRemaining(data?.attemptsRemaining ?? null);
            setPin('');
            setLoading(false);
        }
    };

    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'enter'];

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans selection:bg-indigo-500/30">
            {/* ── Background Aesthetics ── */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1e293b 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-indigo-500/10 via-transparent to-blue-500/10" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-8">
                        <button 
                            onClick={() => navigate('/')}
                            className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all shadow-sm"
                        >
                            <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> 
                            Back to Public Site
                        </button>
                    </div>
                    <motion.div 
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[2.5rem] shadow-2xl border border-white/10 mb-8 relative group"
                    >
                        <Shield size={40} className="text-indigo-400 group-hover:text-white transition-colors" />
                        <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                    <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-4">
                        Master <span className="text-indigo-500 underline decoration-indigo-500/30 underline-offset-8">Console.</span>
                    </h1>
                    <p className="text-slate-400 font-medium text-lg">Nexus Cluster Command & Intelligence</p>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-16 shadow-2xl relative overflow-hidden text-center">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-500/10 blur-[80px] rounded-full" />
                    
                    <div className="relative z-10">
                        <div className="mb-10 text-center">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Security Active</span>
                            </div>
                            <p className="text-slate-300 text-sm font-medium">Verify your administrative identity.</p>
                        </div>

                        {error && (
                            <div className="mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold tracking-tight">
                                {error}
                            </div>
                        )}

                        {/* ── Visual PIN Display ── */}
                        <div className="flex justify-center gap-4 mb-12">
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ 
                                        scale: pin.length > i ? 1.1 : 1,
                                        backgroundColor: pin.length > i ? '#6366f1' : 'rgba(255,255,255,0.05)'
                                    }}
                                    className="w-4 h-12 rounded-full border border-white/5 shadow-inner"
                                />
                            ))}
                        </div>

                        {/* ── Numeric Keypad ── */}
                        <div className="grid grid-cols-3 gap-6 mb-12 max-w-sm mx-auto">
                            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'enter'].map((key) => (
                                <motion.button
                                    key={key}
                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        if (key === 'del') handleDelete();
                                        else if (key === 'enter') handleSubmit();
                                        else handleKeyPress(key);
                                    }}
                                    className={`h-20 rounded-3xl flex items-center justify-center text-xl font-bold transition-colors ${
                                        key === 'enter' ? 'bg-indigo-600 text-white col-span-1' : 
                                        key === 'del' ? 'text-rose-400' : 'text-slate-300 bg-white/5'
                                    }`}
                                >
                                    {key === 'del' ? <Delete size={20} /> : 
                                     key === 'enter' ? <ArrowRight size={24} /> : key}
                                </motion.button>
                            ))}
                        </div>

                        <div className="relative flex items-center gap-4 my-8 opacity-20">
                            <div className="h-px flex-1 bg-slate-500" />
                            <span className="text-[10px] font-black tracking-widest text-slate-400">OR</span>
                            <div className="h-px flex-1 bg-slate-500" />
                        </div>

                        <button
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    const { signInWithRedirect } = await import('firebase/auth');
                                    const { auth, googleProvider } = await import('../../services/firebase');
                                    await signInWithRedirect(auth, googleProvider);
                                } catch (err: any) {
                                    setError(err.response?.data?.error || 'Google Identity Verification Failed');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                            className="w-full h-20 bg-white hover:bg-slate-100 text-slate-950 rounded-3xl flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-500/10 group disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 size={24} className="animate-spin text-indigo-600" />
                            ) : (
                                <>
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                                    <span className="text-sm font-black uppercase tracking-widest">Login with Nexus Intelligence</span>
                                </>
                            )}
                        </button>
                        
                        <p className="mt-10 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                            Authorized Personnel Only // Node ID: NS-772
                        </p>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-center gap-8 opacity-20">
                    <div className="flex items-center gap-2">
                        <ArrowRight size={14} className="text-white" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Encrypted Handshake</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className="text-white" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">SOC-2 Compliant</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DevLogin;
