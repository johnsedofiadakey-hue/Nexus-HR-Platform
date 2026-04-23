import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Delete, ArrowRight, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

const DevLogin = () => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

            localStorage.setItem('nexus_dev_token', token);
            localStorage.setItem('nexus_dev_mode', 'true');
            localStorage.removeItem('nexus_dev_firebase_token');
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
            {/* ── Background Grid ── */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1e293b 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-[2rem] shadow-2xl shadow-indigo-500/20 mb-6">
                        <Shield size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Cluster Access</h1>
                    <p className="text-sm text-slate-500 font-medium mt-2">Identity synchronization required.</p>
                </div>

                <div className="nx-card p-10 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="flex justify-center gap-3 mb-10">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                                    pin.length > i 
                                    ? 'bg-indigo-500 border-indigo-500 scale-125 shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                                    : 'border-slate-700 bg-transparent'
                                }`} 
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {keys.map((key, idx) => {
                            if (key === 'del') {
                                return (
                                    <button
                                        key={idx}
                                        onClick={handleDelete}
                                        className="h-16 flex items-center justify-center text-slate-500 hover:text-white rounded-2xl bg-white/5 hover:bg-white/10 transition-all font-black text-xs uppercase tracking-widest"
                                    >
                                        DEL
                                    </button>
                                );
                            }
                            if (key === 'enter') {
                                return (
                                    <button
                                        key={idx}
                                        onClick={handleSubmit}
                                        disabled={pin.length < 4 || loading}
                                        className="h-16 flex items-center justify-center rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 disabled:opacity-20 transition-all group"
                                    >
                                        {loading ? (
                                            <Loader2 size={24} className="animate-spin" />
                                        ) : (
                                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                        )}
                                    </button>
                                );
                            }
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleKeyPress(key)}
                                    className="h-16 text-xl font-black text-white bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all active:scale-90"
                                >
                                    {key}
                                </button>
                            );
                        })}
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center"
                            >
                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">
                                    {error}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex flex-col items-center gap-6">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                         Nexus Security Protocol v5 // 04.23
                      </p>
                   </div>

                   <div className="w-full h-px bg-white/5" />

                   <button
                       onClick={async () => {
                           try {
                               setLoading(true);
                               const { signInWithPopup } = await import('firebase/auth');
                               const { auth, googleProvider } = await import('../../services/firebase');
                               const result = await signInWithPopup(auth, googleProvider);
                               const idToken = await result.user.getIdToken();
                               
                               const res = await api.post('/dev/verify-google', { idToken });
                               const { token } = res.data;
                               
                               localStorage.setItem('nexus_dev_token', token);
                               localStorage.setItem('nexus_dev_mode', 'true');
                               api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                               
                               navigate('/nexus-master-console');
                           } catch (err: any) {
                               setError(err.response?.data?.error || 'Google Identity Verification Failed');
                           } finally {
                               setLoading(false);
                           }
                       }}
                       disabled={loading}
                       className="flex items-center gap-3 px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold text-white transition-all hover:scale-105 disabled:opacity-20"
                   >
                       <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
                       Login with Google Identity
                   </button>
                </div>
            </motion.div>
        </div>
    );
};

const Loader2 = ({ size, className }: { size: number; className?: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
);

export default DevLogin;
