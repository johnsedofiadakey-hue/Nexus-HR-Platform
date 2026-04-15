import React, { useState, useEffect } from 'react';
import { toast } from '../../utils/toast';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldAlert, Activity, Zap, Download, 
    Search, ChevronRight, Settings, Database,
    Layout, UserCheck, Key, Copy, HardDrive,
    Terminal, Globe, CheckCircle2, AlertTriangle,
    CreditCard, Server, LogOut
} from 'lucide-react';
import { cn } from '../../utils/cn';

// NOC Components
import NocModule from './components/NocModule';
import NetworkManager from './components/NetworkManager';
import ProtocolSelector from './components/ProtocolSelector';
import AuditTerminal from './components/AuditTerminal';

const PlatformRevenueConfig = ({ initialStats, onUpdate }: any) => {
    const [monthly, setMonthly] = useState(initialStats?.monthlyPrice || 30000000);
    const [annual, setAnnual] = useState(initialStats?.annualPrice || 360000000);
    const [currency, setCurrency] = useState(initialStats?.currency || 'GNF');
    const [trials, setTrials] = useState(initialStats?.trialDays || 14);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.patch('/settings', {
                monthlyPrice: monthly,
                annualPrice: annual,
                currency,
                trialDays: trials,
            });
            toast.success('Revenue Engine Patched');
            onUpdate();
        } catch (error) { toast.error('Sync failed'); }
        finally { setLoading(false); }
    };

    return (
        <NocModule title="Revenue Infrastructure" subtitle="Global Transaction Engine" icon={CreditCard} iconColor="text-emerald-500">
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Currency</label>
                        <select className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                            <option value="GNF">GNF (Guinea)</option>
                            <option value="USD">USD ($)</option>
                            <option value="GHS">GHS (Ghana)</option>
                        </select>
                    </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Trial Config (Days)</label>
                        <input type="number" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none" value={trials} onChange={(e) => setTrials(Number(e.target.value))} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Monthly Cost</label>
                        <input type="number" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Annual Cost</label>
                        <input type="number" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none" value={annual} onChange={(e) => setAnnual(Number(e.target.value))} />
                    </div>
                </div>
                <button onClick={handleSave} disabled={loading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                    {loading ? 'Patching Engine...' : 'Sync Revenue Settings'}
                </button>
            </div>
        </NocModule>
    );
};

