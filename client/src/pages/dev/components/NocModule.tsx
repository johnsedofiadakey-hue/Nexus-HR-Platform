import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NocModuleProps {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    iconColor?: string;
    children: React.ReactNode;
}

const NocModule: React.FC<NocModuleProps> = ({ title, subtitle, icon: Icon, iconColor = 'text-blue-600', children }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200/50 transition-transform hover:rotate-6">
                    <Icon size={24} className={iconColor} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">{title}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>
                </div>
            </div>
            <div>{children}</div>
        </div>
    );
};

export default NocModule;
