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

    const handleKeyPress = (val: string) => {
        if (pin.length < 20) { // Support variable-length PINs
            setPin(prev => prev + val);
            setError('');
        }
    };

    const handleDelete = () => setPin(prev => prev.slice(0, -1));

    const handleSubmit = async () => {
        if (pin.length < 4) {
            setError('PIN must be at least 4 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Server-side PIN verification — no client-side comparison
            const res = await api.post('/dev/verify-pin', { pin });
            const { token } = res.data;

            // Store server-issued dev JWT
            localStorage.setItem('nexus_dev_token', token);
            localStorage.setItem('nexus_dev_mode', 'true');
            localStorage.removeItem('nexus_dev_firebase_token');

            // Update API defaults for subsequent dev requests
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setTimeout(() => navigate('/nexus-master-console'), 600);
        } catch (err: any) {
            const data = err.response?.data;
            setError(data?.error || 'Authentication failed');
            if (data?.attemptsRemaining !== undefined) {
                setAttemptsRemaining(data.attemptsRemaining);
            }
            setPin('');
            setLoading(false);
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
                    <h1 className="text-xl font-bold text-white">Master Console</h1>
                    <p className="text-sm text-slate-400 mt-1">Enter your access code to continue</p>
                </div>

                {/* Card */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 shadow-xl">
                    {/* PIN Dots */}
                    <div className="flex justify-center gap-2 mb-8 min-h-[24px]">
                        {pin.length === 0 ? (
                            <div className="flex gap-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="w-3 h-3 rounded-full bg-slate-700" />
                                ))}
                            </div>
                        ) : (
                            Array.from({ length: pin.length }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-3 h-3 rounded-full bg-indigo-500"
                                />
                            ))
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-4"
                        >
                            <p className="text-xs text-rose-400 flex items-center justify-center gap-1.5">
                                <AlertTriangle size={12} />
                                {error}
                            </p>
                            {attemptsRemaining !== null && attemptsRemaining <= 3 && (
                                <p className="text-[10px] text-amber-500 mt-1">
                                    {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining before lockout
                                </p>
                            )}
                        </motion.div>
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
                                        disabled={pin.length < 4 || loading}
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
                    Nexus Master Console · Server-Verified Access
                </p>
            </motion.div>
        </div>
    );
};

export default DevLogin;
