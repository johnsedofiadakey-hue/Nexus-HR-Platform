import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Star, Quote, Shield } from 'lucide-react';

const REVIEWS = [
  {
    text: "The Operating System for Human Potential. Nexus reduced our overhead by 40% in just one quarter.",
    author: "Director of Operations, Enterprise Ltd.",
    tag: "EFFICIENCY_GAINED"
  },
  {
    text: "Atomic Nuclear Payroll is a game changer. We processed 500+ employees in 12 seconds with zero errors.",
    author: "CFO, Global Manufacturing",
    tag: "PAYROLL_SYNCED"
  },
  {
    text: "The Cortex AI identified talent gaps we didn't even know we had. A recursive brain for our company.",
    author: "Head of Talent, ScaleUp Africa",
    tag: "TALENT_OPTIMIZED"
  }
];

export const ReviewCortex = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative group">
      <div className="absolute -inset-4 bg-nexus-blue-600/10 blur-[60px] rounded-[4rem] group-hover:bg-nexus-blue-600/20 transition-all duration-700"></div>
      
      <div className="relative bg-nexus-slate-900 border border-white/10 rounded-[3rem] p-12 overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between mb-12">
          <div class="flex gap-2">
            <div class="w-3 h-3 rounded-full bg-rose-500/50"></div>
            <div class="w-3 h-3 rounded-full bg-amber-500/50"></div>
            <div class="w-3 h-3 rounded-full bg-emerald-500/50"></div>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-nexus-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">CORE_REVIEW_PROTOCOL_v4.1.6</span>
          </div>
        </div>

        <div className="min-h-[200px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 1.05 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nexus-blue-600/10 border border-nexus-blue-600/20">
                <span className="text-[8px] font-black text-nexus-blue-500 uppercase tracking-widest">{REVIEWS[index].tag}</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white leading-tight">
                "{REVIEWS[index].text}"
              </h3>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nexus-blue-600 to-nexus-blue-800 flex items-center justify-center text-white font-black text-xs">
                  {REVIEWS[index].author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{REVIEWS[index].author}</p>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="fill-amber-500 text-amber-500" />)}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dynamic Indicator */}
        <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-nexus-blue-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cortex is analyzing satisfaction...</span>
          </div>
          <div className="flex gap-2">
            {REVIEWS.map((_, i) => (
              <div key={i} className={`h-1 transition-all duration-500 rounded-full ${i === index ? 'w-8 bg-nexus-blue-600' : 'w-2 bg-white/10'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
