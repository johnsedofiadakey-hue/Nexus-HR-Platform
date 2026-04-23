import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2, Users, CreditCard, BarChart3, Shield, Settings,
    Search, Plus, LogOut, ChevronRight, MoreHorizontal, Eye,
    EyeOff, Copy, CheckCircle, AlertCircle, Clock, Ban,
    RefreshCw, Database, Activity, Globe, Zap, Calendar,
    Terminal, TrendingUp, X, ArrowUpRight, ExternalLink
} from 'lucide-react';
import { cn } from '../../utils/cn';
import api from '../../services/api';
import { toast } from '../../utils/toast';
import BillingControl from './components/BillingControl';
import ProtocolSelector from './components/ProtocolSelector';
import NetworkManager from './components/NetworkManager';
import AuditTerminal from './components/AuditTerminal';

// ── Types ────────────────────────────────────────────────────────────────────
type NavSection = 'organizations' | 'revenue' | 'security' | 'audit';

// ── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, trend, color = 'blue' }: any) => {
    const colors: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-600/5',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-600/5',
        amber: 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-600/5',
        rose: 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-600/5',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-600/5',
    };
    return (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
            <div className="flex items-start justify-between mb-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
                <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6', colors[color])}>
                    <Icon size={16} />
                </div>
            </div>
            <p className="text-3xl font-black text-slate-900 tabular-nums tracking-tight">{value}</p>
            {trend && (
                <div className="flex items-center gap-1.5 mt-2">
                    <TrendingUp size={12} className="text-emerald-500" />
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">{trend}</p>
                </div>
            )}
        </div>
    );
};

// ── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status, suspended }: any) => {
    if (suspended) return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />Suspended
        </span>
    );
    if (status === 'ACTIVE') return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />Active
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />Trial
        </span>
    );
};

// ── Plan Badge ───────────────────────────────────────────────────────────────
const PlanBadge = ({ plan }: any) => {
    const styles: Record<string, string> = {
        ENTERPRISE: 'text-amber-600 bg-amber-50 border-amber-100',
        PRO: 'text-violet-600 bg-violet-50 border-violet-100',
        STARTER: 'text-sky-600 bg-sky-50 border-sky-100',
        FREE: 'text-slate-500 bg-slate-50 border-slate-100',
    };
    return (
        <span className={cn('px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border', styles[plan] || styles.FREE)}>
            {plan || 'FREE'}
        </span>
    );
};

