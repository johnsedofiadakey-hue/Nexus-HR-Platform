import React, { useEffect, useState, useRef } from 'react';
import { Terminal, Activity, RotateCcw } from 'lucide-react';
import api from '../../../services/api';
import NocModule from './NocModule';

interface AuditTerminalProps {
    tenantId: string;
}

const AuditTerminal: React.FC<AuditTerminalProps> = ({ tenantId }) => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/dev/tenant/${tenantId}/audit`);
            setLogs(res.data);
        } catch (error) {
            console.error('Failed to fetch logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [tenantId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [logs]);

    return (
        <NocModule 
            title="Entity Audit Stream" 
            subtitle="Isolated Telemetry Logs" 
            icon={Terminal}
            iconColor="text-blue-600"
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Trace</p>
                    <button 
                        onClick={fetchLogs}
                        disabled={loading}
                        className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-500 transition-colors disabled:opacity-50"
                    >
                        <RotateCcw size={12} className={loading ? 'animate-spin' : ''} /> Synchronize
                    </button>
                </div>
                
                <div 
                    ref={scrollRef}
                    className="w-full h-96 bg-slate-900 rounded-[2rem] border border-slate-800 p-8 font-mono text-[11px] overflow-y-auto custom-scrollbar shadow-2xl shadow-slate-900/10"
                >
                    {logs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-700 italic">
                            <Activity size={24} className="mb-4 opacity-20" />
                            <p className="tracking-widest uppercase text-[10px] font-black">Waiting for signal trace...</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <span className="text-slate-600 shrink-0 font-bold">[{new Date(log.createdAt).toLocaleTimeString([], { hour12: false })}]</span>
                                    <span className="text-blue-400 shrink-0 font-black">SYS_{log.action}</span>
                                    <span className="text-slate-400 break-all leading-relaxed">{log.details}</span>
                                </div>
                            ))}
                            <div className="pt-2 animate-pulse text-emerald-500 flex items-center gap-2">
                                <span className="w-1.5 h-3 bg-emerald-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Listening for events</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </NocModule>
    );
};

export default AuditTerminal;
