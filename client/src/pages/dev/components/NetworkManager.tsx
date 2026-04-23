import React, { useState } from 'react';
import { Globe, Link2, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '../../../utils/cn';
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
            toast.success('Routing Protocol Synchronized');
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
            subtitle="Software-Defined Networking & DNS Protocols" 
            icon={Globe}
            iconColor="text-blue-600"
        >
            <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Project Subdomain</label>
                        <div className="relative">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                                <Link2 size={16} />
                            </div>
                            <input 
                                type="text"
                                value={subdomain}
                                onChange={e => setSubdomain(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-24 text-sm font-black text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                                placeholder="tenant-slug"
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">.nexus</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Custom Domain Protocol</label>
                        <div className="relative">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                                <Globe size={16} />
                            </div>
                            <input 
                                type="text"
                                value={customDomain}
                                onChange={e => setCustomDomain(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-sm font-black text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                                placeholder="www.enterprise.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <div className="flex items-center gap-5">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                            status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-600 shadow-xl shadow-emerald-500/10' : 'bg-blue-100 text-blue-600 shadow-xl shadow-blue-500/10'
                        )}>
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Routing Status</div>
                            <div className="text-sm font-black text-slate-900 mt-0.5">{status}</div>
                        </div>
                    </div>
                    <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-5 py-2.5 text-[10px] font-black text-slate-900 outline-none shadow-sm hover:border-blue-500 transition-colors cursor-pointer"
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
                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                    {updating ? <Activity size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                    {updating ? 'Synchronizing DNS...' : 'Commit Network Changes'}
                </button>
            </div>
        </NocModule>
    );
};

export default NetworkManager;
