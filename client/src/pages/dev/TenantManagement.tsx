import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Search, Plus, Filter, MoreHorizontal, 
  ChevronRight, Globe, Shield, RefreshCw, X, CheckCircle,
  Mail, Phone, ExternalLink, Zap, CreditCard, Layout, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import api from '../../services/api';
import { toast } from '../../utils/toast';

const TenantManagement = () => {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
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
      toast.error('Failed to bridge with master cluster');
    } finally {
      setLoading(false);
    }
  };

  const handleProvision = async () => {
    if (!newOrg.companyName || !newOrg.adminEmail || !newOrg.adminFullName) {
      return toast.error('Missing required synchronization parameters');
    }
    setProvisioning(true);
    try {
      const res = await api.post('/dev/provision', newOrg);
      setProvisionResult(res.data);
      toast.success('Enterprise Node Synchronized');
      fetchTenants();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Provisioning sequence failure');
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
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Layout size={20} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Tenant Matrix</h1>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Master Authorization & Lifecycle Hub</p>
          </div>
          <button 
            onClick={() => {
              setProvisionResult(null);
              setShowAddModal(true);
            }}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Plus size={16} /> New Organization
          </button>
        </header>

        {/* Search & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-3">
             <Search size={18} className="text-slate-400 ml-4" />
             <input 
               placeholder="Search by company name or subdomain..."
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 placeholder:text-slate-300 outline-none"
             />
          </div>
          <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-center gap-4">
             <div className="text-center border-r border-slate-50 pr-6">
                <p className="text-xl font-black text-slate-900">{tenants.length}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Nodes</p>
             </div>
             <button onClick={fetchTenants} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                <RefreshCw size={18} className={cn(loading && "animate-spin")} />
             </button>
          </div>
        </div>

        {/* Table/Cards */}
        {loading ? (
           <div className="bg-white p-20 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 px-1">Mapping Global Grid...</p>
           </div>
        ) : filteredTenants.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border border-slate-100 shadow-sm text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                <Building2 size={40} />
             </div>
             <p className="text-xl font-black text-slate-900 mb-2">No Clusters Detected</p>
             <p className="text-sm font-medium text-slate-400">Initialize a new organization to begin deployment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTenants.map((tenant, idx) => (
              <motion.div 
                key={tenant.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-8">
                   <div className={cn("px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border", 
                     tenant.billingStatus === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                   )}>
                     {tenant.billingStatus}
                   </div>
                </div>

                <div className="mb-10">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 transition-all shadow-sm">
                      <Building2 size={28} />
                   </div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase group-hover:text-blue-600 transition-colors">{tenant.name}</h3>
                   <div className="flex items-center gap-2 mt-2">
                      <Globe size={14} className="text-slate-300" />
                      <p className="text-xs font-bold text-slate-400">{tenant.subdomain ? `${tenant.subdomain}.nexus-hr.com` : 'Base Routing'}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                   <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Scale</p>
                      <p className="text-sm font-black text-slate-900">{tenant._count?.users || 0} Nodes</p>
                   </div>
                   <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fiscal Tier</p>
                      <p className="text-sm font-black text-slate-900">{tenant.subscriptionPlan || 'STARTER'}</p>
                   </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-8 gap-4">
                   <button className="flex-1 px-4 py-3 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Config</button>
                   <button className="flex-1 px-4 py-3 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                       Proxy Sync <ExternalLink size={12} />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Provision Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               className="bg-white w-full max-w-2xl rounded-[3rem] border border-slate-100 shadow-[0_40px_120px_-10px_rgba(0,0,0,0.2)] overflow-hidden"
             >
                {!provisionResult ? (
                  <div className="p-12">
                     <div className="flex items-center justify-between mb-10">
                        <div>
                           <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Provision Enterprise</h2>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 px-1">Atomic Node Creation & Admin Authorization</p>
                        </div>
                        <button onClick={() => setShowAddModal(false)} className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all">
                           <X size={24} />
                        </button>
                     </div>

                     <div className="space-y-8">
                        <section className="space-y-4">
                           <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] ml-1">Entity Details</p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5 md:col-span-2">
                                 <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Company Name *</label>
                                 <input 
                                   value={newOrg.companyName}
                                   onChange={e => setNewOrg({...newOrg, companyName: e.target.value})}
                                   placeholder="e.g. Apex Global Solutions"
                                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 transition-all outline-none"
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Subdomain Protocol</label>
                                 <div className="relative">
                                    <input 
                                      value={newOrg.subdomain}
                                      onChange={e => setNewOrg({...newOrg, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})}
                                      placeholder="apex"
                                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 transition-all outline-none"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">.nexus</span>
                                 </div>
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Jurisdiction</label>
                                 <input 
                                   value={newOrg.country}
                                   onChange={e => setNewOrg({...newOrg, country: e.target.value})}
                                   placeholder="Guinea"
                                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 transition-all outline-none"
                                 />
                              </div>
                           </div>
                        </section>

                        <section className="space-y-4">
                           <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] ml-1">Root Administrator (MD)</p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5 md:col-span-2">
                                 <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Full Identity Name *</label>
                                 <input 
                                   value={newOrg.adminFullName}
                                   onChange={e => setNewOrg({...newOrg, adminFullName: e.target.value})}
                                   placeholder="Full Name"
                                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 transition-all outline-none"
                                 />
                              </div>
                              <div className="space-y-1.5 md:col-span-2">
                                 <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Authorization Email *</label>
                                 <input 
                                   value={newOrg.adminEmail}
                                   onChange={e => setNewOrg({...newOrg, adminEmail: e.target.value})}
                                   placeholder="admin@company.com"
                                   type="email"
                                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 transition-all outline-none"
                                 />
                              </div>
                           </div>
                        </section>
                     </div>

                     <div className="mt-12 flex gap-4">
                        <button onClick={() => setShowAddModal(false)} className="px-8 py-5 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Abort Sync</button>
                        <button 
                           onClick={handleProvision}
                           disabled={provisioning}
                           className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                           {provisioning ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                           {provisioning ? 'Synchronizing Cluster...' : 'Initialize Enterprise Node'}
                        </button>
                     </div>
                  </div>
                ) : (
                  <div className="p-16 text-center">
                     <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto mb-10 border border-emerald-100 shadow-xl shadow-emerald-500/5">
                        <CheckCircle size={40} />
                     </div>
                     <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-4">Sync Succeeded</h2>
                     <p className="text-sm font-medium text-slate-500 mb-12 px-10">Root authorization cluster established for <span className="text-slate-900 font-black">{provisionResult.organization.name}</span>. Transfer keys to the Managing Director.</p>

                     <div className="space-y-4 mb-12 text-left">
                        {[
                          { label: 'Access Identity (Email)', value: provisionResult.credentials.email, key: 'id' },
                          { label: 'Root Encryption Key (Password)', value: provisionResult.credentials.password, key: 'key' }
                        ].map((cred) => (
                           <div key={cred.key} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group relative">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{cred.label}</p>
                              <div className="flex items-center justify-between">
                                 <p className="text-sm font-black text-slate-900 font-mono tracking-tight">{cred.value}</p>
                                 <button 
                                   onClick={() => {
                                     navigator.clipboard.writeText(cred.value);
                                     toast.success('Key Captured to Clipboard');
                                   }}
                                   className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 shadow-sm transition-all"
                                 >
                                    <Copy size={16} />
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="flex flex-col gap-4">
                        <button 
                           onClick={() => window.open('/login', '_blank')}
                           className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 active:scale-95 transition-all"
                        >Launch Root Control Portal</button>
                        <button onClick={() => setShowAddModal(false)} className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest py-2 transition-colors">Return to Grid</button>
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
