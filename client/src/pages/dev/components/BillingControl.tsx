import React, { useState } from 'react';
import { CreditCard, Zap, Calendar, Ban, CheckCircle, Clock } from 'lucide-react';
import { cn } from '../../../utils/cn';
import api from '../../../services/api';
import { toast } from '../../../utils/toast';

interface BillingControlProps {
    tenant: any;
    onUpdate: () => void;
}

const TIERS = [
    {
        id: 'FREE',
        label: 'Free Trial',
        color: 'text-slate-400',
        activeBg: 'bg-slate-100 border-slate-200',
        activeText: 'text-slate-900',
        desc: 'Core HRM features, 14-day trial window',
        modules: 3,
        features: ['records', 'leave', 'announcements'],
    },
    {
        id: 'STARTER',
        label: 'Starter',
        color: 'text-sky-600',
        activeBg: 'bg-sky-50 border-sky-100',
        activeText: 'text-sky-900',
        desc: 'Small business suite — up to 30 employees',
        modules: 4,
        features: ['records', 'leave', 'announcements', 'assets'],
    },
    {
        id: 'PRO',
        label: 'Pro',
        color: 'text-violet-600',
        activeBg: 'bg-violet-50 border-violet-100',
        activeText: 'text-violet-900',
        desc: 'Advanced operations — unlimited nodes',
        modules: 9,
        features: ['records', 'leave', 'announcements', 'payroll', 'appraisals', 'assets', 'recruitment', 'training', 'expenses'],
    },
    {
        id: 'ENTERPRISE',
        label: 'Enterprise',
        color: 'text-amber-600',
        activeBg: 'bg-amber-50 border-amber-100',
        activeText: 'text-amber-900',
        desc: 'Global scale + AI Engine + White Label proxying',
        modules: 12,
        features: ['records', 'leave', 'announcements', 'payroll', 'appraisals', 'assets', 'recruitment', 'training', 'expenses', 'custom_domains', 'ai_engine', 'white_label'],
    },
];

const BillingControl: React.FC<BillingControlProps> = ({ tenant, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [trialDays, setTrialDays] = useState(7);
    const [bankRef, setBankRef] = useState('');
    const [bankAmount, setBankAmount] = useState('');
    const [bankNotes, setBankNotes] = useState('');

    const currentTier = TIERS.find(t => t.id === tenant.subscriptionPlan) || TIERS[0];
    const isSuspended = tenant.isSuspended;
    const trialEndsAt = tenant.trialEndsAt ? new Date(tenant.trialEndsAt) : null;
    const trialDaysLeft = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / 86400000)) : null;

    const applyTier = async (tierId: string) => {
        setLoading(true);
        try {
            const tier = TIERS.find(t => t.id === tierId)!;
            const featuresMap: Record<string, boolean> = {};
            tier.features.forEach(f => featuresMap[f] = true);
            await api.patch(`/dev/tenant/${tenant.id}/billing`, {
                subscriptionPlan: tierId,
                billingStatus: tierId === 'FREE' ? 'FREE' : 'ACTIVE',
                isSuspended: false,
                features: JSON.stringify(featuresMap),
            });
            toast.success(`Protocol Transferred: ${tier.label}`);
            onUpdate();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to update plan');
        } finally {
            setLoading(false);
        }
    };

    const toggleSuspend = async () => {
        setLoading(true);
        try {
            await api.patch(`/dev/tenant/${tenant.id}/billing`, {
                isSuspended: !isSuspended,
                billingStatus: !isSuspended ? 'SUSPENDED' : tenant.subscriptionPlan === 'FREE' ? 'FREE' : 'ACTIVE',
            });
            toast.success(isSuspended ? 'Proxy Reactivated' : 'Proxy Suspended');
            onUpdate();
        } catch {
            toast.error('Failed to update account status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* Status Panel */}
            <div className={cn(
                'flex items-center justify-between p-8 rounded-[2rem] border relative overflow-hidden transition-all',
                isSuspended 
                    ? 'bg-rose-50 border-rose-100 shadow-xl shadow-rose-200/20' 
                    : 'bg-white border-slate-100 shadow-xl shadow-slate-200/20'
            )}>
                <div className="flex items-center gap-5">
                    <div className={cn(
                        'w-3 h-3 rounded-full', 
                        isSuspended ? 'bg-rose-600' : tenant.billingStatus === 'ACTIVE' ? 'bg-emerald-600 animate-pulse' : 'bg-blue-600'
                    )} />
                    <div>
                        <p className="text-xl font-black text-slate-900 tracking-tight uppercase">
                            {isSuspended ? 'Signal Suspended' : tenant.billingStatus === 'ACTIVE' ? 'Signal Active' : 'Trial Protocol'}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                            Current Infrastructure: <span className="text-blue-600">{currentTier.label}</span>
                            {trialDaysLeft !== null && !isSuspended && (
                                <span className="ml-3 text-amber-600">
                                    <Clock size={10} className="inline mr-1 mb-0.5" />
                                    {trialDaysLeft} Days Remaining
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <button
                    onClick={toggleSuspend}
                    disabled={loading}
                    className={cn(
                        'px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95',
                        isSuspended
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                            : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                    )}
                >
                    {isSuspended ? 'Reactivate Proxy' : 'Terminate Proxy'}
                </button>
            </div>

            {/* Tier Selection */}
            <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-1">Subscription Matrix</h3>
                <div className="grid grid-cols-2 gap-6">
                    {TIERS.map(tier => {
                        const isActive = tenant.subscriptionPlan === tier.id;
                        return (
                            <button
                                key={tier.id}
                                onClick={() => !isActive && applyTier(tier.id)}
                                disabled={loading || isActive}
                                className={cn(
                                    'p-6 rounded-[2rem] border text-left transition-all relative overflow-hidden group shadow-sm',
                                    isActive
                                        ? `${tier.activeBg} cursor-default ring-2 ring-inset ring-blue-600/5`
                                        : 'border-slate-100 bg-white hover:bg-slate-50 hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/50'
                                )}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110', 
                                        isActive ? 'bg-white border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                                    )}>
                                        <Zap size={18} />
                                    </div>
                                    <span className={cn('text-sm font-black uppercase tracking-tight', isActive ? tier.activeText : 'text-slate-900')}>{tier.label}</span>
                                </div>
                                <p className="text-xs font-bold text-slate-400 leading-relaxed mb-4">{tier.desc}</p>
                                <div className="flex items-center justify-between mt-auto">
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tier.modules} Modules</span>
                                   {isActive && <CheckCircle size={14} className="text-emerald-500" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Manual Override */}
            <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-1">Manual Access Injection</h3>
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2 px-1">Fiscal Reference *</label>
                            <input
                                type="text"
                                placeholder="TXN-REF-XXXX"
                                value={bankRef}
                                onChange={e => setBankRef(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2 px-1">Capital Amount (GNF)</label>
                            <input
                                type="number"
                                placeholder="30000000"
                                value={bankAmount}
                                onChange={e => setBankAmount(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2 px-1">Operational Notes</label>
                        <input
                            type="text"
                            placeholder="Manually confirmed via bank statement"
                            value={bankNotes}
                            onChange={e => setBankNotes(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 transition-all outline-none"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => toast.info('Monthly Override Triggered')}
                            disabled={loading || !bankRef}
                            className="flex-1 py-5 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all disabled:opacity-40"
                        >
                            Inject Monthly
                        </button>
                        <button
                            onClick={() => toast.info('Annual Override Triggered')}
                            disabled={loading || !bankRef}
                            className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-40"
                        >
                            Inject Annual
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingControl;
