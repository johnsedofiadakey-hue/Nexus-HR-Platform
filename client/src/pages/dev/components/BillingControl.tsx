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
        color: 'text-slate-300',
        activeBg: 'bg-slate-600/20 border-slate-500',
        desc: 'Basic features, 14-day trial',
        modules: 3,
        features: ['records', 'leave', 'announcements'],
    },
    {
        id: 'STARTER',
        label: 'Starter',
        color: 'text-sky-400',
        activeBg: 'bg-sky-600/10 border-sky-500',
        desc: 'Core HRM — up to 30 employees',
        modules: 4,
        features: ['records', 'leave', 'announcements', 'assets'],
    },
    {
        id: 'PRO',
        label: 'Pro',
        color: 'text-violet-400',
        activeBg: 'bg-violet-600/10 border-violet-500',
        desc: 'Full operations suite — unlimited employees',
        modules: 9,
        features: ['records', 'leave', 'announcements', 'payroll', 'appraisals', 'assets', 'recruitment', 'training', 'expenses'],
    },
    {
        id: 'ENTERPRISE',
        label: 'Enterprise',
        color: 'text-amber-400',
        activeBg: 'bg-amber-600/10 border-amber-500',
        desc: 'All features + AI + Custom Domain + White Label',
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
            toast.success(`Plan changed to ${tier.label}`);
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
            toast.success(isSuspended ? 'Account reactivated' : 'Account suspended');
            onUpdate();
        } catch {
            toast.error('Failed to update account status');
        } finally {
            setLoading(false);
        }
    };

    const extendTrial = async () => {
        setLoading(true);
        try {
            await api.post('/dev/tenant/trial', { organizationId: tenant.id, days: trialDays });
            toast.success(`Trial extended by ${trialDays} days`);
            onUpdate();
        } catch {
            toast.error('Failed to extend trial');
        } finally {
            setLoading(false);
        }
    };

    const grantBankAccess = async (plan: 'MONTHLY' | 'ANNUALLY') => {
        if (!bankRef) return toast.error('Payment reference is required');
        setLoading(true);
        try {
            await api.post('/dev/grant-bank-access', {
                organizationId: tenant.id,
                plan,
                paymentReference: bankRef,
                amount: bankAmount ? parseFloat(bankAmount) : undefined,
                notes: bankNotes,
            });
            toast.success(`Manual access granted — ${plan}`);
            setBankRef(''); setBankAmount(''); setBankNotes('');
            onUpdate();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to grant access');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Status */}
            <div className={cn(
                'flex items-center justify-between p-4 rounded-xl border',
                isSuspended ? 'bg-rose-500/5 border-rose-500/20' : 'bg-slate-800/50 border-slate-700'
            )}>
                <div className="flex items-center gap-3">
                    <div className={cn('w-2 h-2 rounded-full', isSuspended ? 'bg-rose-500' : tenant.billingStatus === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')} />
                    <div>
                        <p className="text-sm font-medium text-white">
                            {isSuspended ? 'Suspended' : tenant.billingStatus === 'ACTIVE' ? 'Active' : 'Trial'}
                            {' · '}{currentTier.label}
                        </p>
                        {trialDaysLeft !== null && !isSuspended && (
                            <p className="text-xs text-slate-400 mt-0.5">
                                <Clock size={10} className="inline mr-1" />
                                {trialDaysLeft} days remaining in trial
                            </p>
                        )}
                    </div>
                </div>
                <button
                    onClick={toggleSuspend}
                    disabled={loading}
                    className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                        isSuspended
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'border border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                    )}
                >
                    {isSuspended ? <><CheckCircle size={11} className="inline mr-1" />Reactivate</> : <><Ban size={11} className="inline mr-1" />Suspend</>}
                </button>
            </div>

            {/* Tier Selection */}
            <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Subscription Plan</p>
                <div className="grid grid-cols-2 gap-3">
                    {TIERS.map(tier => {
                        const isActive = tenant.subscriptionPlan === tier.id;
                        return (
                            <button
                                key={tier.id}
                                onClick={() => !isActive && applyTier(tier.id)}
                                disabled={loading || isActive}
                                className={cn(
                                    'p-4 rounded-xl border text-left transition-all relative',
                                    isActive
                                        ? `${tier.activeBg} cursor-default`
                                        : 'border-slate-700 bg-slate-800/30 hover:bg-slate-800 hover:border-slate-600'
                                )}
                            >
                                {isActive && (
                                    <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                )}
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <Zap size={12} className={isActive ? tier.color : 'text-slate-600'} />
                                    <span className={cn('text-sm font-semibold', isActive ? tier.color : 'text-slate-400')}>{tier.label}</span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">{tier.desc}</p>
                                <p className="text-xs text-slate-600 mt-1.5">{tier.modules} modules</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Trial Extension */}
            <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Extend Trial</p>
                <div className="flex gap-2">
                    {[7, 14, 30].map(d => (
                        <button
                            key={d}
                            onClick={() => setTrialDays(d)}
                            className={cn(
                                'flex-1 py-2 rounded-lg text-xs font-medium border transition-colors',
                                trialDays === d
                                    ? 'border-indigo-500 bg-indigo-600/10 text-indigo-400'
                                    : 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                            )}
                        >
                            +{d} days
                        </button>
                    ))}
                    <button
                        onClick={extendTrial}
                        disabled={loading}
                        className="flex-[2] flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                    >
                        <Calendar size={12} /> Apply Extension
                    </button>
                </div>
            </div>

            {/* Bank Transfer Override */}
            <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Manual Bank Transfer</p>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-slate-500 block mb-1.5">Payment Reference *</label>
                            <input
                                type="text"
                                placeholder="TXN-XXXXXXXX"
                                value={bankRef}
                                onChange={e => setBankRef(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder:text-slate-600 focus:border-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 block mb-1.5">Amount (GNF)</label>
                            <input
                                type="number"
                                placeholder="30000000"
                                value={bankAmount}
                                onChange={e => setBankAmount(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 block mb-1.5">Notes</label>
                        <input
                            type="text"
                            placeholder="e.g. Cash paid at office — confirmed"
                            value={bankNotes}
                            onChange={e => setBankNotes(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => grantBankAccess('MONTHLY')}
                            disabled={loading || !bankRef}
                            className="flex-1 py-2 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg text-xs font-medium transition-colors disabled:opacity-40"
                        >
                            Grant Monthly
                        </button>
                        <button
                            onClick={() => grantBankAccess('ANNUALLY')}
                            disabled={loading || !bankRef}
                            className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-40"
                        >
                            Grant Annual
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingControl;
