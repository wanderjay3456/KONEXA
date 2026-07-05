import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Layers, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight, 
  Check, 
  Info, 
  Accessibility, 
  Laptop, 
  Smartphone, 
  Sliders, 
  Activity, 
  BookOpen, 
  FileBadge, 
  Search,
  MessageSquare,
  ShieldCheck,
  MousePointerClick,
  Globe,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Award,
  Bell,
  Mail,
  Lock
} from 'lucide-react';

// Centralized CDS Translation Dictionary
const localizedCDS = {
  en: {
    submitApplication: 'Submit Application',
    saveProfile: 'Save Profile',
    continueVerification: 'Continue to Verification',
    confirmProject: 'Confirm Project',
    browseProjects: 'Browse Projects',
    preparingDashboard: 'Preparing your dashboard...',
    findingProjects: 'Finding suitable projects...',
    analyzingProfile: 'Analyzing your profile...',
    verifyingInfo: 'Verifying your information...',
    trustScoreTooltip: 'Your trust history grows through successful project participation and employer feedback.',
    performanceHistoryTooltip: 'This section contains objective, verified records from your completed projects.'
  },
  ko: {
    submitApplication: '지원서 제출',
    saveProfile: '프로필 저장',
    continueVerification: '인증 계속하기',
    confirmProject: '프로젝트 확정',
    browseProjects: '프로젝트 탐색',
    preparingDashboard: '대시보드를 준비하는 중입니다...',
    findingProjects: '적합한 프로젝트 매칭 중...',
    analyzingProfile: '프로필 분석 진행 중...',
    verifyingInfo: '학적 정보를 확인하는 중입니다...',
    trustScoreTooltip: '프로젝트의 성공적인 참여 및 고용주 피드백을 통해 신뢰 점수가 누적됩니다.',
    performanceHistoryTooltip: '완료한 프로젝트에서 얻은 객관적인 공식 수행 이력 기록이 보관됩니다.'
  },
  vi: {
    submitApplication: 'Nộp Hồ Sơ',
    saveProfile: 'Lưu Hồ Sơ',
    continueVerification: 'Tiếp Tục Xác Minh',
    confirmProject: 'Xác Nhận Dự Án',
    browseProjects: 'Tìm Kiếm Dự Án',
    preparingDashboard: 'Đang chuẩn bị bảng điều khiển...',
    findingProjects: 'Đang tìm kiếm dự án phù hợp...',
    analyzingProfile: 'Đang phân tích hồ sơ của bạn...',
    verifyingInfo: 'Đang xác minh thông tin của bạn...',
    trustScoreTooltip: 'Điểm số tin cậy của bạn tích lũy qua việc hoàn thành dự án và đánh giá của doanh nghiệp.',
    performanceHistoryTooltip: 'Phần này chứa hồ sơ khách quan, đã được xác minh từ các dự án đã hoàn thành.'
  },
  ja: {
    submitApplication: '応募書類を提出する',
    saveProfile: 'プロフィールを保存する',
    continueVerification: '本人確認に進む',
    confirmProject: 'プロジェクトを確定する',
    browseProjects: 'プロジェクトを探す',
    preparingDashboard: 'ダッシュボードを準備中...',
    findingProjects: '最適なプロジェクトを検索中...',
    analyzingProfile: 'プロフィールを分析中...',
    verifyingInfo: '認証情報を確認中...',
    trustScoreTooltip: 'プロジェクトへの参加成功と雇用主からのフィードバックにより、信頼スコアが蓄積されます。',
    performanceHistoryTooltip: '完了したプロジェクトの客観的で検証済みのパフォーマンス履歴が記録されています。'
  },
  de: {
    submitApplication: 'Bewerbung einreichen',
    saveProfile: 'Profil speichern',
    continueVerification: 'Weiter zur Verifizierung',
    confirmProject: 'Projekt bestätigen',
    browseProjects: 'Projekte durchsuchen',
    preparingDashboard: 'Ihr Dashboard wird vorbereitet...',
    findingProjects: 'Passende Projekte werden gesucht...',
    analyzingProfile: 'Ihr Profil wird analysiert...',
    verifyingInfo: 'Ihre Informationen werden verifiziert...',
    trustScoreTooltip: 'Ihre Vertrauenshistorie wächst durch erfolgreiche Projektteilnahme und Arbeitgeber-Feedback.',
    performanceHistoryTooltip: 'Dieser Bereich enthält objektive, verifizierte Aufzeichnungen Ihrer abgeschlossenen Projekte.'
  }
};

type LanguageKey = 'en' | 'ko' | 'vi' | 'ja' | 'de';

