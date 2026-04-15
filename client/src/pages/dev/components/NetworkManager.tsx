import React, { useState } from 'react';
import { Globe, Link2, ShieldCheck, Activity } from 'lucide-react';
import api from '../../../services/api';
import { toast } from '../../../utils/toast';
import NocModule from './NocModule';

interface NetworkManagerProps {
    tenant: any;
    onUpdate: () => void;
}

const NetworkManager: React.FC<NetworkManagerProps> = ({ tenant, onUpdate }) => {
    const [subdomain, setSubdomain] = useState(tenant.subdomain || '');
    const [customDomain, setCustomDomain] = useState(tenant.customDomain || '');
    const [status, setStatus] = useState(tenant.domainStatus || 'PENDING');
    const [updating, setUpdating] = useState(false);

    const handleSave = async () => {
        setUpdating(true);
        try {
            await api.patch(`/dev/tenant/${tenant.id}/network`, {
                subdomain: subdomain.trim().toLowerCase() || null,
                customDomain: customDomain.trim().toLowerCase() || null,
                domainStatus: status
            });
            toast.success('Network configuration patched');
            onUpdate();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to update routing');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <NocModule 
            title="Infrastructure Routing" 
            subtitle="DNS & Domain Protocols" 
            icon={Globe}
            iconColor="text-sky-400"
        >
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Project Subdomain</label>
                        <div className="relative">
                            <Link2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" />
                            <input 
                                type="text"
                                value={subdomain}
                                onChange={e => setSubdomain(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs font-mono text-white focus:border-sky-500/50 outline-none transition-all"
                                placeholder="tenant-slug"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-700">.nexus-hrm.app</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Custom Domain</label>
                        <div className="relative">
                            <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" />
                            <input 
                                type="text"
                                value={customDomain}
                                onChange={e => setCustomDomain(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs font-mono text-white focus:border-sky-500/50 outline-none transition-all"
                                placeholder="www.company.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={16} className={status === 'VERIFIED' ? 'text-emerald-500' : 'text-amber-500'} />
                        <div>
                            <div className="text-[10px] font-black text-white uppercase tracking-widest">DNS Propagation Status</div>
                            <div className="text-[9px] text-slate-500 font-bold uppercase">{status}</div>
                        </div>
                    </div>
                    <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-[10px] font-black text-white outline-none"
                    >
                        <option value="PENDING">PENDING</option>
                        <option value="VERIFIED">VERIFIED</option>
                        <option value="ERROR">ERROR</option>
                        <option value="DISABLED">DISABLED</option>
                    </select>
                </div>

                <button 
                    onClick={handleSave}
                    disabled={updating}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {updating ? <Activity size={12} className="animate-spin" /> : 'Commit Network Changes'}
                </button>
            </div>
        </NocModule>
    );
};

export default NetworkManager;
