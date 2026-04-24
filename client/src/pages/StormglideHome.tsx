import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { 
  Shield, Users, Activity, BarChart3, Globe, Zap, 
  ArrowUpRight, Monitor, Building, 
  Briefcase, Database, Terminal, CheckCircle2, Mail, Phone,
  ChevronDown, Cpu, Sparkles, Fingerprint, CreditCard,
  Target, GraduationCap, LayoutPanelLeft, BoxSelect, ArrowRight, Star, Clock, Heart, Workflow, Rocket, Smile
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

  const featureCards = [
    {
      title: "Simple Payroll",
      icon: <CreditCard className="text-blue-600" />,
      desc: "Pay your staff in seconds. We handle taxes, bank transfers, and payslips automatically.",
      color: "bg-blue-50",
      accent: "text-blue-600"
    },
    {
      title: "Staff Attendance",
      icon: <Fingerprint className="text-emerald-600" />,
      desc: "See who is at work right now. Use mobile check-ins or biometric sync in real-time.",
      color: "bg-emerald-50",
      accent: "text-emerald-600"
    },
    {
      title: "AI Appraisals",
      icon: <Star className="text-amber-600" />,
      desc: "Track staff performance with smart AI. No more boring paperwork, just growth.",
      color: "bg-amber-50",
      accent: "text-amber-600"
    },
    {
      title: "Smart Onboarding",
      icon: <Smile className="text-purple-600" />,
      desc: "Hire and onboard new people easily. Contracts, training, and equipment—all in one place.",
      color: "bg-purple-50",
      accent: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-blue-600/10 selection:text-blue-700">
      
      {/* ── Top Header Info ── */}
      <div className="bg-blue-600 text-white py-2.5 px-6 text-center">
         <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3">
           <Sparkles size={14} className="animate-pulse" /> 
           <span>Nexus v5.0 is now live for all organizations</span>
           <button onClick={handleDemoLaunch} className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full border border-white/20 transition-all font-black ml-2 uppercase">Try the Demo</button>
         </p>
      </div>

      {/* ── Navigation ── */}
      <nav className={cn(
        "fixed top-[37px] left-0 right-0 z-50 transition-all duration-500 px-6",
        scrolled ? "py-4 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm" : "py-8 bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-200 group-hover:-rotate-3 transition-transform">
               <Shield size={20} className="fill-white/20" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900">Nexus<span className="text-blue-600">.</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-12">
             {['How it Works', 'Pricing', 'Company', 'Security'].map(l => (
               <button key={l} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">{l}</button>
             ))}
          </div>

          <div className="flex items-center gap-6">
             <button onClick={() => navigate('/login')} className="hidden sm:block text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all px-4">Login</button>
             <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">Get Started</button>
          </div>
        </div>
      </nav>

      {/* ── Lively Hero Section ── */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/50 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-50 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-4 px-6 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm mb-12"
           >
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">The Human Resource Suite for Modern Teams</p>
           </motion.div>

           <motion.h1 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
             className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.05] tracking-tighter mb-10"
           >
             The Smartest Way to <br />
             <span className="text-blue-600 px-4 inline-block bg-blue-50 border-b-8 border-blue-100 italic">Manage Your People.</span>
           </motion.h1>

           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-16"
           >
             Build a world-class team with the simplest HR software. 
             Nexus automates payroll, attendance, and reviews so you can focus on growing your business.
           </motion.p>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="flex flex-col sm:flex-row items-center justify-center gap-8"
           >
              <button 
                onClick={handleDemoLaunch}
                className="w-full sm:w-auto px-12 py-7 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 group"
              >
                 Launch Live Demo <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-12 py-7 bg-white border-2 border-slate-100 text-slate-900 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-4"
              >
                 See All Features <ChevronDown size={18} />
              </button>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, scale: 0.9, y: 40 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
             className="mt-24 relative"
           >
              <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full -z-10" />
              <div className="bg-white p-4 rounded-[4rem] border border-white shadow-[0_50px_100px_rgba(0,0,0,0.08)] overflow-hidden">
                 <img 
                   src="/Users/truth/.gemini/antigravity/brain/5c7c5753-759f-47ca-9696-3f88fe723c1f/nexus_hrm_hero_visual_1777069955598.png" 
                   alt="Nexus Platform Preview" 
                   className="w-full h-auto rounded-[3rem] border border-slate-50 shadow-sm"
                 />
              </div>
              <div className="absolute top-1/2 -left-12 p-8 bg-white border border-slate-100 rounded-3xl shadow-2xl hidden xl:block animate-bounce-slow">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><CheckCircle2 size={24}/></div>
                    <div className="text-left">
                       <p className="text-[10px] font-black text-slate-400 uppercase">Payroll Success</p>
                       <p className="text-sm font-black text-slate-900">1,240 Staff Paid</p>
                    </div>
                 </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section id="features" className="py-32 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
               <h2 className="text-xs font-black uppercase tracking-[0.5em] text-blue-600 mb-6">Built for Success</h2>
               <p className="text-5xl font-black text-slate-900 tracking-tight uppercase italic mb-8">Everything you need <br /> to run a great company.</p>
               <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">We took the complex world of HR and simplified it into a single, beautiful experience. No more spreadsheets, no more stress.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
               {featureCards.map((card, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -10 }}
                    className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group border-b-8 hover:border-blue-500"
                  >
                     <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-10 transition-transform group-hover:rotate-6", card.color)}>
                        {React.cloneElement(card.icon as React.ReactElement, { size: 40 })}
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-4">{card.title}</h3>
                     <p className="text-slate-500 font-medium leading-relaxed mb-8">{card.desc}</p>
                     <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest cursor-pointer hover:gap-4 transition-all">
                        Learn More <ArrowRight size={14} />
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* ── Product Differentiation ── */}
      <section className="py-32 px-6 bg-slate-50 relative overflow-hidden">
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-12">
                  <div>
                     <h2 className="text-xs font-black uppercase tracking-[0.5em] text-emerald-600 mb-6">Why Choose Nexus?</h2>
                     <p className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-tight">Better Features, <br /> Zero Maintenance.</p>
                  </div>

                  <div className="space-y-10">
                     {[
                        { title: "Ultra Fast Speed", desc: "Our system runs at 60FPS. Navigate records, payroll, and charts instantly without ever hitting refresh.", icon: <Zap size={24} className="text-amber-500" /> },
                        { title: "Bank-Direct Payroll", desc: "No second steps. Pay all your staff directly through the platform with automatic tax calculations.", icon: <Building size={24} className="text-blue-500" /> },
                        { title: "AI Assistance", desc: "Your HR assistant is available 24/7. Ask questions, generate reports, or find staff records using simple English.", icon: <Cpu size={24} className="text-purple-500" /> }
                     ].map((item, i) => (
                        <div key={i} className="flex gap-8">
                           <div className="w-16 h-16 shrink-0 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">{item.icon}</div>
                           <div className="space-y-2">
                              <h4 className="text-xl font-black text-slate-900 uppercase italic">{item.title}</h4>
                              <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/10 blur-[120px] rounded-full translate-x-1/2" />
                  <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl space-y-10 relative">
                     <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 text-center mb-4">Nexus Advantage vs Others</p>
                     
                     <div className="space-y-6">
                        {[
                           { label: "Payroll Speed", nexus: 98, other: 30 },
                           { label: "Ease of Use", nexus: 100, other: 45 },
                           { label: "AI Capabilities", nexus: 95, other: 15 },
                           { label: "Staff Engagement", nexus: 88, other: 40 }
                        ].map((stat, i) => (
                           <div key={i} className="space-y-3">
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                 <span>{stat.label}</span>
                                 <span className="text-blue-600">Nexus: {stat.nexus}%</span>
                              </div>
                              <div className="h-4 bg-slate-50 border border-slate-100 rounded-full overflow-hidden relative">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   whileInView={{ width: `${stat.nexus}%` }}
                                   transition={{ duration: 1.5, delay: i * 0.1 }}
                                   className="absolute h-full left-0 top-0 bg-blue-600 rounded-full z-10 shadow-lg shadow-blue-200"
                                 />
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   whileInView={{ width: `${stat.other}%` }}
                                   transition={{ duration: 1.5, delay: i * 0.2 }}
                                   className="absolute h-full left-0 top-0 bg-slate-200 rounded-full"
                                 />
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="p-8 bg-blue-50 border border-blue-100 rounded-3xl flex items-center justify-between">
                        <div>
                           <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Estimated Savings</p>
                           <p className="text-3xl font-black text-blue-900 tracking-tighter">40 Hours / Month</p>
                        </div>
                        <Activity className="text-blue-500 animate-pulse" size={40} />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* ── Simple Contact Section ── */}
      <section id="contact" className="py-32 px-6">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-blue-600 mb-6">Let's Get Started</h2>
            <p className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic leading-[1] mb-12">Take Your Team to <br /> <span className="bg-emerald-50 text-emerald-600 px-6 rounded-[2rem] border-b-8 border-emerald-100 italic">the Next Level.</span></p>
            
            <div className="bg-white border-2 border-slate-100 p-12 md:p-20 rounded-[4rem] shadow-2xl relative">
              {formStatus === 'SUCCESS' ? (
                 <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-20 text-center space-y-6">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl"><CheckCircle2 size={48}/></div>
                    <h3 className="text-4xl font-black uppercase italic">We'll be in touch!</h3>
                    <p className="text-slate-500 font-medium max-w-xs mx-auto italic">Thank you for choosing Nexus. One of our specialists will reach out to you within the next hour.</p>
                 </motion.div>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setFormStatus('SENDING');
                  try {
                    await axios.post('/api/support/leads', formData);
                    setFormStatus('SUCCESS');
                  } catch { setFormStatus('IDLE'); }
                }} className="space-y-10 text-left">
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Your Full Name</label>
                         <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Dow" className="w-full h-16 bg-slate-50 border border-slate-100 rounded-3xl px-8 text-slate-900 outline-none focus:border-blue-600 transition-all font-bold placeholder:text-slate-300" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Work Email</label>
                         <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="md@company.com" className="w-full h-16 bg-slate-50 border border-slate-100 rounded-3xl px-8 text-slate-900 outline-none focus:border-blue-600 transition-all font-bold placeholder:text-slate-300" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Company Name</label>
                         <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="e.g. MC Bauchemie" className="w-full h-16 bg-slate-50 border border-slate-100 rounded-3xl px-8 text-slate-900 outline-none focus:border-blue-600 transition-all font-bold placeholder:text-slate-300" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">How can we help you?</label>
                         <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Tell us about your team size and HR goals..." className="w-full h-40 bg-slate-50 border border-slate-100 rounded-3xl p-8 text-slate-900 outline-none focus:border-blue-600 transition-all font-bold resize-none placeholder:text-slate-300" />
                      </div>
                   </div>
                   <button 
                     disabled={formStatus === 'SENDING'}
                     className="w-full py-8 bg-blue-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                   >
                     {formStatus === 'SENDING' ? 'Processing...' : <>Contact Sales <ArrowRight/></>}
                   </button>
                </form>
              )}
            </div>
         </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-20 px-6 border-t border-slate-100 bg-white">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-16">
            <div className="max-w-sm space-y-8">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white"><Shield size={24}/></div>
                  <span className="font-black text-2xl tracking-tighter text-slate-900 italic">NEXUS.</span>
               </div>
               <p className="text-slate-400 font-medium leading-relaxed">
                 The best human resource software for growing companies. Manage people, payroll, and growth in one simple app.
               </p>
               <div className="flex gap-4">
                  {[Phone, Mail, Globe].map((Icon, i) => (
                    <div key={i} className="w-10 h-10 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all cursor-pointer"><Icon size={20}/></div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-20">
               <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 italic">Company</p>
                  <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-slate-400">
                     <li className="hover:text-blue-600 cursor-pointer">About Us</li>
                     <li className="hover:text-blue-600 cursor-pointer">Careers</li>
                     <li className="hover:text-blue-600 cursor-pointer">Privacy</li>
                  </ul>
               </div>
               <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 italic">Product</p>
                  <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-slate-400">
                     <li onClick={handleDemoLaunch} className="hover:text-blue-600 cursor-pointer">Live Demo</li>
                     <li onClick={() => navigate('/login')} className="hover:text-blue-600 cursor-pointer">Login</li>
                     <li className="hover:text-blue-600 cursor-pointer">Pricing</li>
                  </ul>
               </div>
               <div className="space-y-6 hidden sm:block">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 italic">Security</p>
                  <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-slate-400">
                     <li className="hover:text-blue-600 cursor-pointer">ISO 27001</li>
                     <li className="hover:text-blue-600 cursor-pointer">GDPR</li>
                     <li className="hover:text-blue-600 cursor-pointer">Uptime</li>
                  </ul>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">© 2026 NEXUS CORE. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">System Status: Operational</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default StormglideHome;
