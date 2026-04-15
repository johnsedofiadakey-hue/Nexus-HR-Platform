import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Rocket, Users, Activity, BarChart3, Globe, Zap, 
  ChevronRight, ArrowUpRight, MessageSquare, Monitor, 
  PlusSquare, BookOpen, Building, 
  Briefcase, Package, Database, Terminal, Heart, Plane,
  CheckCircle2, Mail, Phone
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
    { id: 'hr', name: 'Nexus HR', icon: Users, desc: 'Unified Workforce Operating System', status: 'LIVE DEMO' },
    { id: 'prod', name: 'Apex Production', icon: Package, desc: 'Manufacturing & Smart Floor Control', status: 'INQUIRE' },
    { id: 'fin', name: 'Ledger Pro', icon: BarChart3, desc: 'Advanced Financials & Bookkeeping', status: 'INQUIRE' },
    { id: 'hosp', name: 'VitalStream', icon: PlusSquare, desc: 'Next-Gen Hospital Management', status: 'INQUIRE' },
    { id: 'dent', name: 'DentaCloud', icon: Activity, desc: 'Professional Dental Practice Hub', status: 'INQUIRE' },
    { id: 'edu', name: 'ScholarNode', icon: BookOpen, desc: 'Institutional Learning & Admin', status: 'INQUIRE' },
    { id: 'hotel', name: 'Vista Booking', icon: Building, desc: 'Hospitality & Reservation Suite', status: 'INQUIRE' },
    { id: 'erp', name: 'SwiftERP', icon: Zap, desc: 'Agile Mini-ERP for Small Businesses', status: 'INQUIRE' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
      {/* ── Dynamic Background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
           className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-100/20 blur-[120px] rounded-full" 
         />
      </div>

      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
               <span className="font-black text-lg">SG</span>
            </div>
            <span className="font-black text-xl tracking-tighter">Stormglide<span className="text-blue-500">.io</span></span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/login')} className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600">Client Login</button>
             <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold">Get Started</button>
          </div>
        </div>
      </nav>

      <section className="relative pt-44 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
           <motion.h1 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8"
           >
              Unified Intelligence. <br/>
              <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600 bg-clip-text text-transparent bg-[size:200%_auto] animate-gradient-x">Infinite Scale.</span>
           </motion.h1>
           <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium mb-12">
              The Next-Gen operating system for modern enterprise. Stormglide unifies HR, production, and financials into a single fluid ecosystem.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={handleDemoLaunch} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl transition-all">Try Nexus HR Demo</button>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-lg">Enquire for Early Access</button>
           </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-slate-100/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {products.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.id} className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                     <div className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center bg-blue-50 text-blue-600">
                        <Icon size={24} />
                     </div>
                     <div className="text-[10px] font-black uppercase text-blue-600 mb-2">{p.status}</div>
                     <h3 className="text-xl font-black mb-2">{p.name}</h3>
                     <p className="text-sm text-slate-500 mb-6">{p.desc}</p>
                     <button onClick={() => p.id === 'hr' ? handleDemoLaunch() : document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-black text-blue-600 flex items-center gap-2">EXPLORE <ArrowUpRight size={14}/></button>
                  </div>
                );
             })}
          </div>
        </div>
      </section>

      <section id="contact" className="py-32 px-6 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto text-center mb-16">
           <h2 className="text-4xl font-black mb-4">Build the Future Together.</h2>
           <p className="text-slate-400">Our solution architects are ready to tailor Stormglide for your business.</p>
        </div>
        <div className="max-w-xl mx-auto bg-white/5 p-8 rounded-[2rem] border border-white/10">
           {formStatus === 'SUCCESS' ? (
              <div className="text-center py-10">
                 <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4" />
                 <h3 className="text-xl font-black">Link Established.</h3>
                 <p className="text-slate-400">We will reach out shortly.</p>
              </div>
           ) : (
             <form onSubmit={handleContactSubmit} className="space-y-4">
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white" />
                <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Company" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white" />
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white" />
                <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={4} placeholder="Your Vision" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white" />
                <button disabled={formStatus === 'SENDING'} className="w-full bg-blue-600 p-4 rounded-xl font-black uppercase tracking-widest">{formStatus === 'SENDING' ? 'Connecting...' : 'Synchronize'}</button>
             </form>
           )}
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-slate-200">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="font-black uppercase tracking-tighter">Stormglide</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">© 2026 Stormglide.io Protocol</span>
            <button onClick={() => navigate('/vault')} className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 flex items-center gap-2">
               <Terminal size={14} /> NOC ACCESS
            </button>
         </div>
      </footer>
    </div>
  );
};

export default StormglideHome;
