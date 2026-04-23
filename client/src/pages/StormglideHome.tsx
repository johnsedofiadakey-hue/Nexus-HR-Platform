import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { 
  Shield, Rocket, Users, Activity, BarChart3, Globe, Zap, 
  ChevronRight, ArrowUpRight, MessageSquare, Monitor, 
  PlusSquare, BookOpen, Building, 
  Briefcase, Package, Database, Terminal, Heart, Plane,
  CheckCircle2, Mail, Phone, Layout
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StormglideHome = () => {
  const [formStatus, setFormStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS'>('IDLE');
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const navigate = useNavigate();

  const handleDemoLaunch = async () => {
    try {
      const res = await axios.post('/api/auth/sandbox');
      const { token, refreshToken, user } = res.data;
      
      localStorage.setItem('nexus_auth_token', token);
      localStorage.setItem('nexus_refresh_token', refreshToken);
      localStorage.setItem('nexus_user', JSON.stringify(user));
      
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Demo Bridge Failed:', err);
      navigate('/login');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('SENDING');
    try {
      await axios.post('/api/support/leads', formData);
      setFormStatus('SUCCESS');
      setFormData({ name: '', email: '', company: '', message: '' });
      setTimeout(() => setFormStatus('IDLE'), 5000);
    } catch (err) {
      setFormStatus('IDLE');
    }
  };

  const products = [
    { id: 'hr', name: 'Nexus HR', icon: Users, desc: 'Unified Workforce Operating System', status: 'LIVE DEMO', color: 'bg-blue-500' },
    { id: 'prod', name: 'Apex Production', icon: Package, desc: 'Manufacturing & Smart Floor Control', status: 'INQUIRE', color: 'bg-indigo-500' },
    { id: 'fin', name: 'Ledger Pro', icon: BarChart3, desc: 'Advanced Financials & Bookkeeping', status: 'INQUIRE', color: 'bg-emerald-500' },
    { id: 'hosp', name: 'VitalStream', icon: PlusSquare, desc: 'Next-Gen Hospital Management', status: 'INQUIRE', color: 'bg-rose-500' },
    { id: 'dent', name: 'DentaCloud', icon: Activity, desc: 'Professional Dental Practice Hub', status: 'INQUIRE', color: 'bg-cyan-500' },
    { id: 'edu', name: 'ScholarNode', icon: BookOpen, desc: 'Institutional Learning & Admin', status: 'INQUIRE', color: 'bg-amber-500' },
    { id: 'hotel', name: 'Vista Booking', icon: Building, desc: 'Hospitality & Reservation Suite', status: 'INQUIRE', color: 'bg-violet-500' },
    { id: 'erp', name: 'SwiftERP', icon: Zap, desc: 'Agile Mini-ERP for Small Businesses', status: 'INQUIRE', color: 'bg-teal-500' }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-600">
      {/* ── Dynamic Decorative Orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div 
            animate={{ 
              x: [0, 100, 0],
              y: [0, 50, 0],
              rotate: 360 
            }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-400/5 blur-[100px] rounded-full" 
          />
          <motion.div 
            animate={{ 
              x: [0, -80, 0],
              y: [0, 100, 0],
              rotate: -360 
            }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-teal-400/5 blur-[100px] rounded-full" 
          />
      </div>

      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-2xl border-b border-slate-100/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-[0.9rem] bg-gradient-to-br from-blue-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-blue-200">
               <span className="font-black text-lg">SG</span>
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900">Stormglide<span className="text-blue-600">.</span></span>
          </div>
          <div className="flex items-center gap-6">
             <button onClick={() => navigate('/login')} className="hidden sm:block text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Client Login</button>
             <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-black tracking-tight hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200">Get Started</button>
          </div>
        </div>
      </nav>

      <section className="relative pt-44 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-100 shadow-sm"
           >
             <Layout size={12} /> Unified Protocol v5.0.0 is Live
           </motion.div>
           <motion.h1 
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
             className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95] mb-8 text-slate-900"
           >
              The Next Era of <br/>
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 bg-clip-text text-transparent bg-[size:200%_auto] animate-gradient-x">Enterprise.</span>
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-12"
           >
              Stormglide unifies fragmented operations into a singular, fluid intelligence. From HR to production, manage your entire organization with precision.
           </motion.p>
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.3 }}
             className="flex flex-col sm:flex-row items-center justify-center gap-4"
           >
              <button onClick={handleDemoLaunch} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95">Try Nexus HR Demo</button>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all active:scale-95 shadow-sm shadow-slate-100">Enquire for Access</button>
           </motion.div>
        </div>
      </section>

      <section className="py-32 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600">Product Ecosystem</h2>
             <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Specialized Solultions for Every Sector</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {products.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group cursor-default"
                  >
                     <div className={cn("w-14 h-14 rounded-2xl mb-8 flex items-center justify-center text-white shadow-xl shadow-slate-100 group-hover:scale-110 transition-transform", p.color)}>
                        <Icon size={28} />
                     </div>
                     <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">{p.status}</div>
                     <h3 className="text-xl font-black mb-3 text-slate-900">{p.name}</h3>
                     <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{p.desc}</p>
                     <button 
                       onClick={() => p.id === 'hr' ? handleDemoLaunch() : document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} 
                       className="text-xs font-black text-slate-900 group-hover:text-blue-600 flex items-center gap-2 transition-colors"
                     >
                       DEPLOY PROTOCOL <ArrowUpRight size={14}/>
                     </button>
                  </motion.div>
                );
             })}
          </div>
        </div>
      </section>

      <section id="contact" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 z-0" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-0">
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 blur-[150px] rounded-full" />
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 blur-[150px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">Scale Without Boundaries.</h2>
             <p className="text-slate-400 text-lg font-medium">Ready to transition your organization into the next phase of efficiency?</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="space-y-8">
                {[
                  { icon: Mail, label: 'Email Support', val: 'concierge@stormglide.io' },
                  { icon: Phone, label: 'Enterprise Line', val: '+224 624 000 000' },
                  { icon: Globe, label: 'Global HQ', val: 'Kaloum District, Conakry' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-5">
                     <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                        <item.icon size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                        <p className="text-white font-bold">{item.val}</p>
                     </div>
                  </div>
                ))}
             </div>
             <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
               {formStatus === 'SUCCESS' ? (
                  <div className="text-center py-10">
                     <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                       <CheckCircle2 size={32} />
                     </div>
                     <h3 className="text-2xl font-black text-white mb-2">Sync Initiated.</h3>
                     <p className="text-slate-400 font-medium">A solution architect will reach out shortly.</p>
                  </div>
               ) : (
                 <form onSubmit={handleContactSubmit} className="space-y-4">
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 transition-all outline-none" />
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Professional Email" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 transition-all outline-none" />
                    <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={3} placeholder="Tell us about your organization" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 transition-all outline-none resize-none" />
                    <button disabled={formStatus === 'SENDING'} className="w-full bg-blue-600 hover:bg-blue-500 p-5 rounded-2xl text-white font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]">
                      {formStatus === 'SENDING' ? 'ESTABLISHING LINK...' : 'SYNCHRONIZE PROTOCOL'}
                    </button>
                 </form>
               )}
             </div>
          </div>
        </div>
      </section>

      <footer className="py-16 px-6 bg-white border-t border-slate-100">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <span className="font-black text-sm text-[10px]">SG</span>
                  </div>
                  <span className="font-black tracking-tighter text-xl">Stormglide.io</span>
               </div>
               <div className="flex items-center gap-8">
                  {['Privacy', 'Standard Terms', 'Infrastructure', 'Legal'].map(l => (
                    <button key={l} className="text-[10px] font-black uppercase tracking-tighter text-slate-400 hover:text-blue-600 transition-colors">{l}</button>
                  ))}
               </div>
               <button onClick={() => navigate('/vault')} className="text-[10px] font-black uppercase text-slate-900 hover:text-blue-600 flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 shadow-sm">
                  <Terminal size={14} /> CLUSTER ACCESS
               </button>
            </div>
            <div className="text-center">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">© 2026 Stormglide Protocol. All cores synchronized.</p>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default StormglideHome;
