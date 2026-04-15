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
            title="Isolated Audit Stream" 
            subtitle="Encrypted Telemetry" 
            icon={Terminal}
            iconColor="text-blue-400"
            headerAction={
                <button 
                    onClick={fetchLogs}
                    className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"
                >
                    <RotateCcw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            }
        >
            <div 
                ref={scrollRef}
                className="w-full h-96 bg-black/60 rounded-2xl border border-white/5 p-4 font-mono text-[10px] overflow-y-auto custom-scrollbar"
            >
                {logs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-800 italic">
                        <Activity size={24} className="mb-2 opacity-10" />
                        NO SIGNAL DETECTED
                    </div>
                ) : (
                    <div className="space-y-2">
                        {logs.map((log, i) => (
                            <div key={i} className="flex gap-4 group">
                                <span className="text-slate-700 shrink-0">[{new Date(log.createdAt).toLocaleTimeString([], { hour12: false })}]</span>
                                <span className="text-blue-400/70 shrink-0">SYS_{log.action}</span>
                                <span className="text-slate-400 break-all">{log.details}</span>
                            </div>
                        ))}
                        <div className="pt-2 animate-pulse text-emerald-500">_</div>
                    </div>
                )}
            </div>
        </NocModule>
    );
};

export default AuditTerminal;
