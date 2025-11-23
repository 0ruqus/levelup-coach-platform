
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  MoreHorizontal, 
  Calendar, 
  Paperclip, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  CheckSquare, 
  Layout,
  ArrowUpRight,
  CheckCircle,
  User,
  Briefcase,
  X,
  Type,
  Clock,
  Settings,
  GripVertical,
  List,
  Kanban,
  GanttChart,
  Network,
  Users,
  Trophy,
  MessageSquare,
  Image as ImageIcon,
  Link,
  Send,
  Pencil,
  Save,
  Trash2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Target,
  Zap,
  Rocket,
  Lightbulb,
  TrendingUp,
  Box,
  Anchor,
  Flag,
  Star,
  Heart,
  Music,
  Video,
  Globe,
  Truck,
  ShoppingBag,
  Smile,
  Cpu,
  Palette,
  Gem,
  AlertTriangle,
  Play,
  StopCircle,
  ClipboardList,
  BrainCircuit,
  Sparkles,
  BarChart3,
  Timer,
  HelpCircle,
  RotateCcw,
  Coffee,
  HelpingHand,
  ArrowUpCircle,
  SignalLow,
  SignalMedium,
  SignalHigh,
  StickyNote,
  Grid,
  Circle,
  Compass,
  Wand2,
  Loader2
} from 'lucide-react';

// --- Types ---

type TaskType = 'LEARN' | 'DO' | 'STRATEGY' | 'COMMIT' | 'REVIEW';
type TaskComplexity = 'EASY' | 'MEDIUM' | 'HARD' | 'UNCERTAIN';
type TimeConfigType = 'ESTIMATION' | 'RANGE' | 'SPRINT' | 'DEADLINE';
type StrategicValue = 'FILLER' | 'SUPPORTIVE' | 'INTENTIONAL' | 'PIVOTAL' | 'CRITICAL_PATH';

interface UserBase {
  id: string;
  name: string;
  role: string;
  color?: string;
}

interface UserWithImage extends UserBase {
  avatarType: 'image';
  img: string;
}

interface UserWithInitials extends UserBase {
  avatarType: 'initials';
  initials: string;
}

type User = UserWithImage | UserWithInitials;

interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
}

interface Guidance {
  id: string;
  text: string;
  timestamp: number;
}

interface TaskImage {
  id: string;
  url: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
  type: TaskType;
  description?: string;
  
  // Time & Complexity
  complexity?: TaskComplexity;
  timeConfig?: {
    type: TimeConfigType;
    value: string; // "1 week", "Q3", "2023-10-12", etc.
  };
  strategicValue?: StrategicValue;
  
  attachments?: number; 
  subtasks?: { label: string; completed: boolean }[];
  assignee?: string; // 'coach' or 'client'
  reporter?: string; // 'coach' or 'client'
  initiativeId?: string;
  objectiveId?: number; // index of the objective
  comments?: Comment[];
  guidance?: Guidance[]; // New Guidance field
  images?: TaskImage[];
  
  // Visibility Toggles
  showChecklistOnCard?: boolean;
  showImageOnCard?: boolean;
}

interface Lane {
  id: string;
  title: string;
  taskIds: string[];
  color: string;
  isLocked?: boolean; 
}

interface BoardData {
  tasks: { [key: string]: Task };
  lanes: { [key: string]: Lane };
  laneOrder: string[];
}

interface Initiative {
  id: string;
  title: string;
  purpose: string;
  objectives: string[];
  icon: string;
}

interface SessionEvent {
  type: 'MOVE' | 'CREATE' | 'EDIT' | 'DELETE' | 'LANE';
  description: string;
  timestamp: number;
  meta?: any; // For smart analysis
}

// --- Constants ---

const USERS: Record<string, User> = {
  coach: { 
    id: 'coach',
    name: 'Jane Bobo', 
    initials: 'JB', 
    color: 'bg-cyan-400', 
    role: 'Product Coach',
    avatarType: 'initials'
  },
  client: { 
    id: 'client',
    name: 'Max Phillips', 
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop', 
    role: 'Client',
    avatarType: 'image'
  }
};

const ICON_MAP: Record<string, React.ElementType> = {
  Target, Zap, Rocket, Lightbulb, TrendingUp, Box, Anchor, Flag, Star, Heart, 
  Music, Video, Globe, Truck, ShoppingBag, Smile, Users, Settings, Trophy, Cpu, Palette, Gem
};

const INITIAL_INITIATIVES: Initiative[] = [
  {
    id: "init_1",
    title: "PRODUCT & DESIGN EXCELLENCE",
    purpose: "Elevate the brand by refining the core collection of concrete lighting into a distinctive, high-style product line.",
    objectives: [
      "Establish a cohesive design language across all fixtures.",
      "Improve mold quality and casting consistency.",
      "Develop two new signature pieces aligned with architectural trends.",
      "Build a lightweight prototype process for rapid iteration."
    ],
    icon: "Gem"
  },
  {
    id: "init_2",
    title: "OPERATIONS & PRODUCTION SYSTEMS",
    purpose: "Create repeatable workflows that support small-batch production while maintaining craftsmanship.",
    objectives: [
      "Document step-by-step casting, curing, and finishing processes.",
      "Implement a simple quality-check system for every production batch.",
      "Reduce waste and material overages by 15%.",
      "Set up a micro-inventory system for hardware, pigments, and molds."
    ],
    icon: "Settings"
  },
  {
    id: "init_3",
    title: "BRAND & MARKET GROWTH",
    purpose: "Position the company as a boutique, design-forward lighting brand with clarity in messaging and audience.",
    objectives: [
      "Refresh the brand narrative (materials, craft, architectural inspiration).",
      "Launch a small lookbook for designers and wholesale partners.",
      "Build relationships with three interior design studios.",
      "Test two sales channels: direct-to-consumer and trade/wholesale."
    ],
    icon: "TrendingUp"
  }
];

const LANE_COLORS = [
  'bg-slate-100',
  'bg-red-100',
  'bg-orange-100',
  'bg-amber-100',
  'bg-green-100',
  'bg-emerald-100',
  'bg-teal-100',
  'bg-cyan-100',
  'bg-sky-100',
  'bg-blue-100',
  'bg-indigo-100',
  'bg-purple-100',
  'bg-fuchsia-100',
  'bg-pink-100',
  'bg-rose-100'
];

const LANE_HEADER_COLORS:Record<string, string> = {
  'bg-slate-100': 'border-slate-300 bg-slate-200',
  'bg-red-100': 'border-red-300 bg-red-200',
  'bg-orange-100': 'border-orange-300 bg-orange-200',
  'bg-amber-100': 'border-amber-300 bg-amber-200',
  'bg-green-100': 'border-green-300 bg-green-200',
  'bg-emerald-100': 'border-emerald-300 bg-emerald-200',
  'bg-teal-100': 'border-teal-300 bg-teal-200',
  'bg-cyan-100': 'border-cyan-300 bg-cyan-200',
  'bg-sky-100': 'border-sky-300 bg-sky-200',
  'bg-blue-100': 'border-blue-300 bg-blue-200',
  'bg-indigo-100': 'border-indigo-300 bg-indigo-200',
  'bg-purple-100': 'border-purple-300 bg-purple-200',
  'bg-fuchsia-100': 'border-fuchsia-300 bg-fuchsia-200',
  'bg-pink-100': 'border-pink-300 bg-pink-200',
  'bg-rose-100': 'border-rose-300 bg-rose-200'
};

const STRATEGIC_VALUE_DESCRIPTIONS: Record<StrategicValue, string> = {
  'FILLER': 'Low importance. Optional or lightweight tasks that still matter for momentum or maintenance.',
  'SUPPORTIVE': 'Indirectly contributes to a goal. Helps set the stage, organize, prepare, or maintain.',
  'INTENTIONAL': 'Deliberate, purposeful actions tied directly to the goal but not time-critical.',
  'PIVOTAL': 'High-impact actions that shift progress meaningfully. If skipped, momentum is noticeably affected.',
  'CRITICAL_PATH': 'The essential sequence. These tasks directly determine whether the goal succeeds and must stay unblocked.'
};

// --- Mock Data ---

