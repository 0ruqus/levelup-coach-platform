

import React from 'react';
import { Task, Win, Activity } from '../types';
import { Sun, CheckSquare, Trophy, Activity as ActivityIcon, MoreHorizontal, Star, PartyPopper, Briefcase, GripVertical, Clock, Calendar, Video, Phone, FileText } from 'lucide-react';

// --- Generic Container ---
const WidgetContainer: React.FC<{ 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode;
    className?: string;
    headerAction?: React.ReactNode;
}> = ({ title, icon, children, className = "", headerAction }) => (
  <div className={`bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col h-full select-none ${className}`}>
    <div className="flex items-center justify-between mb-4 cursor-move group">
        <div className="flex items-center space-x-2 text-slate-700">
            <div className="text-slate-300 group-hover:text-slate-500 transition-colors">
                <GripVertical size={16} />
            </div>
            {icon}
            <h2 className="font-semibold text-sm uppercase tracking-wide">{title}</h2>
        </div>
        {headerAction || (title.includes('Day') && <div className="text-amber-500"><Sun size={18} /></div>)}
    </div>
    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        {children}
    </div>
  </div>
);

// --- My Day Widget (Visual Timeline Style) ---
export const MyDayWidget: React.FC<{ tasks: Task[], title?: string }> = ({ tasks, title = "My Day" }) => {
    // Sort tasks by time (mock logic assuming string sort works for HH:MM AM/PM for demo)
    const upcomingTasks = tasks.filter(t => t.category === 'Personal'); 

    const getTaskIcon = (title: string) => {
        if (title.includes('call') || title.includes('Call')) return <Phone size={14} />;
        if (title.includes('Review') || title.includes('Draft')) return <FileText size={14} />;
        if (title.includes('Meeting') || title.includes('Interview') || title.includes('Sync')) return <Video size={14} />;
        return <Calendar size={14} />;
    };

    return (
        <WidgetContainer title={title} icon={<Calendar size={16} className="text-indigo-500" />}>
            <div className="relative pl-2 pt-2 space-y-6">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-slate-100"></div>

                {upcomingTasks.map((task, idx) => (
                    <div key={task.id} className="relative pl-10 group">
                        {/* Timeline Dot */}
                        <div className={`absolute left-3 top-3 w-5 h-5 rounded-full border-2 border-white shadow-sm z-10 flex items-center justify-center ${
                            idx === 0 ? 'bg-indigo-500' : 'bg-slate-200'
                        }`}>
                            {idx === 0 && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
                        </div>

                        {/* Time Label */}
                        <div className="absolute -left-1 top-3.5 text-[10px] font-bold text-slate-400 w-10 text-right hidden">
                            {task.dueTime.split(' ')[0]}
                        </div>

                        {/* Task Card */}
                        <div className={`p-3 rounded-xl border transition-all ${
                            idx === 0 
                                ? 'bg-indigo-50/50 border-indigo-200 shadow-sm' 
                                : 'bg-white border-slate-100 hover:border-slate-300'
                        }`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                                    idx === 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    <Clock size={10} className="mr-1" />
                                    <span>{task.dueTime}</span>
                                </span>
                                {idx === 0 && <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Up Next</span>}
                            </div>
                            
                            <h4 className={`text-sm font-semibold mb-1 ${idx === 0 ? 'text-indigo-900' : 'text-slate-700'}`}>
                                {task.title}
                            </h4>
                            
                            <div className="flex items-center space-x-2 mt-2">
                                <div className={`flex items-center space-x-1 text-[11px] font-medium px-2 py-1 rounded-md ${
                                    idx === 0 ? 'bg-white text-indigo-600 border border-indigo-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
                                }`}>
                                    {getTaskIcon(task.title)}
                                    <span>{task.category}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {upcomingTasks.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-sm">
                        No scheduled tasks for today.
                    </div>
                )}
            </div>
        </WidgetContainer>
    );
};

// --- Client Wins Widget ---
export const ClientWinsWidget: React.FC<{ wins: Win[], title?: string }> = ({ wins, title = "Client Wins" }) => {
    return (
        <WidgetContainer title={title} icon={<Trophy size={16} className="text-yellow-500" />}>
            <div className="space-y-3">
                {wins.map(win => (
                    <div key={win.id} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100 relative group">
                        <div className="flex items-start space-x-3">
                            <div className="relative">
                                <img src={win.clientAvatar} alt={win.clientName} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-full p-0.5">
                                    <Star size={10} fill="currentColor" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide">{win.clientName}</p>
                                    <span className="text-[10px] text-yellow-600 opacity-70">{win.date}</span>
                                </div>
                                <p className="text-sm text-slate-800 leading-snug mt-1 font-medium">{win.description}</p>
                                
                                {/* Celebration Action */}
                                <div className="mt-3 flex justify-end">
                                    <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-white text-orange-600 text-xs font-semibold rounded-full shadow-sm border border-orange-100 hover:bg-orange-50 transition-colors">
                                        <PartyPopper size={14} />
                                        <span>Celebrate Win</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </WidgetContainer>
    );
};

// --- Client Pulse Widget (Formerly Activity) ---
export const ClientPulseWidget: React.FC<{ activity: Activity[], title?: string }> = ({ activity, title = "Client Pulse" }) => {
    return (
        <WidgetContainer title={title} icon={<ActivityIcon size={16} className="text-indigo-500" />}>
             <div className="space-y-5">
                {activity.map(act => (
                    <div key={act.id} className="flex space-x-3">
                         <div className="relative flex-shrink-0">
                            <img src={act.clientAvatar} className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200" alt={act.clientName} />
                            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                act.status === 'positive' ? 'bg-emerald-500' : 
                                act.status === 'critical' ? 'bg-red-500' : 'bg-slate-400'
                            }`}></div>
                         </div>
                        <div>
                            <p className="text-sm text-slate-700 leading-snug">
                                <span className="font-semibold text-slate-900">{act.clientName}</span> {act.action}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1 font-medium">{act.timeAgo}</p>
                        </div>
                    </div>
                ))}
             </div>
        </WidgetContainer>
    );
};

// --- My Tasks Widget ---
export const MyTasksWidget: React.FC<{ tasks: Task[], title?: string }> = ({ tasks, title = "My Tasks" }) => {
    const workTasks = tasks.filter(t => t.category === 'Client Work');

    return (
        <WidgetContainer title={title} icon={<CheckSquare size={16} className="text-blue-500" />}>
            <ul className="space-y-3">
                {workTasks.map(task => (
                    <li key={task.id} className="flex flex-col p-3 bg-slate-50 hover:bg-blue-50/50 rounded-lg border border-slate-100 transition-all cursor-pointer group">
                        
                        {/* Task Header with Checkbox and Title */}
                        <div className="flex items-start space-x-3">
                            <div className={`mt-0.5 w-5 h-5 rounded border border-slate-300 flex items-center justify-center flex-shrink-0 ${task.completed ? 'bg-blue-500 border-blue-500' : 'bg-white group-hover:border-blue-400'}`}>
                                {task.completed && <CheckSquare size={12} className="text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className={`text-sm font-medium block truncate ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                    {task.title}
                                </span>
                            </div>
                        </div>

                        {/* Task Context (Client & Board) */}
                        <div className="ml-8 mt-2 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {task.clientAvatar && (
                                    <img src={task.clientAvatar} className="w-4 h-4 rounded-full" alt="" />
                                )}
                                <div className="flex flex-col sm:flex-row sm:items-center text-xs">
                                    <span className="font-bold text-slate-600 mr-1.5">{task.clientName}</span>
                                    <span className="text-slate-400 hidden sm:inline">•</span>
                                    <span className="text-slate-500 sm:ml-1.5 flex items-center">
                                        <Briefcase size={10} className="mr-1" />
                                        {task.boardName}
                                    </span>
                                </div>
                            </div>
                            <span className="text-[10px] font-semibold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                                {task.dueTime}
                            </span>
                        </div>
                    </li>
                ))}
                
                <li className="pt-2">
                     <button className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs font-medium text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all">
                        + Add Task from Board
                     </button>
                </li>
            </ul>
        </WidgetContainer>
    );
};
