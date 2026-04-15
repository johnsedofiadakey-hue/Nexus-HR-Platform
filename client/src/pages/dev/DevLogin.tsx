import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Delete, ArrowRight } from 'lucide-react';

const DevLogin = () => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const MASTER_PIN = '564669';

    const handleKeyPress = (val: string) => {
        if (pin.length < 6) {
            setPin(prev => prev + val);
            setError('');
        }
    };

    const handleDelete = () => setPin(prev => prev.slice(0, -1));

    const handleSubmit = () => {
        if (pin === MASTER_PIN) {
            setLoading(true);
            localStorage.setItem('nexus_dev_key', pin);
            localStorage.setItem('nexus_dev_mode', 'true');
            localStorage.removeItem('nexus_dev_firebase_token');
            setTimeout(() => navigate('/nexus-master-console'), 800);
        } else {
            setError('Incorrect PIN. Please try again.');
            setPin('');
        }
    };

    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'enter'];

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-sm"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-2xl mb-4">
                        <Shield size={22} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-white">Admin Access</h1>
                    <p className="text-sm text-slate-400 mt-1">Enter your 6-digit PIN to continue</p>
                </div>

                {/* Card */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 shadow-xl">
                    {/* PIN Dots */}
                    <div className="flex justify-center gap-3 mb-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="relative w-4 h-4 flex items-center justify-center">
                                <motion.div
                                    animate={{
                                        scale: pin[i] ? 1 : 0.6,
                                        backgroundColor: pin[i] ? '#6366F1' : '#334155'
                                    }}
                                    className="w-3 h-3 rounded-full"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center text-xs text-rose-400 mb-4"
                        >
                            {error}
                        </motion.p>
                    )}

                    {/* Keypad */}
                    <div className="grid grid-cols-3 gap-3">
                        {keys.map((key, idx) => {
                            if (key === '') {
                                return (
                                    <button
                                        key={idx}
                                        onClick={handleDelete}
                                        className="h-14 flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-slate-700/50 transition-colors"
                                    >
                                        <Delete size={18} />
                                    </button>
                                );
                            }
                            if (key === 'enter') {
                                return (
                                    <button
                                        key={idx}
                                        onClick={handleSubmit}
                                        disabled={pin.length < 6 || loading}
                                        className="h-14 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <ArrowRight size={18} />
                                        )}
                                    </button>
                                );
                            }
                            return (
                                <motion.button
                                    key={idx}
                                    whileTap={{ scale: 0.92 }}
                                    onClick={() => handleKeyPress(key)}
                                    className="h-14 text-lg font-semibold text-white bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors"
                                >
                                    {key}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                <p className="text-center text-xs text-slate-600 mt-6">
                    Nexus Admin Console · Restricted Access
                </p>
            </motion.div>
        </div>
    );
};

export default DevLogin;
