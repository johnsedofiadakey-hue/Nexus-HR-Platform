import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Delete, ArrowRight, AlertTriangle, Loader2, Command } from 'lucide-react';
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
            setError('The code must be at least 4 digits.');
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
            setError(data?.error || 'Access Denied: Invalid Access Code');
            setAttemptsRemaining(data?.attemptsRemaining ?? null);
            setPin('');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans selection:bg-blue-500/30">
            {/* ── Background Aesthetics ── */}
            <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #cbd5e1 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full" />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-8">
                        <button 
                            onClick={() => navigate('/')}
                            className="group flex items-center gap-3 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all shadow-sm"
                        >
                            <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> 
                            Public Site
                        </button>
                    </div>
                    
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl border border-slate-200 mb-8 relative group"
                    >
                        <Shield size={32} className="text-slate-900 group-hover:text-blue-600 transition-colors" />
                    </motion.div>

                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3 italic uppercase">
                        Admin <span className="text-blue-600">Hub.</span>
                    </h1>
                    <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Total System Control</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-14 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden text-center">
                    <div className="relative z-10">
                        <div className="mb-10 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Protected Access</span>
                            </div>
                            <p className="text-slate-600 text-sm font-medium">Verify your administrative code.</p>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-black uppercase tracking-wider"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* ── Visual Access Code Indicators ── */}
                        <div className="flex justify-center gap-3 mb-10">
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ 
                                        scale: pin.length > i ? 1.2 : 1,
                                        backgroundColor: pin.length > i ? '#2563eb' : '#f1f5f9'
                                    }}
                                    className="w-3.5 h-3.5 rounded-full border border-slate-200 shadow-sm transition-colors"
                                />
                            ))}
                        </div>

                        {/* ── Numeric Keypad ── */}
                        <div className="grid grid-cols-3 gap-4 mb-10 max-w-sm mx-auto">
                            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'enter'].map((key) => (
                                <motion.button
                                    key={key}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98, y: 0 }}
                                    onClick={() => {
                                        if (key === 'del') handleDelete();
                                        else if (key === 'enter') handleSubmit();
                                        else handleKeyPress(key);
                                    }}
                                    className={`h-16 rounded-2xl flex items-center justify-center text-lg font-black transition-all ${
                                        key === 'enter' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 
                                        key === 'del' ? 'text-rose-500 bg-rose-50 border border-rose-100' : 'text-slate-900 bg-slate-50 border border-slate-100 hover:border-slate-200'
                                    }`}
                                >
                                    {key === 'del' ? <Delete size={18} /> : 
                                     key === 'enter' ? <ArrowRight size={20} /> : key}
                                </motion.button>
                            ))}
                        </div>

                        <div className="relative flex items-center gap-4 my-8">
                            <div className="h-px flex-1 bg-slate-100" />
                            <span className="text-[10px] font-black tracking-widest text-slate-300">OR</span>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>

                        <button
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    const { signInWithRedirect } = await import('firebase/auth');
                                    const { auth, googleProvider } = await import('../../services/firebase');
                                    await signInWithRedirect(auth, googleProvider);
                                } catch (err: any) {
                                    setError('Google Admin login failed.');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                            className="w-full h-16 bg-white border border-slate-200 hover:border-slate-300 text-slate-900 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-lg active:scale-95 shadow-sm group disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin text-blue-600" />
                            ) : (
                                <>
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 opacity-80 group-hover:opacity-100" alt="Google" />
                                    <span className="text-xs font-black uppercase tracking-widest">Google Admin Login</span>
                                </>
                            )}
                        </button>
                        
                        <p className="mt-10 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            Private Admin Area // Node ID: NS-772
                        </p>
                    </div>
                </div>

                <div className="mt-10 flex items-center justify-center gap-6 opacity-40">
                    <div className="flex items-center gap-2">
                        <ArrowRight size={12} className="text-slate-900" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Secure Tunnel</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={12} className="text-slate-900" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">SOC-2 Verified</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DevLogin;
