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
    const billingPlan = tenant.subscriptionPlan; // FREE, PRO, ENTERPRISE, etc.

    const protocolGroups = [
        {
            name: "Core Infrastructure",
            tier: "PLUS",
            items: [
                { id: 'records', label: 'Employee Records' },
                { id: 'leave', label: 'Leave Engine' },
                { id: 'announcements', label: 'Comm Hub' }
            ]
        },
        {
            name: "Enterprise Ops",
            tier: "PRO",
            items: [
                { id: 'payroll', label: 'Payroll Core' },
                { id: 'appraisals', label: 'Perf Systems' },
                { id: 'assets', label: 'Asset Ledger' }
            ]
        },
        {
            name: "Strategic Suites",
            tier: "PAID",
            items: [
                { id: 'recruitment', label: 'Talent Acquire' },
                { id: 'training', label: 'Learning Center' },
                { id: 'expenses', label: 'Finance Claims' }
            ]
        },
        {
            name: "Infrastructure Node",
            tier: "PREMIUM",
            items: [
                { id: 'custom_domains', label: 'Custom Domain Protocol' },
                { id: 'ai_engine', label: 'AI Synthesis' },
                { id: 'white_label', label: 'Branding Isolation' }
            ]
        }
    ];

    return (
        <NocModule 
            title="System Protocols" 
            subtitle="Tier-Based Feature Access" 
            icon={Zap}
            iconColor="text-amber-400"
        >
            <div className="space-y-8">
                {protocolGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{group.name}</h4>
                            <span className="text-[8px] font-black text-amber-500/50 uppercase tracking-widest border border-amber-500/20 px-2 py-0.5 rounded-md">
                                {group.tier} REQUIRED
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {group.items.map((item) => {
                                const isEnabled = features[item.id];
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => onToggle(item.id)}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-2xl border transition-all group overflow-hidden relative",
                                            isEnabled 
                                                ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" 
                                                : "border-white/5 bg-white/5 text-slate-500 hover:bg-white/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 relative z-10">
                                            {isEnabled ? <ShieldCheck size={14} /> : <Lock size={14} className="opacity-40" />}
                                            <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 relative z-10">
                                            <span className={cn(
                                                "text-[8px] font-bold uppercase",
                                                isEnabled ? "opacity-100" : "opacity-40"
                                            )}>
                                                {isEnabled ? 'ACTIVE' : 'STANDBY'}
                                            </span>
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                isEnabled ? "bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse" : "bg-slate-800"
                                            )} />
                                        </div>
                                        
                                        {/* Activity glow effect */}
                                        {isEnabled && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
