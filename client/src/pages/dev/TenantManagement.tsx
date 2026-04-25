import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Search, Plus, Filter, MoreHorizontal, 
  ChevronRight, Globe, Shield, RefreshCw, X, CheckCircle,
  Mail, Phone, ExternalLink, Zap, CreditCard, LayoutDashboard, Copy, Trash2, Key, Settings, ArrowLeft, ArrowUpRight, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import api from '../../services/api';
import { toast } from '../../utils/toast';

const TenantManagement = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState<any>(null);
  const [provisioning, setProvisioning] = useState(false);
  const [provisionResult, setProvisionResult] = useState<any>(null);
  
  const [newOrg, setNewOrg] = useState({
    companyName: '',
    subdomain: '',
    country: 'Guinea',
    adminFullName: '',
    adminEmail: ''
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await api.get('/dev/stats');
      setTenants(res.data.tenants || []);
    } catch (err) {
      toast.error('Connection Lost: Could not reach the administration server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTenant = async (id: string, name: string) => {
    const confirmation = window.prompt(`⚠️ TOTAL DESTRUCTION WARNING\n\nThis will permanently delete ${name} and all associated data, including payroll, employees, and files.\n\nType "DELETE ${name.toUpperCase()}" to confirm:`);
    
    if (confirmation !== `DELETE ${name.toUpperCase()}`) {
      toast.error('Identity mismatch. Deletion cancelled.');
      return;
    }

    try {
      await api.delete(`/dev/tenants/${id}`);
      toast.success(`${name} has been removed from the system.`);
      fetchTenants();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to remove client');
    }
  };

  const handleResetMDPassword = async (id: string) => {
    const newPass = window.prompt('Enter a new professional password for the Managing Director:');
    if (!newPass) return;
    try {
      await api.post(`/dev/tenants/${id}/reset-password`, { password: newPass });
      toast.success('Access Restored: The MD password has been updated.');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update access code');
    }
  };

  const handleSaveDomain = async (id: string, domain: string) => {
    try {
      await api.patch(`/dev/tenants/${id}/domain`, { domain });
      toast.success('Domain linked successfully.');
      fetchTenants();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to link custom domain');
    }
  };

  const handleProvision = async () => {
    if (!newOrg.companyName || !newOrg.adminEmail || !newOrg.adminFullName) {
      return toast.error('Required Information Missing: Please fill in all starred fields.');
    }
    setProvisioning(true);
    try {
      const res = await api.post('/dev/provision', newOrg);
      setProvisionResult(res.data);
      toast.success('Enterprise Space Created');
      fetchTenants();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Creation Failed');
    } finally {
      setProvisioning(false);
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subdomain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans selection:bg-blue-500/20">
       <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Navigation Return */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/nexus-master-console')}
            className="group flex items-center gap-3 px-6 py-3 bg-white hover:bg-slate-950 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Command Center
          </button>
        </div>

        {/* Header Architecture */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                <Building2 size={24} />
              </div>
              <h1 className="text-4xl font-black text-slate-950 tracking-tighter uppercase italic">Client Hub</h1>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-1 px-1">Global Organization Management</p>
          </div>
          <button 
            onClick={() => {
              setProvisionResult(null);
              setShowAddModal(true);
            }}
            className="flex items-center justify-center gap-4 px-10 py-5 bg-slate-950 hover:bg-blue-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-slate-200 active:scale-95 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Create New Company
          </button>
        </header>

        {/* Search & Stats HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-4 group focus-within:border-blue-500 transition-colors">
             <div className="p-4 bg-slate-50 rounded-full ml-2">
                <Search size={18} className="text-slate-400" />
             </div>
             <input 
               placeholder="Search by company name or platform ID..."
               className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-black text-slate-950 placeholder:text-slate-300 outline-none uppercase tracking-tight"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="bg-white p-5 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-around">
             <div className="text-center">
                <p className="text-2xl font-black text-slate-950 tracking-tighter italic">{tenants.length}</p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Companies</p>
             </div>
             <div className="w-px h-10 bg-slate-100" />
             <button onClick={fetchTenants} className="p-4 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all group">
                <RefreshCw size={20} className={cn(loading && "animate-spin")} />
             </button>
          </div>
        </div>

        {/* Client Grid */}
        {loading ? (
          <div className="bg-white p-32 rounded-[4rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-6">
              <div className="relative">
                 <div className="w-16 h-16 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
                 <Shield size={20} className="absolute inset-0 m-auto text-blue-600" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Synchronizing Local Nodes</p>
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className="bg-white p-32 rounded-[4rem] border border-slate-200 shadow-sm text-center">
             <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-200">
                <Building2 size={48} />
             </div>
             <h2 className="text-2xl font-black text-slate-900 uppercase italic mb-3">No Active Organizations</h2>
             <p className="text-sm font-medium text-slate-400 max-w-sm mx-auto mb-10">Start by creating your first client company. They will be immediately accessible on their custom domain.</p>
             <button onClick={() => setShowAddModal(true)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Create Enterprise</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
            {filteredTenants.map((tenant, idx) => (
              <motion.div 
                key={tenant.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm hover:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.1)] transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-10">
                   <div className={cn("px-4 py-1.5 rounded-full text-[8px] font-black tracking-[0.2em] uppercase border shadow-sm", 
                     tenant.billingStatus === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                   )}>
                     {tenant.billingStatus === 'ACTIVE' ? 'Verified' : 'Pending Deployment'}
                   </div>
                </div>

                <div className="mb-12">
                   <div className="w-16 h-16 bg-slate-50 group-hover:bg-blue-600 rounded-3xl flex items-center justify-center text-slate-400 group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm mb-8">
                      <Building2 size={32} />
                   </div>
                   <h3 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic group-hover:text-blue-600 transition-colors">{tenant.name}</h3>
                   <div className="flex items-center gap-2 mt-3">
                      <Globe size={14} className="text-blue-500/50" />
                      <p className="text-[11px] font-bold text-slate-400 tracking-tight">{tenant.customDomain || `${tenant.subdomain}.nexus-hr.com`}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-12">
                   <div className="p-5 bg-slate-50 border border-slate-100 rounded-3xl">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Workforce</p>
                      <p className="text-sm font-black text-slate-900 italic">{tenant._count?.users || 0} Members</p>
                   </div>
                   <div className="p-5 bg-slate-50 border border-slate-100 rounded-3xl">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tier</p>
                      <p className="text-sm font-black text-slate-900 italic">{tenant.subscriptionPlan || 'SaaS Tier 1'}</p>
                   </div>
                </div>

                <div className="flex flex-col gap-3 pt-8 border-t border-slate-100">
                   <div className="flex gap-3">
                      <button 
                        onClick={() => setShowConfigModal(tenant)}
                        className="flex-1 h-12 bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Globe size={14} /> Domain
                      </button>
                      <button 
                         onClick={() => handleResetMDPassword(tenant.id)}
                         className="flex-1 h-12 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm border border-blue-100"
                      >
                         <Key size={14} /> Reset MD
                      </button>
                   </div>
                   <button 
                     onClick={() => handleDeleteTenant(tenant.id, tenant.name)}
                     className="w-full h-12 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-rose-100"
                   >
                     <Trash2 size={14} /> Remove Company
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Domain Config Modal - Professional Edition */}
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-3xl bg-slate-900/60">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 40 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 40 }}
               className="bg-white w-full max-w-xl rounded-[4rem] p-12 border border-slate-200 shadow-2xl relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 blur-[80px] rounded-full" />
                
                <div className="flex items-center justify-between mb-10">
                   <div>
                      <h2 className="text-3xl font-black text-slate-950 tracking-tight uppercase italic">Domain Management</h2>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Point {showConfigModal.name} to a custom URL.</p>
                   </div>
                   <button onClick={() => setShowConfigModal(null)} className="p-4 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-3xl transition-all ring-1 ring-slate-100"><X size={20}/></button>
                </div>
                
                <div className="space-y-8 mb-12">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] ml-2">Public Website Address</label>
                      <div className="relative group">
                         <input 
                           defaultValue={showConfigModal.customDomain || ''}
                           id="customDomainInput"
                           placeholder="www.companyname.com"
                           className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-5 text-sm font-black text-slate-950 outline-none focus:border-blue-600 transition-all shadow-inner"
                         />
                         <Globe size={18} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                      </div>
                   </div>

                   {/* PROFESSIONAL FIREBASE DNS GUIDE */}
                   <div className="p-8 bg-blue-600/[0.03] border border-blue-600/10 rounded-[3rem] space-y-6">
                      <div className="flex items-center justify-between">
                         <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] flex items-center gap-3">
                           <Shield size={16} /> Firebase Integration Guide
                         </p>
                         <HelpCircle size={14} className="text-slate-300" />
                      </div>
                      
                      <div className="space-y-4">
                         <p className="text-[11px] font-medium text-slate-500 leading-relaxed px-1">
                            To link this organization to a professional domain, add the following <span className="font-black text-slate-950">A Records</span> to your DNS provider (e.g. GoDaddy, Namecheap).
                         </p>
                         
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                               { label: 'Host / Name', value: '@' },
                               { label: 'IP Address 1', value: '199.36.158.100' },
                               { label: 'IP Address 2', value: '151.101.1.195' }
                            ].map((dns) => (
                               <div key={dns.label} className="bg-white p-4 rounded-2xl border border-blue-600/5 shadow-sm group/dns relative">
                                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{dns.label}</p>
                                  <div className="flex items-center justify-between">
                                     <p className="text-xs font-black text-slate-950 font-mono tracking-tight">{dns.value}</p>
                                     <button 
                                       onClick={() => {
                                          navigator.clipboard.writeText(dns.value);
                                          toast.success('Copied Value');
                                       }}
                                       className="text-slate-300 hover:text-blue-600 transition-colors"
                                     >
                                        <Copy size={12} />
                                     </button>
                                  </div>
                               </div>
                            ))}
                         </div>

                         <div className="flex items-start gap-3 p-4 bg-white/50 rounded-2xl border border-blue-100/50">
                            <Zap size={14} className="text-amber-500 mt-1 flex-shrink-0" />
                            <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
                               After updating DNS, it can take up to 24 hours to "Propagate." Nexus will automatically issue an <span className="text-blue-600 font-black">SSL Padlock</span> once verified.
                            </p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                   <button 
                     onClick={() => {
                       const val = (document.getElementById('customDomainInput') as HTMLInputElement).value;
                       handleSaveDomain(showConfigModal.id, val);
                       setShowConfigModal(null);
                     }}
                     className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3"
                   >
                     Link Organization Domain <ArrowUpRight size={18} />
                   </button>
                   <button onClick={() => setShowConfigModal(null)} className="py-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-slate-900 transition-colors">Discard Changes</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Client Modal - High Fidelity */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-3xl bg-slate-900/40">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 50 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 50 }}
               className="bg-white w-full max-w-3xl rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden relative"
             >
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 blur-[100px] rounded-full" />
                
                {!provisionResult ? (
                  <div className="p-16">
                     <div className="flex items-center justify-between mb-12">
                        <div>
                           <h2 className="text-4xl font-black text-slate-950 tracking-tight uppercase italic">Establish Space</h2>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2 px-1">Configure new client workspace & administration</p>
                        </div>
                        <button onClick={() => setShowAddModal(false)} className="p-4 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-3xl transition-all ring-1 ring-slate-100">
                           <X size={24} />
                        </button>
                     </div>

                     <div className="space-y-10 text-left">
                        <section className="space-y-5">
                           <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] ml-2">Legal Identity</p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2 md:col-span-2">
                                 <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest ml-4">Full Company Name *</label>
                                 <input 
                                   value={newOrg.companyName}
                                   onChange={e => setNewOrg({...newOrg, companyName: e.target.value})}
                                   placeholder="e.g. Nexus Global Manufacturing"
                                   className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-5 text-sm font-black text-slate-950 outline-none focus:border-blue-600 transition-all shadow-inner"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest ml-4">Subdomain Identifier</label>
                                 <div className="relative group">
                                    <input 
                                      value={newOrg.subdomain}
                                      onChange={e => setNewOrg({...newOrg, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})}
                                      placeholder="companyname"
                                      className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-5 text-sm font-black text-slate-950 outline-none focus:border-blue-600 transition-all shadow-inner"
                                    />
                                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">.nexus</span>
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest ml-4">Global Region</label>
                                 <input 
                                   value={newOrg.country}
                                   onChange={e => setNewOrg({...newOrg, country: e.target.value})}
                                   placeholder="Guinea"
                                   className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-5 text-sm font-black text-slate-950 outline-none focus:border-blue-600 shadow-inner"
                                 />
                              </div>
                           </div>
                        </section>

                        <section className="space-y-5">
                           <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] ml-2">Executive Access (MD)</p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest ml-4">Director Full Name *</label>
                                 <input 
                                   value={newOrg.adminFullName}
                                   onChange={e => setNewOrg({...newOrg, adminFullName: e.target.value})}
                                   placeholder="Full Name"
                                   className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-5 text-sm font-black text-slate-950 outline-none focus:border-blue-600 transition-all shadow-inner"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest ml-4">Secure Email Address *</label>
                                 <input 
                                   value={newOrg.adminEmail}
                                   onChange={e => setNewOrg({...newOrg, adminEmail: e.target.value})}
                                   placeholder="director@company.com"
                                   type="email"
                                   className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-5 text-sm font-black text-slate-950 outline-none focus:border-blue-600 shadow-inner"
                                 />
                              </div>
                           </div>
                        </section>
                     </div>

                     <div className="mt-14 flex gap-6">
                        <button onClick={() => setShowAddModal(false)} className="px-10 py-6 border border-slate-200 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 hover:bg-slate-50 transition-all">Discard</button>
                        <button 
                           onClick={handleProvision}
                           disabled={provisioning}
                           className="flex-1 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-4"
                        >
                           {provisioning ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} />}
                           {provisioning ? 'Creating Workspace...' : 'Initialize Enterprise Space'}
                        </button>
                     </div>
                  </div>
                ) : (
                  <div className="p-20 text-center">
                     <div className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-[4rem] flex items-center justify-center mx-auto mb-10 border border-emerald-100 shadow-2xl shadow-emerald-500/10">
                        <CheckCircle size={54} />
                     </div>
                     <h2 className="text-5xl font-black text-slate-950 tracking-tighter uppercase italic mb-4">Space Activated.</h2>
                     <p className="text-sm font-medium text-slate-400 mb-14 max-w-md mx-auto">Administrator credentials for <span className="text-slate-950 font-black italic">{provisionResult.organization.name}</span> have been generated.</p>

                     <div className="space-y-6 mb-16 text-left max-w-md mx-auto">
                        {[
                           { label: 'Admin Login', value: provisionResult.credentials.email },
                           { label: 'Initial Access Code', value: provisionResult.credentials.password }
                        ].map((cred) => (
                           <div key={cred.label} className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 group relative shadow-inner">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 ml-1">{cred.label}</p>
                              <div className="flex items-center justify-between">
                                 <p className="text-md font-black text-slate-950 font-mono tracking-tight">{cred.value}</p>
                                 <button 
                                   onClick={() => {
                                     navigator.clipboard.writeText(cred.value);
                                     toast.success('Copied Content');
                                   }}
                                   className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 shadow-sm transition-all hover:scale-110 active:scale-95"
                                 >
                                    <Copy size={18} />
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="flex flex-col gap-5">
                        <button 
                           onClick={() => window.open('/', '_blank')}
                           className="w-full py-6 bg-slate-950 hover:bg-blue-600 text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-slate-300 transition-all"
                        >Launch Login Gateway</button>
                        <button onClick={() => setShowAddModal(false)} className="text-[10px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-[0.4em] py-3 transition-colors">Return to Dashboard</button>
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

export default TenantManagement;
