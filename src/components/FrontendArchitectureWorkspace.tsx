import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  FolderTree, 
  Route, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Lock, 
  Eye, 
  Sliders, 
  FileCode2, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Check, 
  AlertTriangle, 
  Zap, 
  SlidersHorizontal,
  Folder,
  FileText,
  RefreshCw,
  HelpCircle,
  Accessibility,
  ArrowRight,
  Sparkles,
  BookOpen,
  Info
} from 'lucide-react';

// Feature-First Folder Directory Node Type
interface FileNode {
  name: string;
  type: 'file' | 'folder';
  description: string;
  children?: FileNode[];
}

const folderTreeData: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    description: 'Core application source directory.',
    children: [
      {
        name: 'assets',
        type: 'folder',
        description: 'Universal SVG icons, theme logo tokens, and web banners.',
      },
      {
        name: 'components',
        type: 'folder',
        description: 'Global reusable UI atoms styled with Tailwind and radix primitives.',
        children: [
          { name: 'Button.tsx', type: 'file', description: 'Variant-based button with built-in accessibility focus ring bindings.' },
          { name: 'Input.tsx', type: 'file', description: 'Accessible input wrapper with dynamic ARIA descriptors and validation bounds.' },
          { name: 'DataTable.tsx', type: 'file', description: 'Virtualized responsive grid supporting multi-column sorting and bulk actions.' },
          { name: 'Card.tsx', type: 'file', description: 'Enterprise layout card with subtle hover micro-animations.' }
        ]
      },
      {
        name: 'features',
        type: 'folder',
        description: 'Domain-specific capabilities isolated cleanly to prevent circular dependencies.',
        children: [
          {
            name: 'authentication',
            type: 'folder',
            description: 'JWT validation, redirect triggers, and secure login components.',
            children: [
              { name: 'components/LoginForm.tsx', type: 'file', description: 'Zod-validated login page using React Hook Form.' },
              { name: 'hooks/useAuthMutation.ts', type: 'file', description: 'Supabase authenticating client call mutation.' }
            ]
          },
          {
            name: 'projects',
            type: 'folder',
            description: 'Micro-assignment brief submission, status tracking, and bento details.',
            children: [
              { name: 'components/ProjectCard.tsx', type: 'file', description: 'Standardized layout rendering brief parameters.' },
              { name: 'hooks/useProjectsQuery.ts', type: 'file', description: 'TanStack Query fetching matched tasks lists.' }
            ]
          },
          {
            name: 'performance',
            type: 'folder',
            description: 'Immutable timeline milestones and student competency analytics charts.',
            children: [
              { name: 'components/PerformanceChart.tsx', type: 'file', description: 'Recharts visualizer rendering satisfaction growth lines.' },
              { name: 'hooks/usePerformanceLedger.ts', type: 'file', description: 'Durable immutable series retrieval client hook.' }
            ]
          }
        ]
      },
      {
        name: 'hooks',
        type: 'folder',
        description: 'Global utility helpers (useMediaQuery, useLocalStorage, useKeyPress).',
      },
      {
        name: 'routes',
        type: 'folder',
        description: 'Lazy-loaded route guards separating student and SME dashboards.',
        children: [
          { name: 'ProtectedRoute.tsx', type: 'file', description: 'Guard checking user JWT roles before mounting layout wrappers.' },
          { name: 'AppRoutes.tsx', type: 'file', description: 'Unified React Router hierarchy with Suspense bounds.' }
        ]
      },
      {
        name: 'services',
        type: 'folder',
        description: 'API client wrappers communicating with the Phase 8 REST endpoints.',
        children: [
          { name: 'apiClient.ts', type: 'file', description: 'Axios instance with global interceptors attaching JWT refresh headers.' }
        ]
      },
      {
        name: 'store',
        type: 'folder',
        description: 'Lightweight UI state managers using feature-specific Zustand slices.',
      },
      {
        name: 'types',
        type: 'folder',
        description: 'Strict TypeScript interfaces and enums corresponding to database tables.',
      }
    ]
  },
  {
    name: 'vite.config.ts',
    type: 'file',
    description: 'Bundling configuration enabling code-splitting chunks and routing fallbacks.'
  },
  {
    name: 'package.json',
    type: 'file',
    description: 'Vite, React 18, TanStack Query, and TailwindCSS dependency manifests.'
  }
];

