import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Save, Eye, RefreshCw, Sparkles, 
  Shield, Zap, Globe, MessageSquare, Image,
  Type, ArrowRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { toast } from '../../utils/toast';

const SiteManagement = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'features' | 'security' | 'pricing'>('hero');
  
  const [siteData, setSiteData] = useState({
    heroTitle: 'Manage Your Company Brain.',
    heroSub: 'The Nexus HRM Platform is a recursive enterprise shell designed to handle the complexities of modern teams.',
    pricingModel: 'Consultative Inquiry (DM for Price)',
    securityLevel: 'Military-Grade (SOC 2 Type II)',
    contactEmail: 'strategic@nexus-core.com'
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Showroom Cluster Synchronized Successfully');
    }, 1500);
  };

  return (
    <div className="space-y-10 p-2">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Showroom Control</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Nexus Public Interface Manager v1.0.4</p>
        </div>
        <div className="flex gap-4">
           <button onClick={() => window.open('/', '_blank')} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
             <Eye size={14} /> Open Live Site
           </button>
           <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
             {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />} 
             {isSaving ? 'Syncing Cluster...' : 'Push to Production'}
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left Control Column */}
        <div className="lg:col-span-2 space-y-8">
           {/* Tab Switcher */}
           <div className="flex gap-2 p-1 bg-slate-100/50 rounded-2xl w-fit">
              {[
                { id: 'hero', label: 'Hero Display', icon: LayoutDashboard },
                { id: 'features', label: 'Feature Exhibits', icon: Zap },
                { id: 'security', label: 'Security Protocols', icon: Shield },
                { id: 'pricing', label: 'Pricing Strategy', icon: Globe }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === tab.id ? "bg-white text-blue-600 shadow-xl shadow-blue-600/5 border border-blue-100" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <tab.icon size={14} /> {tab.label}
                </button>
              ))}
           </div>

           {/* Hero Editor */}
           {activeTab === 'hero' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                <div className="space-y-6">
                   <div>
                      <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-3 ml-1">Main Headline</label>
                      <input 
                        value={siteData.heroTitle}
                        onChange={e => setSiteData({...siteData, heroTitle: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all uppercase italic" 
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-3 ml-1">Sub-Headline (The Pitch)</label>
                      <textarea 
                        value={siteData.heroSub}
                        onChange={e => setSiteData({...siteData, heroSub: e.target.value})}
                        className="w-full h-32 bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 text-sm font-medium text-slate-500 outline-none focus:border-blue-600 focus:bg-white transition-all resize-none italic" 
                      />
                   </div>
                </div>
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                   <div className="flex items-center gap-3 text-emerald-500">
                      <CheckCircle2 size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Headline is SEO Optimized</span>
                   </div>
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Character Count: {siteData.heroTitle.length}/60</p>
                </div>
             </motion.div>
           )}

           {/* Pricing Strategy */}
           {activeTab === 'pricing' && (
             <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm space-y-8">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-lg"><Globe size={24}/></div>
                   <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Economic Engagement Hub</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Current Strategy: {siteData.pricingModel}</p>
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                      <div className="flex items-center gap-4 mb-4">
                         <MessageSquare className="text-blue-600" size={20} />
                         <span className="text-[10px] font-black uppercase tracking-widest">Consultative Model Active</span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium mb-6">Nexus is currently configured for bespoke enterprise engagement. Pricing tables are hidden in favor of direct strategic inquiries.</p>
                      <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="text-[9px] font-black text-slate-900 uppercase tracking-widest block mb-2">Display Text</label>
                            <input value="Contact for Quote" className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-black text-slate-900 uppercase italic outline-none focus:border-blue-600 transition-all" />
                         </div>
                         <div>
                            <label className="text-[9px] font-black text-slate-900 uppercase tracking-widest block mb-2">Response SLA Target</label>
                            <input value="< 60 Minutes" className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-black text-slate-900 uppercase italic outline-none focus:border-blue-600 transition-all" />
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
           )}

           {activeTab === 'features' && (
             <div className="flex flex-col items-center justify-center p-20 bg-slate-50 border border-dashed border-slate-200 rounded-[3rem]">
                <Zap className="text-slate-300 mb-6" size={48} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Feature Module Logic Syncing...</p>
             </div>
           )}

           {activeTab === 'security' && (
             <div className="flex flex-col items-center justify-center p-20 bg-slate-50 border border-dashed border-slate-200 rounded-[3rem]">
                <Shield className="text-slate-300 mb-6" size={48} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Security Exhibit Drafting...</p>
             </div>
           )}
        </div>

        {/* Right Preview Column */}
        <div className="space-y-8">
           <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full translate-x-10 -translate-y-10" />
              <div className="flex items-center gap-3 mb-10">
                 <Sparkles className="text-blue-500" size={16} />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Showroom Snapshot</span>
              </div>
              
              <div className="space-y-6 pt-4 border-t border-white/5">
                 <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Shell</p>
                 <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
                    <p className="text-[8px] font-black text-blue-400 uppercase tracking-[0.4em] mb-2">HERO SECTION</p>
                    <h4 className="text-xl font-black italic uppercase leading-none mb-3 underline decoration-blue-600 decoration-2 underline-offset-4">{siteData.heroTitle}</h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">{siteData.heroSub.substring(0, 100)}...</p>
                 </div>
                 
                 <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10">
                    <p className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-2">PRICING TRIGGER</p>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase italic tracking-widest">{siteData.pricingModel}</span>
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                 </div>
              </div>

              <div className="mt-12 p-6 bg-blue-600 rounded-[2rem] shadow-xl text-center">
                 <p className="text-[10px] font-black uppercase tracking-widest mb-1">Live Status</p>
                 <p className="text-sm font-black uppercase italic tracking-tighter">Synchronized High-Fidelity</p>
              </div>
           </div>

           <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Performance Metrics</h3>
              <div className="space-y-6">
                 {[
                   { label: 'Site Health', value: '100%', color: 'text-emerald-500' },
                   { label: 'Conversion Lift', value: '+12.4%', color: 'text-blue-500' },
                   { label: 'Latency (LCP)', value: '0.8s', color: 'text-slate-900' }
                 ].map(m => (
                   <div key={m.label} className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400">{m.label}</span>
                      <span className={cn("text-sm font-black", m.color)}>{m.value}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SiteManagement;
