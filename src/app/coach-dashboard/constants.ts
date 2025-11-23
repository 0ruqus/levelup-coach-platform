



import { Board, ClientType, Task, Win, Activity, BoardTemplate, UserProfile } from './types';

// --- PERSONA DEFINITIONS ---
export const PERSONAS: UserProfile[] = [
  {
    id: 'coach',
    name: "Jane Bobo",
    role: "Senior Performance Coach",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane&backgroundColor=c0aede"
  },
  {
    id: 'hwi',
    name: "Sterling Vance",
    role: "Private Investor",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=e5e7eb&clothing=blazerAndShirt"
  },
  {
    id: 'partner',
    name: "Marcus Chen",
    role: "Co-Founder & CTO",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=ffdfbf&clothing=hoodie"
  }
];

// --- TEMPLATES REPOSITORY (Shared) ---
export const BOARD_TEMPLATES: BoardTemplate[] = [
  {
    id: 'temp_startup',
    title: 'Startup Accelerator Board',
    description: 'High-velocity workflow for founders and early-stage startups focused on rapid iteration.',
    category: 'Business',
    lanes: ['Action Ready', 'In Motion', 'Q&A', 'Stuck', 'Review Ready'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1600',
    recommendedFor: ['Startups', 'Product Launch', 'Biz Dev']
  },
  {
    id: 'temp_career',
    title: 'Career Transition Roadmap',
    description: 'Structured pipeline for job seekers, from resume refinement to offer negotiation.',
    category: 'Career',
    lanes: ['Resume/Brand Prep', 'Networking Targets', 'Applications Sent', 'Interview Prep', 'Offer Negotiation'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1600',
    recommendedFor: ['Job Seekers', 'Career Switchers', 'Graduates']
  },
  {
    id: 'temp_life',
    title: 'Life Balance & Goals',
    description: 'Holistic view of personal development, habit tracking, and long-term vision.',
    category: 'Wellness',
    lanes: ['Discovery & Vision', 'Goal Setting', 'Habit Building', 'Reflection', 'Wins & Achieved'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1600',
    recommendedFor: ['Life Coaching', 'Wellness', 'Personal Growth']
  },
  {
    id: 'temp_onboarding',
    title: 'New Client Onboarding',
    description: 'Standardized intake process for getting new clients set up and ready for success.',
    category: 'Admin',
    lanes: ['Contract Sent', 'Contract Signed', 'Intake Form', 'First Session Scheduled', 'Onboarding Complete'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1600',
    recommendedFor: ['All Clients', 'Admin', 'Operations']
  },
  {
    id: 'temp_90day',
    title: 'Executive 90-Day Plan',
    description: 'Strategic roadmap for executives taking on a new role or driving a major initiative.',
    category: 'Executive',
    lanes: ['Days 1-30: Learn', 'Days 31-60: Assess', 'Days 61-90: Execute', 'Milestones', 'Review'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1600',
    recommendedFor: ['Executives', 'Leadership', 'VPs']
  }
];

// --- COACH DATA SET ---
const COACH_BOARDS: Board[] = [
    {
      id: '7',
      clientName: 'Blunt Mason Lighting',
      headline: 'Retail Expansion',
      subhead: 'Q4 Showroom Launch Strategy',
      type: ClientType.STARTUP,
      tags: ['Retail', 'Expansion', 'Hiring'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=1600',
      logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=BM&backgroundColor=475569',
      isOrganization: true,
      lastActive: '2m ago',
      alerts: [
          { id: 'a1', type: 'success', title: 'Alignment Index', metric: '98%' },
          { id: 'a2', type: 'critical', title: 'Failed Commits', metric: '2 Items' },
          { id: 'a_streaks', type: 'success', title: 'Weekly Streak', metric: '4 Wks' }
      ]
    },
    {
      id: '1',
      clientName: 'TechNova',
      headline: 'Series A Fundraising',
      subhead: 'Q3 Financial Goals',
      type: ClientType.STARTUP,
      tags: ['Biz Dev', 'Finance', 'Strategy'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1600',
      logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=TechNova&backgroundColor=0ea5e9',
      isOrganization: true,
      lastActive: '20m ago',
      alerts: [
          { id: 'a3', type: 'review', title: 'Path Advanced', metric: '+1 Step' },
          { id: 'a_blocker', type: 'success', title: 'Blockers Resolved', metric: '3' },
          { id: 'a_eng', type: 'warning', title: 'Engagement Inc', metric: '-2%' }
      ]
    },
    {
      id: '2',
      clientName: 'GreenLeaf Co.',
      headline: 'Supply Chain Optimization',
      subhead: 'Vendor Selection',
      type: ClientType.STARTUP,
      tags: ['Operations', 'Scaling'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1600',
      logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=GreenLeaf&backgroundColor=22c55e',
      isOrganization: true,
      lastActive: '2h ago',
      alerts: [
          { id: 'g1', type: 'success', title: 'Weekly Tasks Completed', metric: '100%' },
          { id: 'g2', type: 'info', title: 'Brand Words', metric: 'Updated' }
      ]
    },
    {
      id: '3',
      clientName: 'Sarah Jenkins',
      headline: 'Career Pivot to PM',
      subhead: 'Interview Prep Phase',
      type: ClientType.CAREER,
      tags: ['Career Planning', 'Resume', 'Mock Interviews'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1600',
      logoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffdfbf',
      isOrganization: false,
      lastActive: '4h ago',
      alerts: [
          { id: 'a4', type: 'success', title: 'Self Rating', metric: '4.8/5' },
          { id: 'a_qual', type: 'success', title: 'Quality of Week', metric: 'High' }
      ]
    },
    {
      id: '4',
      clientName: 'Michael Chen',
      headline: 'Executive Leadership',
      subhead: 'Public Speaking & Presence',
      type: ClientType.CAREER,
      tags: ['Leadership', 'Soft Skills'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1600',
      logoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=b6e3f4',
      isOrganization: false,
      lastActive: '1d ago',
      alerts: [
          { id: 'm1', type: 'info', title: 'Strength Interpretation', metric: 'Ready' },
          { id: 'm2', type: 'success', title: 'Alignment Index', metric: '95%' }
      ]
    },
    {
      id: '5',
      clientName: 'Junior Dev Cohort',
      headline: 'Full Stack Mastery',
      subhead: 'React & Node.js Curriculum',
      type: ClientType.MENTORING,
      tags: ['Mentoring', 'Technical Skills'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1600',
      logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=DevCohort',
      isOrganization: true,
      lastActive: '30m ago',
      alerts: [
          { id: 'j1', type: 'critical', title: 'Difficulty Rating', metric: 'High' },
          { id: 'j2', type: 'success', title: 'WoW Improvement', metric: '+15%' }
      ]
    },
    {
      id: '6',
      clientName: 'Alex Rivera',
      headline: 'UX Design Portfolio',
      subhead: 'Case Study Review',
      type: ClientType.MENTORING,
      tags: ['Mentoring', 'Portfolio'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1600',
      logoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=ffdfbf',
      isOrganization: false,
      lastActive: '5h ago',
      alerts: [
          { id: 'ar1', type: 'success', title: 'Evolved Up', metric: '2 Items' },
          { id: 'ar2', type: 'review', title: 'Critical Tasks', metric: '5 Done' }
      ]
    },
];

const COACH_TASKS: Task[] = [
  { id: 't1', title: 'Schedule follow-up call with Pacific Corp', dueTime: '09:30 AM', category: 'Personal', completed: false },
  { id: 't2', title: 'Re-engage OmniTech (Gone Cold)', dueTime: '11:00 AM', category: 'Personal', completed: false },
  { id: 't3', title: 'Review "Design Specs" lane for Blunt Mason', dueTime: '02:00 PM', category: 'Personal', completed: false },
  { id: 't_late', title: 'Draft proposal for new Career Cohort', dueTime: '04:30 PM', category: 'Personal', completed: false },
  { id: 't8', title: 'Update billing for Q3 Clients', dueTime: '05:00 PM', category: 'Personal', completed: false },
  { id: 't4', title: 'Review Series A Pitch Deck', dueTime: '02:00 PM', category: 'Client Work', completed: false, clientId: '1', clientName: 'TechNova', clientAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=TechNova&backgroundColor=0ea5e9', boardName: 'Fundraising' },
  { id: 't_bm1', title: 'Approve Final Showroom Layout', dueTime: '02:30 PM', category: 'Client Work', completed: false, clientId: '7', clientName: 'Blunt Mason', clientAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BM&backgroundColor=475569', boardName: 'Retail Expansion' },
  { id: 't5', title: 'Mock Interview: Behavioral Questions', dueTime: '03:30 PM', category: 'Client Work', completed: false, clientId: '3', clientName: 'Sarah Jenkins', clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffdfbf', boardName: 'Career Pivot' },
];

const COACH_WINS: Win[] = [
  { id: 'w4', clientName: 'Blunt Mason', clientAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BM&backgroundColor=475569', description: 'Signed lease for prime downtown location!', date: '1 hour ago', type: ClientType.STARTUP },
  { id: 'w1', clientName: 'Sarah Jenkins', clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffdfbf', description: 'Landed final round interviews at Google & Spotify!', date: 'Today', type: ClientType.CAREER },
  { id: 'w2', clientName: 'TechNova', clientAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=TechNova&backgroundColor=0ea5e9', description: 'Secured $500k Angel Investment commitment.', date: 'Yesterday', type: ClientType.STARTUP },
];

const COACH_ACTIVITY: Activity[] = [
  { id: 'a0', clientName: 'Blunt Mason', clientAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BM&backgroundColor=475569', action: 'uploaded "Showroom_Floorplan_v2.pdf"', status: 'positive', timeAgo: '2m ago' },
  { id: 'a1', clientName: 'Sarah Jenkins', clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffdfbf', action: 'moved "Netflix Application" to "Interview"', status: 'positive', timeAgo: '10m ago' },
  { id: 'a2', clientName: 'GreenLeaf', clientAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=GreenLeaf&backgroundColor=22c55e', action: 'flagged "Logistics Provider" as Blocked', status: 'critical', timeAgo: '2h ago' },
];


// --- HWI (High Wealth Individual) DATA SET ---
const HWI_BOARDS: Board[] = [
    {
      id: 'hwi_1',
      clientName: 'The Vance Estate',
      headline: 'Property Management',
      subhead: 'Aspen & Hamptons Renovations',
      type: ClientType.ESTATE,
      tags: ['Properties', 'Staffing', 'Maintenance'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1600596542815-6ad4c728fd2f?auto=format&fit=crop&q=80&w=1600',
      logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=VE&backgroundColor=334155',
      isOrganization: true,
      lastActive: '10m ago',
      alerts: [
          { id: 'ha1', type: 'critical', title: 'Budget Overrun', metric: '$12.5k' },
          { id: 'ha2', type: 'success', title: 'Renovation Done', metric: '100%' }
      ]
    },
    {
      id: 'hwi_2',
      clientName: 'Maria Rodriguez',
      headline: 'Executive PA',
      subhead: 'Travel & Calendar Mgmt',
      type: ClientType.PERSONAL_ASSISTANT,
      tags: ['Scheduling', 'Travel', 'Events'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1600',
      logoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=fbbf24',
      isOrganization: false,
      lastActive: '1h ago',
      alerts: [
        { id: 'ha3', type: 'warning', title: 'Flight Delay', metric: '+2h' },
        { id: 'ha_info', type: 'info', title: 'Values Updated', metric: 'New' }
      ]
    },
    {
      id: 'hwi_3',
      clientName: 'Vance Family Office',
      headline: 'Investment Portfolio',
      subhead: 'Q4 Strategy & Philanthropy',
      type: ClientType.FAMILY_OFFICE,
      tags: ['Finance', 'Trusts', 'Charity'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600',
      logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=VanceOffice&backgroundColor=4f46e5',
      isOrganization: true,
      lastActive: '4h ago',
      alerts: [
          { id: 'ha_streak', type: 'success', title: 'Goal Streak', metric: '6 Mos' },
          { id: 'ha_align', type: 'success', title: 'Alignment Index', metric: '100%' }
      ]
    },
    {
      id: 'hwi_4',
      clientName: 'Aviation Dept',
      headline: 'Fleet Management',
      subhead: 'G550 Maintenance Schedule',
      type: ClientType.ESTATE,
      tags: ['Logistics', 'Assets'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=1600',
      logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=Jet',
      isOrganization: true,
      lastActive: '2d ago',
      alerts: [
          { id: 'av1', type: 'warning', title: 'Maint. Check', metric: 'Due' },
          { id: 'av2', type: 'info', title: 'Self-Story', metric: 'Updated' }
      ]
    }
];

const HWI_TASKS: Task[] = [
    { id: 'h_t1', title: 'Approve catering budget for Charity Gala', dueTime: '10:00 AM', category: 'Personal', completed: false },
    { id: 'h_t2', title: 'Review architectural plans for Aspen West Wing', dueTime: '01:00 PM', category: 'Personal', completed: false },
    { id: 'h_t3', title: 'Sign Trust Fund transfer documents', dueTime: '04:00 PM', category: 'Personal', completed: false },
    { id: 'h_t4', title: 'Review Flight Itinerary to Davos', dueTime: '03:30 PM', category: 'Client Work', completed: false, clientId: 'hwi_2', clientName: 'Maria (PA)', clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=fbbf24', boardName: 'Travel' },
    { id: 'h_t5', title: 'Approve Yacht Crew Bonuses', dueTime: 'Tomorrow', category: 'Client Work', completed: false, clientId: 'hwi_3', clientName: 'Family Office', clientAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=VanceOffice&backgroundColor=4f46e5', boardName: 'Finance' },
];

const HWI_WINS: Win[] = [
    { id: 'h_w1', clientName: 'Vance Office', clientAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=VanceOffice&backgroundColor=4f46e5', description: 'Foundation gala raised $2.4M for clean water.', date: 'Yesterday', type: ClientType.FAMILY_OFFICE },
    { id: 'h_w2', clientName: 'Maria (PA)', clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=fbbf24', description: 'Secured impossible reservation at Dorsia.', date: '2 days ago', type: ClientType.PERSONAL_ASSISTANT },
    { id: 'h_w3', clientName: 'Estate Team', clientAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=VE&backgroundColor=334155', description: 'Hamptons landscape project finished under budget.', date: 'Last week', type: ClientType.ESTATE },
];

const HWI_ACTIVITY: Activity[] = [
    { id: 'h_a1', clientName: 'Maria (PA)', clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=fbbf24', action: 'booked "Flight G-VANC to Zurich"', status: 'positive', timeAgo: '15m ago' },
    { id: 'h_a2', clientName: 'Estate Team', clientAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=VE&backgroundColor=334155', action: 'reported "Pool Heating Issue"', status: 'critical', timeAgo: '2h ago' },
    { id: 'h_a3', clientName: 'Aviation', clientAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Jet', action: 'uploaded "Maintenance Log Q3"', status: 'neutral', timeAgo: '4h ago' },
];

// --- STARTUP PARTNER DATA SET ---
const PARTNER_BOARDS: Board[] = [
    {
      id: 'p_1',
      clientName: 'OmniStream Co-Founders',
      headline: 'Founder Sync',
      subhead: 'Strategic Alignment & Vision',
      type: ClientType.PARTNERSHIP,
      tags: ['Strategy', 'Co-Founder', 'Vision'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1600',
      logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Omni&backgroundColor=14b8a6',
      isOrganization: true,
      lastActive: '5m ago',
      alerts: [
        { id: 'pa1', type: 'critical', title: 'Cash Runway', metric: '6 Mos' },
        { id: 'pa2', type: 'warning', title: 'Burn Rate', metric: '+$5k/mo' },
      ]
    },
    {
      id: 'p_2',
      clientName: 'Series A War Room',
      headline: 'Fundraising',
      subhead: 'Q4 Investor Roadshow',
      type: ClientType.STARTUP,
      tags: ['Finance', 'Pitch Deck', 'VC'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=1600',
      logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=SeriesA',
      isOrganization: true,
      lastActive: '1h ago',
      alerts: [
        { id: 'pa3', type: 'info', title: 'Pitch Deck V4', metric: 'Ready' },
        { id: 'pa4', type: 'success', title: 'Intro Meetings', metric: '5 Scheduled' }
      ]
    },
    {
      id: 'p_3',
      clientName: 'Product Engineering',
      headline: 'v2.0 Roadmap',
      subhead: 'Sprint 24: Core Features',
      type: ClientType.PARTNERSHIP,
      tags: ['Product', 'Engineering', 'Sprint'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1600',
      logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=Product&backgroundColor=6366f1',
      isOrganization: true,
      lastActive: '30m ago',
      alerts: [
        { id: 'pa5', type: 'success', title: 'MAU Growth', metric: '+12%' },
        { id: 'pa6', type: 'critical', title: 'Bug Squash', metric: '8 Open' }
      ]
    },
    {
      id: 'p_4',
      clientName: 'Legal & IP',
      headline: 'Patent Strategy',
      subhead: 'Trademark Filings',
      type: ClientType.STARTUP,
      tags: ['Legal', 'IP', 'Admin'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1600',
      logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Legal&backgroundColor=64748b',
      isOrganization: true,
      lastActive: '1d ago',
      alerts: [
        { id: 'pa7', type: 'info', title: 'Term Sheet', metric: 'Review' }
      ]
    }
];

const PARTNER_TASKS: Task[] = [
    { id: 'pt1', title: 'Review Term Sheet details with Counsel', dueTime: '10:30 AM', category: 'Personal', completed: false },
    { id: 'pt2', title: 'Sync with Sarah (CEO) on Hiring Plan', dueTime: '01:00 PM', category: 'Personal', completed: false },
    { id: 'pt3', title: 'Approve final API Specification for v2', dueTime: '03:00 PM', category: 'Personal', completed: false },
    { id: 'pt4', title: 'Review Pitch Deck Feedback', dueTime: '04:00 PM', category: 'Client Work', completed: false, clientId: 'p_2', clientName: 'Series A', clientAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=SeriesA', boardName: 'Fundraising' },
    { id: 'pt5', title: 'Interview Senior Backend Candidate', dueTime: '05:30 PM', category: 'Client Work', completed: false, clientId: 'p_3', clientName: 'Engineering', clientAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Product&backgroundColor=6366f1', boardName: 'Hiring' },
];

const PARTNER_WINS: Win[] = [
    { id: 'pw1', clientName: 'Engineering', clientAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Product&backgroundColor=6366f1', description: 'Beta v2.0 deployed to staging with 99.9% uptime.', date: 'Today', type: ClientType.PARTNERSHIP },
    { id: 'pw2', clientName: 'Series A', clientAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=SeriesA', description: 'Lead Investor confirmed follow-on meeting.', date: 'Yesterday', type: ClientType.STARTUP },
    { id: 'pw3', clientName: 'Legal', clientAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Legal&backgroundColor=64748b', description: 'Trademark application approved.', date: '2 days ago', type: ClientType.STARTUP },
];

const PARTNER_ACTIVITY: Activity[] = [
    { id: 'pa_a1', clientName: 'Sarah (CEO)', clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahCEO&backgroundColor=f472b6', action: 'commented on "Revenue Projections"', status: 'positive', timeAgo: '5m ago' },
    { id: 'pa_a2', clientName: 'Engineering', clientAvatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Product&backgroundColor=6366f1', action: 'merged PR #402 "Stripe Integration"', status: 'positive', timeAgo: '1h ago' },
    { id: 'pa_a3', clientName: 'Legal', clientAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Legal&backgroundColor=64748b', action: 'uploaded "NDA_Template_v3.docx"', status: 'neutral', timeAgo: '3h ago' },
];


// --- HELPER TO GET DATA BY PERSONA ---
const multiplyData = <T extends { id: string }>(data: T[], count: number): T[] => {
    let result: T[] = [];
    for (let i = 0; i < count; i++) {
        const chunk = data.map(item => ({
            ...item,
            id: `${item.id}_copy_${i}` // Ensure unique IDs
        }));
        result = [...result, ...chunk];
    }
    return result;
};

export const GET_INITIAL_DATA = (personaId: string) => {
    if (personaId === 'hwi') {
        return {
            boards: HWI_BOARDS,
            tasks: multiplyData(HWI_TASKS, 4),
            wins: multiplyData(HWI_WINS, 4),
            activity: multiplyData(HWI_ACTIVITY, 4)
        };
    }
    if (personaId === 'partner') {
        return {
            boards: PARTNER_BOARDS,
            tasks: multiplyData(PARTNER_TASKS, 4),
            wins: multiplyData(PARTNER_WINS, 4),
            activity: multiplyData(PARTNER_ACTIVITY, 4)
        };
    }
    // Default to Coach
    return {
        boards: COACH_BOARDS,
        tasks: multiplyData(COACH_TASKS, 4),
        wins: multiplyData(COACH_WINS, 4),
        activity: multiplyData(COACH_ACTIVITY, 4)
    };
};