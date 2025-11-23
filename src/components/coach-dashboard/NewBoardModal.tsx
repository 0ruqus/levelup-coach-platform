
import React, { useState, useEffect } from 'react';
import { X, User, Building2, Check, Layout, Sparkles, Mail, Phone } from 'lucide-react';
import { BoardTemplate, NewBoardPayload } from '../types';

interface NewBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewBoardPayload) => void;
  templates: BoardTemplate[];
  preSelectedTemplateId?: string | null;
}

const NewBoardModal: React.FC<NewBoardModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  templates,
  preSelectedTemplateId 
}) => {
  const [formData, setFormData] = useState<NewBoardPayload>({
    clientName: '',
    isOrganization: false,
    headline: '',
    subhead: '',
    templateId: templates[0]?.id || '',
    inviteEmail: '',
    invitePhone: ''
  });

  // Effect to handle pre-selection from the "Template Library" tab
  useEffect(() => {
    if (preSelectedTemplateId) {
      setFormData(prev => ({ ...prev, templateId: preSelectedTemplateId }));
    }
  }, [preSelectedTemplateId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.headline) return; // Basic validation
    onSubmit(formData);
    // Reset form after submit
    setFormData({
      clientName: '',
      isOrganization: false,
      headline: '',
      subhead: '',
      templateId: templates[0]?.id || '',
      inviteEmail: '',
      invitePhone: ''
    });
  };

  const selectedTemplate = templates.find(t => t.id === formData.templateId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">New Client Board</h2>
            <p className="text-xs text-slate-500">Set up a collaborative space for a new engagement.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section 1: Client Info */}
          <section className="space-y-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Client Details</label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {/* Type Toggle */}
               <div className="col-span-1 sm:col-span-2 flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, isOrganization: false})}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 border rounded-xl transition-all ${!formData.isOrganization ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                  >
                    <User size={18} />
                    <span className="text-sm font-semibold">Individual</span>
                    {!formData.isOrganization && <Check size={16} className="ml-2" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, isOrganization: true})}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 border rounded-xl transition-all ${formData.isOrganization ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                  >
                    <Building2 size={18} />
                    <span className="text-sm font-semibold">Organization</span>
                    {formData.isOrganization && <Check size={16} className="ml-2" />}
                  </button>
               </div>

               {/* Name Input */}
               <div className="col-span-1 sm:col-span-2">
                 <label className="block text-sm font-medium text-slate-700 mb-1">
                    {formData.isOrganization ? 'Company Name' : 'Client Name'}
                 </label>
                 <input 
                    type="text" 
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    placeholder={formData.isOrganization ? "e.g. Acme Corp" : "e.g. Jane Doe"}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                    autoFocus
                 />
               </div>
            </div>
          </section>

          {/* Section: Client Invitation */}
          <section className="space-y-4">
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Invite Client</label>
             <p className="text-xs text-slate-500 -mt-3 mb-2">Send an invite via email or SMS to collaborate on this board.</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-slate-400" />
                    </div>
                    <input 
                        type="email" 
                        value={formData.inviteEmail}
                        onChange={(e) => setFormData({...formData, inviteEmail: e.target.value})}
                        placeholder="Email Address"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                    />
                  </div>
                </div>
                <div>
                   <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-slate-400" />
                    </div>
                    <input 
                        type="tel" 
                        value={formData.invitePhone}
                        onChange={(e) => setFormData({...formData, invitePhone: e.target.value})}
                        placeholder="Phone Number"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                    />
                  </div>
                </div>
             </div>
          </section>

          {/* Section 2: Board Definition */}
          <section className="space-y-4">
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Board Focus</label>
             <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project Headline</label>
                  <input 
                      type="text" 
                      value={formData.headline}
                      onChange={(e) => setFormData({...formData, headline: e.target.value})}
                      placeholder="e.g. Q4 Growth Strategy"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subhead / Goal</label>
                  <input 
                      type="text" 
                      value={formData.subhead}
                      onChange={(e) => setFormData({...formData, subhead: e.target.value})}
                      placeholder="e.g. Launching 3 new product lines"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
             </div>
          </section>

          {/* Section 3: Template Selection */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Select Framework</label>
                <span className="text-xs text-indigo-600 font-medium cursor-pointer hover:underline">View all templates</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {templates.map(tpl => (
                   <div 
                      key={tpl.id}
                      onClick={() => setFormData({...formData, templateId: tpl.id})}
                      className={`cursor-pointer p-3 rounded-lg border transition-all flex items-start space-x-3 ${formData.templateId === tpl.id ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-300'}`}
                   >
                      <div className="w-12 h-12 rounded bg-slate-100 flex-shrink-0 overflow-hidden">
                          <img src={tpl.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                          <p className={`text-sm font-bold ${formData.templateId === tpl.id ? 'text-indigo-900' : 'text-slate-800'}`}>{tpl.title}</p>
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{tpl.lanes.length} Lanes: {tpl.lanes.slice(0, 3).join(', ')}...</p>
                      </div>
                   </div>
               ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center text-xs text-slate-500">
               {selectedTemplate && (
                   <>
                    <Layout size={14} className="mr-1.5" />
                    Using: <span className="font-semibold ml-1">{selectedTemplate.title}</span>
                   </>
               )}
            </div>
            <div className="flex space-x-3">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  className="flex items-center px-6 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <Sparkles size={16} className="mr-2" />
                  Create Board
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default NewBoardModal;
