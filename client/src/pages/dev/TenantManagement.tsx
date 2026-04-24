import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Search, Plus, Filter, MoreHorizontal, 
  ChevronRight, Globe, Shield, RefreshCw, X, CheckCircle,
  Mail, Phone, ExternalLink, Zap, CreditCard, Layout, Copy, Trash2, Key, Settings, ArrowLeft
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
      toast.error('Could not connect to the main server');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTenant = async (id: string, name: string) => {
    if (!window.confirm(`⚠️ ARE YOU SURE? This will permanently delete ${name} and all their data.`)) return;
    try {
      await api.delete(`/dev/tenants/${id}`);
      toast.success(`${name} has been deleted.`);
      fetchTenants();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete client');
    }
  };

  const handleResetMDPassword = async (id: string) => {
    const newPass = window.prompt('Enter new password for the Managing Director:');
    if (!newPass) return;
    try {
      await api.post(`/dev/tenants/${id}/reset-password`, { password: newPass });
      toast.success('MD password has been updated.');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reset password');
    }
  };

  const handleSaveDomain = async (id: string, domain: string) => {
    try {
      await api.patch(`/dev/tenants/${id}/domain`, { domain });
      toast.success('Domain settings updated.');
      fetchTenants();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update domain');
    }
  };

  const handleProvision = async () => {
    if (!newOrg.companyName || !newOrg.adminEmail || !newOrg.adminFullName) {
      return toast.error('Please fill in all required fields');
    }
    setProvisioning(true);
    try {
      const res = await api.post('/dev/provision', newOrg);
      setProvisionResult(res.data);
      toast.success('New company created successfully');
      fetchTenants();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Creation failed');
    } finally {
      setProvisioning(false);
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subdomain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 font-sans selection:bg-blue-100 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Navigation Return */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/nexus-master-console')}
            className="group flex items-center gap-3 px-6 py-3 bg-white hover:bg-slate-900 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Overview
          </button>
        </div>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Shield size={20} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Client Manager</h1>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Global Control & Hosting Hub</p>
          </div>
          <button 
            onClick={() => {
              setProvisionResult(null);
              setShowAddModal(true);
            }}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Plus size={16} /> Add New Client
          </button>
        </header>

        {/* Search & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-3">
             <Search size={18} className="text-slate-400 ml-4" />
             <input 
               placeholder="Search by company name..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 placeholder:text-slate-300 outline-none"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-center gap-4">
             <div className="text-center border-r border-slate-50 pr-6">
                <p className="text-xl font-black text-slate-900">{tenants.length}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Clients</p>
             </div>
             <button onClick={fetchTenants} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                <RefreshCw size={18} className={cn(loading && "animate-spin")} />
             </button>
          </div>
        </div>

        {/* Client Cards */}
        {loading ? (
          <div className="bg-white p-20 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 px-1">Loading Client Data...</p>
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border border-slate-100 shadow-sm text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                <Building2 size={40} />
             </div>
             <p className="text-xl font-black text-slate-900 mb-2">No Clients Found</p>
             <p className="text-sm font-medium text-slate-400">Click "Add New Client" to start.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTenants.map((tenant, idx) => (
              <motion.div 
                key={tenant.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-200 transition-all group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-8 flex gap-2">
                   <div className={cn("px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border", 
                     tenant.billingStatus === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                   )}>
                     {tenant.billingStatus}
                   </div>
                </div>

                <div className="mb-10">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6 transition-all shadow-sm">
                      <Building2 size={28} />
                   </div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase group-hover:text-indigo-600 transition-colors">{tenant.name}</h3>
                   <div className="flex items-center gap-2 mt-2">
                      <Globe size={14} className="text-slate-300" />
                      <p className="text-xs font-bold text-slate-400">{tenant.customDomain || `${tenant.subdomain}.nexus-hr.com`}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                   <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Team Size</p>
                      <p className="text-sm font-black text-slate-900">{tenant._count?.users || 0} Staff</p>
                   </div>
                   <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Plan</p>
                      <p className="text-sm font-black text-slate-900">{tenant.subscriptionPlan || 'FREE'}</p>
                   </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-50 pt-8">
                   <div className="flex gap-3">
                      <button 
                        onClick={() => setShowConfigModal(tenant)}
                        className="flex-1 px-4 py-3 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        <Settings size={14} /> Domain
                      </button>
                      <button 
                         onClick={() => handleResetMDPassword(tenant.id)}
                         className="flex-1 px-4 py-3 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                         <Key size={14} /> MD Pass
                      </button>
                   </div>
                   <button 
                     onClick={() => handleDeleteTenant(tenant.id, tenant.name)}
                     className="w-full px-4 py-3 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                   >
                     <Trash2 size={14} /> Delete Organization
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Domain Config Modal */}
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white w-full max-w-md rounded-[3rem] p-10 border border-slate-100 shadow-2xl"
             >
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Domain Settings</h2>
                   <button onClick={() => setShowConfigModal(null)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><X/></button>
                </div>
                <p className="text-xs font-medium text-slate-500 mb-8">Point {showConfigModal.name} to a custom website domain.</p>
                
                <div className="space-y-4 mb-10">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Custom Domain</label>
                      <input 
                        defaultValue={showConfigModal.customDomain || ''}
                        id="customDomainInput"
                        placeholder="mcbauchemieguinea.com"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500"
                      />
                   </div>

                   {/* DNS INTEGRATION GUIDE */}
                   <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-[2rem] space-y-4">
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                        <Globe size={14} /> Firebase DNS Guide
                      </p>
                      <div className="space-y-3">
                         <div className="bg-white p-3 rounded-xl border border-indigo-100/50">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">A Record (Value 1)</p>
                            <p className="text-xs font-black text-slate-900 font-mono">199.36.158.100</p>
                         </div>
                         <div className="bg-white p-3 rounded-xl border border-indigo-100/50">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">A Record (Value 2)</p>
                            <p className="text-xs font-black text-slate-900 font-mono">151.101.1.195</p>
                         </div>
                         <p className="text-[9px] font-bold text-slate-400 italic leading-relaxed">
                            Buy your domain (Namecheap/GoDaddy), then add these two A Records in the DNS settings. Once done, Firebase will issue a Secure Padlock (SSL) automatically.
                         </p>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => {
                    const val = (document.getElementById('customDomainInput') as HTMLInputElement).value;
                    handleSaveDomain(showConfigModal.id, val);
                    setShowConfigModal(null);
                  }}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-xl transition-all"
                >Save Domain Configuration</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               className="bg-white w-full max-w-2xl rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden"
             >
                {!provisionResult ? (
                  <div className="p-12">
                     <div className="flex items-center justify-between mb-10">
                        <div>
                           <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Add New Client</h2>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 px-1">Create a new company space and administrator</p>
                        </div>
                        <button onClick={() => setShowAddModal(false)} className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all">
                           <X size={24} />
                        </button>
                     </div>

                     <div className="space-y-8 text-left">
                        <section className="space-y-4 text-left">
                           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] ml-1">Company Details</p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5 md:col-span-2">
                                 <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Company Name *</label>
                                 <input 
                                   value={newOrg.companyName}
                                   onChange={e => setNewOrg({...newOrg, companyName: e.target.value})}
                                   placeholder="e.g. MC Bauchemie"
                                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all"
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Subdomain Name</label>
                                 <div className="relative">
                                    <input 
                                      value={newOrg.subdomain}
                                      onChange={e => setNewOrg({...newOrg, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})}
                                      placeholder="mcbau"
                                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">.nexus</span>
                                 </div>
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Country</label>
                                 <input 
                                   value={newOrg.country}
                                   onChange={e => setNewOrg({...newOrg, country: e.target.value})}
                                   placeholder="Guinea"
                                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500"
                                 />
                              </div>
                           </div>
                        </section>

                        <section className="space-y-4">
                           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] ml-1">Managing Director (MD)</p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5 md:col-span-2">
                                 <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">MD Full Name *</label>
                                 <input 
                                   value={newOrg.adminFullName}
                                   onChange={e => setNewOrg({...newOrg, adminFullName: e.target.value})}
                                   placeholder="Full Name"
                                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500"
                                 />
                              </div>
                              <div className="space-y-1.5 md:col-span-2">
                                 <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">MD Email Address *</label>
                                 <input 
                                   value={newOrg.adminEmail}
                                   onChange={e => setNewOrg({...newOrg, adminEmail: e.target.value})}
                                   placeholder="md@company.com"
                                   type="email"
                                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500"
                                 />
                              </div>
                           </div>
                        </section>
                     </div>

                     <div className="mt-12 flex gap-4">
                        <button onClick={() => setShowAddModal(false)} className="px-8 py-5 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Cancel</button>
                        <button 
                           onClick={handleProvision}
                           disabled={provisioning}
                           className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                           {provisioning ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                           {provisioning ? 'Creating Space...' : 'Create Company Space'}
                        </button>
                     </div>
                  </div>
                ) : (
                  <div className="p-16 text-center">
                     <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto mb-10 border border-emerald-100 shadow-xl shadow-emerald-500/5">
                        <CheckCircle size={40} />
                     </div>
                     <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-4">Client Created</h2>
                     <p className="text-sm font-medium text-slate-500 mb-12 px-10">Access account created for <span className="text-slate-900 font-black">{provisionResult.organization.name}</span>. Please share these details with the MD.</p>

                     <div className="space-y-4 mb-12 text-left">
                        {[
                           { label: 'Login Email', value: provisionResult.credentials.email, key: 'id' },
                           { label: 'Login Password', value: provisionResult.credentials.password, key: 'key' }
                        ].map((cred) => (
                           <div key={cred.key} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group relative">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{cred.label}</p>
                              <div className="flex items-center justify-between">
                                 <p className="text-sm font-black text-slate-900 font-mono tracking-tight">{cred.value}</p>
                                 <button 
                                   onClick={() => {
                                     navigator.clipboard.writeText(cred.value);
                                     toast.success('Copied to Clipboard');
                                   }}
                                   className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all"
                                 >
                                    <Copy size={16} />
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="flex flex-col gap-4">
                        <button 
                           onClick={() => window.open('/', '_blank')}
                           className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all"
                        >Go To Login Page</button>
                        <button onClick={() => setShowAddModal(false)} className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest py-2 transition-colors">Close</button>
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