const INITIAL_DATA: BoardData = {
  tasks: {
    't2': {
      id: 't2',
      type: 'DO',
      title: 'Core Feature Functionality',
      description: 'Wireflow_of_feature_map.jpg',
      complexity: 'MEDIUM',
      strategicValue: 'PIVOTAL',
      timeConfig: { type: 'ESTIMATION', value: '3 Days' },
      attachments: 1,
      subtasks: [{ label: 'Draft', completed: true }, { label: 'Wireframe', completed: false }],
      assignee: 'client',
      reporter: 'coach',
      comments: [],
      showChecklistOnCard: true,
      showImageOnCard: true,
      guidance: []
    },
    't3': {
      id: 't3',
      type: 'STRATEGY',
      title: 'Define tasks and expectations for Jr. Mid. and Sr. Levels 1-3',
      subtasks: [
        { label: 'Junior Level 1 (Entry-Level)', completed: false },
        { label: 'Junior Level 2 (Intermediate)', completed: false },
        { label: 'Junior Level 3 (Advanced)', completed: false },
      ],
      complexity: 'HARD',
      strategicValue: 'CRITICAL_PATH',
      timeConfig: { type: 'SPRINT', value: 'Sprint 4' },
      attachments: 5,
      assignee: 'coach',
      reporter: 'client',
      comments: [],
      showChecklistOnCard: true,
      showImageOnCard: false,
      guidance: []
    },
    't4': {
      id: 't4',
      type: 'COMMIT',
      title: 'Define tasks and expectations for Jr. Mid. and Sr. Levels 1-3',
      subtasks: [
        { label: 'Junior Level 1 (Entry-Level)', completed: false },
        { label: 'Junior Level 2 (Intermediate)', completed: false },
      ],
      complexity: 'MEDIUM',
      strategicValue: 'INTENTIONAL',
      timeConfig: { type: 'DEADLINE', value: '2024-12-01' },
      attachments: 5,
      assignee: 'coach',
      reporter: 'coach',
      comments: [],
      showChecklistOnCard: false,
      showImageOnCard: false,
      guidance: []
    },
    
    // --- NEW CLIENT TASKS (Blunt Mason Lighting context) ---
    'cl_1': {
      id: 'cl_1', type: 'DO', title: 'Source sustainable packaging options', description: 'Find supplier for recycled honeycomb cardboard inserts.', 
      assignee: 'client', reporter: 'coach', complexity: 'MEDIUM', strategicValue: 'PIVOTAL', timeConfig: { type: 'ESTIMATION', value: '2 Days'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'cl_2': {
      id: 'cl_2', type: 'DO', title: 'Upload CAD files for "Monolith" Lamp', description: 'Finalize .STL files for the new table lamp mold.', 
      assignee: 'client', reporter: 'client', complexity: 'EASY', strategicValue: 'SUPPORTIVE', timeConfig: { type: 'ESTIMATION', value: '4 Hours'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'cl_3': {
      id: 'cl_3', type: 'LEARN', title: 'Research pigment mixing ratios', description: 'Watch tutorials on reducing air bubbles in dark concrete mixes.', 
      assignee: 'client', reporter: 'coach', complexity: 'UNCERTAIN', strategicValue: 'INTENTIONAL', timeConfig: { type: 'RANGE', value: 'Oct 10-15'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'cl_4': {
      id: 'cl_4', type: 'DO', title: 'Photograph new finish samples', description: 'Take high-res texture shots of the "Charcoal" and "Bone" finishes.', 
      assignee: 'client', reporter: 'client', complexity: 'MEDIUM', strategicValue: 'SUPPORTIVE', timeConfig: { type: 'ESTIMATION', value: '1 Day'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'cl_5': {
      id: 'cl_5', type: 'REVIEW', title: 'Check E26 Socket Inventory', description: 'Do we have enough brass hardware for the Q3 production run?', 
      assignee: 'client', reporter: 'client', complexity: 'EASY', strategicValue: 'FILLER', timeConfig: { type: 'ESTIMATION', value: '1 Hour'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'cl_6': {
      id: 'cl_6', type: 'DO', title: 'Reach out to "Modern Living" blog', description: 'Send press kit to the editor for potential feature.', 
      assignee: 'client', reporter: 'coach', complexity: 'HARD', strategicValue: 'PIVOTAL', timeConfig: { type: 'DEADLINE', value: '2024-11-01'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'cl_7': {
      id: 'cl_7', type: 'STRATEGY', title: 'Brainstorm "Obelisk" Collection names', description: 'Need 5 strong naming options for the floor lamp series.', 
      assignee: 'client', reporter: 'client', complexity: 'MEDIUM', strategicValue: 'INTENTIONAL', timeConfig: { type: 'ESTIMATION', value: '3 Days'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'cl_8': {
      id: 'cl_8', type: 'DO', title: 'Update Shopify Product Descriptions', description: 'Add dimensions and weight for the "Cylinder" pendant.', 
      assignee: 'client', reporter: 'client', complexity: 'EASY', strategicValue: 'SUPPORTIVE', timeConfig: { type: 'ESTIMATION', value: '2 Hours'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'cl_9': {
      id: 'cl_9', type: 'DO', title: 'Order silicone for molds', description: 'Need 5 gallons of Smooth-On layout rubber.', 
      assignee: 'client', reporter: 'client', complexity: 'EASY', strategicValue: 'CRITICAL_PATH', timeConfig: { type: 'ESTIMATION', value: '30 Mins'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'cl_10': {
      id: 'cl_10', type: 'LEARN', title: 'Competitor Pricing Audit', description: 'Review pricing of "Concrete Cat" and "Into Concrete".', 
      assignee: 'client', reporter: 'coach', complexity: 'MEDIUM', strategicValue: 'INTENTIONAL', timeConfig: { type: 'ESTIMATION', value: '1 Day'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },

    // --- NEW COACH TASKS (REQUESTS FROM CLIENT) ---
    'co_1': {
      id: 'co_1', type: 'LEARN', title: 'Share "Unit Economics 101" Template', description: 'I need that spreadsheet template you mentioned for calculating margins per SKU.', 
      assignee: 'coach', reporter: 'client', complexity: 'EASY', strategicValue: 'SUPPORTIVE', timeConfig: { type: 'ESTIMATION', value: '10 Mins'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'co_2': {
      id: 'co_2', type: 'REVIEW', title: 'Record Loom: Workflow Audit', description: 'Could you record a quick video reviewing my production flow diagram? I feel stuck on step 4.', 
      assignee: 'coach', reporter: 'client', complexity: 'MEDIUM', strategicValue: 'PIVOTAL', timeConfig: { type: 'ESTIMATION', value: '20 Mins'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'co_3': {
      id: 'co_3', type: 'DO', title: 'Send "Wholesale Terms" Boilerplate', description: 'Do you have a standard contract template for Net-30 terms I can adapt?', 
      assignee: 'coach', reporter: 'client', complexity: 'EASY', strategicValue: 'SUPPORTIVE', timeConfig: { type: 'ESTIMATION', value: '5 Mins'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'co_4': {
      id: 'co_4', type: 'LEARN', title: 'Article: Q4 Marketing Trends', description: 'Please send that article about "Slow Living" marketing trends you referenced.', 
      assignee: 'coach', reporter: 'client', complexity: 'EASY', strategicValue: 'FILLER', timeConfig: { type: 'ESTIMATION', value: '5 Mins'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'co_5': {
      id: 'co_5', type: 'DO', title: 'Intro: Logistics Consultant', description: 'Please introduce me to Sarah via email regarding freight shipping rates.', 
      assignee: 'coach', reporter: 'client', complexity: 'MEDIUM', strategicValue: 'INTENTIONAL', timeConfig: { type: 'ESTIMATION', value: '15 Mins'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'co_6': {
      id: 'co_6', type: 'STRATEGY', title: 'Methodology: CRO Audit', description: 'Share the 5-step checklist for performing a Conversion Rate Optimization audit on my landing page.', 
      assignee: 'coach', reporter: 'client', complexity: 'HARD', strategicValue: 'CRITICAL_PATH', timeConfig: { type: 'ESTIMATION', value: '1 Hour'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'co_7': {
      id: 'co_7', type: 'DO', title: 'Template: Monthly Burn Rate', description: 'I need a simple Google Sheet to track our monthly cash burn.', 
      assignee: 'coach', reporter: 'client', complexity: 'EASY', strategicValue: 'SUPPORTIVE', timeConfig: { type: 'ESTIMATION', value: '15 Mins'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'co_8': {
      id: 'co_8', type: 'STRATEGY', title: 'Slide Deck: Pitch Structure', description: 'Can you share the "Perfect Pitch" slide structure for presenting to architects?', 
      assignee: 'coach', reporter: 'client', complexity: 'MEDIUM', strategicValue: 'INTENTIONAL', timeConfig: { type: 'ESTIMATION', value: '30 Mins'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'co_9': {
      id: 'co_9', type: 'LEARN', title: 'Example: Growth Roadmap', description: 'Can I see an anonymized example of a 3-year roadmap from a similar hardware startup?', 
      assignee: 'coach', reporter: 'client', complexity: 'HARD', strategicValue: 'PIVOTAL', timeConfig: { type: 'ESTIMATION', value: '1 Hour'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    },
    'co_10': {
      id: 'co_10', type: 'LEARN', title: 'Video: How to set OKRs', description: 'Send a training video on setting effective Objectives and Key Results for creative teams.', 
      assignee: 'coach', reporter: 'client', complexity: 'MEDIUM', strategicValue: 'INTENTIONAL', timeConfig: { type: 'ESTIMATION', value: '20 Mins'}, subtasks: [], comments: [], showChecklistOnCard: false, showImageOnCard: false, guidance: []
    }
  },
  lanes: {
    'client_log': {
      id: 'client_log',
      title: 'Client Log',
      // Pre-populate Client Log
      taskIds: ['cl_1', 'cl_2', 'cl_3', 'cl_4', 'cl_5', 'cl_6', 'cl_7', 'cl_8', 'cl_9', 'cl_10', 't2'],
      isLocked: true,
      color: 'bg-purple-100'
    },
    'coach_log': {
      id: 'coach_log',
      title: 'Coach Log',
      // Pre-populate Coach Log
      taskIds: ['co_1', 'co_2', 'co_3', 'co_4', 'co_5', 'co_6', 'co_7', 'co_8', 'co_9', 'co_10', 't3', 't4'],
      isLocked: true,
      color: 'bg-cyan-100'
    },
    'processing_vibe': {
      id: 'processing_vibe',
      title: 'ACTION READY',
      taskIds: [],
      color: 'bg-slate-100'
    },
    'in_motion': {
      id: 'in_motion',
      title: 'IN MOTION',
      taskIds: [],
      color: 'bg-blue-100'
    },
    'qa': {
      id: 'qa',
      title: 'Q&A',
      taskIds: [],
      color: 'bg-indigo-100'
    },
    'stuck': {
      id: 'stuck',
      title: 'STUCK',
      taskIds: [],
      color: 'bg-red-100'
    },
    'complete_review': {
      id: 'complete_review',
      title: 'REVIEW READY',
      taskIds: [],
      color: 'bg-emerald-100'
    },
    'stretch': {
      id: 'stretch',
      title: 'STRETCH GOAL',
      taskIds: [],
      color: 'bg-fuchsia-100'
    },
    'done': {
      id: 'done',
      title: 'DONE',
      taskIds: [],
      isLocked: true,
      color: 'bg-green-100'
    }
  },
  laneOrder: ['processing_vibe', 'in_motion', 'qa', 'stuck', 'complete_review', 'stretch'] 
};

// --- Helper Functions ---

const getTypeColor = (type: TaskType) => {
  switch (type) {
    case 'LEARN': return 'bg-[#d500f9] text-white';
    case 'DO': return 'bg-[#00e5ff] text-slate-900';
    case 'STRATEGY': return 'bg-[#00e676] text-slate-900';
    case 'COMMIT': return 'bg-[#ffea00] text-slate-900';
    case 'REVIEW': return 'bg-orange-400 text-white';
    default: return 'bg-slate-200 text-slate-800';
  }
};

const getUserById = (id?: string): User | null => {
  if (id === 'coach') return USERS.coach;
  if (id === 'client') return USERS.client;
  return null;
};

const getIconComponent = (iconName: string) => {
  return ICON_MAP[iconName] || Trophy;
};

const formatDuration = (ms: number) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  
  return parts.join(' ');
};

const getComplexityConfig = (c?: TaskComplexity) => {
  switch(c) {
    case 'EASY': return { icon: SignalLow, color: 'text-green-500', label: 'Easy' };
    case 'MEDIUM': return { icon: SignalMedium, color: 'text-yellow-500', label: 'Medium' };
    case 'HARD': return { icon: SignalHigh, color: 'text-red-500', label: 'Hard' };
    case 'UNCERTAIN': return { icon: HelpCircle, color: 'text-slate-400', label: 'Uncertain' };
    default: return { icon: SignalLow, color: 'text-slate-200', label: 'None' };
  }
};

const getStrategicValueConfig = (v?: StrategicValue) => {
  switch (v) {
    case 'FILLER': return { icon: Coffee, color: 'text-slate-400', label: 'Filler' };
    case 'SUPPORTIVE': return { icon: HelpingHand, color: 'text-blue-400', label: 'Supportive' };
    case 'INTENTIONAL': return { icon: Target, color: 'text-emerald-500', label: 'Intentional' };
    case 'PIVOTAL': return { icon: ArrowUpCircle, color: 'text-orange-500', label: 'Pivotal' };
    case 'CRITICAL_PATH': return { icon: Zap, color: 'text-red-500', label: 'Critical Path' };
    default: return { icon: Circle, color: 'text-slate-200', label: 'None' };
  }
};

// --- Components ---

const AIAssistant = ({ tasks, isAIActive, setIsAIActive }: { tasks: Record<string, Task>, isAIActive: boolean, setIsAIActive: (v: boolean) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<{taskId: string, taskTitle: string, suggestion: string, actionLabel: string}[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Mock analysis
    const newSuggestions: {taskId: string, taskTitle: string, suggestion: string, actionLabel: string}[] = [];
    const taskValues = Object.values(tasks);
    
    taskValues.forEach(t => {
       const lower = t.title.toLowerCase();
       if (lower.includes('photo') || lower.includes('image') || lower.includes('finish')) {
          newSuggestions.push({
             taskId: t.id,
             taskTitle: t.title,
             suggestion: "Create a mood board of examples",
             actionLabel: "Generate Mood Board"
          });
       }
       if (lower.includes('email') || lower.includes('reach out') || lower.includes('contact')) {
          newSuggestions.push({
             taskId: t.id,
             taskTitle: t.title,
             suggestion: "Draft initial outreach email",
             actionLabel: "Draft Email"
          });
       }
       if (lower.includes('schedule') || lower.includes('plan')) {
          newSuggestions.push({
             taskId: t.id,
             taskTitle: t.title,
             suggestion: "Generate project timeline",
             actionLabel: "Create Timeline"
          });
       }
    });
    
    setSuggestions(newSuggestions);
  }, [tasks]);

  const handleRun = (id: string) => {
     setLoadingId(id);
     setTimeout(() => {
        setLoadingId(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
     }, 1500);
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-[90] flex flex-col items-end pointer-events-auto"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => { if(!isAIActive) setIsOpen(false); }}
    >
       {showSuccess && (
          <div className="absolute bottom-20 right-0 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-4 flex items-center gap-2">
             <CheckCircle size={16} /> AI Action Completed!
          </div>
       )}

       {/* Expanded Panel */}
       <div className={`mb-3 bg-white rounded-2xl shadow-2xl border border-purple-100 w-80 transform transition-all duration-300 origin-bottom-right overflow-hidden ${isOpen || isAIActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 flex justify-between items-center">
             <div className="flex items-center gap-2 text-white">
                <Sparkles className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">AI Assistant</h4>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/80 font-medium uppercase">Suggestions Mode</span>
                <button 
                  onClick={() => setIsAIActive(!isAIActive)}
                  className={`w-8 h-4 rounded-full relative transition-colors ${isAIActive ? 'bg-white/30' : 'bg-black/20'}`}
                >
                   <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all ${isAIActive ? 'left-4.5' : 'left-0.5'}`} />
                </button>
             </div>
          </div>
          
          <div className="p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
             {isAIActive ? (
                <div className="space-y-4">
                    {suggestions.length > 0 ? suggestions.map((s, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                         <div className="flex items-start gap-2 mb-2">
                            <Wand2 size={14} className="text-purple-500 mt-0.5 shrink-0"/>
                            <div>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Suggestion</p>
                               <p className="text-xs text-slate-700 font-medium leading-snug">{s.suggestion}</p>
                               <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[200px]">Ref: {s.taskTitle}</p>
                            </div>
                         </div>
                         <button 
                           onClick={() => handleRun(s.taskId)}
                           disabled={!!loadingId}
                           className="w-full py-1.5 bg-white border border-purple-200 text-purple-600 hover:bg-purple-50 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                         >
                            {loadingId === s.taskId ? <Loader2 size={12} className="animate-spin"/> : <Play size={12} fill="currentColor"/>}
                            {loadingId === s.taskId ? 'Running...' : s.actionLabel}
                         </button>
                      </div>
                   )) : (
                       <p className="text-xs text-slate-400 italic text-center">No active suggestions found.</p>
                   )}
                </div>
             ) : (
                <div className="space-y-2">
                   <p className="text-xs text-slate-500 italic text-center py-2">Hover over the toggle above to enable AI Suggestions for your tasks.</p>
                   <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <h5 className="text-xs font-bold text-blue-700 mb-1">Observation</h5>
                      <p className="text-xs text-blue-600">You have 3 tasks in "Stuck". Consider breaking them down.</p>
                   </div>
                </div>
             )}
          </div>
       </div>
       
       <button 
         className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform animate-bounce-subtle ${isAIActive ? 'bg-slate-900 ring-4 ring-purple-200' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-purple-300'}`}
       >
          <BrainCircuit size={28} />
       </button>
    </div>
  );
};

const Confetti = ({ active }: { active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: any[] = [];
    const colors = ['#d500f9', '#00e5ff', '#00e676', '#ffea00', '#ff4081'];

    const createParticle = (x: number, y: number) => {
      const type = Math.random() > 0.6 ? 'circle' : 'stringer'; 
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 30, 
        vy: (Math.random() - 1) * 25, 
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 2,
        life: 150 + Math.random() * 100,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.4,
        length: type === 'stringer' ? Math.random() * 20 + 10 : 0
      };
    };

    // Initial burst
    for (let i = 0; i < 150; i++) {
      particles.push(createParticle(canvas.width - 200, canvas.height / 2)); 
    }
    
    // Secondary bursts
    const burstInterval = setInterval(() => {
        for (let i = 0; i < 50; i++) {
             particles.push(createParticle(canvas.width - 200 + (Math.random() * 100 - 50), canvas.height / 2 + (Math.random() * 100 - 50))); 
        }
    }, 400);

    const timeout = setTimeout(() => clearInterval(burstInterval), 1500);

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles = particles.filter(p => p.life > 0);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // Gravity
        p.life--;
        p.rotation += p.rotationSpeed;
        
        // Friction
        p.vx *= 0.96;
        p.vy *= 0.96;

        ctx.fillStyle = p.color;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'stringer') {
            ctx.fillRect(-p.size / 4, -p.length / 2, p.size / 2, p.length);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
      }

      if (particles.length > 0) {
        requestAnimationFrame(animate);
      }
    };

    animate();
    
    return () => {
        clearInterval(burstInterval);
        clearTimeout(timeout);
    };
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />;
};

const DeleteToast = ({ taskTitle, onConfirm, onCancel }: { taskTitle: string, onConfirm: () => void, onCancel: () => void }) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 fade-in">
      <div className="bg-slate-900 text-white rounded-xl shadow-2xl p-4 flex items-center gap-6 border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/20 rounded-full text-red-400">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm">Delete Task?</h4>
            <p className="text-xs text-slate-400 max-w-[200px] truncate">Are you sure you want to delete "{taskTitle}"?</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg shadow-red-900/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Modals ---

const SessionSummaryModal = ({ sessionLog, startTime, onClose }: { sessionLog: SessionEvent[], startTime: number, onClose: () => void }) => {
  const duration = Date.now() - startTime;
  
  // Analytics
  const moves = sessionLog.filter(e => e.type === 'MOVE').length;
  const created = sessionLog.filter(e => e.type === 'CREATE').length;
  const velocityScore = Math.min(100, (moves * 10) + (created * 5));
  
  // Generate Coaching Prompts
  const prompts = [];
  if (moves > 5) prompts.push("High activity detected. Are these moves reflecting real progress or just reshuffling?");
  if (created > 3) prompts.push("New tasks added. Do we have the capacity to handle this influx?");
  if (velocityScore < 20) prompts.push("Slow session. Was this a deep-dive planning discussion?");
  if (prompts.length === 0) prompts.push("Great session! Review the board state before closing.");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white p-0 rounded-2xl shadow-2xl w-[700px] animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-10 transform rotate-12 scale-150">
              <BarChart3 size={200} />
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2 text-purple-300">
                <Sparkles size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Smart Session Analysis</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Session Complete</h2>
              <p className="text-slate-400 flex items-center gap-2">
                 <Timer size={16} /> Duration: <span className="text-white font-mono">{formatDuration(duration)}</span>
              </p>
           </div>
        </div>

        {/* Dashboard Grid */}
        <div className="p-8 grid grid-cols-2 gap-6 bg-slate-50">
           <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Session Velocity</h3>
              <div className="flex items-end gap-2">
                 <span className="text-4xl font-black text-slate-800">{velocityScore}</span>
                 <span className="text-xs font-bold text-slate-400 mb-1.5">/ 100</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500" style={{ width: `${velocityScore}%` }} />
              </div>
           </div>

           <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Action Breakdown</h3>
              <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Moves</span>
                    <span className="font-bold text-slate-900">{moves}</span>
                 </div>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400" style={{ width: `${Math.min(100, moves * 10)}%` }} />
                 </div>
                 
                 <div className="flex justify-between text-sm mt-2">
                    <span className="text-slate-600">Created</span>
                    <span className="font-bold text-slate-900">{created}</span>
                 </div>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400" style={{ width: `${Math.min(100, created * 10)}%` }} />
                 </div>
              </div>
           </div>
        </div>

        {/* Coach Prompts */}
        <div className="px-8 pb-8 bg-slate-50 flex-1">
           <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <HelpCircle size={14} /> Coaching Prompts
           </h3>
           <div className="space-y-3">
              {prompts.map((prompt, idx) => (
                 <div key={idx} className="p-4 bg-white border-l-4 border-purple-500 shadow-sm rounded-r-lg text-sm text-slate-700 italic">
                    "{prompt}"
                 </div>
              ))}
           </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-white flex justify-end">
           <button 
             onClick={onClose}
             className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
           >
             End Session & Close
           </button>
        </div>
      </div>
    </div>
  );
};

const IconPickerModal = ({ onClose, onSelect }: { onClose: () => void, onSelect: (iconName: string) => void }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white p-6 rounded-xl shadow-2xl w-[320px] animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-4 text-slate-800">Select Icon</h2>
        <div className="grid grid-cols-5 gap-3">
          {Object.keys(ICON_MAP).map(iconName => {
             const Icon = ICON_MAP[iconName];
             return (
                <button 
                  key={iconName}
                  onClick={() => onSelect(iconName)}
                  className="p-2 rounded-lg hover:bg-purple-50 text-slate-500 hover:text-purple-600 flex items-center justify-center transition-colors"
                  title={iconName}
                >
                   <Icon size={24} />
                </button>
             );
          })}
        </div>
        <button onClick={onClose} className="mt-6 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-medium transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
};

const TaskDetailModal = ({ task, initiatives, onClose, onUpdate }: { task: Task, initiatives: Initiative[], onClose: () => void, onUpdate: (t: Task) => void }) => {
  const [localTask, setLocalTask] = useState<Task>(JSON.parse(JSON.stringify(task)));
  
  const [isEditingStrategy, setIsEditingStrategy] = useState(!task.initiativeId);
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newGuidance, setNewGuidance] = useState('');
  const [addImageUrl, setAddImageUrl] = useState('');
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [isBlueprintMode, setIsBlueprintMode] = useState(false);

  const assigneeUser = getUserById(localTask.assignee);
  const reporterUser = getUserById(localTask.reporter);
  
  const updateLocalField = (field: keyof Task, value: any) => {
    setLocalTask(prev => ({ ...prev, [field]: value }));
  };

  const handleGlobalSave = () => {
    onUpdate(localTask);
    onClose();
  };

  const toggleSubtask = (index: number) => {
    const newSubtasks = [...(localTask.subtasks || [])];
    newSubtasks[index].completed = !newSubtasks[index].completed;
    updateLocalField('subtasks', newSubtasks);
  };

  const deleteSubtask = (index: number) => {
    const newSubtasks = [...(localTask.subtasks || [])];
    newSubtasks.splice(index, 1);
    updateLocalField('subtasks', newSubtasks);
  };

  const addSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    const newSubtasks = [...(localTask.subtasks || []), { label: newSubtask, completed: false }];
    updateLocalField('subtasks', newSubtasks);
    setNewSubtask('');
  };

  const addComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      userId: 'coach', 
      text: newComment,
      timestamp: Date.now()
    };
    const newComments = [...(localTask.comments || []), comment];
    updateLocalField('comments', newComments);
    setNewComment('');
  };

  const addGuidance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuidance.trim()) return;
    const guidance: Guidance = {
        id: Date.now().toString(),
        text: newGuidance,
        timestamp: Date.now()
    };
    const newGuidanceList = [...(localTask.guidance || []), guidance];
    updateLocalField('guidance', newGuidanceList);
    setNewGuidance('');
  };

  const addImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addImageUrl.trim()) return;
    const newImage: TaskImage = {
      id: Date.now().toString(),
      url: addImageUrl,
      name: 'Attachment'
    };
    const newImages = [...(localTask.images || []), newImage];
    updateLocalField('images', newImages);
    updateLocalField('attachments', (localTask.attachments || 0) + 1);
    setAddImageUrl('');
    setIsAddingImage(false);
  };

  // Blueprint Mode Helpers
  const getStickyColor = (index: number) => {
      const colors = ['bg-yellow-200 text-yellow-900', 'bg-pink-200 text-pink-900', 'bg-cyan-200 text-cyan-900', 'bg-orange-200 text-orange-900'];
      return colors[index % colors.length];
  };
  const getStickyRotation = (index: number) => {
      const rots = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0'];
      return rots[index % rots.length];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl m-4 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200" 
        onClick={e => e.stopPropagation()}
      >
         {/* Header */}
         <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/80">
            <div className="flex-1 pr-4">
               <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 shadow-sm ${getTypeColor(localTask.type)}`}>
                  {localTask.type}
               </div>
               <input 
                  type="text" 
                  value={localTask.title} 
                  onChange={(e) => updateLocalField('title', e.target.value)}
                  className="w-full text-xl font-bold text-slate-800 leading-snug bg-transparent border-b border-transparent hover:border-slate-200 focus:border-purple-500 focus:ring-0 p-0 py-1 transition-colors outline-none placeholder:text-slate-300"
                  placeholder="Task Title"
               />
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full p-1 transition-colors">
               <X className="w-6 h-6" />
            </button>
         </div>

         {/* Body */}
         <div className="flex-1 flex overflow-hidden">
           {/* Left Main Content */}
           <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Strategy Link */}
              <section>
                 <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Link className="w-4 h-4" /> Strategy Link
                    </h3>
                    {!isEditingStrategy && localTask.initiativeId && (
                       <button onClick={() => setIsEditingStrategy(true)} className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-50 transition-colors" title="Edit Strategy">
                          <Pencil size={14} />
                       </button>
                    )}
                 </div>
                 
                 {isEditingStrategy ? (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 animate-in fade-in">
                       <select 
                         className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                         value={localTask.initiativeId || ''}
                         onChange={(e) => {
                           updateLocalField('initiativeId', e.target.value);
                           updateLocalField('objectiveId', undefined);
                         }}
                       >
                         <option value="">-- Select Project Initiative --</option>
                         {initiatives.map(init => (
                           <option key={init.id} value={init.id}>{init.title}</option>
                         ))}
                       </select>
                       
                       {localTask.initiativeId && (
                         <select 
                           className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                           value={localTask.objectiveId !== undefined ? localTask.objectiveId : ''}
                           onChange={(e) => {
                              const val = e.target.value;
                              updateLocalField('objectiveId', val === '' ? undefined : parseInt(val));
                           }}
                         >
                           <option value="">-- Select Specific Objective --</option>
                           {initiatives.find(i => i.id === localTask.initiativeId)?.objectives.map((obj, idx) => (
                             <option key={idx} value={idx}>{obj}</option>
                           ))}
                         </select>
                       )}
                       <div className="flex justify-end mt-2">
                          <button 
                            onClick={() => setIsEditingStrategy(false)}
                            disabled={!localTask.initiativeId} 
                            className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded shadow-sm hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1"
                          >
                             <CheckCircle size={12} /> Save Strategy Link
                          </button>
                       </div>
                    </div>
                 ) : (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-4 relative group transition-all">
                       {(() => {
                          const init = initiatives.find(i => i.id === localTask.initiativeId);
                          const obj = init?.objectives[localTask.objectiveId || 0];
                          const InitIcon = init ? getIconComponent(init.icon) : Trophy;
                          return (
                            <div className="flex items-start gap-4">
                               <div className="p-3 bg-white rounded-lg shadow-sm text-purple-600">
                                  <InitIcon size={24} />
                               </div>
                               <div>
                                   <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                      Linked Initiative
                                   </div>
                                   <div className="font-bold text-slate-800 text-sm mb-2 leading-tight">{init?.title}</div>
                                   {obj && (
                                      <div className="flex items-start gap-2 bg-white/50 p-2 rounded-lg border border-purple-100/50">
                                         <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                                         <p className="text-xs text-slate-600 italic">{obj}</p>
                                      </div>
                                   )}
                               </div>
                            </div>
                          );
                       })()}
                    </div>
                 )}
              </section>

              {/* Description */}
              <section>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <Layout className="w-4 h-4" /> Description
                 </h3>
                 <textarea 
                    className="w-full min-h-[100px] bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed resize-y focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    placeholder="Add a more detailed description..."
                    value={localTask.description || ''}
                    onChange={(e) => updateLocalField('description', e.target.value)}
                 />
                 <p className="text-[10px] text-slate-400 mt-1 italic">Description is always visible on the card (truncated).</p>
              </section>

               {/* Subtasks with Blueprint Mode */}
              <section>
                 <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                       <CheckSquare className="w-4 h-4" /> Checklist
                    </h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setIsBlueprintMode(!isBlueprintMode)}
                        className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${isBlueprintMode ? 'bg-yellow-100 text-yellow-700 font-medium' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        title="Visualize as Sticky Notes"
                      >
                        {isBlueprintMode ? <List size={12} /> : <StickyNote size={12} />}
                        {isBlueprintMode ? 'List View' : 'Generate to Blueprint'}
                      </button>
                      <button 
                        onClick={() => updateLocalField('showChecklistOnCard', !localTask.showChecklistOnCard)}
                        className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${localTask.showChecklistOnCard ? 'bg-purple-50 text-purple-600 font-medium' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        title="Toggle visibility on board card"
                      >
                        {localTask.showChecklistOnCard ? <Eye size={12} /> : <EyeOff size={12} />}
                        {localTask.showChecklistOnCard ? 'Visible on Card' : 'Hidden on Card'}
                      </button>
                    </div>
                 </div>

                 {/* Checklist Body */}
                 {isBlueprintMode ? (
                    <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 min-h-[200px] grid grid-cols-3 gap-4 relative overflow-hidden">
                        {/* Background grid lines for whiteboard effect */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                        
                        {localTask.subtasks && localTask.subtasks.map((st, i) => (
                           <div 
                              key={i} 
                              className={`aspect-square p-4 shadow-lg hover:shadow-xl transition-all flex flex-col ${getStickyColor(i)} ${getStickyRotation(i)} hover:scale-105 hover:rotate-0 ${st.completed ? 'opacity-60' : ''}`}
                           >
                              <span className={`text-sm font-medium font-sans leading-tight flex-1 ${st.completed ? 'line-through decoration-2' : ''}`}>
                                {st.label}
                              </span>
                              <div className="mt-2 flex justify-between items-end">
                                 <span className="text-[10px] opacity-60 font-bold">BLUNT</span>
                                 {st.completed && <CheckCircle size={16} className="text-black/40" />}
                              </div>
                           </div>
                        ))}
                        {(!localTask.subtasks || localTask.subtasks.length === 0) && (
                           <div className="col-span-3 flex flex-col items-center justify-center text-slate-400 italic text-sm py-10">
                              <StickyNote size={48} className="mb-2 opacity-20" />
                              Add items to the checklist to generate blueprint notes.
                           </div>
                        )}
                    </div>
                 ) : (
                   <div className="space-y-2">
                      {localTask.subtasks && localTask.subtasks.length > 0 && (
                         localTask.subtasks.map((st, i) => (
                           <div 
                              key={i} 
                              className="flex items-start gap-3 p-2 rounded-lg border border-transparent hover:bg-slate-50 hover:shadow-sm group transition-all"
                           >
                              <button 
                                onClick={() => toggleSubtask(i)}
                                className={`mt-1 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors cursor-pointer ${st.completed ? 'bg-green-500 border-green-500' : 'border-slate-300 bg-white hover:border-purple-500'}`}
                              >
                                 {st.completed && <CheckCircle className="w-3 h-3 text-white" />}
                              </button>
                              <span 
                                  onClick={() => toggleSubtask(i)}
                                  className={`flex-1 text-sm leading-relaxed cursor-pointer select-none transition-colors ${st.completed ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700'}`}
                              >
                                 {st.label}
                              </span>
                              <button
                                  onClick={() => deleteSubtask(i)}
                                  className="shrink-0 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                                  title="Delete Item"
                              >
                                  <Trash2 size={14} />
                              </button>
                           </div>
                         ))
                      )}
                      
                      <form onSubmit={addSubtask} className="flex gap-2 mt-2">
                         <input 
                            type="text" 
                            placeholder="Add an item..." 
                            className="flex-1 p-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                            value={newSubtask}
                            onChange={e => setNewSubtask(e.target.value)}
                         />
                         <button type="submit" disabled={!newSubtask.trim()} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors">
                            <Plus size={16} />
                         </button>
                      </form>
                   </div>
                 )}
              </section>

              {/* Coach Guidance Section */}
              <section>
                 <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <Lightbulb className="w-4 h-4" /> Coach Guidance & Tips
                 </h3>
                 <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-3">
                    {localTask.guidance && localTask.guidance.length > 0 ? (
                        <div className="space-y-2">
                            {localTask.guidance.map(g => (
                                <div key={g.id} className="flex gap-3 items-start bg-white p-3 rounded-lg shadow-sm border border-amber-100/50">
                                    <div className="mt-0.5 text-amber-500 shrink-0">
                                        <Compass size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-700 leading-relaxed">{g.text}</p>
                                        <span className="text-[10px] text-slate-400 mt-1 block">{new Date(g.timestamp).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 italic">No specific guidance added yet.</p>
                    )}
                    
                    <form onSubmit={addGuidance} className="flex gap-2 mt-2">
                        <input 
                            type="text" 
                            placeholder="Add a tip, link, or resource..." 
                            className="flex-1 p-2 border border-amber-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-400 outline-none placeholder:text-amber-300/70"
                            value={newGuidance}
                            onChange={e => setNewGuidance(e.target.value)}
                        />
                        <button type="submit" disabled={!newGuidance.trim()} className="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 disabled:opacity-50 transition-colors font-medium text-xs">
                            Add Tip
                        </button>
                    </form>
                 </div>
              </section>

              {/* Images / Attachments */}
              <section>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Images & Attachments
                  </h3>
                  <div className="flex items-center gap-2">
                     <button 
                        onClick={() => updateLocalField('showImageOnCard', !localTask.showImageOnCard)}
                        className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${localTask.showImageOnCard ? 'bg-purple-50 text-purple-600 font-medium' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        title="Toggle visibility on board card"
                     >
                        {localTask.showImageOnCard ? <Eye size={12} /> : <EyeOff size={12} />}
                        {localTask.showImageOnCard ? 'Visible on Card' : 'Hidden on Card'}
                     </button>
                     <button onClick={() => setIsAddingImage(!isAddingImage)} className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 px-2 py-1 rounded-md hover:bg-purple-50">
                        <Plus size={12} /> Add Image
                     </button>
                  </div>
                </div>

                {isAddingImage && (
                   <form onSubmit={addImage} className="mb-4 flex gap-2 animate-in slide-in-from-top-2">
                      <input 
                        type="url" 
                        autoFocus
                        placeholder="Paste image URL..." 
                        className="flex-1 p-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                        value={addImageUrl}
                        onChange={e => setAddImageUrl(e.target.value)}
                      />
                      <button type="submit" className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700">Add</button>
                   </form>
                )}

                <div className="grid grid-cols-3 gap-3">
                   {localTask.images?.map(img => (
                      <div key={img.id} className="aspect-square rounded-lg overflow-hidden border border-slate-200 group relative">
                         <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </div>
                   ))}
                   {(!localTask.images || localTask.images.length === 0) && localTask.description && localTask.description.endsWith('.jpg') && (
                      <div className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-purple-50 flex items-center justify-center p-2 text-center">
                         <span className="text-[10px] text-purple-400">{localTask.description}</span>
                      </div>
                   )}
                </div>
              </section>

              {/* Comments */}
              <section className="pt-4 border-t border-slate-100">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Comments
                 </h3>
                 <div className="space-y-4 mb-4">
                    {localTask.comments?.map(comment => {
                       const user = getUserById(comment.userId);
                       return (
                          <div key={comment.id} className="flex gap-3">
                             <div className="mt-1">
                                {user?.avatarType === 'image' ? (
                                   <img src={user.img} className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                   <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-white text-xs font-bold">{user?.initials}</div>
                                )}
                             </div>
                             <div className="bg-slate-50 p-3 rounded-xl rounded-tl-none border border-slate-100">
                                <div className="flex items-center gap-2 mb-1">
                                   <span className="text-xs font-bold text-slate-700">{user?.name}</span>
                                   <span className="text-[10px] text-slate-400">{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <p className="text-sm text-slate-600">{comment.text}</p>
                             </div>
                          </div>
                       );
                    })}
                 </div>
                 <form onSubmit={addComment} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-white text-xs font-bold shrink-0">JB</div>
                    <div className="flex-1 relative">
                       <input 
                          type="text" 
                          placeholder="Write a comment..." 
                          className="w-full pl-4 pr-10 py-2 border border-slate-200 rounded-full text-sm bg-white focus:ring-2 focus:ring-cyan-400 outline-none"
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                       />
                       <button type="submit" disabled={!newComment.trim()} className="absolute right-1.5 top-1.5 p-1 text-cyan-500 hover:bg-cyan-50 rounded-full transition-colors disabled:opacity-30">
                          <Send size={14} />
                       </button>
                    </div>
                 </form>
              </section>

           </div>

           {/* Right Sidebar Meta */}
           <div className="w-72 bg-slate-50 border-l border-slate-100 p-6 space-y-6 overflow-y-auto">
              
              <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Strategic Value</h3>
                 <div className="space-y-2">
                    {(['FILLER', 'SUPPORTIVE', 'INTENTIONAL', 'PIVOTAL', 'CRITICAL_PATH'] as StrategicValue[]).map(v => {
                       const config = getStrategicValueConfig(v);
                       const Icon = config.icon;
                       return (
                         <button
                            key={v}
                            onClick={() => updateLocalField('strategicValue', v)}
                            title={STRATEGIC_VALUE_DESCRIPTIONS[v]}
                            className={`w-full px-3 py-2 rounded-lg text-left border transition-all flex items-center gap-3 group ${localTask.strategicValue === v ? 'bg-white border-purple-400 shadow-sm ring-1 ring-purple-400' : 'bg-white border-slate-200 hover:border-purple-200'}`}
                         >
                            <div className={`${config.color} bg-slate-50 p-1 rounded group-hover:bg-white`}><Icon size={16} /></div>
                            <div className="flex flex-col">
                               <span className={`text-xs font-bold ${localTask.strategicValue === v ? 'text-slate-800' : 'text-slate-500'}`}>{config.label}</span>
                            </div>
                         </button>
                       );
                    })}
                 </div>
              </div>

              <div className="h-px bg-slate-200 my-2" />

              <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Complexity</h3>
                 <div className="grid grid-cols-2 gap-2">
                    {(['EASY', 'MEDIUM', 'HARD', 'UNCERTAIN'] as TaskComplexity[]).map(c => {
                       const config = getComplexityConfig(c);
                       const Icon = config.icon;
                       return (
                        <button
                            key={c}
                            onClick={() => updateLocalField('complexity', c)}
                            className={`px-2 py-2 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center gap-1.5 ${localTask.complexity === c ? 'bg-white border-slate-800 text-slate-800 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                            <Icon size={12} className={config.color}/>
                            {c}
                        </button>
                       )
                    })}
                 </div>
              </div>

              <div className="h-px bg-slate-200 my-2" />

              <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Time Config</h3>
                 <div className="space-y-2">
                    <select
                       value={localTask.timeConfig?.type || 'ESTIMATION'}
                       onChange={(e) => updateLocalField('timeConfig', { ...localTask.timeConfig, type: e.target.value as TimeConfigType, value: localTask.timeConfig?.value || '' })}
                       className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-purple-500"
                    >
                       <option value="ESTIMATION">Estimation</option>
                       <option value="RANGE">Date Range</option>
                       <option value="SPRINT">Sprint Target</option>
                       <option value="DEADLINE">Deadline</option>
                    </select>
                    
                    <div className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-lg">
                       {localTask.timeConfig?.type === 'DEADLINE' || localTask.timeConfig?.type === 'RANGE' ? <Calendar size={14} className="text-slate-400"/> : <Clock size={14} className="text-slate-400"/>}
                       <input 
                          type={localTask.timeConfig?.type === 'DEADLINE' ? 'date' : 'text'}
                          value={localTask.timeConfig?.value || ''}
                          onChange={(e) => updateLocalField('timeConfig', { ...localTask.timeConfig, type: localTask.timeConfig?.type || 'ESTIMATION', value: e.target.value })}
                          placeholder={localTask.timeConfig?.type === 'ESTIMATION' ? "e.g. 2 Days" : "e.g. Sprint 4"}
                          className="w-full text-sm text-slate-700 outline-none bg-transparent"
                       />
                    </div>
                 </div>
              </div>

              <div className="h-px bg-slate-200 my-2" />

              <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Assignee</h3>
                 <select 
                    value={localTask.assignee || ''}
                    onChange={(e) => updateLocalField('assignee', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-purple-500"
                 >
                    <option value="">Unassigned</option>
                    <option value="coach">Jane Bobo</option>
                    <option value="client">Max Phillips</option>
                 </select>
                 {localTask.assignee && assigneeUser && (
                    <div className="mt-2 flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                        {assigneeUser.avatarType === 'image' ? (
                           <img src={assigneeUser.img} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                           <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center text-white text-[10px] font-bold">{assigneeUser?.initials}</div>
                        )}
                        <span className="text-sm font-medium text-slate-700">{assigneeUser?.name}</span>
                    </div>
                 )}
              </div>

              <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tasked By</h3>
                 <select 
                    value={localTask.reporter || ''}
                    onChange={(e) => updateLocalField('reporter', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-purple-500"
                 >
                    <option value="">Unassigned</option>
                    <option value="coach">Jane Bobo</option>
                    <option value="client">Max Phillips</option>
                 </select>
                 {localTask.reporter && reporterUser && (
                    <div className="mt-2 flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                        {reporterUser.avatarType === 'image' ? (
                           <img src={reporterUser.img} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                           <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center text-white text-[10px] font-bold">{reporterUser?.initials}</div>
                        )}
                        <span className="text-sm font-medium text-slate-700">{reporterUser?.name}</span>
                    </div>
                 )}
              </div>

              <div className="h-px bg-slate-200 my-4" />

              <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Meta</h3>
                 <div className="space-y-3">
                    <div>
                       <label className="block text-[10px] font-bold text-slate-500 mb-1">Task Type</label>
                        <select 
                          value={localTask.type} 
                          onChange={e => updateLocalField('type', e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-white text-sm text-slate-700 outline-none"
                        >
                           <option value="LEARN">LEARN</option>
                           <option value="DO">DO</option>
                           <option value="STRATEGY">STRATEGY</option>
                           <option value="COMMIT">COMMIT</option>
                           <option value="REVIEW">REVIEW</option>
                        </select>
                    </div>
                 </div>
              </div>

           </div>
         </div>
         
         {/* Footer */}
         <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between gap-2 items-center">
            <div className="text-xs text-slate-400 font-medium italic">
               Changes are not saved until you click Save.
            </div>
            <div className="flex gap-2">
               <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-all">
                  Cancel
               </button>
               <button onClick={handleGlobalSave} className="px-6 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                  <Save size={16} /> Save Changes
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

const CreateTaskModal = ({ onClose, onCreate }: { onClose: () => void, onCreate: (t: {title: string, type: TaskType, description: string}) => void }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TaskType>('LEARN');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate({ title, type, description });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-[480px] animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-6 text-slate-800">Add New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Task Title</label>
            <input
              autoFocus
              type="text"
              className="w-full p-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter task title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
             <textarea
                className="w-full p-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-y"
                placeholder="Enter task description..."
                value={description}
                onChange={e => setDescription(e.target.value)}
             />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Type</label>
            <select 
              className="w-full p-3 border border-slate-200 rounded-lg bg-white text-slate-900 outline-none focus:ring-2 focus:ring-purple-500"
              value={type} 
              onChange={e => setType(e.target.value as TaskType)}
            >
              <option value="LEARN">LEARN</option>
              <option value="DO">DO</option>
              <option value="STRATEGY">STRATEGY</option>
              <option value="COMMIT">COMMIT</option>
              <option value="REVIEW">REVIEW</option>
            </select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-lg shadow-purple-200 transition-all">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LaneModal = ({ initialTitle = '', initialColor = LANE_COLORS[0], isEdit = false, onClose, onSave }: { initialTitle?: string, initialColor?: string, isEdit?: boolean, onClose: () => void, onSave: (title: string, color: string) => void }) => {
  const [title, setTitle] = useState(initialTitle);
  const [color, setColor] = useState(initialColor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title, color);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-6 text-slate-800">{isEdit ? 'Edit Lane' : 'Add New Lane'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lane Title</label>
            <input
              autoFocus
              type="text"
              className="w-full p-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter lane title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lane Color</label>
             <div className="grid grid-cols-5 gap-2">
                {LANE_COLORS.map(c => (
                   <button
                      type="button"
                      key={c}
                      className={`w-8 h-8 rounded-full ${c} border-2 ${color === c ? 'border-slate-800 scale-110' : 'border-transparent hover:border-slate-300'} transition-all`}
                      onClick={() => setColor(c)}
                   />
                ))}
             </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium shadow-lg transition-all">{isEdit ? 'Save Changes' : 'Create Lane'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main App ---

const ProjectInitiativesDrawer = ({ isOpen, setIsOpen, initiatives, setEditingInitiativeId, setActiveModal, tasks }: { isOpen: boolean, setIsOpen: (v: boolean) => void, initiatives: Initiative[], setEditingInitiativeId: (id: string) => void, setActiveModal: (m: any) => void, tasks: Record<string, Task> }) => {
   
   const getTaskCountForInitiative = (initId: string) => {
       return Object.values(tasks).filter(t => t.initiativeId === initId).length;
   };

   return (
     <div className="absolute top-[68px] left-0 right-0 z-40 flex flex-col items-center pointer-events-none">
        {/* The Drawer Content (Pointer events enabled only when open to allow clicking inside) */}
        <div className={`w-full bg-white/95 backdrop-blur-md shadow-sm overflow-hidden transition-all duration-300 ease-in-out pointer-events-auto ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-100'}`}> 
             <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                   <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Target size={16} className="text-purple-500"/> Project Initiatives
                   </h2>
                   <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400"><X size={16}/></button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                   {initiatives.map((init) => {
                      const IconComponent = getIconComponent(init.icon);
                      const taskCount = getTaskCountForInitiative(init.id);
                      return (
                      <div key={init.id} className="relative w-[420px] shrink-0 bg-slate-50 border border-slate-200 rounded-xl p-5 transition-all shadow-sm hover:shadow-md group">
                         <div className="flex gap-4 h-full">
                            <button 
                               onClick={() => { setEditingInitiativeId(init.id); setActiveModal('icon-picker'); }}
                               className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 shrink-0 flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform"
                               title="Change Icon"
                            >
                               <IconComponent size={24} />
                            </button>
                            <div className="flex-1">
                               <div className="flex justify-between items-start">
                                   <h3 className="font-bold text-slate-800 text-sm mb-1">{init.title}</h3>
                                   {taskCount > 0 && (
                                       <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{taskCount} Linked Tasks</span>
                                   )}
                               </div>
                               <p className="text-xs text-slate-500 leading-relaxed mb-3">{init.purpose}</p>
                               
                               <div className="pt-2 border-t border-slate-100">
                                   <h4 className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-2">Objectives</h4>
                                   <ul className="space-y-1 list-disc pl-4">
                                     {init.objectives.map((obj, i) => (
                                         <li key={i} className="text-xs text-slate-600 leading-tight">{obj}</li>
                                     ))}
                                   </ul>
                               </div>
                            </div>
                         </div>
                      </div>
                   )})}
                </div>
             </div>
        </div>

        {/* The Purple Pin Bar - Moves up/down as the content above it collapses/expands */}
        <div className="w-full h-[3px] bg-gradient-to-r from-[#6432ff] to-[#d500f9] shrink-0 pointer-events-auto" />

        {/* The Hanging Tab - Attached to the bar */}
        <button 
             onClick={() => setIsOpen(!isOpen)}
             className={`pointer-events-auto flex items-center justify-center w-[28px] h-[24px] rounded-b-lg text-white shadow-md hover:h-[28px] transition-all ease-out -mt-[1px] ${isOpen ? 'bg-white text-purple-600 shadow-sm border-x border-b border-slate-100' : 'bg-gradient-to-br from-[#6432ff] to-[#d500f9]'}`}
             title="Toggle Project Initiatives"
        >
             <Target size={14} strokeWidth={2.5} className={isOpen ? "" : "drop-shadow-sm"} />
        </button>

        {/* Backdrop */}
        {isOpen && (
            <div className="fixed inset-0 bg-black/5 z-[-1] pointer-events-auto" onClick={() => setIsOpen(false)} />
        )}
     </div>
   );
};

const App = () => {
  const [boardData, setBoardData] = useState<BoardData>(INITIAL_DATA);
  const [initiatives, setInitiatives] = useState<Initiative[]>(INITIAL_INITIATIVES);
  const [isTaskLogOpen, setTaskLogOpen] = useState(true);
  const [isDoneDrawerOpen, setDoneDrawerOpen] = useState(true);
  const [isInitiativesOpen, setInitiativesOpen] = useState(false); // Default closed
  const [collapsedLanes, setCollapsedLanes] = useState<Set<string>>(new Set());
  
  // Session State
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [sessionLog, setSessionLog] = useState<SessionEvent[]>([]);
  
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null); // For vertical sorting
  const [dragOverLaneId, setDragOverLaneId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Modal States
  const [activeModal, setActiveModal] = useState<'task-detail' | 'create-task' | 'lane-settings' | 'icon-picker' | 'session-summary' | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [targetLaneId, setTargetLaneId] = useState<string | null>(null); // For creating task in specific lane
  const [editingLaneId, setEditingLaneId] = useState<string | null>(null); // For editing specific lane
  const [editingInitiativeId, setEditingInitiativeId] = useState<string | null>(null); // For editing initiative icon

  // Card Menu State
  const [activeCardMenuId, setActiveCardMenuId] = useState<string | null>(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
  const [isAIActive, setIsAIActive] = useState(false);
  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(null);

  const logSessionAction = (type: SessionEvent['type'], description: string) => {
    if (isSessionActive) {
      setSessionLog(prev => [...prev, { type, description, timestamp: Date.now() }]);
    }
  };

  const toggleSession = () => {
    if (isSessionActive) {
      setActiveModal('session-summary');
      setIsSessionActive(false);
    } else {
      setIsSessionActive(true);
      setSessionStartTime(Date.now());
      setSessionLog([]);
    }
  };

  const resetBoard = () => {
    if(confirm("Are you sure you want to reset the board? This will move all cards back to the Client/Coach Logs.")) {
       setBoardData(prev => {
          const newLanes = { ...prev.lanes };
          const clientLogIds = [...newLanes['client_log'].taskIds];
          const coachLogIds = [...newLanes['coach_log'].taskIds];
          Object.keys(newLanes).forEach(laneId => {
             if (laneId !== 'client_log' && laneId !== 'coach_log') {
                const taskIds = newLanes[laneId].taskIds;
                taskIds.forEach(tid => {
                   const task = prev.tasks[tid];
                   if (task.assignee === 'client' || task.reporter === 'coach') {
                      clientLogIds.push(tid);
                   } else {
                      coachLogIds.push(tid);
                   }
                });
                newLanes[laneId].taskIds = [];
             }
          });
          newLanes['client_log'].taskIds = clientLogIds;
          newLanes['coach_log'].taskIds = coachLogIds;
          return { ...prev, lanes: newLanes };
       });
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.stopPropagation();
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleLaneDragStart = (e: React.DragEvent, laneId: string) => {
    e.dataTransfer.setData('laneId', laneId);
  };

  const handleDragOver = (e: React.DragEvent, laneId: string) => {
    e.preventDefault();
    if (draggedTaskId) {
       setDragOverLaneId(laneId);
    }
  };

  const handleDrop = (e: React.DragEvent, targetLaneId: string) => {
    e.preventDefault();
    setDragOverLaneId(null);
    const draggedLaneId = e.dataTransfer.getData('laneId');
    if (draggedLaneId) {
      const newLaneOrder = [...boardData.laneOrder];
      const dragIndex = newLaneOrder.indexOf(draggedLaneId);
      const hoverIndex = newLaneOrder.indexOf(targetLaneId);
      if (dragIndex > -1 && hoverIndex > -1) {
         newLaneOrder.splice(dragIndex, 1);
         newLaneOrder.splice(hoverIndex, 0, draggedLaneId);
         setBoardData(prev => ({ ...prev, laneOrder: newLaneOrder }));
         logSessionAction('LANE', `Reordered lane "${boardData.lanes[draggedLaneId].title}"`);
      }
      return;
    }
    if (!draggedTaskId) return;
    const sourceLaneId = Object.keys(boardData.lanes).find(key => boardData.lanes[key].taskIds.includes(draggedTaskId));
    if (!sourceLaneId) {
      setDraggedTaskId(null);
      setDragOverTaskId(null);
      return;
    }
    const sourceLane = boardData.lanes[sourceLaneId];
    const targetLane = boardData.lanes[targetLaneId];
    const task = boardData.tasks[draggedTaskId];
    let newTargetTaskIds = [...targetLane.taskIds];
    if (sourceLaneId === targetLaneId) {
        newTargetTaskIds = newTargetTaskIds.filter(id => id !== draggedTaskId);
    }
    let insertIndex = newTargetTaskIds.length;
    if (dragOverTaskId && targetLane.taskIds.includes(dragOverTaskId)) {
        const index = newTargetTaskIds.indexOf(dragOverTaskId);
        if (index !== -1) {
            insertIndex = index;
        }
    }
    newTargetTaskIds.splice(insertIndex, 0, draggedTaskId);
    setBoardData(prev => {
       const newLanes = { ...prev.lanes };
       if (sourceLaneId !== targetLaneId) {
           newLanes[sourceLaneId] = { ...sourceLane, taskIds: sourceLane.taskIds.filter(id => id !== draggedTaskId) };
           logSessionAction('MOVE', `Moved "${task.title}" from ${sourceLane.title} to ${targetLane.title}`);
       } else {
           logSessionAction('MOVE', `Reordered "${task.title}" in ${targetLane.title}`);
       }
       newLanes[targetLaneId] = { ...targetLane, taskIds: newTargetTaskIds };
       return { ...prev, lanes: newLanes };
    });
    if (targetLaneId === 'done' && sourceLaneId !== 'done') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  const addNewLane = (title: string, color: string) => {
     if (editingLaneId) {
        setBoardData(prev => ({ ...prev, lanes: { ...prev.lanes, [editingLaneId]: { ...prev.lanes[editingLaneId], title, color } } }));
        logSessionAction('LANE', `Edited lane "${title}"`);
        setEditingLaneId(null);
     } else {
        const newId = `lane-${Date.now()}`;
        const newLane: Lane = { id: newId, title, taskIds: [], color };
        setBoardData(prev => ({ ...prev, lanes: { ...prev.lanes, [newId]: newLane }, laneOrder: [...prev.laneOrder, newId] }));
        logSessionAction('LANE', `Created lane "${title}"`);
     }
  };

  const addNewTask = (taskDetails: {title: string, type: TaskType, description: string}) => {
     if (!targetLaneId) return;
     const newId = `t-${Date.now()}`;
     const newTask: Task = { id: newId, title: taskDetails.title, type: taskDetails.type, description: taskDetails.description, complexity: 'UNCERTAIN', timeConfig: { type: 'ESTIMATION', value: '1 Day' }, subtasks: [], attachments: 0, comments: [] };
     setBoardData(prev => ({ ...prev, tasks: { ...prev.tasks, [newId]: newTask }, lanes: { ...prev.lanes, [targetLaneId]: { ...prev.lanes[targetLaneId], taskIds: [...prev.lanes[targetLaneId].taskIds, newId] } } }));
     logSessionAction('CREATE', `Created task "${taskDetails.title}" in ${boardData.lanes[targetLaneId].title}`);
  };

  const updateTask = (updatedTask: Task) => {
     setBoardData(prev => ({ ...prev, tasks: { ...prev.tasks, [updatedTask.id]: updatedTask } }));
     logSessionAction('EDIT', `Updated task "${updatedTask.title}"`);
  };

  const handleDeleteTask = () => {
    if (!taskToDeleteId) return;
    const taskTitle = boardData.tasks[taskToDeleteId]?.title;
    setBoardData(prev => {
      const newTasks = { ...prev.tasks };
      delete newTasks[taskToDeleteId];
      const newLanes = { ...prev.lanes };
      for (const laneId in newLanes) {
          newLanes[laneId] = { ...newLanes[laneId], taskIds: newLanes[laneId].taskIds.filter(id => id !== taskToDeleteId) };
      }
      return { ...prev, tasks: newTasks, lanes: newLanes };
    });
    logSessionAction('DELETE', `Deleted task "${taskTitle}"`);
    setTaskToDeleteId(null);
  };

  const updateInitiativeIcon = (iconName: string) => {
    if (editingInitiativeId) {
      setInitiatives(prev => prev.map(init => init.id === editingInitiativeId ? { ...init, icon: iconName } : init));
      setEditingInitiativeId(null);
      setActiveModal(null);
    }
  };

  const handleToggleLaneCollapse = (laneId: string) => {
     setCollapsedLanes(prev => {
        const next = new Set(prev);
        if (next.has(laneId)) { next.delete(laneId); } else { next.add(laneId); }
        return next;
     });
  };
  
  const getAISuggestion = (taskTitle: string) => {
      const lower = taskTitle.toLowerCase();
      if (lower.includes('photo') || lower.includes('image') || lower.includes('finish')) {
          return { text: "Create a mood board of examples", label: "Generate Mood Board" };
      }
      if (lower.includes('email') || lower.includes('reach out') || lower.includes('contact')) {
          return { text: "Draft initial outreach email", label: "Draft Email" };
      }
      if (lower.includes('order') || lower.includes('supply') || lower.includes('source')) {
          return { text: "List potential suppliers & prices", label: "Find Suppliers" };
      }
      if (lower.includes('schedule') || lower.includes('plan')) {
          return { text: "Generate project timeline", label: "Create Timeline" };
      }
      // Return null if no specific context is found
      return null;
  };

  const handleRunAI = (taskId: string) => {
      // Simulate AI action
      setActiveSuggestionId(null);
      setShowConfetti(true); // Small celebration for running AI
      setTimeout(() => setShowConfetti(false), 1500);
  };

  const renderCard = (taskId: string, isSidebar: boolean = false) => {
    const task = boardData.tasks[taskId];
    if (!task) return null;
    const assignee = task.assignee ? getUserById(task.assignee) : null;
    const linkedInitiative = initiatives.find(i => i.id === task.initiativeId);
    const InitIcon = linkedInitiative ? getIconComponent(linkedInitiative.icon) : null;
    const complexityConfig = getComplexityConfig(task.complexity);
    const strategicConfig = getStrategicValueConfig(task.strategicValue);
    const StrategicIcon = strategicConfig.icon;
    const ComplexityIcon = complexityConfig.icon;
    
    // Check for AI Suggestion Context
    const aiSuggestion = getAISuggestion(task.title);

    // Card Background Logic
    let cardStyle = 'bg-white border-slate-100 hover:border-purple-200'; // Default Sidebar style
    
    if (!isSidebar) {
        if (task.assignee === 'coach') {
            // Coach cards on board: Cyan tint
            cardStyle = 'bg-cyan-50/60 border-cyan-100 hover:border-cyan-300';
        } else {
            // Other cards on board: Light Gray to contrast with Sidebar
            cardStyle = 'bg-slate-100 border-slate-200 hover:border-purple-200'; 
        }
    }

    return (
      <div 
        key={task.id} 
        draggable 
        onDragStart={(e) => handleDragStart(e, task.id)} 
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); if (draggedTaskId && draggedTaskId !== task.id) { setDragOverTaskId(task.id); } }} 
        onClick={() => { setSelectedTaskId(task.id); setActiveModal('task-detail'); }} 
        className={`${cardStyle} p-4 rounded-xl shadow-sm border cursor-grab active:cursor-grabbing hover:shadow-md transition-all group relative ${dragOverTaskId === task.id ? 'border-purple-500 ring-2 ring-purple-100' : ''}`}
      >
        {/* AI Suggestion Overlay */}
        {activeSuggestionId === task.id && aiSuggestion && (
            <div className="absolute inset-0 z-30 bg-white/95 backdrop-blur-sm p-4 rounded-xl flex flex-col justify-center items-center text-center animate-in fade-in zoom-in-95 border-2 border-purple-400 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <Wand2 className="text-purple-500 mb-2" size={24}/>
                <h5 className="text-xs font-bold text-slate-800 mb-1 uppercase tracking-wider">AI Suggestion</h5>
                <p className="text-xs text-slate-600 mb-3 font-medium leading-snug">"{aiSuggestion.text}"</p>
                <div className="flex gap-2 w-full">
                    <button onClick={(e) => { e.stopPropagation(); handleRunAI(task.id); }} className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-md transition-colors">{aiSuggestion.label}</button>
                    <button onClick={(e) => { e.stopPropagation(); setActiveSuggestionId(null); }} className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors">Close</button>
                </div>
            </div>
        )}

        {/* AI Trigger Button (Selective & "Color Cloud" style) */}
        {isAIActive && !isSidebar && aiSuggestion && activeSuggestionId !== task.id && (
            <button 
                onClick={(e) => { e.stopPropagation(); setActiveSuggestionId(task.id); }}
                className="absolute -top-3 -right-3 z-20 group w-8 h-8 flex items-center justify-center"
                title="AI Assistant"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400 via-purple-400 to-pink-400 rounded-full blur-[3px] opacity-60 group-hover:opacity-100 animate-[spin_4s_linear_infinite]" />
                <div className="relative bg-white p-1.5 rounded-full shadow-sm z-10 group-hover:scale-110 transition-transform">
                    <Sparkles size={12} className="text-purple-600" fill="currentColor" />
                </div>
            </button>
        )}

        {activeCardMenuId === task.id && (<div className="fixed inset-0 z-[5]" onClick={(e) => { e.stopPropagation(); setActiveCardMenuId(null); }} />)}
        <div className="flex justify-between items-start mb-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getTypeColor(task.type)}`}>{task.type}</span>
          <div className="relative flex items-center gap-1">
             {!isSidebar && InitIcon && (<div className="text-purple-400" title={`Linked to: ${linkedInitiative?.title}`}><InitIcon size={14} /></div>)}
             <button onClick={(e) => { e.stopPropagation(); setActiveCardMenuId(activeCardMenuId === task.id ? null : task.id); }} className={`text-slate-300 hover:text-slate-600 transition-opacity ${activeCardMenuId === task.id ? 'opacity-100 text-slate-600' : 'opacity-0 group-hover:opacity-100'}`}><MoreHorizontal size={16} /></button>
             {activeCardMenuId === task.id && (
                <div className="absolute right-0 top-6 bg-white rounded-lg shadow-xl border border-slate-100 z-[10] w-32 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <button onClick={(e) => { e.stopPropagation(); setActiveCardMenuId(null); setSelectedTaskId(task.id); setActiveModal('task-detail'); }} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Pencil size={12} /> Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); setActiveCardMenuId(null); setTaskToDeleteId(task.id); }} className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 size={12} /> Delete</button>
                </div>
             )}
          </div>
        </div>
        <h4 className="text-sm font-bold text-slate-800 mb-1 leading-snug">{task.title}</h4>
        {task.description && (<p className="text-xs text-slate-500 line-clamp-2 mb-2 leading-relaxed" title={task.description}>{task.description}</p>)}
        {isSidebar ? null : (
           <>
             {task.showImageOnCard && task.images && task.images.length > 0 && (<div className="mt-2 mb-2 rounded-lg overflow-hidden h-24 bg-slate-100"><img src={task.images[0].url} className="w-full h-full object-cover" alt="Task attachment" /></div>)}
             {task.showChecklistOnCard && task.subtasks && task.subtasks.length > 0 && (
                <div className="mt-2 mb-2 space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                   {task.subtasks.slice(0, 3).map((st, i) => (<div key={i} className="flex items-center gap-2"><div className={`w-3 h-3 rounded-sm border ${st.completed ? 'bg-green-400 border-green-400' : 'border-slate-300 bg-white'}`}>{st.completed && <CheckCircle className="w-full h-full text-white" />}</div><span className={`text-[10px] truncate ${st.completed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{st.label}</span></div>))}
                   {task.subtasks.length > 3 && <div className="text-[9px] text-slate-400 pl-5">+{task.subtasks.length - 3} more...</div>}
                </div>
             )}
             <div className="flex items-center gap-3 mt-3">
                {assignee && (<div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white shadow-sm">{assignee.avatarType === 'initials' ? (assignee as UserWithInitials).initials : <img src={(assignee as UserWithImage).img} className="w-full h-full rounded-full object-cover" />}</div>)}
                <div className="flex items-center gap-3 ml-auto">
                   {task.guidance && task.guidance.length > 0 && (<div className="flex items-center gap-1 text-amber-500 text-[10px]" title={`${task.guidance.length} guidance tip(s) available`}><Lightbulb size={14} fill="currentColor" className="text-amber-400"/></div>)}
                   {task.comments && task.comments.length > 0 && (<div className="flex items-center gap-1 text-slate-400 text-[10px]"><MessageSquare size={12} /><span>{task.comments.length}</span></div>)}
                   {task.strategicValue && (<div className={`flex items-center gap-1 text-[10px] ${strategicConfig.color}`} title={`Strategic Value: ${strategicConfig.label}`}><StrategicIcon size={14} /></div>)}
                   {task.complexity && (<div className={`flex items-center gap-1 text-[10px] ${complexityConfig.color}`} title={`Complexity: ${complexityConfig.label}`}><ComplexityIcon size={14} /></div>)}
                   {task.timeConfig && (<div className="flex items-center gap-1 text-slate-400 text-[10px]" title={task.timeConfig.type}>{task.timeConfig.type === 'DEADLINE' ? <Calendar size={12} className="text-red-400"/> : <Clock size={12} />}<span>{task.timeConfig.value}</span></div>)}
                </div>
             </div>
           </>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#f3f6fc] relative overflow-hidden">
      <Confetti active={showConfetti} />
      <AIAssistant tasks={boardData.tasks} isAIActive={isAIActive} setIsAIActive={setIsAIActive} />
      <header className="h-[68px] bg-white border-b border-slate-200 flex items-center px-6 justify-between shrink-0 z-20 relative shadow-sm">
        <div className="flex items-center gap-4 h-full">
          <button onClick={resetBoard} className="w-[48px] h-[48px] bg-gradient-to-br from-[#6432ff] to-[#d500f9] rounded-lg flex items-center justify-center shadow-lg shadow-purple-200 hover:scale-105 active:scale-95 transition-transform group" title="Reset Board (Move all to Log)">
            <span className="text-white font-black text-2xl tracking-tighter group-hover:rotate-180 transition-transform duration-500">B</span>
          </button>
          <div>
            <div className="flex items-center gap-2"><span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Board Type:</span><span className="font-black text-slate-900 text-xs uppercase tracking-wider">Sync</span></div>
            <h1 className="text-2xl font-bold text-[#d81b60] tracking-tight leading-none">BLUNT Mason Lighting</h1>
          </div>
        </div>
        <div className="flex items-center gap-8 h-full">
          <nav className="flex items-center gap-6 mr-8">
             <button title="List View" className="text-slate-400 hover:text-slate-600 transition-colors"><List size={16} /></button>
             <button title="Kanban Board" className="text-purple-600 bg-purple-50 p-2 rounded-lg"><Kanban size={16} /></button>
             <button title="Gantt Chart" className="text-slate-400 hover:text-slate-600 transition-colors"><GanttChart size={16} /></button>
             <button title="Calendar" className="text-slate-400 hover:text-slate-600 transition-colors"><Calendar size={16} /></button>
             <button title="Network View" className="text-slate-400 hover:text-slate-600 transition-colors"><Network size={16} /></button>
             <button title="Users" className="text-slate-400 hover:text-slate-600 transition-colors"><Users size={16} /></button>
             <button title="Achievements" className="text-slate-400 hover:text-slate-600 transition-colors"><Trophy size={16} /></button>
             <button title="More Options" className="text-slate-400 hover:text-slate-600 transition-colors"><MoreHorizontal size={16} /></button>
          </nav>
          <div className="flex items-center gap-3 pl-8 border-l border-slate-100 h-10 my-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 rounded-full border border-cyan-100"><div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center text-white text-xs font-bold">JB</div><span className="text-xs font-bold text-cyan-700">Jane Bobo</span></div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full border border-purple-100"><img src={(USERS.client as UserWithImage).img} className="w-6 h-6 rounded-full object-cover" /><span className="text-xs font-bold text-purple-700">Max Phillips</span></div>
          </div>
        </div>
      </header>
      
      {/* Hanging Project Initiatives Drawer Component */}
      <ProjectInitiativesDrawer 
        isOpen={isInitiativesOpen} 
        setIsOpen={setInitiativesOpen} 
        initiatives={initiatives} 
        setEditingInitiativeId={setEditingInitiativeId}
        setActiveModal={setActiveModal}
        tasks={boardData.tasks}
      />

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar: Shared Task Log */}
        <div className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-20 shadow-xl ${isTaskLogOpen ? 'w-[680px]' : 'w-12'}`}>
           <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 h-14 shrink-0">
              {isTaskLogOpen && (
                 <div className="flex items-center gap-4">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2"><List size={18}/> Collaborative Task Log</h2>
                    <button 
                      onClick={toggleSession}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${isSessionActive ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                    >
                       {isSessionActive ? <StopCircle size={14} fill="currentColor"/> : <Play size={14} fill="currentColor"/>}
                       {isSessionActive ? 'End Session' : 'Start Session'}
                    </button>
                 </div>
              )}
              <button onClick={() => setTaskLogOpen(!isTaskLogOpen)} className="p-1 hover:bg-slate-200 rounded-md text-slate-400 transition-colors">
                 {isTaskLogOpen ? <ChevronLeft size={18} /> : <List size={18} />}
              </button>
           </div>
           
           {isTaskLogOpen && (
             <div className="flex-1 flex overflow-hidden">
                {/* Client Log Column */}
                <div className="flex-1 flex flex-col border-r border-slate-100 bg-slate-50/30">
                    <div className="p-3 border-b border-slate-100 flex items-center gap-3">
                        <img src={(USERS.client as UserWithImage).img} className="w-8 h-8 rounded-full object-cover shadow-sm border border-white" />
                        <div>
                           <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider">Client Log</h3>
                           <p className="text-[10px] font-bold text-slate-400">{USERS.client.name}</p>
                        </div>
                        <span className="ml-auto bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{boardData.lanes['client_log'].taskIds.length}</span>
                    </div>
                    <div 
                        className={`flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar transition-colors ${dragOverLaneId === 'client_log' ? 'bg-purple-50' : ''}`}
                        onDragOver={(e) => handleDragOver(e, 'client_log')}
                        onDrop={(e) => handleDrop(e, 'client_log')}
                    >
                        {boardData.lanes['client_log'].taskIds.map(taskId => renderCard(taskId, true))}
                        <button onClick={() => { setTargetLaneId('client_log'); setActiveModal('create-task'); }} className="w-full py-3 text-xs font-bold text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg border-2 border-dashed border-slate-200 hover:border-purple-200 transition-all flex items-center justify-center gap-1">
                            <Plus size={14} /> Add Task
                        </button>
                    </div>
                </div>

                {/* Coach Log Column */}
                <div className="flex-1 flex flex-col bg-slate-50/30">
                    <div className="p-3 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-sm border border-white">JB</div>
                        <div>
                           <h3 className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Coach Log</h3>
                           <p className="text-[10px] font-bold text-slate-400">{USERS.coach.name}</p>
                        </div>
                        <span className="ml-auto bg-cyan-100 text-cyan-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{boardData.lanes['coach_log'].taskIds.length}</span>
                    </div>
                    <div 
                        className={`flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar transition-colors ${dragOverLaneId === 'coach_log' ? 'bg-cyan-50' : ''}`}
                        onDragOver={(e) => handleDragOver(e, 'coach_log')}
                        onDrop={(e) => handleDrop(e, 'coach_log')}
                    >
                        {boardData.lanes['coach_log'].taskIds.map(taskId => renderCard(taskId, true))}
                        <button onClick={() => { setTargetLaneId('coach_log'); setActiveModal('create-task'); }} className="w-full py-3 text-xs font-bold text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg border-2 border-dashed border-slate-200 hover:border-cyan-200 transition-all flex items-center justify-center gap-1">
                            <Plus size={14} /> Add Task
                        </button>
                    </div>
                </div>
             </div>
           )}
        </div>

        {/* Center: Kanban Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden hide-scrollbar bg-slate-50/50 network-bg">
           <div className="h-full flex p-6 gap-6 min-w-max items-start pt-16"> {/* Added top padding to clear the Hanging Tab */}
              {boardData.laneOrder.map(laneId => {
                 const lane = boardData.lanes[laneId];
                 const isDragOver = dragOverLaneId === laneId;
                 const headerColorClass = LANE_HEADER_COLORS[lane.color] || 'bg-slate-200 border-slate-300';
                 const headerBg = headerColorClass.split(' ')[1] || 'bg-slate-200';
                 const isCollapsed = collapsedLanes.has(laneId);

                 if (isCollapsed) {
                    return (
                        <div 
                            key={laneId}
                            className="w-[40px] flex flex-col h-full shrink-0 transition-all duration-200 border border-slate-200 bg-slate-100 rounded-xl overflow-hidden"
                        >
                            <div 
                                onClick={() => handleToggleLaneCollapse(laneId)}
                                className={`h-full flex flex-col items-center py-4 gap-4 cursor-pointer hover:bg-slate-200 transition-colors ${headerBg}`}
                            >
                                <button className="p-1 bg-white/50 rounded hover:bg-white text-slate-600">
                                    <Maximize2 size={14} />
                                </button>
                                <div className="bg-white px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-700 shadow-sm border border-slate-100">
                                    {lane.taskIds.length}
                                </div>
                                <div className="flex-1 w-full flex flex-col items-center gap-1 px-1">
                                    {lane.taskIds.map(tid => {
                                        const t = boardData.tasks[tid];
                                        return (
                                            <div 
                                                key={tid} 
                                                className={`w-4 h-1.5 rounded-full ${getTypeColor(t.type).split(' ')[0]}`} 
                                                title={t.title}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="flex-1 flex items-center justify-center py-4">
                                   <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap [writing-mode:vertical-rl] rotate-180">
                                       {lane.title}
                                   </span>
                                </div>
                            </div>
                        </div>
                    );
                 }

                 return (
                    <div 
                       key={laneId} 
                       draggable
                       onDragStart={(e) => handleDragStart(e, laneId)}
                       onDragOver={(e) => handleDragOver(e, laneId)} // Allow dropping lanes to reorder
                       onDrop={(e) => handleDrop(e, laneId)}
                       className="w-80 flex flex-col h-full shrink-0 select-none transition-all duration-200"
                    >
                       {/* Lane Header */}
                       <div className={`p-3 rounded-t-xl border-b-0 flex justify-between items-center shadow-sm relative group cursor-grab active:cursor-grabbing ${headerColorClass}`}>
                          <div className="flex items-center gap-2">
                             <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">{lane.title}</h3>
                             <span className="bg-white/50 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-600">{lane.taskIds.length}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                                onClick={() => handleToggleLaneCollapse(laneId)}
                                className="p-1 hover:bg-black/10 rounded text-slate-600"
                                title="Collapse Lane"
                             >
                                <Minimize2 size={14} />
                             </button>
                             <button 
                                onClick={() => { setEditingLaneId(laneId); setActiveModal('lane-settings'); }} 
                                className="p-1 hover:bg-black/10 rounded text-slate-600"
                             >
                                <Settings size={14} />
                             </button>
                             <button 
                                onClick={() => { setTargetLaneId(laneId); setActiveModal('create-task'); }}
                                className="p-1 hover:bg-black/10 rounded text-slate-600"
                             >
                                <Plus size={16} />
                             </button>
                          </div>
                       </div>

                       {/* Lane Body (Drop Zone) */}
                       <div 
                          className={`flex-1 bg-slate-100/50 border-x border-b border-slate-200 rounded-b-xl p-3 space-y-3 overflow-y-auto custom-scrollbar transition-all duration-200 ${isDragOver ? 'bg-purple-50 ring-2 ring-purple-400 ring-inset' : ''}`}
                       >
                          {lane.taskIds.map(taskId => renderCard(taskId, false))}
                          
                          {/* Add Task Button at bottom of lane */}
                          <button 
                             onClick={() => { setTargetLaneId(laneId); setActiveModal('create-task'); }}
                             className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 text-sm font-medium opacity-50 hover:opacity-100"
                          >
                             <Plus size={16} /> Add Card
                          </button>
                       </div>
                    </div>
                 );
              })}

              {/* Add New Lane Button */}
              <button 
                 onClick={() => { setEditingLaneId(null); setActiveModal('lane-settings'); }}
                 className="shrink-0 flex items-center gap-2 text-slate-400 hover:text-purple-600 font-bold text-sm px-4 py-3 rounded-lg hover:bg-white/50 border border-transparent hover:border-purple-200 transition-all h-max mt-2"
              >
                 <Plus size={20} />
                 <span className="whitespace-nowrap">Add New Lane</span>
              </button>
           </div>
        </div>

        {/* Right Sidebar: Done Drawer */}
        <div className={`bg-white border-l border-slate-200 transition-all duration-300 flex flex-col shadow-xl z-20 ${isDoneDrawerOpen ? 'w-80' : 'w-12'}`}>
           <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 h-14">
              {isDoneDrawerOpen && <h2 className="font-bold text-emerald-600 flex items-center gap-2"><CheckCircle size={18}/> DONE</h2>}
              <button onClick={() => setDoneDrawerOpen(!isDoneDrawerOpen)} className="p-1 hover:bg-slate-200 rounded-md text-slate-400 transition-colors">{isDoneDrawerOpen ? <ChevronLeft size={18} className="rotate-180"/> : <CheckCircle size={18} />}</button>
           </div>
           
           {isDoneDrawerOpen && (
              <div 
                 className={`flex-1 overflow-y-auto p-4 space-y-3 bg-emerald-50/30 custom-scrollbar transition-colors ${dragOverLaneId === 'done' ? 'bg-emerald-100/50' : ''}`}
                 onDragOver={(e) => handleDragOver(e, 'done')}
                 onDrop={(e) => handleDrop(e, 'done')}
              >
                 {boardData.lanes['done'].taskIds.length === 0 && (
                    <div className="text-center text-slate-400 text-xs py-10 italic">
                       Drag completed tasks here to celebrate!
                    </div>
                 )}
                 {boardData.lanes['done'].taskIds.map(taskId => renderCard(taskId, false))}
              </div>
           )}
        </div>
      </div>

      {/* --- Modals --- */}
      {activeModal === 'task-detail' && selectedTaskId && boardData.tasks[selectedTaskId] && (
        <TaskDetailModal 
           task={boardData.tasks[selectedTaskId]} 
           initiatives={initiatives}
           onClose={() => { setActiveModal(null); setSelectedTaskId(null); }}
           onUpdate={updateTask}
        />
      )}

      {activeModal === 'create-task' && (
         <CreateTaskModal 
            onClose={() => { setActiveModal(null); setTargetLaneId(null); }}
            onCreate={addNewTask}
         />
      )}

      {activeModal === 'lane-settings' && (
         <LaneModal
            initialTitle={editingLaneId ? boardData.lanes[editingLaneId].title : ''}
            initialColor={editingLaneId ? boardData.lanes[editingLaneId].color : LANE_COLORS[0]}
            isEdit={!!editingLaneId}
            onClose={() => { setActiveModal(null); setEditingLaneId(null); }}
            onSave={addNewLane}
         />
      )}

      {activeModal === 'icon-picker' && (
        <IconPickerModal 
           onClose={() => setActiveModal(null)}
           onSelect={updateInitiativeIcon}
        />
      )}

      {activeModal === 'session-summary' && (
        <SessionSummaryModal 
           sessionLog={sessionLog}
           startTime={sessionStartTime}
           onClose={() => setActiveModal(null)}
        />
      )}

      {/* --- Delete Confirmation Toast --- */}
      {taskToDeleteId && (
         <DeleteToast 
            taskTitle={boardData.tasks[taskToDeleteId]?.title || 'Task'}
            onConfirm={handleDeleteTask}
            onCancel={() => setTaskToDeleteId(null)}
         />
      )}
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