const GlobalOps = ({ settings, onUpdate }: any) => {
    const handleToggle = async (field: string, val: boolean) => {
        try {
            await api.put('/settings', { [field]: val });
            toast.success(`${field} Updated`);
            onUpdate();
        } catch (err) { toast.error('Toggle failed'); }
    };

    const handleBackup = async () => {
        try {
            const res = await api.post('/dev/backup');
            if (res.data.success) {
                toast.success(`Backup Success! Local: ${res.data.localFile}`);
            } else {
                toast.error('Backup completed with warnings');
            }
        } catch (err) { toast.error('Backup failed'); }
    };

    return (
        <NocModule title="Global System Locks" subtitle="Platform Killswitches" icon={ShieldAlert} iconColor="text-rose-500">
            <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                    <div>
                        <h4 className="text-sm font-black text-rose-500 uppercase tracking-tighter">Emergency Lockdown</h4>
                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Blocks all node traffic</p>
                    </div>
                    <button 
                        onClick={() => handleToggle('securityLockdown', !settings?.securityLockdown)}
                        className={cn("px-6 py-2 text-[10px] font-black uppercase rounded-xl transition-all", settings?.securityLockdown ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-400")}
                    >
                        {settings?.securityLockdown ? 'Engaged' : 'Standby'}
                    </button>
                </div>
                <div className="flex justify-between items-center p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                    <div>
                        <h4 className="text-sm font-black text-amber-500 uppercase tracking-tighter">Maintenance Pulse</h4>
                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Only NOC identities can bypass</p>
                    </div>
                    <button 
                        onClick={() => handleToggle('isMaintenanceMode', !settings?.isMaintenanceMode)}
                        className={cn("px-6 py-2 text-[10px] font-black uppercase rounded-xl transition-all", settings?.isMaintenanceMode ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-400")}
                    >
                        {settings?.isMaintenanceMode ? 'Engaged' : 'Standby'}
                    </button>
                </div>
                <button onClick={handleBackup} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <Database size={14} /> Trigger Manual Core Backup
                </button>
            </div>
        </NocModule>
    );
};

const NexusNocPortal = () => {
    const [stats, setStats] = useState<any>({ tenants: [], summary: {} });
    const [logs, setLogs] = useState<any[]>([]);
    const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
    const [tenantDetails, setTenantDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'tenants' | 'infrastructure' | 'audit'>('tenants');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [sRes, lRes] = await Promise.allSettled([api.get('/dev/stats'), api.get('/dev/logs')]);
            const sData = sRes.status === 'fulfilled' ? sRes.value.data : { tenants: [], summary: {} };
            setStats(sData);
            setLogs(lRes.status === 'fulfilled' ? lRes.value.data : []);

            if (sData.tenants?.length > 0 && !selectedTenantId) {
                handleTenantSelect(sData.tenants[0].id);
            }
        } catch (error) { console.error('Data pull failed'); }
        finally { setLoading(false); }
    };

    const handleTenantSelect = async (id: string) => {
        setSelectedTenantId(id);
        setTenantDetails(null);
        try {
            const res = await api.get(`/dev/tenant/${id}`);
            setTenantDetails(res.data);
        } catch (err) { toast.error('Node bridge failure'); }
    };

    const handleImpersonate = async (orgId: string) => {
        try {
            const res = await api.post('/auth/impersonate', { organizationId: orgId });
            localStorage.setItem('nexus_auth_token', res.data.token);
            toast.success('Impersonation Active');
            window.location.href = '/dashboard';
        } catch (error) { toast.error('Bridge failed'); }
    };

    const handleLogout = () => {
        localStorage.removeItem('nexus_auth_token');
        window.location.href = '/dev-login';
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617]">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Connecting to Nexus NOC Core...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200">
            {/* NOC Header */}
            <header className="sticky top-0 z-[100] bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 animate-pulse">
                        <Activity size={22} />
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-white tracking-tighter uppercase">Nexus Network Control Center</h1>
                        <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.3em] mt-0.5 font-mono">ENCRYPTED_LINK_ACTIVE</p>
                    </div>
                </div>

                <nav className="flex p-1 bg-black/40 rounded-xl border border-white/5">
                    {(['tenants', 'infrastructure', 'audit'] as const).map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-5 py-2 rounded-lg text-[9px] font-black uppercase transition-all",
                                activeTab === tab ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-500 hover:text-white"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-rose-500 transition-all">
                        <LogOut size={16} />
                    </button>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-500/10">System_Online</span>
                </div>
            </header>

            <main className="max-w-[1700px] mx-auto p-10">
                <AnimatePresence mode="wait">
                    {activeTab === 'tenants' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-10">
                            {/* Node Sidebar */}
                            <div className="w-80 space-y-4">
                                <div className="relative mb-6">
                                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                                    <input 
                                        type="text" 
                                        placeholder="Scan Network..." 
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-[10px] font-black text-white focus:border-emerald-500/50 transition-all outline-none"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1 max-h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar pr-2">
                                    {(stats?.tenants || []).filter((t: any) => t.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((ten: any) => (
                                        <button 
                                            key={ten.id} 
                                            onClick={() => handleTenantSelect(ten.id)}
                                            className={cn(
                                                "w-full p-4 rounded-2xl flex items-center justify-between border transition-all active:scale-[0.98] group relative overflow-hidden",
                                                selectedTenantId === ten.id ? "bg-emerald-500/10 border-emerald-500/30 text-white" : "bg-transparent border-transparent text-slate-500 hover:bg-white/5"
                                            )}
                                        >
                                            <div className="text-left relative z-10">
                                                <div className="text-[10px] font-black uppercase tracking-widest truncate max-w-[140px]">{ten.name}</div>
                                                <div className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-1">/{ten.subdomain || 'unset'}</div>
                                            </div>
                                            <div className="flex items-center gap-3 relative z-10">
                                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-40">{ten.subscriptionPlan}</span>
                                                <div className={cn("w-1.5 h-1.5 rounded-full", ten.isSuspended ? "bg-rose-500" : "bg-emerald-500")} />
                                            </div>
                                            {selectedTenantId === ten.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Command Center */}
                            <div className="flex-1 min-h-[700px]">
                                {tenantDetails ? (
                                    <div className="space-y-10">
                                        {/* Node Header */}
                                        <NocModule 
                                            title={tenantDetails.tenant.name} 
                                            subtitle={`Encrypted Node Identifier: ${tenantDetails.tenant.id}`} 
                                            icon={Server} 
                                            iconColor="text-emerald-400"
                                            headerAction={
                                                <div className="flex gap-3">
                                                    <button onClick={() => handleImpersonate(tenantDetails.tenant.id)} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                                                        <UserCheck size={14} /> Bridge to Node
                                                    </button>
                                                </div>
                                            }
                                        >
                                            <div className="grid grid-cols-4 gap-6">
                                                {[
                                                    { label: 'Network Route', val: `/${tenantDetails.tenant.subdomain || 'unset'}`, icon: Globe, color: 'text-sky-400' },
                                                    { label: 'Access Units', val: tenantDetails.tenant._count?.users || 0, icon: UserCheck, color: 'text-emerald-400' },
                                                    { label: 'Buffer Usage', val: `${tenantDetails.metrics?.ramUsage || 0} GB`, icon: Activity, color: 'text-rose-400' },
                                                    { label: 'Protocol Tier', val: tenantDetails.tenant.subscriptionPlan || 'FREE', icon: Zap, color: 'text-amber-400' }
                                                ].map((stat, i) => (
                                                    <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <stat.icon size={12} className={stat.color} />
                                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                                                        </div>
                                                        <div className="text-lg font-black text-white font-mono">{stat.val}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </NocModule>

                                        <div className="grid grid-cols-2 gap-10">
                                            <NetworkManager tenant={tenantDetails.tenant} onUpdate={() => handleTenantSelect(tenantDetails.tenant.id)} />
                                            <ProtocolSelector 
                                                tenant={tenantDetails.tenant} 
                                                onToggle={async (feature) => {
                                                    try {
                                                        const currentFeatures = JSON.parse(tenantDetails.tenant.features || '{}');
                                                        const enabled = !currentFeatures[feature];
                                                        await api.post('/dev/tenant/feature', { 
                                                            organizationId: tenantDetails.tenant.id, 
                                                            feature, 
                                                            enabled 
                                                        });
                                                        
                                                        const updatedFeatures = { ...currentFeatures, [feature]: enabled };
                                                        setTenantDetails({
                                                            ...tenantDetails,
                                                            tenant: { ...tenantDetails.tenant, features: JSON.stringify(updatedFeatures) }
                                                        });
                                                        toast.success(`Protocol ${feature} toggled`);
                                                    } catch (err) {
                                                        toast.error('Failed to update protocol');
                                                    }
                                                }} 
                                            />
                                        </div>

                                        <AuditTerminal tenantId={tenantDetails.tenant.id} />
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-800 border-2 border-dashed border-white/5 rounded-[4rem]">
                                        <Activity size={100} className="mb-8 opacity-[0.03]" />
                                        <p className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-700">Infrastructure Standby</p>
                                        <p className="text-[9px] uppercase tracking-widest text-slate-800 mt-2 font-black italic">Select Organization Node to Initiate Link</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'infrastructure' && (
                        <div className="grid grid-cols-2 gap-10">
                            <PlatformRevenueConfig initialStats={stats?.summary} onUpdate={fetchData} />
                            <GlobalOps settings={stats?.summary} onUpdate={fetchData} />
                        </div>
                    )}

                    {activeTab === 'audit' && (
                        <NocModule title="Global Operations Stream" subtitle="Cross-Node Telemetry" icon={Terminal} iconColor="text-sky-400">
                             <div className="w-full h-[600px] bg-black/60 rounded-2xl border border-white/5 p-4 font-mono text-[10px] overflow-y-auto custom-scrollbar">
                                <div className="space-y-2">
                                    {logs.map((log: any, i: number) => (
                                        <div key={i} className="flex gap-4 group">
                                            <span className="text-slate-700 shrink-0">[{new Date(log.createdAt).toLocaleString([], { hour12: false })}]</span>
                                            <span className="text-emerald-500 shrink-0">@{log.operatorEmail?.split('@')[0]}</span>
                                            <span className="text-slate-400 break-all">{log.details}</span>
                                        </div>
                                    ))}
                                    <div className="pt-2 animate-pulse text-emerald-500">_</div>
                                </div>
                            </div>
                        </NocModule>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default NexusNocPortal;
