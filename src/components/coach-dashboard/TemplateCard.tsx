
import React from 'react';
import { BoardTemplate } from '../types';
import { Layers, ArrowRight } from 'lucide-react';

interface TemplateCardProps {
  template: BoardTemplate;
  onUse?: (templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onUse }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-200 flex flex-col h-full group overflow-hidden">
      
      {/* Header Image & Overlay */}
      <div className="relative h-32 overflow-hidden bg-slate-100">
        <img 
            src={template.thumbnailUrl} 
            alt={template.title} 
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        <div className="absolute bottom-3 left-4 right-4">
            <div className="flex justify-between items-end">
                <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-indigo-500/90 text-white text-[10px] font-bold uppercase tracking-wider mb-1 backdrop-blur-sm">
                        {template.category}
                    </span>
                    <h3 className="text-white font-bold text-lg leading-tight">{template.title}</h3>
                </div>
            </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {template.description}
        </p>

        {/* Lane Preview */}
        <div className="mb-4 bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="flex items-center text-slate-400 mb-2">
                <Layers size={14} className="mr-1.5" />
                <span className="text-xs font-semibold uppercase tracking-wide">Board Structure (Lanes)</span>
            </div>
            <div className="space-y-2">
                {template.lanes.map((lane, index) => (
                    <div key={index} className="flex items-center text-xs text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2"></div>
                        {lane}
                    </div>
                ))}
            </div>
        </div>
        
        {/* Footer / Action */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
             <div className="flex -space-x-1.5">
                {/* Fake user faces to show popularity */}
                <div className="w-6 h-6 rounded-full border border-white bg-gray-200"></div>
                <div className="w-6 h-6 rounded-full border border-white bg-gray-300"></div>
                <div className="w-6 h-6 rounded-full border border-white bg-indigo-100 flex items-center justify-center text-[8px] font-bold text-indigo-600">+1k</div>
             </div>
             <button 
                onClick={() => onUse && onUse(template.id)}
                className="flex items-center bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
             >
                Use Template
                <ArrowRight size={12} className="ml-1.5" />
             </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