// ── Revenue Config ────────────────────────────────────────────────────────────
const RevenueSection = ({ stats, onUpdate }: any) => {
    const [monthly, setMonthly] = useState(stats?.monthlyPrice || 30000000);
    const [annual, setAnnual] = useState(stats?.annualPrice || 360000000);
    const [currency, setCurrency] = useState(stats?.currency || 'GNF');
    const [trials, setTrials] = useState(stats?.trialDays || 14);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.patch('/settings', { monthlyPrice: monthly, annualPrice: annual, currency, trialDays: trials });
            toast.success('Settings saved');
            onUpdate();
        } catch { toast.error('Failed to save'); }
        finally { setSaving(false); }
    };

    return (
        <div className="grid grid-cols-2 gap-8">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 transition-transform hover:rotate-6">
                        <CreditCard size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Subscriptions</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Fiscal Configuration</p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2 px-1">Currency</label>
                            <select
                                value={currency}
                                onChange={e => setCurrency(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 transition-all outline-none"
                            >
                                <option value="GNF">GNF (Guinea)</option>
                                <option value="USD">USD ($)</option>
                                <option value="GHS">GHS (Ghana)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2 px-1">Trial Window (Days)</label>
                            <input type="number" value={trials}
                                onChange={e => setTrials(Number(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2 px-1">Monthly Subscription Cost</label>
                        <input type="number" value={monthly}
                            onChange={e => setMonthly(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 transition-all outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2 px-1">Annual Subscription Cost</label>
                        <input type="number" value={annual}
                            onChange={e => setAnnual(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 transition-all outline-none"
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
                    >
                        {saving ? 'Synchronizing...' : 'Save Pricing Matrix'}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">System Health</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-left group hover:bg-white hover:border-blue-100 transition-all">
                            <Database size={24} className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                            <p className="text-sm font-black text-slate-900 mb-1">Cold Backup</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Run Manual Storage Snapshot</p>
                        </button>
                        <button className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-left group hover:bg-white hover:border-amber-100 transition-all">
                            <Activity size={24} className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                            <p className="text-sm font-black text-slate-900 mb-1">Security Audit</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Trigger Vulnerability Scan</p>
                        </button>
                    </div>
                </div>
                
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full translate-x-10 -translate-y-10" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Network Status</h3>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xl font-black uppercase tracking-tight">Nexus Core v5.0 Active</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 opacity-60 uppercase tracking-widest">Global infrastructure synchronized across 12 regions</p>
                </div>
            </div>
        </div>
    );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
const AdminConsole = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<NavSection>('organizations');
    const [stats, setStats] = useState<any>({ tenants: [], summary: {} });
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
    const [tenantDetails, setTenantDetails] = useState<any>(null);
    const [detailTab, setDetailTab] = useState<'overview' | 'billing' | 'features' | 'network' | 'audit'>('overview');
    const [detailLoading, setDetailLoading] = useState(false);
    // Provision modal state
    const [showProvision, setShowProvision] = useState(false);
    const [provisionStep, setProvisionStep] = useState<'form' | 'success'>('form');
    const [provisioning, setProvisioning] = useState(false);
    const [provisionResult, setProvisionResult] = useState<any>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);
    const [newOrg, setNewOrg] = useState({
        companyName: '', subdomain: '', country: '',
        adminFullName: '', adminEmail: '', adminPassword: ''
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [sRes, lRes] = await Promise.allSettled([
                api.get('/dev/stats'),
                api.get('/dev/logs'),
            ]);
            if (sRes.status === 'fulfilled') setStats(sRes.value.data);
            if (lRes.status === 'fulfilled') setLogs(lRes.value.data);
        } catch (err) {
            console.error('Failed to fetch admin data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTenantSelect = async (id: string) => {
        setSelectedTenantId(id);
        setTenantDetails(null);
        setDetailTab('overview');
        setDetailLoading(true);
        try {
            const res = await api.get(`/dev/tenant/${id}`);
            setTenantDetails(res.data);
        } catch {
            toast.error('Failed to load organization details');
        } finally {
            setDetailLoading(false);
        }
    };

    const handleImpersonate = async (orgId: string) => {
        try {
            const res = await api.post('/auth/impersonate', { organizationId: orgId });
            localStorage.setItem('nexus_auth_token', res.data.token);
            toast.success('Logged in as client');
            window.location.href = '/dashboard';
        } catch { toast.error('Login failed'); }
    };

    const handleLogout = () => {
        localStorage.removeItem('nexus_auth_token');
        localStorage.removeItem('nexus_dev_key');
        window.location.href = '/vault';
    };

    const resetProvision = () => {
        setShowProvision(false);
        setProvisionStep('form');
        setProvisionResult(null);
        setNewOrg({ companyName: '', subdomain: '', country: '', adminFullName: '', adminEmail: '', adminPassword: '' });
    };

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleProvision = async () => {
        if (!newOrg.companyName) return toast.error('Company name is required');
        if (!newOrg.adminFullName) return toast.error('Admin full name is required');
        if (!newOrg.adminEmail) return toast.error('Admin email is required');
        setProvisioning(true);
        try {
            const res = await api.post('/dev/provision', newOrg);
            setProvisionResult(res.data);
            setProvisionStep('success');
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Provisioning failed');
        } finally {
            setProvisioning(false);
        }
    };

    const tenants = (stats?.tenants || []).filter((t: any) => t && (
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subdomain?.toLowerCase().includes(searchTerm.toLowerCase())
    ));

    const summary = stats?.summary || {};
    const totalActive = (stats?.tenants || []).filter((t: any) => t?.billingStatus === 'ACTIVE' && !t?.isSuspended).length;
    const totalTrial = (stats?.tenants || []).filter((t: any) => t?.billingStatus === 'FREE' && !t?.isSuspended).length;
    const totalSuspended = (stats?.tenants || []).filter((t: any) => t?.isSuspended).length;

    const navItems: { id: NavSection; label: string; icon: any }[] = [
        { id: 'organizations', label: 'Organizations', icon: Building2 },
        { id: 'revenue', label: 'Revenue & Pricing', icon: CreditCard },
        { id: 'security', label: 'System Control', icon: Shield },
        { id: 'audit', label: 'Audit Log', icon: Terminal },
    ];

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="text-center">
                <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Initializing Core...</p>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-white overflow-hidden text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-50 border-r border-slate-100 flex flex-col flex-shrink-0">
                {/* Brand */}
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <Shield size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tight">Nexus Master</p>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">Control Center</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveSection(id)}
                            className={cn(
                                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-left group',
                                activeSection === id
                                    ? 'bg-white text-blue-600 font-black shadow-xl shadow-blue-600/5 border border-blue-100'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                            )}
                        >
                            <Icon size={16} className={cn('transition-colors', activeSection === id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600')} />
                            <span className="tracking-tight">{label}</span>
                        </button>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 space-y-2">
                    <button
                        onClick={() => navigate('/nexus-master-console/tenants')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
                    >
                        <ExternalLink size={14} />Classic List
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                    >
                        <LogOut size={14} />Terminate
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/30">
                {/* Top Bar */}
                <header className="flex-shrink-0 border-b border-slate-100 px-10 py-5 flex items-center justify-between bg-white/80 backdrop-blur-xl">
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                            {navItems.find(n => n.id === activeSection)?.label}
                        </h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                            {summary.orgCount ?? 0} Global Tenants  /  {summary.userCount ?? 0} Synchronized Users
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <motion.button 
                            whileHover={{ rotate: 180 }}
                            onClick={fetchData} 
                            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                            <RefreshCw size={16} />
                        </motion.button>
                        <div className="flex items-center gap-3 pr-2">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-900 uppercase">Master Admin</p>
                                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Protocol Active</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                                <Users size={16} className="text-slate-600" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto custom-scrollbar">
                    {/* ORGANIZATIONS SECTION */}
                    {activeSection === 'organizations' && (
                        <div className="flex h-full">
                            {/* Left Panel */}
                            <div className="w-96 flex-shrink-0 border-r border-slate-100 flex flex-col bg-white">
                                <div className="p-6 space-y-6">
                                    {/* Stats row */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: 'Sites', value: stats?.tenants?.length ?? 0, color: 'text-slate-900' },
                                            { label: 'Active', value: totalActive, color: 'text-emerald-600' },
                                            { label: 'Trial', value: totalTrial, color: 'text-blue-600' },
                                        ].map(s => (
                                            <div key={s.label} className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                                <p className={cn('text-xl font-black', s.color)}>{s.value}</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Search & Add */}
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search organizations..."
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 transition-all outline-none"
                                            />
                                        </div>
                                        <button
                                            onClick={() => setShowProvision(true)}
                                            className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
                                        >
                                            <Plus size={16} /> Add Organization
                                        </button>
                                    </div>
                                </div>

                                {/* Tenant List */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar border-t border-slate-50">
                                    {tenants.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-64 text-slate-300">
                                            <Building2 size={40} className="mb-4 opacity-20" />
                                            <p className="text-xs font-black uppercase tracking-widest">No Signals Found</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-50">
                                            {tenants.map((t: any) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => handleTenantSelect(t.id)}
                                                    className={cn(
                                                        'w-full text-left px-6 py-5 hover:bg-slate-50 transition-all group relative overflow-hidden',
                                                        selectedTenantId === t.id ? 'bg-blue-50/50' : ''
                                                    )}
                                                >
                                                    {selectedTenantId === t.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />}
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0 flex-1">
                                                            <p className={cn("text-sm font-black transition-colors truncate", selectedTenantId === t.id ? 'text-blue-700' : 'text-slate-900')}>{t.name || 'Unnamed Organization'}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                                                                <Globe size={10} /> {t.subdomain ? `${t.subdomain}.nexus-hr.com` : 'Base Routing'}
                                                            </p>
                                                        </div>
                                                        <ChevronRight size={14} className={cn("mt-1 transition-all", selectedTenantId === t.id ? 'text-blue-600 translate-x-1' : 'text-slate-300 opacity-0 group-hover:opacity-100')} />
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-4">
                                                        <StatusBadge status={t.billingStatus} suspended={t.isSuspended} />
                                                        <PlanBadge plan={t.subscriptionPlan} />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Detail Panel */}
                            <div className="flex-1 overflow-y-auto bg-slate-50/30 custom-scrollbar">
                                {detailLoading ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-4">
                                        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Details...</p>
                                    </div>
                                ) : tenantDetails ? (
                                    <div className="p-8">
                                        {/* Detail Header Wrapper */}
                                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden mb-8">
                                            <div className="px-10 py-8 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-4 mb-2">
                                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{tenantDetails.tenant.name}</h2>
                                                        <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black border border-blue-100 uppercase tracking-widest">
                                                            Internal ID: {tenantDetails.tenant.id.slice(0, 8)}...
                                                        </div>
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                                        <Calendar size={14} className="text-slate-300" /> Joined Platform on {new Date(tenantDetails.tenant.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => handleImpersonate(tenantDetails.tenant.id)}
                                                        className="flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200"
                                                    >
                                                        <ExternalLink size={16} /> Impersonate Proxy
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (window.confirm(`NUCLEAR OPTION: Are you sure you want to PERMANENTLY ERASE "${tenantDetails.tenant.name}"? All users, payroll data, and configuration will be destroyed.`)) {
                                                                try {
                                                                    await api.delete(`/dev/tenant/${tenantDetails.tenant.id}`);
                                                                    toast.success('Organization erased from cluster');
                                                                    setSelectedTenantId(null);
                                                                    setTenantDetails(null);
                                                                    fetchData();
                                                                } catch (err: any) {
                                                                    toast.error(err.response?.data?.error || 'Erasure failed');
                                                                }
                                                            }
                                                        }}
                                                        className="w-14 h-14 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-100 rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-rose-200/20 group"
                                                        title="Hard Delete"
                                                    >
                                                        <Ban size={20} className="group-hover:rotate-12 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Sub-tabs */}
                                            <div className="px-10 py-5 bg-white flex gap-1 border-b border-slate-50">
                                                {(['overview', 'billing', 'features', 'network', 'audit'] as const).map(tab => (
                                                    <button
                                                        key={tab}
                                                        onClick={() => setDetailTab(tab)}
                                                        className={cn(
                                                            'px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
                                                            detailTab === tab
                                                                ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100'
                                                                : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'
                                                        )}
                                                    >
                                                        {tab}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Tab Content */}
                                            <div className="p-10">
                                                {detailTab === 'overview' && (
                                                    <div className="space-y-10">
                                                        {/* Lively Stats */}
                                                        <div className="grid grid-cols-4 gap-6">
                                                            <StatCard label="Total Users" value={tenantDetails.tenant._count?.users ?? 0} icon={Users} color="indigo" />
                                                            <StatCard label="Plan Level" value={tenantDetails.tenant.subscriptionPlan || 'FREE'} icon={Zap} color="amber" />
                                                            <StatCard label="Active Nodes" value={tenantDetails.metrics?.activeUsers ?? 0} icon={Activity} color="emerald" />
                                                            <StatCard label="Data Pool" value={`${tenantDetails.metrics?.storageUsed ?? 0} MB`} icon={Database} color="indigo" />
                                                        </div>

                                                        {/* Details Grid */}
                                                        <div className="grid grid-cols-2 gap-10">
                                                            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100">
                                                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Nexus Profile</h3>
                                                                <div className="space-y-6">
                                                                    {[
                                                                        { label: 'Entity Name', value: tenantDetails.tenant.name },
                                                                        { label: 'Admin Matrix', value: tenantDetails.tenant.email || '—' },
                                                                        { label: 'Primary Routing', value: tenantDetails.tenant.subdomain ? `${tenantDetails.tenant.subdomain}.nexus-hr.com` : 'Global Hub' },
                                                                        { label: 'Operational Sync', value: tenantDetails.tenant.domainStatus },
                                                                    ].map(({ label, value }) => (
                                                                        <div key={label}>
                                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
                                                                            <p className="text-sm font-black text-slate-900">{value}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100">
                                                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Fiscal Configuration</h3>
                                                                <div className="space-y-6">
                                                                    {[
                                                                        { label: 'Jurisdiction', value: tenantDetails.tenant.country || 'International' },
                                                                        { label: 'Base Currency', value: tenantDetails.tenant.currency },
                                                                        { label: 'Trial Expiry', value: tenantDetails.tenant.trialEndsAt ? new Date(tenantDetails.tenant.trialEndsAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Infinite' },
                                                                        { label: 'Billing Health', value: tenantDetails.tenant.billingStatus },
                                                                    ].map(({ label, value }) => (
                                                                        <div key={label}>
                                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
                                                                            <p className="text-sm font-black text-slate-900">{value}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Activity Trace */}
                                                        {tenantDetails.recentEvents?.length > 0 && (
                                                            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                                                                <h3 className="text-xs font-black font-display text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Security Access History
                                                                </h3>
                                                                <div className="space-y-3">
                                                                    {tenantDetails.recentEvents.slice(0, 5).map((ev: any, i: number) => (
                                                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 group hover:bg-white hover:border-blue-100 hover:shadow-lg hover:shadow-blue-600/5 transition-all">
                                                                            <div className="flex items-center gap-4">
                                                                                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center border', ev.success ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100')}>
                                                                                    <Shield size={16} />
                                                                                </div>
                                                                                <div>
                                                                                    <span className="text-sm font-black text-slate-900">{ev.email}</span>
                                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{ev.success ? 'Authorization Granted' : 'Access Denied'}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <span className="text-[10px] font-black text-slate-400 uppercase tabular-nums">{new Date(ev.createdAt).toLocaleString()}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {detailTab === 'billing' && (
                                                    <BillingControl
                                                        tenant={tenantDetails.tenant}
                                                        onUpdate={() => handleTenantSelect(tenantDetails.tenant.id)}
                                                    />
                                                )}

                                                {detailTab === 'features' && (
                                                    <ProtocolSelector
                                                        tenant={tenantDetails.tenant}
                                                        onToggle={async (feature) => {
                                                            try {
                                                                const currentFeatures = JSON.parse(tenantDetails.tenant.features || '{}');
                                                                const enabled = !currentFeatures[feature];
                                                                await api.post('/dev/tenant/feature', {
                                                                    organizationId: tenantDetails.tenant.id,
                                                                    feature, enabled
                                                                });
                                                                const updatedFeatures = { ...currentFeatures, [feature]: enabled };
                                                                setTenantDetails({
                                                                    ...tenantDetails,
                                                                    tenant: { ...tenantDetails.tenant, features: JSON.stringify(updatedFeatures) }
                                                                });
                                                                toast.success(`${feature} Protocol Updated`);
                                                            } catch { toast.error('Feature Link Failed'); }
                                                        }}
                                                    />
                                                )}

                                                {detailTab === 'network' && (
                                                    <NetworkManager
                                                        tenant={tenantDetails.tenant}
                                                        onUpdate={() => handleTenantSelect(tenantDetails.tenant.id)}
                                                    />
                                                )}

                                                {detailTab === 'audit' && (
                                                    <AuditTerminal tenantId={tenantDetails.tenant.id} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-300">
                                        <div className="w-24 h-24 rounded-[3rem] bg-white shadow-2xl shadow-slate-200 border border-slate-100 flex items-center justify-center mb-8">
                                            <Building2 size={48} className="opacity-10 text-slate-900" />
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Select Entity Proxy to Sync</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* REVENUE SECTION */}
                    {activeSection === 'revenue' && (
                        <div className="p-10 space-y-10">
                            <div className="grid grid-cols-4 gap-6">
                                <StatCard label="Global Tenants" value={summary.orgCount ?? 0} icon={Building2} color="indigo" />
                                <StatCard label="Active Users" value={summary.userCount ?? 0} icon={Users} color="emerald" />
                                <StatCard label="Live Trials" value={totalTrial} icon={Clock} color="amber" />
                                <StatCard label="Archived" value={totalSuspended} icon={Ban} color="rose" />
                            </div>
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-10">
                                <RevenueSection stats={summary} onUpdate={fetchData} />
                            </div>
                        </div>
                    )}

                    {/* SYSTEM SECTION */}
                    {activeSection === 'security' && (
                        <div className="p-10">
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-10">
                                <RevenueSection stats={summary} onUpdate={fetchData} />
                            </div>
                        </div>
                    )}

                    {/* AUDIT SECTION */}
                    {activeSection === 'audit' && (
                        <div className="p-10">
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                                <div className="px-10 py-8 border-b border-slate-100">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">System Integrity Log</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Tracing all administrative operations across the master cluster</p>
                                </div>
                                <div className="divide-y divide-slate-50 max-h-[700px] overflow-y-auto custom-scrollbar">
                                    {logs.length === 0 ? (
                                        <div className="flex items-center justify-center p-20 text-slate-300 font-black uppercase text-xs tracking-widest">No Trace Data Available</div>
                                    ) : logs.map((log: any, i: number) => (
                                        <div key={i} className="px-10 py-5 flex items-center gap-6 hover:bg-slate-50 transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0 border border-slate-200 group-hover:text-blue-600 transition-colors">
                                                <Terminal size={14} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors capitalize">{log?.action || log?.type || 'System Event'}</p>
                                                <p className="text-xs font-medium text-slate-500 truncate mt-0.5">{log?.details || log?.message || 'Executing background protocol...'}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-[10px] font-black text-slate-900 uppercase">{log?.operatorEmail?.split('@')[0] || 'system'}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1 tabular-nums">{log?.createdAt ? new Date(log.createdAt).toLocaleString() : 'Recent'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Provision Modal */}
            <AnimatePresence>
                {showProvision && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                            onClick={provisionStep === 'form' ? resetProvision : undefined}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-xl bg-white border border-slate-100 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] overflow-hidden"
                        >
                            {provisionStep === 'form' ? (
                                <div className="p-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                                                <Plus size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Provision Proxy</h2>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Initiating New Organization Sub-Cluster</p>
                                            </div>
                                        </div>
                                        <button onClick={resetProvision} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Physical Signal</p>
                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2 ml-1">Entity Name *</label>
                                                    <input type="text" placeholder="Nexus International Ltd"
                                                        value={newOrg.companyName}
                                                        onChange={e => setNewOrg(p => ({ ...p, companyName: e.target.value }))}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 transition-all outline-none"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2 ml-1">Cluster Subdomain</label>
                                                        <div className="relative">
                                                            <input type="text" placeholder="nexus-int"
                                                                value={newOrg.subdomain}
                                                                onChange={e => setNewOrg(p => ({ ...p, subdomain: e.target.value }))}
                                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 pr-16 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 transition-all outline-none"
                                                            />
                                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">.nexus</div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2 ml-1">Jurisdiction</label>
                                                        <input type="text" placeholder="Switzerland"
                                                            value={newOrg.country}
                                                            onChange={e => setNewOrg(p => ({ ...p, country: e.target.value }))}
                                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 transition-all outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Root Administrator (MD)</p>
                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2 ml-1">Identity Full Name *</label>
                                                    <input type="text" placeholder="Arthur Morgan"
                                                        value={newOrg.adminFullName}
                                                        onChange={e => setNewOrg(p => ({ ...p, adminFullName: e.target.value }))}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 transition-all outline-none"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-1 px-1">Email *</label>
                                                        <input type="email" placeholder="admin@nexus.io"
                                                            value={newOrg.adminEmail}
                                                            onChange={e => setNewOrg(p => ({ ...p, adminEmail: e.target.value }))}
                                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 transition-all outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-1 px-1">Access Key</label>
                                                        <div className="relative">
                                                            <input
                                                                type={showPassword ? 'text' : 'password'}
                                                                placeholder="Auto-generated if empty"
                                                                value={newOrg.adminPassword}
                                                                onChange={e => setNewOrg(p => ({ ...p, adminPassword: e.target.value }))}
                                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 transition-all outline-none"
                                                            />
                                                            <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors">
                                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-10 flex gap-4">
                                        <button onClick={resetProvision} className="flex-1 py-5 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all">Cancel</button>
                                        <button 
                                            onClick={handleProvision}
                                            disabled={provisioning}
                                            className="flex-[2] py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                        >
                                            {provisioning ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                                            {provisioning ? 'Initializing Sub-Cluster...' : 'Provision Enterprise Proxy'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-xl shadow-emerald-500/5">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-3">Sync Established</h2>
                                    <p className="text-sm font-medium text-slate-500 mb-10 px-10">Root credentials generated for <span className="text-slate-900 font-black">{provisionResult.organization.name}</span>.</p>

                                    <div className="space-y-4 mb-10 text-left">
                                        {[
                                            { label: 'Entity Access Matrix (Email)', value: provisionResult.credentials.email, key: 'email' },
                                            { label: 'Secure Root Key (Password)', value: provisionResult.credentials.password, key: 'pass' }
                                        ].map((cred, i) => (
                                            <div key={i} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 relative">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{cred.label}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-black text-slate-900 font-mono">{cred.key === 'pass' && !showPassword ? '••••••••••••' : cred.value}</span>
                                                    <div className="flex gap-2">
                                                        {cred.key === 'pass' && (
                                                            <button onClick={() => setShowPassword(!showPassword)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 shadow-sm transition-all">
                                                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => handleCopy(cred.value, cred.key)}
                                                            className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 shadow-sm hover:shadow-lg transition-all"
                                                        >
                                                            {copied === cred.key ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button onClick={() => window.open('/login', '_blank')} className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all active:scale-[0.98]">Launch Enterprise Portal</button>
                                        <button onClick={resetProvision} className="py-3 text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Return to Console</button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminConsole;