// i18n Translation Dictionary Sample
const translationDictionary: { [lang: string]: { [key: string]: string } } = {
  EN: {
    dashboard_title: 'Global SME Workspace',
    payout_guarantee: 'Immutable Milestone Payout Verified',
    trust_index: 'Dynamic Developer Trust Score',
    skills_required: 'Validated Competency Requirements',
    match_confidence: 'AI Alignment Match Confidence',
    submit_milestone: 'Submit Weekly Deliverables',
    verification_pending: 'Academic Credentials Review Pending'
  },
  KO: {
    dashboard_title: '글로벌 SME 워크스페이스',
    payout_guarantee: '불변 마일스톤 정산 보증 완료',
    trust_index: '실시간 개발자 신뢰성 지수',
    skills_required: '검증된 핵심 직무 역량',
    match_confidence: 'AI 최적 정합 신뢰도',
    submit_milestone: '주간 수행 산출물 제출하기',
    verification_pending: '학적 증명 서류 관리자 검토 대기 중'
  },
  VI: {
    dashboard_title: 'Không gian làm việc SME Toàn cầu',
    payout_guarantee: 'Xác minh Thanh toán Cột mốc Bất biến',
    trust_index: 'Chỉ số Tin cậy Nhà phát triển',
    skills_required: 'Yêu cầu Năng lực đã Xác minh',
    match_confidence: 'Độ tin cậy Liên kết AI',
    submit_milestone: 'Nộp Sản phẩm báo cáo Hàng tuần',
    verification_pending: 'Đang chờ Kiểm duyệt Học vấn'
  },
  JA: {
    dashboard_title: 'グローバルSMEワークスペース',
    payout_guarantee: '不変マイルストーン支払い保証完了',
    trust_index: '開発者信頼性リアルタイムスコア',
    skills_required: '検証済みのコア職務スキル',
    match_confidence: 'AI適合マッチング信頼度',
    submit_milestone: '週次成果物の提出',
    verification_pending: '学歴証明書の管理者確認待ち'
  },
  DE: {
    dashboard_title: 'Globaler KMU-Arbeitsbereich',
    payout_guarantee: 'Unveränderliche Meilensteinauszahlung verifiziert',
    trust_index: 'Dynamischer Vertrauensindex des Entwicklers',
    skills_required: 'Validierte Kompetenzanforderungen',
    match_confidence: 'KI-Übereinstimmungsvertrauen',
    submit_milestone: 'Wöchentliche Ergebnisse einreichen',
    verification_pending: 'Überprüfung der akademischen Qualifikation ausstehend'
  }
};