export default function UXDesignSystem() {
  const [activeTab, setActiveTab] = useState<'principles' | 'colors_typography' | 'components' | 'cds_engine' | 'flows'>('principles');
  
  // Language for localized copy testing
  const [selectedLang, setSelectedLang] = useState<LanguageKey>('en');

  // Interactive Onboarding Steps
  const [studentStep, setStudentStep] = useState(1);
  const [companyStep, setCompanyStep] = useState(1);
  
  // Interactive Validation Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formTouched, setFormTouched] = useState<{ [key: string]: boolean }>({});
  const [formAutoSaveStatus, setFormAutoSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Auto-save logic
  useEffect(() => {
    if (formName || formEmail || formPassword) {
      setFormAutoSaveStatus('saving');
      const timer = setTimeout(() => {
        setFormAutoSaveStatus('saved');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formName, formEmail, formPassword]);

  // CDS Form Inline Validation Errors
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordHasUpper = /[A-Z]/.test(formPassword);
  const passwordHasLower = /[a-z]/.test(formPassword);
  const passwordHasNumber = /[0-9]/.test(formPassword);
  
  const formErrors = {
    name: formName.trim().length < 3 ? 'Full Name must be at least 3 characters' : '',
    email: !emailRegex.test(formEmail) ? 'Please enter a valid academic/corporate email (e.g. @rmit.edu.vn)' : '',
    password: formPassword.length < 8 || !passwordHasUpper || !passwordHasLower || !passwordHasNumber
      ? 'Password must contain at least 8 characters, one uppercase, one lowercase letter, and one number.' 
      : ''
  };

  // Interactive Table States
  const [tableSearch, setTableSearch] = useState('');
  const [tableSort, setTableSort] = useState<'name' | 'trust'>('name');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING'>('ALL');

  const initialCandidates = [
    { id: '1', name: 'Nguyen Minh Anh', program: 'Software Engineering', trust: 98, status: 'VERIFIED', rating: 4.9 },
    { id: '2', name: 'Tran Hoang Nam', program: 'Data Science', trust: 95, status: 'VERIFIED', rating: 4.8 },
    { id: '3', name: 'Kim Ji-woo', program: 'UX/UI Design', trust: 85, status: 'PENDING', rating: 4.2 },
    { id: '4', name: 'Lee Min-ho', program: 'Cloud Security', trust: 92, status: 'VERIFIED', rating: 4.7 }
  ];

  // Interactive Messaging Sandbox
  const [activeMessageDemo, setActiveMessageDemo] = useState<'success_submit' | 'error_resume' | 'achievement_first'>('success_submit');
  const [loadingReassuranceText, setLoadingReassuranceText] = useState<'preparing' | 'finding' | 'analyzing' | 'verifying'>('preparing');
  const [isLoadingActive, setIsLoadingActive] = useState(false);

  const triggerLoadingSimulation = () => {
    setIsLoadingActive(true);
    setTimeout(() => {
      setIsLoadingActive(false);
    }, 2000);
  };

  return (
    <div className="space-y-6" id="konexa-dls-workspace">
      {/* Design System Enterprise Hero Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-950/20 via-neutral-900 to-neutral-950 border border-blue-900/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs uppercase tracking-wider font-mono">
            <Sparkles className="w-4 h-4 text-blue-400" /> Phase 6 & 6.5 unified workspace
          </div>
          <h2 className="text-xl md:text-2xl font-black text-neutral-100 tracking-tight">Enterprise Design & Content Language System</h2>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            The authoritative visual identity and tone framework. Ensuring every page, feedback, button copy, and status indicator sounds like one world-class SaaS platform combining <strong>Apple</strong>, <strong>Stripe</strong>, <strong>Linear</strong>, <strong>Notion</strong>, and <strong>Airbnb</strong> traits.
          </p>
        </div>
      </div>

      {/* Main DLS Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-neutral-900/60 border border-neutral-850 rounded-2xl">
        {[
          { tabId: 'principles', label: 'DLS Philosophy & Voice', icon: BookOpen },
          { tabId: 'colors_typography', label: 'Colors, Typography & Grids', icon: Layers },
          { tabId: 'components', label: 'Component & Interaction Playground', icon: MousePointerClick },
          { tabId: 'cds_engine', label: 'CDS Copy & Localization Engine', icon: Globe },
          { tabId: 'flows', label: 'Trust-Driven Onboarding', icon: Sliders }
        ].map(tab => {
          const IconComp = tab.icon;
          const isSelected = activeTab === tab.tabId;
          return (
            <button
              key={tab.tabId}
              id={`tab-btn-${tab.tabId}`}
              onClick={() => setActiveTab(tab.tabId as any)}
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

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: DLS PHILOSOPHY & VOICE */}
        {activeTab === 'principles' && (
          <motion.div
            key="principles"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Core Philosophy Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-neutral-900/30 border border-neutral-900 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-950/40 border border-blue-900/40 flex items-center justify-center text-blue-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-neutral-100">Absolute Trustworthiness</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  People do not trust software, they trust clear human communication. Every element prioritizes transparency, manual audits, verification badges, and secure data trails.
                </p>
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">Inspired by Airbnb</div>
              </div>

              <div className="p-6 rounded-3xl bg-neutral-900/30 border border-neutral-900 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-950/40 border border-emerald-900/40 flex items-center justify-center text-emerald-400">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-neutral-100">Reduced Cognitive Load</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Never display unnecessary metrics or simulated logs. Each page pursues exactly one primary CTA. Form flows auto-save instantly to avoid user input loss.
                </p>
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">Inspired by Linear & Stripe</div>
              </div>

              <div className="p-6 rounded-3xl bg-neutral-900/30 border border-neutral-900 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-950/40 border border-purple-900/40 flex items-center justify-center text-purple-400">
                  <Accessibility className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-neutral-100">Universal Calm Polish</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Symmetrical displays, ample negative spaces, muted neutral palettes, and elegant typography. Our software is designed to protect eyes during nighttime developer sprints.
                </p>
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">Inspired by Vercel & Apple</div>
              </div>
            </div>

            {/* CDS Voice & Persona Matrix */}
            <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider">Tone & Persona Guidelines</h3>
                <p className="text-[10px] text-neutral-500">How the platform sounds to different actors across the global HR landscape</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    role: 'Students',
                    tone: 'Encouraging • Educational • Professional',
                    rule: 'Celebrate meaningful milestone progress. Offer exact context on how verification or outstanding submissions grow their permanent validation profile.',
                    example: '"Your completed project has been securely recorded to your permanent history. Corporate partners can now review verified outputs."'
                  },
                  {
                    role: 'Companies',
                    tone: 'Confident • Business-oriented • Reliable',
                    rule: 'Focus on candidate quality, risk reduction, and structured project milestones. Use corporate-friendly, clear terminology without marketing exaggeration.',
                    example: '"Review student milestone submissions. Verify progress and record week-by-week evaluations based on objective deliverables."'
                  },
                  {
                    role: 'Administrators',
                    tone: 'Direct • Efficient • Action-oriented',
                    rule: 'High informational density, fast review indicators, clear dispute resolution channels, and prompt alerts for project delays.',
                    example: '"Student credentials require manual academic review. Cross-examine passport entries before granting RMIT verification badge."'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 bg-neutral-950 rounded-2xl border border-neutral-900 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-neutral-100">{item.role}</span>
                      <span className="text-[9px] font-mono text-blue-400 bg-blue-950/40 border border-blue-900/40 px-2 py-0.5 rounded-full font-bold">{item.tone}</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">{item.rule}</p>
                    <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-850">
                      <p className="text-[10px] font-mono text-neutral-300 italic">{item.example}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: COLORS, TYPOGRAPHY & GRIDS */}
        {activeTab === 'colors_typography' && (
          <motion.div
            key="colors_typography"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Color Swatch Tokens */}
            <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider">Unified DLS Color Palette</h3>
                <p className="text-[10px] text-neutral-500">Muted, sophisticated colors engineered to prevent visual overload.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {[
                  { name: 'Primary Blue', hex: '#3b82f6', use: 'Trust, CTA, brand focus', bg: 'bg-blue-500 text-black' },
                  { name: 'Soft Background', hex: '#0a0a0a', use: 'Matte dark slate backdrop', bg: 'bg-neutral-950 border border-neutral-900 text-white' },
                  { name: 'Card Slate', hex: '#171717', use: 'Interactive surfaces', bg: 'bg-neutral-900 border border-neutral-800 text-white' },
                  { name: 'Success Green', hex: '#10b981', use: 'Verified states, success CTA', bg: 'bg-emerald-500 text-black font-bold' },
                  { name: 'Warning Orange', hex: '#f97316', use: 'Disputes, missed deadlines', bg: 'bg-orange-500 text-black font-bold' },
                  { name: 'Danger Red', hex: '#ef4444', use: 'Rejections, security warnings', bg: 'bg-red-500 text-white font-bold' }
                ].map((color, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className={`h-16 rounded-2xl ${color.bg} flex items-end p-3`}>
                      <span className="font-mono text-[9px] font-bold uppercase">{color.hex}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-200">{color.name}</h4>
                      <p className="text-[10px] text-neutral-500 leading-snug">{color.use}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography Grid Hierarchy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider">Display Typography (Space Grotesk)</h3>
                  <p className="text-[10px] text-neutral-500">Applied strictly to top-level displays and hero statements</p>
                </div>
                <div className="p-5 bg-neutral-950 rounded-2xl border border-neutral-900 space-y-3">
                  <div className="text-3xl font-black text-neutral-100 tracking-tight">Expand Your Boundaries</div>
                  <div className="text-xl font-bold text-neutral-300 tracking-tight">Verified Academic Matches. Zero Risk.</div>
                  <div className="text-xs text-neutral-500 font-mono">Font: Space Grotesk • Weight: 800/900 • Spacing: -0.05em</div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider">Informational Clarity (Inter & Mono)</h3>
                  <p className="text-[10px] text-neutral-500">Inter for readable human sentences; JetBrains Mono for metrics and scheduling</p>
                </div>
                <div className="p-5 bg-neutral-950 rounded-2xl border border-neutral-900 space-y-3 font-mono">
                  <div className="text-xs text-neutral-400 font-sans leading-relaxed">
                    "Students complete 4-week micro-assignments to demonstrate actual capability before a permanent hiring decision is evaluated."
                  </div>
                  <div className="text-emerald-400 text-xs font-bold uppercase">
                    MATCH_ACCURACY: 98.4% [OBJECTIVE_LEDGER]
                  </div>
                  <div className="text-xs text-neutral-500 font-sans">Font: Inter (Sans) & JetBrains Mono (Mono)</div>
                </div>
              </div>

            </div>

            {/* Unified Layout Grid Visualizer */}
            <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-3">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">12-Column Responsive Desktop Grid (Live Blueprint)</h3>
                <p className="text-[10px] text-neutral-500">Every panel aligns meticulously with a 4px/8px/12px grid standard to ensure absolute structural alignment</p>
              </div>

              <div className="grid grid-cols-12 gap-2 bg-neutral-950 p-4 rounded-xl border border-neutral-900 font-mono text-[9px] text-center font-bold text-neutral-500">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="py-2.5 bg-neutral-900 border border-neutral-800 rounded text-blue-400/80">
                    Col {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: COMPONENT & INTERACTION PLAYGROUND */}
        {activeTab === 'components' && (
          <motion.div
            key="components"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Button Presets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Buttons Panel */}
              <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">DLS Button Presets</h3>
                  <p className="text-[10px] text-neutral-500">Clear hierarchy of interactive trigger actions</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-neutral-500">Primary CTA</span>
                    <button className="w-full py-2.5 bg-blue-500 hover:bg-blue-400 text-black font-black text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all">
                      Confirm Project <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-neutral-500">Secondary CTA</span>
                    <button className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-900 text-neutral-200 border border-neutral-850 font-bold text-xs rounded-xl cursor-pointer transition-all">
                      Browse Projects
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-neutral-500">Ghost / Muted</span>
                    <button className="w-full py-2.5 text-neutral-400 hover:text-white font-semibold text-xs rounded-xl cursor-pointer transition-all">
                      View Audit Details
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-neutral-500">Destructive</span>
                    <button className="w-full py-2.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 font-bold text-xs rounded-xl cursor-pointer transition-all">
                      Reject Application
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-neutral-500">Disabled State</span>
                    <button disabled className="w-full py-2.5 bg-neutral-900 text-neutral-600 border border-neutral-850 font-bold text-xs rounded-xl cursor-not-allowed">
                      Submit Verified Data
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-neutral-500">Loading State</span>
                    <button disabled className="w-full py-2.5 bg-blue-950/40 text-blue-400/80 border border-blue-900/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-wait">
                      <div className="w-3.5 h-3.5 border-2 border-blue-400/20 border-t-blue-400 rounded-full animate-spin" />
                      Synchronizing...
                    </button>
                  </div>
                </div>
              </div>

              {/* Input Forms with CDS Validation */}
              <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">CDS Form & Validation</h3>
                    <p className="text-[10px] text-neutral-500">Auto-save draft indicators with detailed helper guidance</p>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    formAutoSaveStatus === 'saving' 
                      ? 'text-orange-400 bg-orange-950/40 border-orange-900/30' 
                      : 'text-emerald-400 bg-emerald-950/40 border-emerald-900/30'
                  }`}>
                    {formAutoSaveStatus === 'saving' ? 'Saving draft...' : 'Draft auto-saved'}
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-neutral-400 font-bold uppercase">Academic Full Name</label>
                    <input 
                      type="text"
                      value={formName}
                      onChange={(e) => {
                        setFormName(e.target.value);
                        setFormTouched(prev => ({ ...prev, name: true }));
                      }}
                      placeholder="Nguyen Minh Anh"
                      className="w-full bg-neutral-950 border border-neutral-850 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-neutral-200 outline-none transition-all"
                    />
                    {formTouched.name && formErrors.name ? (
                      <p className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.name}</p>
                    ) : (
                      <p className="text-[9px] text-neutral-500">Must match your formal enrollment passport records.</p>
                    )}
                  </div>

                  {/* Password validation example conforming to exact rules */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-neutral-400 font-bold uppercase font-sans">Secure Access Token</label>
                    <input 
                      type="password"
                      value={formPassword}
                      onChange={(e) => {
                        setFormPassword(e.target.value);
                        setFormTouched(prev => ({ ...prev, password: true }));
                      }}
                      placeholder="••••••••"
                      className="w-full bg-neutral-950 border border-neutral-850 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-neutral-200 outline-none transition-all"
                    />
                    
                    {/* Visual validation checklist teaching the user */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <div className={`text-[9px] flex items-center gap-1 ${formPassword.length >= 8 ? 'text-emerald-400' : 'text-neutral-500'}`}>
                        <Check className="w-2.5 h-2.5" /> 8+ Characters
                      </div>
                      <div className={`text-[9px] flex items-center gap-1 ${passwordHasUpper && passwordHasLower ? 'text-emerald-400' : 'text-neutral-500'}`}>
                        <Check className="w-2.5 h-2.5" /> Mix Case
                      </div>
                      <div className={`text-[9px] flex items-center gap-1 ${passwordHasNumber ? 'text-emerald-400' : 'text-neutral-500'}`}>
                        <Check className="w-2.5 h-2.5" /> One Number
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* DLS Meticulous Table Design */}
            <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">DLS Compliant Responsive Data Tables</h3>
                  <p className="text-[10px] text-neutral-500">Meticulously sorted, filtered, accessible structure with robust empty and hover states</p>
                </div>
                
                {/* Search & Filters */}
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
                    <input 
                      type="text"
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      placeholder="Search candidates..."
                      className="bg-neutral-950 border border-neutral-850 rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-200 outline-none w-44 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex bg-neutral-950 border border-neutral-850 rounded-xl p-0.5">
                    {(['ALL', 'VERIFIED', 'PENDING'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setSelectedFilter(f)}
                        className={`px-2.5 py-1 text-[9px] font-bold rounded-lg cursor-pointer ${
                          selectedFilter === f ? 'bg-neutral-900 text-blue-400' : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actual Table */}
              <div className="overflow-x-auto rounded-2xl border border-neutral-900 bg-neutral-950">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-900/60 text-neutral-400 font-mono text-[9px] uppercase tracking-wider border-b border-neutral-900">
                      <th className="p-4 font-bold">Candidate Name</th>
                      <th className="p-4 font-bold">Academic Major</th>
                      <th className="p-4 font-bold text-center">Trust Ledger Score</th>
                      <th className="p-4 font-bold">Verification Badge</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {initialCandidates
                      .filter(c => {
                        const matchesSearch = c.name.toLowerCase().includes(tableSearch.toLowerCase()) || c.program.toLowerCase().includes(tableSearch.toLowerCase());
                        const matchesFilter = selectedFilter === 'ALL' || c.status === selectedFilter;
                        return matchesSearch && matchesFilter;
                      })
                      .map((c) => (
                        <tr key={c.id} className="border-b border-neutral-900/60 hover:bg-neutral-900/20 transition-all">
                          <td className="p-4">
                            <div className="font-bold text-neutral-100 flex items-center gap-1.5">
                              {c.name}
                              {c.trust >= 95 && (
                                <span className="text-[8px] bg-blue-950 text-blue-400 px-1.5 py-0.5 rounded-full font-mono font-bold border border-blue-900/20">TOP</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-neutral-400">{c.program}</td>
                          <td className="p-4 text-center font-mono font-black text-blue-400">
                            {c.trust}%
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase inline-flex items-center gap-1 ${
                              c.status === 'VERIFIED' 
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/20' 
                                : 'bg-orange-950 text-orange-400 border border-orange-900/20'
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                              {c.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button className="px-3 py-1 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-neutral-800 text-[10px] font-bold rounded-lg cursor-pointer">
                              View Portfolio
                            </button>
                          </td>
                        </tr>
                      ))}
                    {initialCandidates.filter(c => {
                      const matchesSearch = c.name.toLowerCase().includes(tableSearch.toLowerCase()) || c.program.toLowerCase().includes(tableSearch.toLowerCase());
                      const matchesFilter = selectedFilter === 'ALL' || c.status === selectedFilter;
                      return matchesSearch && matchesFilter;
                    }).length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-neutral-500 italic">
                          No candidates matching active filter guidelines. Explore other queries.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* DLS Meticulous Visual Chart Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">Minimal Performance & Trust Charts</h3>
                  <p className="text-[10px] text-neutral-500">Interactive data visuals mapping objective milestone verification histories</p>
                </div>

                {/* Minimalist Grid chart mockup using compliant SVG elements */}
                <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-900 space-y-4">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-neutral-400">WEEKLY MILESTONE VELOCITY</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5"><TrendingUp className="w-3.5 h-3.5" /> +14.2%</span>
                  </div>

                  <div className="h-28 flex items-end justify-between gap-2 pt-2">
                    {[
                      { week: 'W1', val: 40, status: 'Completed' },
                      { week: 'W2', val: 75, status: 'Completed' },
                      { week: 'W3', val: 60, status: 'Completed' },
                      { week: 'W4', val: 95, status: 'Verified' }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                        <div className="w-full bg-neutral-900 hover:bg-neutral-850 rounded-t-lg relative group overflow-hidden" style={{ height: `${bar.val}px` }}>
                          <div className="absolute bottom-0 left-0 w-full bg-blue-500 transition-all duration-300" style={{ height: `${bar.val}%` }} />
                        </div>
                        <span className="text-[9px] font-mono font-bold text-neutral-500">{bar.week}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-[9px] font-mono text-neutral-500 border-t border-neutral-900 pt-2.5">
                    <span>LEDGER_ID: 4892_AUD_SEC</span>
                    <span>98.6% VERIFICATION SPEED</span>
                  </div>
                </div>
              </div>

              {/* Status guidelines */}
              <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">Status System Blueprint</h3>
                  <p className="text-[10px] text-neutral-500">Standardized status styles mapped cleanly for instant recognition</p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { label: 'Pending Academic Verification', color: 'text-orange-400 bg-orange-950/40 border border-orange-900/30' },
                    { label: 'Verified Global Talent', color: 'text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 font-black' },
                    { label: 'Active Corporate Matching', color: 'text-blue-400 bg-blue-950/40 border border-blue-900/30' },
                    { label: 'Evaluation Disputed', color: 'text-red-400 bg-red-950/40 border border-red-900/30' }
                  ].map((st, i) => (
                    <div key={i} className={`p-3.5 rounded-xl border flex justify-between items-center ${st.color}`}>
                      <span className="text-xs font-bold font-sans">{st.label}</span>
                      <span className="text-[9px] font-mono uppercase tracking-wider font-bold">LGR_ST_0{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 4: CDS COPY & LOCALIZATION ENGINE */}
        {activeTab === 'cds_engine' && (
          <motion.div
            key="cds_engine"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Multilingual Localization sandbox */}
            <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">Multilingual Localization Matrix (Phase 6.5)</h3>
                  <p className="text-[10px] text-neutral-500">Every notification, modal, or CTA button maps safely to external locale dictionaries</p>
                </div>

                {/* Flags/Lang switcher */}
                <div className="flex flex-wrap gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-850">
                  {[
                    { key: 'en', flag: '🇬🇧', label: 'English' },
                    { key: 'ko', flag: '🇰🇷', label: '한국어' },
                    { key: 'vi', flag: '🇻🇳', label: 'Tiếng Việt' },
                    { key: 'ja', flag: '🇯🇵', label: '日本語' },
                    { key: 'de', flag: '🇩🇪', label: 'Deutsch' }
                  ].map(lang => (
                    <button
                      key={lang.key}
                      onClick={() => setSelectedLang(lang.key as any)}
                      className={`px-3 py-1 text-xs rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                        selectedLang === lang.key 
                          ? 'bg-neutral-900 text-blue-400 border border-neutral-800' 
                          : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className="hidden sm:inline">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview dictionary card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-950 p-5 rounded-2xl border border-neutral-900">
                <div className="space-y-3">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-bold">Button CTA Copy Rules</span>
                  
                  <div className="space-y-2">
                    {[
                      { key: 'submitApplication', rule: 'Submit Application (Action-oriented, no vague "Submit")' },
                      { key: 'saveProfile', rule: 'Save Profile (Saves specific document state)' },
                      { key: 'continueVerification', rule: 'Continue to Verification (Explains immediate next step)' },
                      { key: 'confirmProject', rule: 'Confirm Project (Explicit authorization trigger)' }
                    ].map(btn => (
                      <div key={btn.key} className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-850 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-neutral-400 font-mono italic">{btn.rule}</p>
                          <p className="text-xs font-black text-neutral-100 mt-1">{localizedCDS[selectedLang][btn.key as keyof typeof localizedCDS['en']]}</p>
                        </div>
                        <span className="text-[8px] font-mono text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-850">CDS_BTN</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-bold">Dynamic Tooltips & Informational Labels</span>
                  
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono text-neutral-300 font-bold flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-blue-400" /> Trust Score Tooltip
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed bg-neutral-900/40 p-3 rounded-xl border border-neutral-850 italic">
                        "{localizedCDS[selectedLang].trustScoreTooltip}"
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-mono text-neutral-300 font-bold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-blue-400" /> Performance History Guidelines
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed bg-neutral-900/40 p-3 rounded-xl border border-neutral-850 italic">
                        "{localizedCDS[selectedLang].performanceHistoryTooltip}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CDS Sandbox message types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Message Sandbox controller */}
              <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">CDS Copy Sandboxing</h3>
                  <p className="text-[10px] text-neutral-500">Toggle system situations to preview tone-compliant message structures</p>
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'success_submit', label: 'Success: Application Submitted', desc: 'Confirmation, explanation, and immediate next steps.' },
                    { id: 'error_resume', label: 'Error Recovery: Missing Document', desc: 'No system generic error. Direct explanation of why & how to solve.' },
                    { id: 'achievement_first', label: 'Achievement: Global Milestone Completed', desc: 'Encouraging, business-led positive feedback.' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveMessageDemo(item.id as any)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                        activeMessageDemo === item.id 
                          ? 'bg-neutral-950 border-blue-500/20 text-neutral-100 shadow-xl' 
                          : 'bg-neutral-950/20 border-neutral-950/40 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <h4 className="text-xs font-bold">{item.label}</h4>
                      <p className="text-[10px] text-neutral-500 mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Sandbox live viewer */}
              <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-bold">Sandbox Render</span>
                  
                  <AnimatePresence mode="wait">
                    {activeMessageDemo === 'success_submit' && (
                      <motion.div
                        key="success_submit"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-neutral-950 p-5 rounded-2xl border border-neutral-900 space-y-3.5"
                      >
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-xs font-bold">Application Submitted</span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-neutral-100">Your application has been successfully submitted.</h4>
                          <p className="text-[10px] text-neutral-400 leading-relaxed font-sans">
                            The Korean SME hiring coordinator will review your verified RMIT performance records and portfolio entries. We will notify you here once an update is compiled.
                          </p>
                        </div>
                        <div className="p-2.5 bg-neutral-900 rounded-xl text-[9px] text-neutral-500 font-mono">
                          Next Step: Prepare details for the initial matching interview.
                        </div>
                      </motion.div>
                    )}

                    {activeMessageDemo === 'error_resume' && (
                      <motion.div
                        key="error_resume"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-neutral-950 p-5 rounded-2xl border border-neutral-900 space-y-3.5"
                      >
                        <div className="flex items-center gap-2 text-red-400">
                          <AlertTriangle className="w-5 h-5" />
                          <span className="text-xs font-bold">Application Blocked</span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-neutral-100">We couldn't submit your application because your resume is missing.</h4>
                          <p className="text-[10px] text-neutral-400 leading-relaxed font-sans">
                            Our verification rules require an uploaded PDF portfolio or formal developer resume before matches are dispatched.
                          </p>
                        </div>
                        <button className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-200 border border-neutral-800 rounded-xl text-[10px] font-bold cursor-pointer">
                          Upload PDF Resume & Try Again
                        </button>
                      </motion.div>
                    )}

                    {activeMessageDemo === 'achievement_first' && (
                      <motion.div
                        key="achievement_first"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-neutral-950 p-5 rounded-2xl border border-neutral-900 space-y-3.5"
                      >
                        <div className="flex items-center gap-2 text-blue-400 animate-bounce">
                          <Award className="w-5 h-5 animate-spin" />
                          <span className="text-xs font-bold">Perfect Deadline Achieved</span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-neutral-100">Congratulations! You maintained a perfect deadline record.</h4>
                          <p className="text-[10px] text-neutral-400 leading-relaxed font-sans">
                            Excellent work. You completed all 4 weekly milestone deliverables precisely on time. This fact has been permanently recorded to your global trust ledger.
                          </p>
                        </div>
                        <div className="text-[9px] font-mono text-neutral-500">
                          Impact: Grows match accuracy scores with next-tier enterprise sponsors.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Loading state test section */}
                <div className="border-t border-neutral-900/60 pt-4 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-bold">Reassurance Loader</span>
                    <button 
                      onClick={triggerLoadingSimulation}
                      className="px-2.5 py-1 bg-blue-500 hover:bg-blue-400 text-black text-[9px] font-black rounded-lg cursor-pointer"
                    >
                      Trigger Reassurance simulation
                    </button>
                  </div>

                  <div className="flex gap-2 p-1 bg-neutral-950 rounded-xl border border-neutral-900">
                    {(['preparing', 'finding', 'analyzing', 'verifying'] as const).map(item => (
                      <button
                        key={item}
                        onClick={() => setLoadingReassuranceText(item)}
                        className={`flex-1 py-1 text-[9px] rounded-lg font-bold cursor-pointer ${
                          loadingReassuranceText === item ? 'bg-neutral-900 text-blue-400' : 'text-neutral-500'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="h-14 bg-neutral-950 rounded-xl border border-neutral-900 flex items-center justify-center p-3 relative overflow-hidden">
                    {isLoadingActive ? (
                      <div className="flex items-center gap-2.5">
                        <div className="w-3.5 h-3.5 border-2 border-blue-400/20 border-t-blue-400 rounded-full animate-spin" />
                        <span className="text-xs font-mono text-neutral-300 animate-pulse">
                          {localizedCDS[selectedLang][`${loadingReassuranceText}Dashboard` as keyof typeof localizedCDS['en']] || localizedCDS[selectedLang][`${loadingReassuranceText}Projects` as keyof typeof localizedCDS['en']] || localizedCDS[selectedLang][`${loadingReassuranceText}Profile` as keyof typeof localizedCDS['en']] || localizedCDS[selectedLang][`${loadingReassuranceText}Info` as keyof typeof localizedCDS['en']]}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-neutral-500 font-mono">Simulate a reassuring loader using localized rules</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 5: TRUST-DRIVEN ONBOARDING */}
        {activeTab === 'flows' && (
          <motion.div
            key="flows"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Student steppers conforming to strict steps */}
            <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-neutral-200">Student Trust Journey Stepper</h3>
                  <p className="text-[10px] text-neutral-500">Meticulous verification pipeline</p>
                </div>
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/40 border border-blue-900/30 px-2 py-0.5 rounded">
                  Step {studentStep}/7
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1 bg-neutral-950 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(studentStep / 7) * 100}%` }} />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {[
                  { step: 1, title: 'Create Academic Account', desc: 'Establish authentication profile with verified RMIT credentials.' },
                  { step: 2, title: 'Verify Profile Integrity', desc: 'Manual review of passport information and student registry data.' },
                  { step: 3, title: 'Complete Portfolio Credentials', desc: 'Securely link GitHub records, design deliverables, and verified academic history.' },
                  { step: 4, title: 'Apply for Validation Projects', desc: 'Select matched, 4-week micro projects posted by Gyeongbuk SMEs.' },
                  { step: 5, title: 'Work with Gyeongbuk Companies', desc: 'Submit weekly milestone deliverables to progress the project ledger.' },
                  { step: 6, title: 'Build Verified Performance History', desc: 'Gather objective employer feedback and performance ratings.' },
                  { step: 7, title: 'Get Direct-Hired', desc: 'Complete verified collaboration and secure global work placements.' }
                ].map(s => (
                  <div 
                    key={s.step}
                    className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                      studentStep === s.step 
                        ? 'bg-neutral-950 border-blue-500/20 text-neutral-100 shadow-lg' 
                        : studentStep > s.step 
                          ? 'bg-neutral-900/20 border-neutral-900 text-neutral-500 opacity-60' 
                          : 'bg-neutral-950/20 border-neutral-950/40 text-neutral-600'
                    }`}
                  >
                    <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                      studentStep === s.step 
                        ? 'bg-blue-500 text-black' 
                        : studentStep > s.step 
                          ? 'bg-neutral-900 text-blue-400 border border-neutral-800' 
                          : 'bg-neutral-950 text-neutral-600'
                    }`}>
                      {studentStep > s.step ? <Check className="w-3 h-3" /> : s.step}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{s.title}</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button 
                  disabled={studentStep === 1}
                  onClick={() => setStudentStep(prev => prev - 1)}
                  className="px-3.5 py-1.5 bg-neutral-950 text-neutral-400 border border-neutral-850 rounded-xl text-xs font-bold hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  Prev
                </button>
                <button 
                  disabled={studentStep === 7}
                  onClick={() => setStudentStep(prev => prev + 1)}
                  className="px-3.5 py-1.5 bg-blue-500 text-black rounded-xl text-xs font-black flex items-center gap-1 hover:bg-blue-400 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* SME Company Journeys conforming to strict steps */}
            <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-neutral-200">SME Matching Journey Stepper</h3>
                  <p className="text-[10px] text-neutral-500">Corporate validation matching pipeline</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded">
                  Step {companyStep}/6
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1 bg-neutral-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(companyStep / 6) * 100}%` }} />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {[
                  { step: 1, title: 'Corporate Registry Verification', desc: 'Enter registration business licenses for secure manual verification.' },
                  { step: 2, title: 'Draft Interactive Project Brief', desc: 'Outline 4-week milestones with explicit weekly deliverables.' },
                  { step: 3, title: 'AI Match Candidate recommendation', desc: 'Receive matched student profiles based on objective skill records.' },
                  { step: 4, title: 'Manage active milestone sprints', desc: 'Review weekly deliverable submissions and evaluate speeds.' },
                  { step: 5, title: 'Review & Grade deliverables', desc: 'Provide verified milestone evaluations to update student histories.' },
                  { step: 6, title: 'Make Verified Hiring Decision', desc: 'Seamlessly convert students to permanent hire or keep in matches.' }
                ].map(s => (
                  <div 
                    key={s.step}
                    className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                      companyStep === s.step 
                        ? 'bg-neutral-950 border-emerald-500/20 text-neutral-100 shadow-lg' 
                        : companyStep > s.step 
                          ? 'bg-neutral-900/20 border-neutral-900 text-neutral-500 opacity-60' 
                          : 'bg-neutral-950/20 border-neutral-950/40 text-neutral-600'
                    }`}
                  >
                    <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                      companyStep === s.step 
                        ? 'bg-emerald-500 text-black' 
                        : companyStep > s.step 
                          ? 'bg-neutral-900 text-emerald-400 border border-neutral-800' 
                          : 'bg-neutral-950 text-neutral-600'
                    }`}>
                      {companyStep > s.step ? <Check className="w-3 h-3" /> : s.step}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{s.title}</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button 
                  disabled={companyStep === 1}
                  onClick={() => setCompanyStep(prev => prev - 1)}
                  className="px-3.5 py-1.5 bg-neutral-950 text-neutral-400 border border-neutral-850 rounded-xl text-xs font-bold hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  Prev
                </button>
                <button 
                  disabled={companyStep === 6}
                  onClick={() => setCompanyStep(prev => prev + 1)}
                  className="px-3.5 py-1.5 bg-emerald-500 text-black rounded-xl text-xs font-black flex items-center gap-1 hover:bg-emerald-400 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
