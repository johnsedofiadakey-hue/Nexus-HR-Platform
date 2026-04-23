import React from 'react';
import { Zap, ShieldCheck, Lock, Activity } from 'lucide-react';
import { cn } from '../../../utils/cn';
import NocModule from './NocModule';

interface ProtocolSelectorProps {
    tenant: any;
    onToggle: (feature: string) => void;
}

const ProtocolSelector: React.FC<ProtocolSelectorProps> = ({ tenant, onToggle }) => {
    const features = JSON.parse(tenant.features || '{}');

    const protocolGroups = [
        {
            name: "Core Infrastructure",
            tier: "BASIC",
            items: [
                { id: 'records', label: 'Employee Records Cluster' },
                { id: 'leave', label: 'Leave Lifecycle Engine' },
                { id: 'announcements', label: 'Broadcast Protocol' }
            ]
        },
        {
            name: "Enterprise Operations",
            tier: "PRO",
            items: [
                { id: 'payroll', label: 'Fiscal Payroll Hub' },
                { id: 'appraisals', label: 'Performance Matrix' },
                { id: 'assets', label: 'Fixed Asset Ledger' }
            ]
        },
        {
            name: "Strategic Sub-Systems",
            tier: "ADVANCED",
            items: [
                { id: 'recruitment', label: 'Talent Acquisition' },
                { id: 'training', label: 'Cognitive Learning' },
                { id: 'expenses', label: 'Expense Disbursement' }
            ]
        },
        {
            name: "Global Infrastructure",
            tier: "ENTERPRISE",
            items: [
                { id: 'custom_domains', label: 'Domain Proxy Protocol' },
                { id: 'ai_engine', label: 'Synthesized Intelligence' },
                { id: 'white_label', label: 'Branding Isolation' }
            ]
        }
    ];

    return (
        <NocModule 
            title="Protocol Configuration" 
            subtitle="Software-Defined Feature Gateway" 
            icon={Zap}
            iconColor="text-blue-600"
        >
            <div className="space-y-12">
                {protocolGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{group.name}</h4>
                            <span className="text-[9px] font-black text-blue-600/50 uppercase tracking-widest bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                                TIER {group.tier}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {group.items.map((item) => {
                                const isEnabled = features[item.id];
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => onToggle(item.id)}
                                        className={cn(
                                            "flex items-center justify-between p-5 rounded-2xl border transition-all group relative overflow-hidden",
                                            isEnabled 
                                                ? "border-emerald-100 bg-emerald-50 text-emerald-900 shadow-lg shadow-emerald-500/5" 
                                                : "border-slate-100 bg-white text-slate-400 hover:bg-slate-50 hover:border-slate-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                                isEnabled ? "bg-white text-emerald-600 shadow-sm" : "bg-slate-50 text-slate-300"
                                            )}>
                                                {isEnabled ? <ShieldCheck size={18} /> : <Lock size={18} />}
                                            </div>
                                            <span className="text-sm font-black uppercase tracking-tight">{item.label}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 relative z-10 px-2">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest",
                                                isEnabled ? "text-emerald-600" : "text-slate-400"
                                            )}>
                                                {isEnabled ? 'ACTIVE' : 'STANDBY'}
                                            </span>
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                isEnabled ? "bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse" : "bg-slate-200"
                                            )} />
                                        </div>
                                        
                                        {isEnabled && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </NocModule>
    );
};

export default ProtocolSelector;