export default function FrontendArchitectureWorkspace() {
  const [activeSpecTab, setActiveSpecTab] = useState<'folder_structure' | 'routing_guards' | 'state_architecture' | 'responsive_a11y' | 'internationalization'>('folder_structure');
  
  // Browsable Directory State
  const [expandedNodes, setExpandedNodes] = useState<{ [path: string]: boolean }>({ 'src': true });
  const [selectedFileDesc, setSelectedFileDesc] = useState<string>('Select any file or folder from the directory tree to inspect its enterprise purpose.');

  // Route Guard Simulator State
  const [simRole, setSimRole] = useState<'STUDENT' | 'COMPANY' | 'ADMIN' | 'ANONYMOUS'>('STUDENT');
  const [simRoute, setSimRoute] = useState<string>('/student/dashboard');

  // Viewport/Responsiveness state
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // i18n state
  const [selectedLang, setSelectedLang] = useState<string>('EN');

  const toggleNode = (name: string) => {
    setExpandedNodes(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const selectNode = (node: FileNode) => {
    setSelectedFileDesc(`[${node.type.toUpperCase()}] ${node.name}: ${node.description}`);
  };

  // Directory Renderer helper
  const renderDirNode = (node: FileNode, depth = 0) => {
    const isFolder = node.type === 'folder';
    const isExpanded = expandedNodes[node.name];
    
    return (
      <div key={node.name} style={{ paddingLeft: `${depth * 12}px` }} className="space-y-1">
        <button
          onClick={() => {
            if (isFolder) toggleNode(node.name);
            selectNode(node);
          }}
          className="w-full text-left py-1 px-2 rounded-lg hover:bg-neutral-900/60 flex items-center gap-2 text-xs font-mono transition-all cursor-pointer group"
        >
          {isFolder ? (
            <Folder className={`w-3.5 h-3.5 ${isExpanded ? 'text-blue-400' : 'text-neutral-500'}`} />
          ) : (
            <FileText className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-400" />
          )}
          <span className={isFolder ? 'text-neutral-200 font-bold' : 'text-neutral-400'}>
            {node.name}
          </span>
        </button>
        {isFolder && isExpanded && node.children && (
          <div className="border-l border-neutral-900 ml-3.5 space-y-1">
            {node.children.map(child => renderDirNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Evaluate Routing Guards Simulator
  const evaluateRouteGuard = () => {
    if (simRoute === '/login' || simRoute === '/register') {
      if (simRole !== 'ANONYMOUS') {
        return {
          allowed: false,
          status: 'REDIRECT',
          destination: simRole === 'STUDENT' ? '/student/dashboard' : '/company/dashboard',
          details: 'User is already authenticated. The Route Guard automatically skips credentials forms.'
        };
      }
      return {
        allowed: true,
        status: 'MOUNT_PAGE',
        details: 'Public endpoint accessible to unauthenticated guests.'
      };
    }

    if (simRoute.startsWith('/student')) {
      if (simRole === 'STUDENT') {
        return {
          allowed: true,
          status: 'MOUNT_PAGE',
          details: 'Successfully mounted with <Suspense> and skeleton loading fallbacks.'
        };
      }
      return {
        allowed: false,
        status: 'BLOCK',
        destination: '/login',
        details: `Access denied. Route requires [STUDENT] claim, but user has [${simRole}]. Triggering login redirect.`
      };
    }

    if (simRoute.startsWith('/company')) {
      if (simRole === 'COMPANY') {
        return {
          allowed: true,
          status: 'MOUNT_PAGE',
          details: 'Mounted SME coordinator dashboard panel.'
        };
      }
      return {
        allowed: false,
        status: 'BLOCK',
        destination: '/login',
        details: `Access denied. Route requires [COMPANY] claim, but user has [${simRole}].`
      };
    }

    if (simRoute.startsWith('/admin')) {
      if (simRole === 'ADMIN') {
        return {
          allowed: true,
          status: 'MOUNT_PAGE',
          details: 'Mounted platform compliance dashboard workspace.'
        };
      }
      return {
        allowed: false,
        status: 'BLOCK',
        destination: '/403',
        details: 'Critical: Non-admin users are blocked from compliance auditing views.'
      };
    }

    return { allowed: true, status: 'MOUNT_PAGE', details: 'General routing access enabled.' };
  };

  const guardResult = evaluateRouteGuard();

  return (
    <div className="space-y-6" id="frontend-architecture-workspace">
      
      {/* Frontend Design Hero Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-950/20 via-neutral-900 to-neutral-950 border border-blue-900/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs uppercase tracking-wider font-mono">
            <Layers className="w-4 h-4 text-blue-400" /> Phase 9 Reusable Module Specs
          </div>
          <h2 className="text-xl md:text-2xl font-black text-neutral-100 tracking-tight">Enterprise Client Architecture</h2>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            Architectural specification of the client-side single-page application. Built with feature-first folder structures, strict TypeScript interfaces, lazy-loaded role routing, separated local and server state models, WCAG AA compliance checkers, and localization tokens.
          </p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-neutral-900/60 border border-neutral-850 rounded-2xl">
        {[
          { tabId: 'folder_structure', label: 'Feature-First Folders', icon: FolderTree },
          { tabId: 'routing_guards', label: 'Route Guard Simulator', icon: Route },
          { tabId: 'state_architecture', label: 'State & Cache Matrix', icon: Cpu },
          { tabId: 'responsive_a11y', label: 'A11y & Viewports', icon: Accessibility },
          { tabId: 'internationalization', label: 'i18n Translation Matrix', icon: Globe }
        ].map(tab => {
          const IconComp = tab.icon;
          const isSelected = activeSpecTab === tab.tabId;
          return (
            <button
              key={tab.tabId}
              id={`fe-tab-btn-${tab.tabId}`}
              onClick={() => setActiveSpecTab(tab.tabId as any)}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-neutral-950 text-blue-400 border border-neutral-800 shadow-lg font-black' 
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-neutral-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* WORKSPACE MAIN BODY */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: FEATURE-FIRST DIRECTORY */}
        {activeSpecTab === 'folder_structure' && (
          <motion.div
            key="folder_structure"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Directory Browser (Width: 5) */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-neutral-900/30 border border-neutral-900 space-y-4">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">Interactive Folder Tree</h3>
                  <p className="text-[10px] text-neutral-500">Explore feature-first isolation boundaries designed for high modularity</p>
                </div>

                <div className="p-4 bg-neutral-950 border border-neutral-900 rounded-2xl max-h-[420px] overflow-y-auto space-y-1">
                  {folderTreeData.map(node => renderDirNode(node))}
                </div>
              </div>

              {/* Node Metadata & Clean Architecture Specs (Width: 7) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
                
                {/* Chosen File Metadata */}
                <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-mono font-bold uppercase text-neutral-400">Selected Node Specification</span>
                  </div>

                  <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-2xl">
                    <p className="text-xs font-mono text-neutral-300 leading-relaxed">
                      {selectedFileDesc}
                    </p>
                  </div>
                </div>

                {/* Business Decoupling Rules */}
                <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black block">Front-end Decoupling & Business Rules</span>
                  
                  <div className="space-y-3">
                    {[
                      { title: 'Zero Business Logic in Views', desc: 'React components act solely as visual maps of state. Complex calculations or evaluation triggers are isolated inside back-end REST APIs to keep bundle sizes thin.' },
                      { title: 'Feature-First Independence', desc: 'Features (like auth, projects, performance) do not import modules from other features. Common components must reside strictly inside the global /components shared bucket.' },
                      { title: 'Schema Type Correlation', desc: 'TS types (in types/) map directly to Phase 7 database column names to guarantee type safety across API integrations.' }
                    ].map((rule, idx) => (
                      <div key={idx} className="p-3 bg-neutral-950 rounded-xl border border-neutral-900 flex gap-3">
                        <div className="w-5 h-5 rounded-lg bg-blue-950/40 border border-blue-900/20 flex items-center justify-center font-mono text-[9px] font-bold text-blue-400">
                          {idx + 1}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-black text-neutral-200">{rule.title}</h4>
                          <p className="text-[10px] text-neutral-500 leading-normal">{rule.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: ROUTING & GUARD SIMULATOR */}
        {activeSpecTab === 'routing_guards' && (
          <motion.div
            key="routing_guards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Guard Configurations */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-neutral-900/30 border border-neutral-900 space-y-4">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">Route Security Controls</h3>
                  <p className="text-[10px] text-neutral-500">Configure simulated user role credentials to test secure route guard routing transitions</p>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-neutral-400 font-bold uppercase">Simulated User Role</label>
                    <select
                      value={simRole}
                      onChange={(e) => setSimRole(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-850 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-neutral-200 outline-none transition-all cursor-pointer"
                    >
                      <option value="ANONYMOUS">Anonymous Guest (No Session)</option>
                      <option value="STUDENT">Student (RMIT Verified)</option>
                      <option value="COMPANY">Company SME Representative</option>
                      <option value="ADMIN">Platform Compliance Auditor</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-neutral-400 font-bold uppercase">Requested URL Path</label>
                    <select
                      value={simRoute}
                      onChange={(e) => setSimRoute(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-850 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-neutral-200 outline-none transition-all cursor-pointer"
                    >
                      <option value="/login">/login (Public access)</option>
                      <option value="/student/dashboard">/student/dashboard (Student Private)</option>
                      <option value="/company/dashboard">/company/dashboard (SME Private)</option>
                      <option value="/admin/verification">/admin/verification (Admin Privilege)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Guard Diagnostics (Width: 7) */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 flex flex-col justify-between">
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">Guard Router Output</h3>
                      <p className="text-[10px] text-neutral-500">Decisions triggered automatically before mounting components</p>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded-full font-bold">
                      Strict JWT Guarding
                    </span>
                  </div>

                  {/* Visual Guard Response Panel */}
                  <div className={`p-6 rounded-2xl border flex items-start gap-4 ${
                    guardResult.allowed 
                      ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' 
                      : 'bg-red-950/20 border-red-900/30 text-red-400'
                  }`}>
                    {guardResult.allowed ? (
                      <ShieldCheck className="w-10 h-10 animate-pulse flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-10 h-10 animate-bounce flex-shrink-0" />
                    )}
                    <div className="space-y-1">
                      <h4 className="text-sm font-black uppercase tracking-wider">
                        {guardResult.allowed ? 'ROUTE ACCESS GRANTED' : 'ACCESS DENIED (REDIRECT TRIGGERED)'}
                      </h4>
                      <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                        {guardResult.details}
                      </p>
                      {guardResult.destination && (
                        <div className="flex items-center gap-1.5 pt-1 text-[11px] font-mono font-bold text-neutral-400">
                          <span>Redirect target:</span>
                          <span className="text-blue-400 bg-blue-950/40 border border-blue-900/20 px-1.5 py-0.5 rounded">
                            {guardResult.destination}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Suspense Router Guard Code template */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black block">ProtectedRoute Guard Declarative Logic</span>
                    <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-900 font-mono text-xs text-neutral-300 overflow-x-auto">
                      <p className="text-neutral-500">// React Router v6 Guard Wrap</p>
                      <p className="text-purple-400">
                        export function <span className="text-blue-400">ProtectedRoute</span>({`{ children, requiredRole }`}) {`{`}
                      </p>
                      <p className="pl-4 text-emerald-400">
                        const {`{ isAuthenticated, user }`} = useAuthSession();
                      </p>
                      <p className="pl-4 text-purple-400">
                        if (!isAuthenticated) return {`<Navigate to="/login" replace />`};
                      </p>
                      <p className="pl-4 text-purple-400">
                        if (requiredRole && user.role !== requiredRole) return {`<Navigate to="/403" replace />`};
                      </p>
                      <p className="pl-4 text-amber-400">
                        return {`<Suspense fallback={<SkeletonLoader />}>{children}</Suspense>`};
                      </p>
                      <p className="text-neutral-200">{`}`}</p>
                    </div>
                  </div>
                </div>

                <div className="text-[9px] font-mono text-neutral-500 border-t border-neutral-900 pt-3.5 mt-4">
                  Route lazy-loading guarantees that unaccessed modules (like Admin panels) are never downloaded by student browsers, dramatically cutting cold start metrics.
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 3: STATE ARCHITECTURE */}
        {activeSpecTab === 'state_architecture' && (
          <motion.div
            key="state_architecture"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Server Cache vs Local State Separation matrix */}
            <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">Client-Side State Separation Matrix</h3>
                <p className="text-[10px] text-neutral-500">KONEXA separates volatile client-only states from durable cached API server records to eliminate redundancy</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Server State Cache */}
                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-900 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black">Server State Cache (TanStack Query)</span>
                    <span className="text-[8px] font-mono text-blue-400 bg-blue-950/20 border border-blue-900/10 px-1.5 py-0.5 rounded font-black">ASYNC</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: 'useProjectsQuery', model: 'Projects lists / search filters', TTL: 'Stale: 1 min, Cache: 5 mins' },
                      { key: 'useStudentProfile', model: 'Academic certificates / portfolio links', TTL: 'Stale: 5 mins, Cache: 10 mins' },
                      { key: 'useMatchExplanation', model: 'AI alignment confidence indexes', TTL: 'Stale: Immediate (Refetch on click)' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-neutral-900 rounded-xl border border-neutral-850 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-mono font-bold text-neutral-200 block">{item.key}</span>
                          <span className="text-[10px] text-neutral-500 block">{item.model}</span>
                        </div>
                        <span className="text-[9px] font-mono text-neutral-400">{item.TTL}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-neutral-500 italic">
                    All network payloads are cached contextually. Automatic refetch guarantees up-to-date deadline schedules.
                  </p>
                </div>

                {/* Local UI State */}
                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-900 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black">Local UI State (Zustand & Context)</span>
                    <span className="text-[8px] font-mono text-purple-400 bg-purple-950/20 border border-purple-900/10 px-1.5 py-0.5 rounded font-black">VOLATILE</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { slice: 'useNotificationPreferences', details: 'Sound triggers, desktop toast alerts, email toggles' },
                      { slice: 'useMultiStepFormProgress', details: 'Keeps intermediate draft files safely stored if browser disconnects' },
                      { slice: 'useThemeState', details: 'Light mode, future dark-mode tokens context' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-neutral-900 rounded-xl border border-neutral-850">
                        <span className="text-xs font-mono font-bold text-neutral-200 block">{item.slice}</span>
                        <span className="text-[10px] text-neutral-500 block">{item.details}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-neutral-500 italic">
                    Local states remain decoupled from APIs, maximizing layout speeds and minimizing redundant network traffic.
                  </p>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: RESPONSIVE & WCAG ACCESSIBILITY */}
        {activeSpecTab === 'responsive_a11y' && (
          <motion.div
            key="responsive_a11y"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Responsive Layout controls */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-neutral-900/30 border border-neutral-900 space-y-4">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">Viewport & Accessibility Sandbox</h3>
                  <p className="text-[10px] text-neutral-500">Verify responsive grid density scaling and WCAG AA guidelines</p>
                </div>

                <div className="space-y-4">
                  {/* Viewport toggles */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-neutral-400 font-bold uppercase block">Simulate Viewport Scale</span>
                    <div className="grid grid-cols-3 gap-1 p-0.5 bg-neutral-950 border border-neutral-850 rounded-xl">
                      {[
                        { id: 'desktop', label: 'Desktop', icon: Monitor },
                        { id: 'tablet', label: 'Tablet (MD)', icon: Tablet },
                        { id: 'mobile', label: 'Mobile (SM)', icon: Smartphone }
                      ].map(v => {
                        const Icon = v.icon;
                        const isSelected = viewportMode === v.id;
                        return (
                          <button
                            key={v.id}
                            onClick={() => setViewportMode(v.id as any)}
                            className={`py-2 text-[10px] font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5 ${
                              isSelected ? 'bg-neutral-900 text-blue-400' : 'text-neutral-500'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" /> {v.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Accessibility metrics checklists */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black block">WCAG AA Compliance Parameters</span>
                    <div className="space-y-2">
                      {[
                        { title: 'Contrast Ratio', status: 'Passed (4.5:1 min for body text)', details: 'Soft off-whites matched against midnight charcoal backgrounds.' },
                        { title: 'Touch Targets', status: 'Min 44px x 44px', details: 'All actionable buttons pad out safely for easy mobile thumbs.' },
                        { title: 'ARIA Screen Reader', status: 'aria-live="polite" bounds', details: 'Alert toasts announce immediately to visual screen readers.' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-neutral-950 rounded-xl border border-neutral-900 space-y-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-neutral-300 font-bold">{item.title}</span>
                            <span className="text-emerald-400 text-[10px] font-bold">{item.status}</span>
                          </div>
                          <p className="text-[10px] text-neutral-500">{item.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Viewport preview emulator */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">Adaptive Component Preview</h3>
                      <p className="text-[10px] text-neutral-500">Component density mapping dynamically based on simulated device pixels</p>
                    </div>
                    <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900/30 px-2 py-0.5 rounded-full font-bold uppercase">
                      Media query: {viewportMode === 'desktop' ? 'lg: (1024px+)' : viewportMode === 'tablet' ? 'md: (768px-1023px)' : 'sm: (<767px)'}
                    </span>
                  </div>

                  {/* Visual responsive mockup box */}
                  <div className="p-6 bg-neutral-950 rounded-2xl border border-neutral-900 flex justify-center items-center py-12 transition-all">
                    
                    {/* Simulated Card Container */}
                    <div 
                      className={`p-5 bg-neutral-900 rounded-xl border border-neutral-850 space-y-3 shadow-lg transition-all ${
                        viewportMode === 'desktop' ? 'w-[400px]' : viewportMode === 'tablet' ? 'w-[300px]' : 'w-full max-w-[240px]'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-neutral-500">RMIT SOFTWARE MAJOR</span>
                          <h4 className="text-xs font-bold text-neutral-200">Nguyen Minh Anh</h4>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/20 px-2 py-0.5 rounded-full">
                          Score: 98
                        </span>
                      </div>

                      {/* Display skills list differently based on screen space */}
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono text-neutral-500 block uppercase">Validated developer competencies</span>
                        <div className={`flex ${viewportMode === 'mobile' ? 'flex-col gap-1' : 'flex-wrap gap-1.5'}`}>
                          {['React', 'TypeScript', 'Node.js'].map(s => (
                            <span key={s} className="px-1.5 py-0.5 bg-neutral-950 rounded border border-neutral-800 font-mono text-[9px] text-neutral-400">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-850 flex items-center justify-between">
                        <span className="text-[9px] font-mono text-neutral-400">Verified identity</span>
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="text-[9px] font-mono text-neutral-500 border-t border-neutral-900 pt-3.5 mt-4">
                  Touch-ready bounds and keyboard navigation (tabIndex, focus-visible) are natively wired into atoms to fulfill enterprise WCAG AA validation checklists.
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 5: INTERNATIONALIZATION MATRIX */}
        {activeSpecTab === 'internationalization' && (
          <motion.div
            key="internationalization"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Interactive i18n Dictionary mapping */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Language Selector */}
              <div className="lg:col-span-4 p-6 rounded-3xl bg-neutral-900/30 border border-neutral-900 space-y-4">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">Language Matrix Selector</h3>
                  <p className="text-[10px] text-neutral-500">Choose a locale to fetch matched translated frontend assets</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { code: 'EN', label: 'English (US / GB)', origin: 'Primary Locale' },
                    { code: 'KO', label: 'Korean (South Korea)', origin: 'Gyeongbuk Localized' },
                    { code: 'VI', label: 'Vietnamese (Vietnam)', origin: 'RMIT Campus Localized' },
                    { code: 'JA', label: 'Japanese (Japan)', origin: 'SME Global Expansion' },
                    { code: 'DE', label: 'German (Germany)', origin: 'EU Regulatory Compliant' }
                  ].map(l => (
                    <button
                      key={l.code}
                      onClick={() => setSelectedLang(l.code)}
                      className={`p-3 text-left rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        selectedLang === l.code 
                          ? 'bg-neutral-950 border-blue-500/20 text-neutral-100 shadow-lg' 
                          : 'bg-neutral-950/20 border-neutral-950/40 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-black">{l.label}</span>
                        <span className="text-[9px] text-neutral-500 block">{l.origin}</span>
                      </div>
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-950/20 border border-blue-900/10 px-2 py-0.5 rounded font-bold">
                        {l.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Translation Key Ledger preview */}
              <div className="lg:col-span-8 p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">Translated Dictionary Ledger</h3>
                      <p className="text-[10px] text-neutral-500">Translating interface string token codes dynamically with zero hardcoded literals</p>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded-full font-bold">
                      Format: JSON Key-Value
                    </span>
                  </div>

                  {/* Rendering translated dictionary values */}
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {Object.entries(translationDictionary[selectedLang]).map(([key, value]) => (
                      <div key={key} className="p-3 bg-neutral-950 rounded-xl border border-neutral-900 flex justify-between items-center gap-4">
                        <div className="space-y-0.5 font-mono text-xs">
                          <span className="text-neutral-500 block">{key}</span>
                          <span className="text-neutral-200 font-bold block">{value}</span>
                        </div>
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black shrink-0">
                          {selectedLang} Token
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-neutral-950 border border-neutral-900 rounded-xl mt-4">
                  <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <p className="text-[10px] text-neutral-400 leading-relaxed font-mono">
                    All interface copy triggers must query translated dictionaries dynamically. Key fallbacks guarantee robust string rendering.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
