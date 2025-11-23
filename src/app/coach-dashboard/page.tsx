"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
    PERSONAS,
    GET_INITIAL_DATA,
    BOARD_TEMPLATES
} from './constants';
import { Board, NewBoardPayload, ClientType } from './types';
import { MyDayWidget, ClientWinsWidget, ClientPulseWidget, MyTasksWidget } from '@/components/coach-dashboard/Widgets';
import { LayoutGrid, Search, Bell, Settings, Library, ChevronDown, LogOut, BarChart3, ArrowUpRight } from 'lucide-react';
import BoardCard from "@/components/coach-dashboard/BoardCard";
import NewBoardModal from "@/components/coach-dashboard/NewBoardModal";
import TemplateCard from "@/components/coach-dashboard/TemplateCard";

const App: React.FC = () => {
  // --- Persona State ---
  const [currentPersonaId, setCurrentPersonaId] = useState('coach');
  const currentUser = PERSONAS.find(p => p.id === currentPersonaId) || PERSONAS[0];
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  // --- Data State (Dependent on Persona) ---
  const [boards, setBoards] = useState<Board[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [wins, setWins] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  
  // Load data when persona changes
  useEffect(() => {
    const fetchInitialData = async () => {
      const data = GET_INITIAL_DATA(currentPersonaId);
      setBoards(data.boards);
      setTasks(data.tasks);
      setWins(data.wins);
      setActivity(data.activity);
    };

    fetchInitialData().then();
  }, [currentPersonaId]);

  const [templates] = useState(BOARD_TEMPLATES);

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState<string | null>(null);

  // --- View State for Right Column ---
  const [boardViewMode, setBoardViewMode] = useState<'active' | 'templates'>('active');

  // --- Drag and Drop State ---
  const [widgetOrder, setWidgetOrder] = useState(['day', 'pulse', 'wins', 'tasks']);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const dragItemNode = useRef<HTMLDivElement | null>(null);

  const handleDragStart = (e: React.DragEvent, item: string) => {
    setDraggedItem(item);
    dragItemNode.current = e.target as HTMLDivElement;
    dragItemNode.current.addEventListener('dragend', handleDragEnd);
    // setTimeout to hide the element being dragged but keep the ghost image
    setTimeout(() => {
        if (dragItemNode.current) dragItemNode.current.classList.add('opacity-50');
    }, 0);
  };

  const handleDragEnter = (e: React.DragEvent, targetItem: string) => {
    if (draggedItem === null || draggedItem === targetItem) return;
    
    const currentOrder = [...widgetOrder];
    const draggedIndex = currentOrder.indexOf(draggedItem);
    const targetIndex = currentOrder.indexOf(targetItem);

    if (draggedIndex !== targetIndex) {
        currentOrder.splice(draggedIndex, 1);
        currentOrder.splice(targetIndex, 0, draggedItem);
        setWidgetOrder(currentOrder);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    if (dragItemNode.current) {
        dragItemNode.current.classList.remove('opacity-50');
        dragItemNode.current.removeEventListener('dragend', handleDragEnd);
        dragItemNode.current = null;
    }
  };

  // --- Board Creation Logic ---
  const openNewBoardModal = (templateId?: string) => {
      setSelectedTemplateForModal(templateId || null);
      setIsModalOpen(true);
  };

  const handleCreateBoard = (data: NewBoardPayload) => {
    const template = templates.find(t => t.id === data.templateId);
    
    // Map template category to client type for visuals
    let clientType = ClientType.CAREER;
    // Simple mapping logic for demo
    if (template?.category === 'Business') clientType = ClientType.STARTUP;
    if (template?.category === 'Executive') clientType = ClientType.CAREER;

    const newBoard: Board = {
        id: `new_${Date.now()}`,
        clientName: data.clientName,
        headline: data.headline,
        subhead: data.subhead,
        type: clientType,
        tags: [template?.category || 'General', data.isOrganization ? 'Organization' : 'Individual'],
        // Use placeholder images based on name
        thumbnailUrl: template?.thumbnailUrl || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1600',
        logoUrl: data.isOrganization 
            ? `https://api.dicebear.com/7.x/shapes/svg?seed=${data.clientName}&backgroundColor=0ea5e9`
            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.clientName}&backgroundColor=ffdfbf`,
        isOrganization: data.isOrganization,
        lastActive: 'Just now'
    };

    setBoards([newBoard, ...boards]);
    setIsModalOpen(false);
    setBoardViewMode('active'); // Switch back to active view to see the new board
  };

  // --- Context Helper for Headers/Labels ---
  const getPersonaContext = () => {
      if (currentPersonaId === 'hwi') {
          return {
              widgetTitles: {
                  day: 'Daily Itinerary',
                  pulse: 'Comprehensive Pulse',
                  wins: 'Staff Wins',
                  tasks: 'My Priorities'
              },
              masterOverview: {
                  title: 'Master Estate View',
                  subtitle: `Managed Properties: ${boards.length}`,
                  buttonText: 'Open Estate Master'
              },
              activeBoards: 'Active Properties'
          };
      }
      if (currentPersonaId === 'partner') {
          return {
              widgetTitles: {
                  day: 'Founder Schedule',
                  pulse: 'Shared Pulse',
                  wins: 'Venture Wins',
                  tasks: 'Shared Priorities'
              },
              masterOverview: {
                  title: 'Venture Overview',
                  subtitle: `Active Workstreams: ${boards.length}`,
                  buttonText: 'Open Venture Master'
              },
              activeBoards: 'Active Workstreams'
          };
      }
      // Default: Coach
      return {
          widgetTitles: {
              day: 'My Day',
              pulse: 'Client Pulse',
              wins: 'Client Wins',
              tasks: 'My Tasks'
          },
          masterOverview: {
              title: 'Master Overview',
              subtitle: `Active Portfolios: ${boards.length}`,
              buttonText: 'Open Master View'
          },
          activeBoards: 'Active Boards'
      };
  };

  const context = getPersonaContext();

  const renderWidget = (id: string) => {
    switch (id) {
        case 'day': return <MyDayWidget tasks={tasks} title={context.widgetTitles.day} />;
        case 'pulse': return <ClientPulseWidget activity={activity} title={context.widgetTitles.pulse} />;
        case 'wins': return <ClientWinsWidget wins={wins} title={context.widgetTitles.wins} />;
        case 'tasks': return <MyTasksWidget tasks={tasks} title={context.widgetTitles.tasks} />;
        default: return null;
    }
  };

  const handlePersonaSwitch = (id: string) => {
    setCurrentPersonaId(id);
    setIsPersonaMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* --- Top Navigation --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="bg-cyan-400 text-white font-bold text-xl w-10 h-10 flex items-center justify-center rounded-lg shadow-sm">
                    LU
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-800 leading-none">LEVEL UP</h1>
                    <span className="text-xs text-slate-500 font-medium">Workspace</span>
                </div>
            </div>

            <div className="flex items-center space-x-6">
                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                    <Search size={16} className="text-slate-400 mr-2" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-400"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <Settings size={20} />
                    </button>
                    
                    <div className="h-8 w-px bg-slate-200 mx-2"></div>
                    
                    {/* Persona Switcher Dropdown */}
                    <div className="relative">
                        <div 
                            className="flex items-center space-x-3 cursor-pointer p-1 hover:bg-slate-50 rounded-lg transition-colors"
                            onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-slate-800 leading-none">{currentUser.name}</p>
                                <p className="text-xs text-cyan-600 font-medium mt-1">{currentUser.role}</p>
                            </div>
                            <img 
                                src={currentUser.avatarUrl} 
                                alt="Profile" 
                                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                            />
                            <ChevronDown size={14} className={`text-slate-400 transition-transform ${isPersonaMenuOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {/* Dropdown Menu */}
                        {isPersonaMenuOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Persona</span>
                                </div>
                                {PERSONAS.map(persona => (
                                    <button
                                        key={persona.id}
                                        onClick={() => handlePersonaSwitch(persona.id)}
                                        className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-slate-50 transition-colors ${currentPersonaId === persona.id ? 'bg-indigo-50/50' : ''}`}
                                    >
                                        <img src={persona.avatarUrl} className="w-8 h-8 rounded-full border border-slate-200" alt="" />
                                        <div>
                                            <p className={`text-sm font-semibold ${currentPersonaId === persona.id ? 'text-indigo-900' : 'text-slate-700'}`}>{persona.name}</p>
                                            <p className="text-xs text-slate-500">{persona.role}</p>
                                        </div>
                                        {currentPersonaId === persona.id && (
                                            <div className="ml-auto w-2 h-2 rounded-full bg-indigo-500"></div>
                                        )}
                                    </button>
                                ))}
                                <div className="border-t border-slate-100 mt-2 pt-1">
                                    <button className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center">
                                        <LogOut size={14} className="mr-2" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </header>

      {/* --- Main Content Grid --- */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            
            {/* --- Left Side: Widgets (2x2 Grid) --- */}
            <div className="lg:col-span-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {widgetOrder.map((widgetId) => (
                        <div 
                            key={widgetId}
                            draggable
                            onDragStart={(e) => handleDragStart(e, widgetId)}
                            onDragEnter={(e) => handleDragEnter(e, widgetId)}
                            onDragOver={(e) => e.preventDefault()}
                            className={`h-[450px] transition-all duration-200 ease-in-out ${draggedItem === widgetId ? 'scale-[0.98] ring-2 ring-indigo-400 rounded-xl' : ''}`}
                        >
                            {renderWidget(widgetId)}
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Right Side: My Boards & Templates --- */}
            <div className="lg:col-span-6 flex flex-col h-full">
                <div className="bg-white/50 border border-slate-200/60 rounded-2xl p-6 shadow-sm backdrop-blur-xl flex-1 flex flex-col h-full min-h-[700px]">
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                        {/* Tab Switcher */}
                        <div className="bg-slate-100/80 p-1 rounded-lg flex items-center">
                            <button 
                                onClick={() => setBoardViewMode('active')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${boardViewMode === 'active' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <LayoutGrid size={16} />
                                <span>{context.activeBoards}</span>
                            </button>
                            <button 
                                onClick={() => setBoardViewMode('templates')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${boardViewMode === 'templates' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Library size={16} />
                                <span>Template Library</span>
                            </button>
                        </div>

                        <div className="flex space-x-2 self-end sm:self-auto">
                            {boardViewMode === 'active' ? (
                                <button 
                                    onClick={() => openNewBoardModal()}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors shadow-sm shadow-indigo-200"
                                >
                                    + New Board
                                </button>
                            ) : (
                                <div className="text-xs text-slate-400 font-medium px-2">
                                    Select a template to start
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- MASTER OVERVIEW HEADER (Contextual Design) --- */}
                    {boardViewMode === 'active' && (
                        <div className="mb-6 bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between shadow-sm relative overflow-hidden group">
                             {/* Light decorative gradient */}
                             <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50 opacity-50"></div>
                             
                             <div className="flex items-center space-x-4 z-10 w-full sm:w-auto mb-4 sm:mb-0">
                                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100">
                                    <BarChart3 size={20} className="text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-base leading-tight">{context.masterOverview.title}</h3>
                                    <p className="text-slate-400 text-xs">{context.masterOverview.subtitle}</p>
                                </div>
                             </div>

                             <div className="flex items-center space-x-6 z-10 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="flex space-x-6 mr-4 border-r border-slate-100 pr-6">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-slate-800 leading-none">3</div>
                                        <div className="text-[9px] text-slate-400 uppercase tracking-wide mt-1 font-semibold">Critical</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-slate-800 leading-none">12</div>
                                        <div className="text-[9px] text-slate-400 uppercase tracking-wide mt-1 font-semibold">Pending</div>
                                    </div>
                                </div>
                                <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-all shadow-sm">
                                    <span>{context.masterOverview.buttonText}</span>
                                    <ArrowUpRight size={14} />
                                </button>
                             </div>
                        </div>
                    )}

                    {/* Scrollable Grid Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        
                        {boardViewMode === 'active' ? (
                            /* --- ACTIVE BOARDS GRID --- */
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 pb-4">
                                {boards.map(board => (
                                    <div key={board.id} className="h-[320px]">
                                        <BoardCard board={board} />
                                    </div>
                                ))}
                                
                                {/* Add New Placeholder */}
                                <div 
                                    onClick={() => openNewBoardModal()}
                                    className="h-[320px] border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-white flex items-center justify-center mb-3 transition-colors">
                                        <Library size={24} />
                                    </div>
                                    <span className="font-medium text-sm">Create New Board</span>
                                </div>
                            </div>
                        ) : (
                            /* --- TEMPLATE LIBRARY GRID --- */
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 pb-4">
                                {templates.map(template => (
                                    <div key={template.id} className="h-auto min-h-[360px]">
                                        <TemplateCard 
                                            template={template} 
                                            onUse={(id) => openNewBoardModal(id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>

                </div>
            </div>

        </div>
      </main>

      {/* --- Modals --- */}
      <NewBoardModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateBoard}
        templates={templates}
        preSelectedTemplateId={selectedTemplateForModal}
      />

    </div>
  );
};

export default App;
