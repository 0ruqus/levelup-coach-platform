


import React, { useState } from 'react';
import { Board, ClientType, AlertType } from '../types';
import { MoreHorizontal, Layout, Users, Briefcase, GraduationCap, Home, UserCog, Building, AlertTriangle, ThumbsUp, CheckCircle, X, AlertCircle, Target, Flame, FileText, ShieldCheck, TrendingUp, Award, Star, Zap, BarChart2, ArrowUpCircle, Clock, CheckSquare, Smile, Frown, ChevronLeft, ChevronRight, Handshake } from 'lucide-react';

interface BoardCardProps {
  board: Board;
}

const BoardCard: React.FC<BoardCardProps> = ({ board }) => {
  const [alertIndex, setAlertIndex] = useState(0);
  const alerts = board.alerts || [];
  const currentAlert = alertIndex < alerts.length ? alerts[alertIndex] : null;

  // Carousel Logic: Next
  const nextAlert = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAlertIndex(prev => (prev + 1) % alerts.length);
  };

  // Carousel Logic: Previous
  const prevAlert = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAlertIndex(prev => (prev - 1 + alerts.length) % alerts.length);
  };

  // Clear All Logic (Hide Overlay)
  const clearAllAlerts = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAlertIndex(alerts.length);
  };
  
  const getIcon = (type: ClientType) => {
    switch (type) {
      case ClientType.CAREER: return <Users size={14} />;
      case ClientType.STARTUP: return <Briefcase size={14} />;
      case ClientType.MENTORING: return <GraduationCap size={14} />;
      case ClientType.ESTATE: return <Home size={14} />;
      case ClientType.PERSONAL_ASSISTANT: return <UserCog size={14} />;
      case ClientType.FAMILY_OFFICE: return <Building size={14} />;
      case ClientType.PARTNERSHIP: return <Handshake size={14} />;
      default: return <Layout size={14} />;
    }
  };

  const getThemeColor = (type: ClientType) => {
    switch (type) {
      case ClientType.CAREER: return 'text-purple-600 bg-purple-50 border-purple-200';
      case ClientType.STARTUP: return 'text-blue-600 bg-blue-50 border-blue-200';
      case ClientType.MENTORING: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case ClientType.ESTATE: return 'text-amber-700 bg-amber-50 border-amber-200';
      case ClientType.PERSONAL_ASSISTANT: return 'text-pink-600 bg-pink-50 border-pink-200';
      case ClientType.FAMILY_OFFICE: return 'text-slate-700 bg-slate-100 border-slate-300';
      case ClientType.PARTNERSHIP: return 'text-cyan-600 bg-cyan-50 border-cyan-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getAlertStyles = (type: AlertType, title: string) => {
      // Dynamic Icon based on Title for specific metrics
      let icon = <Layout size={32} />;
      
      const titleLower = title.toLowerCase();
      
      // Extensive Icon Mapping based on User Request
      if (titleLower.includes('streak')) icon = <Flame size={32} />;
      else if (titleLower.includes('alignment')) icon = <Target size={32} />;
      else if (titleLower.includes('blocker') || titleLower.includes('resolved')) icon = <ShieldCheck size={32} />;
      else if (titleLower.includes('word') || titleLower.includes('story') || titleLower.includes('value') || titleLower.includes('strength') || titleLower.includes('document') || titleLower.includes('deck') || titleLower.includes('sheet')) icon = <FileText size={32} />;
      else if (titleLower.includes('improve') || titleLower.includes('increase') || titleLower.includes('evolved') || titleLower.includes('growth')) icon = <TrendingUp size={32} />;
      else if (titleLower.includes('quality') || titleLower.includes('rating') || titleLower.includes('score')) icon = <Award size={32} />;
      else if (titleLower.includes('self') || titleLower.includes('star')) icon = <Star size={32} />;
      else if (titleLower.includes('difficulty') || titleLower.includes('high') || titleLower.includes('burn')) icon = <Zap size={32} />;
      else if (titleLower.includes('engagement') || titleLower.includes('completed') || titleLower.includes('%') || titleLower.includes('rate') || titleLower.includes('runway')) icon = <BarChart2 size={32} />;
      else if (titleLower.includes('path') || titleLower.includes('advance')) icon = <ArrowUpCircle size={32} />;
      else if (titleLower.includes('time') || titleLower.includes('delay') || titleLower.includes('schedule')) icon = <Clock size={32} />;
      else if (titleLower.includes('check') || titleLower.includes('done') || titleLower.includes('meeting')) icon = <CheckSquare size={32} />;
      else if (titleLower.includes('commit') || titleLower.includes('failed') || titleLower.includes('bug')) icon = <Frown size={32} />;
      else if (titleLower.includes('happy') || titleLower.includes('great')) icon = <Smile size={32} />;
      else {
          // Fallback based on Type
          switch (type) {
              case 'critical': icon = <AlertTriangle size={32} />; break;
              case 'review': icon = <ThumbsUp size={32} />; break;
              case 'success': icon = <CheckCircle size={32} />; break;
              case 'warning': icon = <AlertCircle size={32} />; break;
              case 'info': icon = <FileText size={32} />; break;
          }
      }

      // Using /80 opacity to allow seeing through to the card image
      switch (type) {
          case 'critical': return { bg: 'bg-red-600/80', icon, text: 'text-white' };
          case 'review': return { bg: 'bg-blue-600/80', icon, text: 'text-white' };
          case 'success': return { bg: 'bg-emerald-600/80', icon, text: 'text-white' };
          case 'warning': return { bg: 'bg-amber-600/80', icon, text: 'text-white' };
          case 'info': return { bg: 'bg-indigo-600/80', icon, text: 'text-white' };
          default: return { bg: 'bg-slate-800/80', icon, text: 'text-white' };
      }
  };

  const alertStyle = currentAlert ? getAlertStyles(currentAlert.type, currentAlert.title) : null;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-slate-100 flex flex-col h-full group overflow-hidden relative">
      
      {/* Header (Fixed Height, Always Visible) */}
      <div className="flex-none p-4 pb-2 z-20 relative bg-white">
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-3">
                {/* Logic for Logo (Org) vs Avatar (Person) */}
                {board.isOrganization ? (
                    <div className="w-10 h-10 rounded-md border border-slate-100 shadow-sm overflow-hidden flex-shrink-0 bg-white">
                        <img src={board.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden flex-shrink-0 bg-slate-100">
                        <img src={board.logoUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                )}
                
                <div className="overflow-hidden">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                            {board.clientName}
                        </h3>
                        <div className={`p-1 rounded-full flex-shrink-0 ${getThemeColor(board.type)}`}>
                            {getIcon(board.type)}
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{board.isOrganization ? 'Organization' : 'Individual'}</p>
                </div>
            </div>
            <button className="text-slate-300 hover:text-slate-600 transition-colors">
                <MoreHorizontal size={18} />
            </button>
        </div>
      </div>

      {/* Main Body Content (Flexible Height) */}
      <div className="flex-1 flex flex-col px-4 min-h-0">
          
        {/* Board Title & Tags (Fixed within body) */}
        <div className="flex-none mb-3">
            <h4 className="text-sm font-semibold text-slate-900 truncate">{board.headline}</h4>
            <p className="text-xs text-slate-500 mb-2 truncate">{board.subhead}</p>
            
            <div className="flex flex-wrap gap-1.5 h-6 overflow-hidden">
                {board.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[10px] font-semibold rounded border border-slate-200 whitespace-nowrap">
                        {tag}
                    </span>
                ))}
            </div>
        </div>

        {/* Board Visual WITH Alert Overlay - Flexible to fill remaining space */}
        <div className="flex-1 relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200 group/image mb-3 min-h-0">
            {/* Background Image */}
            <img 
                src={board.thumbnailUrl} 
                alt={board.headline} 
                className="w-full h-full object-cover opacity-90 group-hover/image:opacity-100 transition-opacity"
            />
            {/* Dark Gradient for text readability when no alert */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60"></div>
            
            {/* Standard Label (Hidden if alert active) */}
            {!currentAlert && (
                <div className="absolute bottom-2 left-3 text-white text-xs font-medium flex items-center animate-in fade-in duration-300 drop-shadow-md">
                    <Layout size={12} className="mr-1.5 opacity-90" />
                    Open Board
                </div>
            )}

            {/* --- ALERT OVERLAY SYSTEM (Over Image Only) --- */}
            {currentAlert && alertStyle && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
                    
                    {/* Transparent Color Field with Blur (80% Opacity) */}
                    <div 
                        className={`absolute inset-0 ${alertStyle.bg} backdrop-blur-sm transition-colors duration-300`}
                    ></div>

                    {/* Icon & Metric (Full Opacity) */}
                    <div className="relative z-40 text-white flex flex-col items-center p-2 w-full max-w-[80%]">
                        <div className="drop-shadow-lg transform transition-transform group-hover:scale-110 duration-200 mb-1 opacity-100">
                            {alertStyle.icon}
                        </div>
                        <div className="text-2xl font-black tracking-tight drop-shadow-md leading-none mb-1">
                            {currentAlert.metric}
                        </div>
                        <div className="text-[9px] font-bold mt-0.5 opacity-100 uppercase tracking-wider leading-tight px-3 border-t border-white/30 pt-1 line-clamp-1">
                            {currentAlert.title}
                        </div>
                    </div>

                    {/* Controls */}
                    {/* Clear All (X) */}
                    <button 
                        onClick={clearAllAlerts}
                        className="absolute top-1.5 right-1.5 p-1 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-all z-50"
                        title="Clear All Alerts"
                    >
                        <X size={16} />
                    </button>

                    {/* Carousel Arrows (Only if multiple) */}
                    {alerts.length > 1 && (
                        <>
                            <button 
                                onClick={prevAlert}
                                className="absolute left-1 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-all z-50 group/arrow"
                            >
                                <ChevronLeft size={24} className="group-hover/arrow:scale-110 transition-transform" />
                            </button>
                            <button 
                                onClick={nextAlert}
                                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-all z-50 group/arrow"
                            >
                                <ChevronRight size={24} className="group-hover/arrow:scale-110 transition-transform" />
                            </button>
                        </>
                    )}

                    {/* Dots Indicator (Only if multiple) */}
                    {alerts.length > 1 && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1.5 z-40">
                            {alerts.map((_, idx) => (
                                <div 
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${idx === alertIndex ? 'bg-white scale-110 opacity-100' : 'bg-white/40'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>

      </div>

      {/* Footer (Fixed at Bottom, Outside Body Flex) */}
      <div className="flex-none px-4 pb-4 pt-0 bg-white z-20 mt-auto">
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-[10px] text-slate-400 font-medium flex items-center">
                <Clock size={10} className="mr-1" />
                Active {board.lastActive}
            </span>
            <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center group/btn transition-colors px-2 py-1 rounded hover:bg-indigo-50">
                Open Board 
                <span className="inline-block transition-transform group-hover/btn:translate-x-1 ml-0.5">→</span>
            </button>
          </div>
      </div>

    </div>
  );
};

export default BoardCard;