import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

interface NocModuleProps {
    title: string;
    subtitle?: string;
    icon: React.ElementType;
    iconColor?: string;
    className?: string;
    children: React.ReactNode;
    headerAction?: React.ReactNode;
}

const NocModule: React.FC<NocModuleProps> = ({ 
    title, 
    subtitle, 
    icon: Icon, 
    iconColor = "text-emerald-500", 
    className, 
    children,
    headerAction
}) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "glass p-6 border-white/5 bg-white/[0.02] relative overflow-hidden group",
                className
            )}
        >
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className={cn("p-2 rounded-xl bg-white/5 border border-white/5", iconColor)}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">{title}</h3>
                        {subtitle && <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{subtitle}</p>}
                    </div>
                </div>
                {headerAction}
            </div>
            
            <div className="relative z-10">
                {children}
            </div>
            
            {/* Background Decoration */}
            <div className={cn("absolute top-0 right-0 p-8 opacity-[0.02] transition-transform group-hover:scale-110 pointer-events-none", iconColor)}>
                <Icon size={120} />
            </div>
        </motion.div>
    );
};

export default NocModule;
