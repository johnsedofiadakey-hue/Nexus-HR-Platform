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
const StatCard = ({ label, value, icon: Icon, trend, color = 'indigo' }: any) => {
    const colors: Record<string, string> = {
        indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    };
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
                <div className={cn('p-1.5 rounded-lg border', colors[color])}>
                    <Icon size={14} />
                </div>
            </div>
            <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
            {trend && <p className="text-xs text-slate-500 mt-1">{trend}</p>}
        </div>
    );
};

// ── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status, suspended }: any) => {
    if (suspended) return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />Suspended
        </span>
    );
    if (status === 'ACTIVE') return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Active
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Trial
        </span>
    );
};

// ── Plan Badge ───────────────────────────────────────────────────────────────
const PlanBadge = ({ plan }: any) => {
    const styles: Record<string, string> = {
        ENTERPRISE: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        PRO: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
        STARTER: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
        FREE: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    };
    return (
        <span className={cn('px-2 py-0.5 rounded text-xs font-semibold border', styles[plan] || styles.FREE)}>
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

    const handleToggle = async (field: string, val: boolean) => {
        try {
            await api.put('/settings', { [field]: val });
            toast.success('Updated');
            onUpdate();
        } catch { toast.error('Update failed'); }
    };

    const handleBackup = async () => {
        try {
            await api.post('/dev/backup');
            toast.success('Backup completed');
        } catch { toast.error('Backup failed'); }
    };

    return (
        <div className="grid grid-cols-2 gap-6">
            {/* Pricing */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-white mb-1">Subscription Pricing</h3>
                <p className="text-xs text-slate-500 mb-6">Global pricing applied to all new subscriptions</p>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-slate-400 block mb-1.5">Currency</label>
                            <select
                                value={currency}
                                onChange={e => setCurrency(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                            >
                                <option value="GNF">GNF (Guinea)</option>
                                <option value="USD">USD ($)</option>
                                <option value="GHS">GHS (Ghana)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-400 block mb-1.5">Trial Days</label>
                            <input type="number" value={trials}
                                onChange={e => setTrials(Number(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-400 block mb-1.5">Monthly Price</label>
                        <input type="number" value={monthly}
                            onChange={e => setMonthly(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-400 block mb-1.5">Annual Price</label>
                        <input type="number" value={annual}
                            onChange={e => setAnnual(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <button onClick={handleSave} disabled={saving}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Pricing'}
                    </button>
                </div>
            </div>

            {/* System Controls */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-white mb-1">System Controls</h3>
                <p className="text-xs text-slate-500 mb-6">Platform-wide switches and operations</p>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-white">Maintenance Mode</p>
                            <p className="text-xs text-slate-400">Blocks access for all non-admin users</p>
                        </div>
                        <button
                            onClick={() => handleToggle('isMaintenanceMode', !stats?.isMaintenanceMode)}
                            className={cn(
                                'px-4 py-1.5 rounded-lg text-xs font-medium transition-colors',
                                stats?.isMaintenanceMode
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                            )}
                        >
                            {stats?.isMaintenanceMode ? 'ON' : 'OFF'}
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-white">Security Lockdown</p>
                            <p className="text-xs text-slate-400">Emergency access block — all logins frozen</p>
                        </div>
                        <button
                            onClick={() => handleToggle('securityLockdown', !stats?.securityLockdown)}
                            className={cn(
                                'px-4 py-1.5 rounded-lg text-xs font-medium transition-colors',
                                stats?.securityLockdown
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                            )}
                        >
                            {stats?.securityLockdown ? 'ENGAGED' : 'OFF'}
                        </button>
                    </div>
                    <button
                        onClick={handleBackup}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Database size={14} /> Run Manual Backup
                    </button>
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

    const tenants = (stats?.tenants || []).filter((t: any) =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subdomain?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const summary = stats?.summary || {};
    const totalActive = (stats?.tenants || []).filter((t: any) => t.billingStatus === 'ACTIVE' && !t.isSuspended).length;
    const totalTrial = (stats?.tenants || []).filter((t: any) => t.billingStatus === 'FREE' && !t.isSuspended).length;
    const totalSuspended = (stats?.tenants || []).filter((t: any) => t.isSuspended).length;

    const navItems: { id: NavSection; label: string; icon: any }[] = [
        { id: 'organizations', label: 'Organizations', icon: Building2 },
        { id: 'revenue', label: 'Revenue & Pricing', icon: CreditCard },
        { id: 'security', label: 'System', icon: Shield },
        { id: 'audit', label: 'Audit Log', icon: Terminal },
    ];

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-[#0F172A]">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-400">Loading console...</p>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#0F172A] overflow-hidden">
            {/* Sidebar */}
            <aside className="w-60 bg-[#0D1526] border-r border-slate-800 flex flex-col flex-shrink-0">
                {/* Brand */}
                <div className="p-5 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Shield size={15} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white leading-tight">Nexus Admin</p>
                            <p className="text-[10px] text-slate-500">Master Console</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-0.5">
                    {navItems.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveSection(id)}
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left',
                                activeSection === id
                                    ? 'bg-indigo-600 text-white font-medium'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            )}
                        >
                            <Icon size={15} />
                            {label}
                        </button>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-3 border-t border-slate-800 space-y-2">
                    <button
                        onClick={() => navigate('/nexus-master-console/tenants')}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                        <ExternalLink size={14} />Classic View
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-colors"
                    >
                        <LogOut size={14} />Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="flex-shrink-0 border-b border-slate-800 px-8 py-4 flex items-center justify-between bg-[#0F172A]">
                    <div>
                        <h1 className="text-base font-semibold text-white">
                            {navItems.find(n => n.id === activeSection)?.label}
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {summary.orgCount ?? 0} organizations · {summary.userCount ?? 0} total users
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={fetchData} className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
                            <RefreshCw size={14} />
                        </button>
                        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            System online
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto">
                    {/* ORGANIZATIONS SECTION */}
                    {activeSection === 'organizations' && (
                        <div className="flex h-full">
                            {/* Left Panel */}
                            <div className="w-80 flex-shrink-0 border-r border-slate-800 flex flex-col">
                                <div className="p-4 border-b border-slate-800 space-y-3">
                                    {/* Stats row */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { label: 'Total', value: stats?.tenants?.length ?? 0, color: 'text-white' },
                                            { label: 'Active', value: totalActive, color: 'text-emerald-400' },
                                            { label: 'Trial', value: totalTrial, color: 'text-amber-400' },
                                        ].map(s => (
                                            <div key={s.label} className="text-center p-2 bg-slate-800/50 rounded-lg">
                                                <p className={cn('text-lg font-bold', s.color)}>{s.value}</p>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wide">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Search */}
                                    <div className="relative">
                                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="text"
                                            placeholder="Search organizations..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                    {/* Add button */}
                                    <button
                                        onClick={() => setShowProvision(true)}
                                        className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <Plus size={14} /> Add Organization
                                    </button>
                                </div>

                                {/* Tenant List */}
                                <div className="flex-1 overflow-y-auto">
                                    {tenants.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-40 text-slate-600">
                                            <Building2 size={28} className="mb-2 opacity-40" />
                                            <p className="text-sm">No organizations found</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-800">
                                            {tenants.map((t: any) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => handleTenantSelect(t.id)}
                                                    className={cn(
                                                        'w-full text-left px-4 py-3.5 hover:bg-slate-800/50 transition-colors group',
                                                        selectedTenantId === t.id ? 'bg-slate-800 border-l-2 border-indigo-500' : 'border-l-2 border-transparent'
                                                    )}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-white truncate">{t.name}</p>
                                                            <p className="text-xs text-slate-500 mt-0.5">
                                                                {t.subdomain ? `/${t.subdomain}` : 'No subdomain'}
                                                            </p>
                                                        </div>
                                                        <ChevronRight size={14} className="text-slate-600 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2">
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
                            <div className="flex-1 overflow-y-auto">
                                {detailLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : tenantDetails ? (
                                    <div>
                                        {/* Detail Header */}
                                        <div className="sticky top-0 z-10 bg-[#0F172A] border-b border-slate-800 px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-base font-semibold text-white">{tenantDetails.tenant.name}</h2>
                                                    <p className="text-xs text-slate-400 mt-0.5 font-mono">{tenantDetails.tenant.id}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleImpersonate(tenantDetails.tenant.id)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        <ArrowUpRight size={14} /> Login as Client
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Sub-tabs */}
                                            <div className="flex gap-1 mt-4">
                                                {(['overview', 'billing', 'features', 'network', 'audit'] as const).map(tab => (
                                                    <button
                                                        key={tab}
                                                        onClick={() => setDetailTab(tab)}
                                                        className={cn(
                                                            'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors',
                                                            detailTab === tab
                                                                ? 'bg-slate-700 text-white'
                                                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                                        )}
                                                    >
                                                        {tab}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Tab Content */}
                                        <div className="p-6">
                                            {detailTab === 'overview' && (
                                                <div className="space-y-6">
                                                    {/* Key metrics */}
                                                    <div className="grid grid-cols-4 gap-4">
                                                        <StatCard label="Users" value={tenantDetails.tenant._count?.users ?? 0} icon={Users} color="indigo" />
                                                        <StatCard label="Plan" value={tenantDetails.tenant.subscriptionPlan || 'FREE'} icon={Zap} color="amber" />
                                                        <StatCard label="Status" value={tenantDetails.tenant.isSuspended ? 'Suspended' : tenantDetails.tenant.billingStatus} icon={Activity} color={tenantDetails.tenant.isSuspended ? 'rose' : 'emerald'} />
                                                        <StatCard label="Storage" value={`${tenantDetails.metrics?.storageUsed ?? 0} MB`} icon={Database} color="indigo" />
                                                    </div>

                                                    {/* Info grid */}
                                                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                                        <h3 className="text-sm font-semibold text-white mb-4">Organization Details</h3>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            {[
                                                                { label: 'Name', value: tenantDetails.tenant.name },
                                                                { label: 'Email', value: tenantDetails.tenant.email || '—' },
                                                                { label: 'Subdomain', value: tenantDetails.tenant.subdomain || '—' },
                                                                { label: 'Domain Status', value: tenantDetails.tenant.domainStatus },
                                                                { label: 'Country', value: tenantDetails.tenant.country || '—' },
                                                                { label: 'Currency', value: tenantDetails.tenant.currency },
                                                                { label: 'Trial Ends', value: tenantDetails.tenant.trialEndsAt ? new Date(tenantDetails.tenant.trialEndsAt).toLocaleDateString() : '—' },
                                                                { label: 'Created', value: new Date(tenantDetails.tenant.createdAt).toLocaleDateString() },
                                                            ].map(({ label, value }) => (
                                                                <div key={label}>
                                                                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">{label}</p>
                                                                    <p className="text-sm text-white">{value}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Recent events */}
                                                    {tenantDetails.recentEvents?.length > 0 && (
                                                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                                            <h3 className="text-sm font-semibold text-white mb-4">Recent Login Activity</h3>
                                                            <div className="space-y-2">
                                                                {tenantDetails.recentEvents.slice(0, 5).map((ev: any, i: number) => (
                                                                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className={cn('w-1.5 h-1.5 rounded-full', ev.success ? 'bg-emerald-500' : 'bg-rose-500')} />
                                                                            <span className="text-sm text-slate-300">{ev.email}</span>
                                                                        </div>
                                                                        <span className="text-xs text-slate-500">{new Date(ev.createdAt).toLocaleString()}</span>
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
                                                            toast.success(`${feature} toggled`);
                                                        } catch { toast.error('Failed to update feature'); }
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
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-600">
                                        <Building2 size={48} className="mb-4 opacity-20" />
                                        <p className="text-sm font-medium">Select an organization to view details</p>
                                        <p className="text-xs mt-1">Choose from the list on the left</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* REVENUE SECTION */}
                    {activeSection === 'revenue' && (
                        <div className="p-8">
                            <div className="grid grid-cols-4 gap-4 mb-8">
                                <StatCard label="Total Orgs" value={summary.orgCount ?? 0} icon={Building2} color="indigo" />
                                <StatCard label="Total Users" value={summary.userCount ?? 0} icon={Users} color="emerald" />
                                <StatCard label="On Trial" value={totalTrial} icon={Clock} color="amber" />
                                <StatCard label="Suspended" value={totalSuspended} icon={Ban} color="rose" />
                            </div>
                            <RevenueSection stats={summary} onUpdate={fetchData} />
                        </div>
                    )}

                    {/* SYSTEM SECTION */}
                    {activeSection === 'security' && (
                        <div className="p-8">
                            <RevenueSection stats={summary} onUpdate={fetchData} />
                        </div>
                    )}

                    {/* AUDIT SECTION */}
                    {activeSection === 'audit' && (
                        <div className="p-8">
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-700">
                                    <h3 className="text-sm font-semibold text-white">System Audit Log</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">All administrative actions across the platform</p>
                                </div>
                                <div className="divide-y divide-slate-700/50 max-h-[600px] overflow-y-auto">
                                    {logs.length === 0 ? (
                                        <div className="flex items-center justify-center h-32 text-slate-500 text-sm">No logs available</div>
                                    ) : logs.map((log: any, i: number) => (
                                        <div key={i} className="px-6 py-3 flex items-center gap-4 hover:bg-slate-800/30">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white font-medium">{log.action || log.type}</p>
                                                <p className="text-xs text-slate-400 truncate">{log.details || log.message}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-xs text-slate-500">{log.operatorEmail || 'system'}</p>
                                                <p className="text-xs text-slate-600">{new Date(log.createdAt).toLocaleString()}</p>
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
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={provisionStep === 'form' ? resetProvision : undefined}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-lg bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {provisionStep === 'form' ? (
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-lg font-semibold text-white">Add Organization</h2>
                                            <p className="text-sm text-slate-400 mt-0.5">Create an organization with an admin account</p>
                                        </div>
                                        <button onClick={resetProvision} className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg">
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className="space-y-5">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Organization</p>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-xs text-slate-400 block mb-1.5">Company Name *</label>
                                                    <input type="text" placeholder="e.g. Acme Corp"
                                                        value={newOrg.companyName}
                                                        onChange={e => setNewOrg(p => ({ ...p, companyName: e.target.value }))}
                                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs text-slate-400 block mb-1.5">Subdomain</label>
                                                        <input type="text" placeholder="acme"
                                                            value={newOrg.subdomain}
                                                            onChange={e => setNewOrg(p => ({ ...p, subdomain: e.target.value }))}
                                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-slate-400 block mb-1.5">Country</label>
                                                        <input type="text" placeholder="Guinea"
                                                            value={newOrg.country}
                                                            onChange={e => setNewOrg(p => ({ ...p, country: e.target.value }))}
                                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Admin Account (Managing Director)</p>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-xs text-slate-400 block mb-1.5">Full Name *</label>
                                                    <input type="text" placeholder="John Doe"
                                                        value={newOrg.adminFullName}
                                                        onChange={e => setNewOrg(p => ({ ...p, adminFullName: e.target.value }))}
                                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs text-slate-400 block mb-1.5">Email *</label>
                                                        <input type="email" placeholder="john@acme.com"
                                                            value={newOrg.adminEmail}
                                                            onChange={e => setNewOrg(p => ({ ...p, adminEmail: e.target.value }))}
                                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-slate-400 block mb-1.5">Password <span className="text-slate-600">(auto if blank)</span></label>
                                                        <div className="relative">
                                                            <input
                                                                type={showPassword ? 'text' : 'password'}
                                                                placeholder="Auto-generated"
                                                                value={newOrg.adminPassword}
                                                                onChange={e => setNewOrg(p => ({ ...p, adminPassword: e.target.value }))}
                                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 pr-10 text-sm text-white focus:border-indigo-500 outline-none"
                                                            />
                                                            <button type="button" onClick={() => setShowPassword(v => !v)}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                                            >
                                                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-8">
                                        <button onClick={resetProvision}
                                            className="flex-1 py-2.5 border border-slate-700 text-slate-400 hover:text-white rounded-lg text-sm font-medium transition-colors"
                                        >Cancel</button>
                                        <button onClick={handleProvision} disabled={provisioning}
                                            className="flex-[2] py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                        >{provisioning ? 'Creating...' : 'Create Organization'}</button>
                                    </div>
                                </div>
                            ) : (
                                /* Success */
                                <div className="p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                            <CheckCircle size={20} className="text-emerald-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-semibold text-white">Organization Created</h2>
                                            <p className="text-sm text-slate-400">{provisionResult?.organization?.name} is ready</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-4 mb-6">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Client Login Credentials</p>
                                        {[
                                            { label: 'Login URL', value: provisionResult?.credentials?.loginUrl, key: 'url' },
                                            { label: 'Email', value: provisionResult?.credentials?.email, key: 'email' },
                                            { label: 'Password', value: provisionResult?.credentials?.password, key: 'pass' },
                                        ].map(({ label, value, key }) => (
                                            <div key={key} className="flex items-center justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-xs text-slate-500">{label}</p>
                                                    <p className="text-sm font-mono text-white truncate">{value}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleCopy(value, key)}
                                                    className={cn(
                                                        'flex-shrink-0 p-2 rounded-lg transition-colors border text-xs',
                                                        copied === key
                                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                            : 'border-slate-700 text-slate-500 hover:text-white hover:border-slate-600'
                                                    )}
                                                >
                                                    {copied === key ? <CheckCircle size={14} /> : <Copy size={14} />}
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button onClick={resetProvision}
                                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
                                    >Done</button>
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
