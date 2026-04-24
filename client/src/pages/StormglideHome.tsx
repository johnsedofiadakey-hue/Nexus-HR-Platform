import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { 
  Shield, Users, Activity, BarChart3, Globe, Zap, 
  ArrowUpRight, Monitor, Building, 
  Briefcase, Database, Terminal, CheckCircle2, Mail, Phone,
  ChevronDown, Cpu, Sparkles, Fingerprint, CreditCard,
  Target, GraduationCap, LayoutPanelLeft, BoxSelect
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StormglideHome = () => {
  const [formStatus, setFormStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS'>('IDLE');
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDemoLaunch = async () => {
    try {
      const res = await axios.post('/api/auth/sandbox');
      const { token, refreshToken, user } = res.data;
      localStorage.setItem('nexus_auth_token', token);
      localStorage.setItem('nexus_refresh_token', refreshToken);
      localStorage.setItem('nexus_user', JSON.stringify(user));
      window.location.href = '/dashboard';
    } catch (err) { navigate('/login'); }
  };

  const capabilities = [
    { 
      id: 'payroll', 
      name: 'Nuclear Payroll', 
      icon: CreditCard, 
      desc: 'Automated tax localizations, bank-direct disbursements, and instant payslip generation.',
      details: ['Multi-currency support', 'One-click tax filing', 'Compliance Guard']
    },
    { 
      id: 'attendance', 
      name: 'Biometric Presence', 
      icon: Fingerprint, 
      desc: 'Real-time floor tracking via biometric hardware sync and geo-fenced mobile check-ins.',
      details: ['Shift auto-rotation', 'Overtime calculation', 'Late-arrival analytics']
    },
    { 
      id: 'appraisal', 
      name: 'Performance Cortex', 
      icon: Target, 
      desc: 'AI-driven appraisals that measure output, potential, and cultural alignment recursively.',
      details: ['360 feedback loops', 'OKR visual tracking', 'Promotion readiness']
    },
    { 
      id: 'onboarding', 
      name: 'Quantum Onboarding', 
      icon: Sparkles, 
      desc: 'Digital contract signing, automated hardware provisioning, and structured training paths.',
      details: ['e-Sign integration', 'Buddy system assignment', 'Progress tracking']
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
      
      {/* ── Navbar ── */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
        scrolled ? "py-4 bg-black/80 backdrop-blur-2xl border-b border-white/5" : "py-8 bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
               <Zap size={20} className="fill-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase italic">Nexus<span className="text-indigo-500">.</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
             {['Platform', 'Intelligence', 'Enterprise', 'Security'].map(l => (
               <button key={l} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors">{l}</button>
             ))}
          </div>

          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/login')} className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white px-6">Terminal Login</button>
             <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20">Initialize Sync</button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[10%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-600/10 blur-[180px] rounded-full animate-pulse" />
            <div className="absolute bottom-[20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/5 blur-[160px] rounded-full" />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
           <div className="text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8"
              >
                <Cpu size={14} /> Nexus Platform Core v4.1.6
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase italic"
              >
                The Operating <br />
                System for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-400 to-indigo-600 animate-gradient-x">Human Potential.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="max-w-xl text-lg text-slate-400 font-medium leading-relaxed mb-12"
              >
                Nexus redefines human resource management with recursive intelligence. Transition from fragmented spreadsheets to a singular, unified enterprise brain.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center gap-6"
              >
                 <button onClick={handleDemoLaunch} className="w-full sm:w-auto px-10 py-6 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all shadow-2xl shadow-white/5 flex items-center justify-center gap-4 group">
                    Launch Demo Hub <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </button>
                 <button onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-10 py-6 bg-white/5 border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all text-white">
                    Core Capabilities
                 </button>
              </motion.div>
           </div>

           <motion.div 
             initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
             animate={{ opacity: 1, scale: 1, rotate: 0 }}
             transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
             className="relative pt-10"
           >
              <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full -z-10" />
              <img 
                src="/Users/truth/.gemini/antigravity/brain/5c7c5753-759f-47ca-9696-3f88fe723c1f/nexus_hrm_hero_visual_1777069955598.png" 
                alt="Nexus Interface" 
                className="w-full h-auto rounded-[3.5rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] transform hover:scale-[1.02] hover:-rotate-1 transition-all duration-700 pointer-events-none"
              />
              <div className="absolute -bottom-10 -right-10 p-8 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl hidden xl:block">
                 <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">All Modules Synchronized</span>
                 </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* ── Capabilities Exhibition ── */}
      <section id="capabilities" className="py-32 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
             <div className="max-w-2xl">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 mb-6 px-1">Atomic Architecture</h2>
                <p className="text-4xl md:text-6xl font-black tracking-tight leading-tight uppercase italic">Every Module is a <br />Strategic Advantage.</p>
             </div>
             <p className="text-slate-500 font-medium max-w-sm mb-2">Designed for elite organizations that require absolute precision in workforce orchestration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {capabilities.map((cap, idx) => (
                <motion.div 
                  key={cap.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-all" />
                   <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-8 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xl">
                      <cap.icon size={28} />
                   </div>
                   <h3 className="text-xl font-black mb-4 uppercase italic">{cap.name}</h3>
                   <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">{cap.desc}</p>
                   <div className="space-y-3">
                      {cap.details.map((d, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <CheckCircle2 size={12} className="text-emerald-500" />
                           <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{d}</span>
                        </div>
                      ))}
                   </div>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* ── The Nexus Edge (Comparison) ── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto bg-white/[0.02] border border-white/10 rounded-[4rem] p-12 md:p-24 relative z-10 overflow-hidden">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
           
           <div className="text-center mb-20">
              <h2 className="text-xs font-black uppercase tracking-[0.5em] text-indigo-500 mb-6">Strategic Benchmark</h2>
              <p className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase italic">Nexus vs. The Legacy Stack</p>
           </div>

           <div className="grid md:grid-cols-2 gap-12">
              <div className="p-10 rounded-[3rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20 group hover:scale-[1.02] transition-all">
                 <h3 className="text-2xl font-black mb-8 flex items-center gap-4">
                    <LayoutPanelLeft size={32} /> THE NEXUS CORE
                 </h3>
                 <div className="space-y-10">
                    {[
                      { l: 'Latency', v: '0.04ms (Instantaneous Sync)' },
                      { l: 'Identity', v: 'Global Multi-Domain Handshake' },
                      { l: 'Assistance', v: 'Recursive AI Cortex Integrated' },
                      { l: 'Deployment', v: 'Atomic Multi-Tenant Cloud' }
                    ].map((item, i) => (
                      <div key={i} className="border-b border-white/10 pb-6 last:border-0">
                         <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">{item.l}</p>
                         <p className="text-xl font-black tracking-tight">{item.v}</p>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="p-10 rounded-[3rem] bg-white text-black hover:scale-[1.02] transition-all">
                 <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-slate-400">
                    <BoxSelect size={32} /> LEGACY HR SOFTWARE
                 </h3>
                 <div className="space-y-10">
                    {[
                      { l: 'Latency', v: 'Fragile (Manual Refresh Required)' },
                      { l: 'Identity', v: 'Siloed Per-Company Accounts' },
                      { l: 'Assistance', v: 'Static Dropdowns & Templates' },
                      { l: 'Deployment', v: 'Monolithic Single-Server' }
                    ].map((item, i) => (
                      <div key={i} className="border-b border-slate-100 pb-6 last:border-0">
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.l}</p>
                         <p className="text-xl font-black text-slate-300 line-through">{item.v}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ── Contact Protocol ── */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-xs font-black uppercase tracking-[0.5em] text-indigo-500 mb-6">Transition Protocol</h2>
             <p className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-6">Scale Without Limits.</p>
             <p className="text-slate-500 font-medium text-lg">Ready to migrate your organization into the Nexus Intelligence Grid?</p>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-3xl p-10 md:p-16 rounded-[4rem] border border-white/10 shadow-2xl relative group">
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[60px] rounded-full -translate-x-1/2 translate-y-1/2" />
             
             {formStatus === 'SUCCESS' ? (
                <div className="text-center py-20">
                   <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
                      <CheckCircle2 size={40} />
                   </div>
                   <h3 className="text-4xl font-black uppercase italic mb-4">Link Established.</h3>
                   <p className="text-slate-400 font-medium">A Nexus architect will initialize contact shortly.</p>
                </div>
             ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setFormStatus('SENDING');
                  try {
                    await axios.post('/api/support/leads', formData);
                    setFormStatus('SUCCESS');
                  } catch { setFormStatus('IDLE'); }
                }} className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Commander Name</label>
                         <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Dow" className="w-full h-16 bg-black/40 border border-white/5 rounded-2xl px-6 text-white outline-none focus:border-indigo-500 transition-all font-bold" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Identity Email</label>
                         <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="md@company.com" className="w-full h-16 bg-black/40 border border-white/5 rounded-2xl px-6 text-white outline-none focus:border-indigo-500 transition-all font-bold" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Organization</label>
                         <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Company Name" className="w-full h-16 bg-black/40 border border-white/5 rounded-2xl px-6 text-white outline-none focus:border-indigo-500 transition-all font-bold" />
                      </div>
                   </div>
                   <div className="space-y-6 flex flex-col">
                      <div className="space-y-2 flex-grow">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Strategic Objectives</label>
                         <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Tell us about your organization goals..." className="w-full h-[calc(100%-30px)] bg-black/40 border border-white/5 rounded-3xl p-6 text-white outline-none focus:border-indigo-500 transition-all font-bold resize-none" />
                      </div>
                      <button disabled={formStatus === 'SENDING'} className="w-full h-20 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-4">
                        {formStatus === 'SENDING' ? 'Synchronizing...' : <>Initialize Connection <ArrowUpRight size={16}/></>}
                      </button>
                   </div>
                </form>
             )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
           <div>
              <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                 <Zap size={24} className="text-indigo-500" />
                 <span className="font-black text-2xl uppercase italic tracking-tighter">Nexus<span className="text-indigo-500">.</span>Platform</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 max-w-xs leading-loose">The Singular Architecture for Global Workforce Empowerment and Administrative Absolute.</p>
           </div>
           
           <div className="flex gap-12">
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-white">Infrastructure</p>
                 <ul className="space-y-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    <li className="hover:text-indigo-400 cursor-pointer transition-colors">Quantum Security</li>
                    <li className="hover:text-indigo-400 cursor-pointer transition-colors">Global Domains</li>
                    <li className="hover:text-indigo-400 cursor-pointer transition-colors">API Reference</li>
                 </ul>
              </div>
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-white">Nexus Hubs</p>
                 <ul className="space-y-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    <li onClick={() => navigate('/login')} className="hover:text-indigo-400 cursor-pointer transition-colors">Client Login</li>
                    <li onClick={() => navigate('/vault')} className="hover:text-indigo-400 cursor-pointer transition-colors">Master Cluster</li>
                    <li className="hover:text-indigo-400 cursor-pointer transition-colors">Status Core</li>
                 </ul>
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
           <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">© 2026 Nexus Protocol. All Rights Reserved.</p>
           <div className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
           </div>
        </div>
      </footer>
    </div>
  );
};

export default StormglideHome;
