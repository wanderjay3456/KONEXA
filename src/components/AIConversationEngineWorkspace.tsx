import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Users,
  Search,
  Activity,
  ArrowRightLeft,
  FileText,
  Clock,
  Terminal,
  Compass,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Send,
  Database,
  Globe,
  Sliders,
  Shield,
  Heart,
  User,
  Bot,
  Zap,
  Briefcase,
  Play,
  FileCode,
  Bell,
  Sparkles,
  TrendingUp,
  Cpu,
  Bookmark,
  Share2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// ============================================================================
// SYSTEM TYPE DEFINITIONS (SPECIFICATION 8.0 AI CONVERSATION ENGINE)
// ============================================================================

export interface AIAgentMetadata {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
}

export interface ConversationObject {
  id: string;
  sessionId: string;
  executionId: string;
  workflowId: string;
  participants: {
    type: 'Student' | 'Company' | 'Administrator' | 'AI_Agent' | 'System';
    id: string;
    name: string;
  }[];
  activeAgent: AIAgentMetadata;
  language: 'English' | 'Korean' | 'Vietnamese' | 'Japanese' | 'Chinese' | 'German';
  intent: string;
  intentConfidence: number;
  goal: string;
  status: 'Created' | 'Assigned' | 'Active' | 'Waiting' | 'Escalated' | 'Transferred' | 'Resolved' | 'Archived';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  startedAt: string;
  updatedAt: string;
  summary: string;
  version: string;
}

export interface MessageObject {
  id: string;
  conversationId: string;
  senderType: 'User' | 'AI' | 'System' | 'Observer';
  senderName: string;
  text: string;
  timestamp: string;
  language: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  sensitiveMasked: boolean;
  integritySignature: string;
}

export interface ConversationMemoryObject {
  intent: string;
  summary: string;
  importantDecisions: string[];
  actionItems: { id: string; text: string; status: 'Pending' | 'Completed'; deadline?: string }[];
  followUps: { id: string; text: string; scheduledTime: string; status: 'Scheduled' | 'Sent' }[];
  referencedObjects: string[];
  knowledgeVersion: string;
}

export interface ConversationAuditRecord {
  id: string;
  conversationId: string;
  executionId: string;
  agentId: string;
  intent: string;
  knowledgeVersion: string;
  memoryVersion: string;
  promptVersion: string;
  actionsEvaluated: string[];
  summary: string;
  timestamp: string;
  status: 'VERIFIED' | 'REVOKED_RULE' | 'HALTING_SAFETY';
}

// ============================================================================
// SEED DATA
// ============================================================================

const SEED_AGENTS: AIAgentMetadata[] = [
  { id: 'AGT-REC-01', name: 'AI Recruiter', role: 'Recruitment Guidance', avatarColor: 'bg-emerald-500' },
  { id: 'AGT-PM-02', name: 'AI Project Manager', role: 'Project Management & Milestones', avatarColor: 'bg-indigo-500' },
  { id: 'AGT-COA-03', name: 'AI Career Coach', role: 'Career Coaching & Interview Prep', avatarColor: 'bg-violet-500' },
  { id: 'AGT-HIR-04', name: 'AI Hiring Advisor', role: 'Approval & Fit Evaluation', avatarColor: 'bg-amber-500' },
  { id: 'AGT-TFD-05', name: 'AI Fraud Investigator', role: 'Security & Trust Audits', avatarColor: 'bg-rose-500' }
];

const SEED_CONVERSATIONS: ConversationObject[] = [
  {
    id: 'CONV-STU-1001',
    sessionId: 'SESS-99881',
    executionId: 'EXEC-771',
    workflowId: 'WF-MTC-502',
    participants: [
      { type: 'Student', id: 'STU-9201', name: 'Nguyen Hoang Long' },
      { type: 'AI_Agent', id: 'AGT-COA-03', name: 'AI Career Coach' }
    ],
    activeAgent: SEED_AGENTS[2],
    language: 'English',
    intent: 'Career Advice',
    intentConfidence: 94,
    goal: 'Resume refinement & interview readiness simulation for global tech placements',
    status: 'Active',
    priority: 'Medium',
    startedAt: '2026-07-04T18:30:00Z',
    updatedAt: '2026-07-04T20:50:00Z',
    summary: 'The student seeks strategies to align project portfolios with multi-national hiring metrics.',
    version: 'v2.1.0'
  },
  {
    id: 'CONV-COMP-3004',
    sessionId: 'SESS-10492',
    executionId: 'EXEC-902',
    workflowId: 'WF-HIR-112',
    participants: [
      { type: 'Company', id: 'COM-4431', name: 'FPT Software Representative' },
      { type: 'AI_Agent', id: 'AGT-REC-01', name: 'AI Recruiter' }
    ],
    activeAgent: SEED_AGENTS[0],
    language: 'English',
    intent: 'Hiring Discussion',
    intentConfidence: 98,
    goal: 'Review student performance credentials for rapid contract authorization',
    status: 'Waiting',
    priority: 'High',
    startedAt: '2026-07-04T19:15:00Z',
    updatedAt: '2026-07-04T20:45:00Z',
    summary: 'Discussion surrounding vetting security checks for engineering apprentices.',
    version: 'v2.0.1'
  },
  {
    id: 'CONV-SYS-5509',
    sessionId: 'SESS-33291',
    executionId: 'EXEC-442',
    workflowId: 'WF-SEC-911',
    participants: [
      { type: 'Administrator', id: 'ADM-01', name: 'Security Admin' },
      { type: 'AI_Agent', id: 'AGT-TFD-05', name: 'AI Fraud Investigator' }
    ],
    activeAgent: SEED_AGENTS[4],
    language: 'Vietnamese',
    intent: 'Fraud Investigation',
    intentConfidence: 89,
    goal: 'Audit of sudden portfolio repository shifts on suspicious student profile',
    status: 'Escalated',
    priority: 'Critical',
    startedAt: '2026-07-04T20:00:00Z',
    updatedAt: '2026-07-04T20:58:00Z',
    summary: 'Administrator requires proof regarding source code plagiarism scores.',
    version: 'v1.4.0'
  }
];

const SEED_MESSAGES: MessageObject[] = [
  {
    id: 'MSG-001',
    conversationId: 'CONV-STU-1001',
    senderType: 'User',
    senderName: 'Nguyen Hoang Long',
    text: 'Hello! I need assistance preparing my portfolio for senior recruiters. My main projects are built using React and Node.js.',
    timestamp: '2026-07-04T18:30:10Z',
    language: 'English',
    sentiment: 'Neutral',
    sensitiveMasked: false,
    integritySignature: 'sha256_b4e9f80a'
  },
  {
    id: 'MSG-002',
    conversationId: 'CONV-STU-1001',
    senderType: 'AI',
    senderName: 'AI Career Coach',
    text: 'Hello Long. I have loaded your current portfolio dataset. Your React applications show high modularity, but we should improve your system design descriptions. Would you like to outline the architectural choices?',
    timestamp: '2026-07-04T18:31:00Z',
    language: 'English',
    sentiment: 'Positive',
    sensitiveMasked: false,
    integritySignature: 'sha256_e109d4c2'
  },
  {
    id: 'MSG-003',
    conversationId: 'CONV-STU-1001',
    senderType: 'User',
    senderName: 'Nguyen Hoang Long',
    text: 'Yes please. I also want to make sure I am ready for security questions about backend OAuth implementation.',
    timestamp: '2026-07-04T18:32:15Z',
    language: 'English',
    sentiment: 'Positive',
    sensitiveMasked: false,
    integritySignature: 'sha256_ff912a48'
  }
];

const SEED_MEMORIES: Record<string, ConversationMemoryObject> = {
  'CONV-STU-1001': {
    intent: 'Career Advice',
    summary: 'The student wants to elevate architectural descriptions on portfolio and practice backend OAuth mockups.',
    importantDecisions: [
      'Focus portfolio revision on microservices layout representation',
      'Target English communication delivery patterns'
    ],
    actionItems: [
      { id: 'ACT-01', text: 'Refactor portfolio architecture diagrams', status: 'Pending', deadline: '2026-07-06' },
      { id: 'ACT-02', text: 'Simulate Mock System Design Interview', status: 'Pending', deadline: '2026-07-08' }
    ],
    followUps: [
      { id: 'FLP-01', text: 'Check progress on architectural updates', scheduledTime: '2026-07-07T09:00:00Z', status: 'Scheduled' }
    ],
    referencedObjects: ['STU-9201 (Nguyen Hoang Long)', 'PORTFOLIO-9201'],
    knowledgeVersion: 'KNL-RULES-v7.2'
  },
  'CONV-COMP-3004': {
    intent: 'Hiring Discussion',
    summary: 'Vetting of apprentice apprentice credentials under company-specific trust criteria.',
    importantDecisions: ['Awaiting physical contract signature before granting platform repository write scopes'],
    actionItems: [
      { id: 'ACT-03', text: 'Review apprentice credential validity certificates', status: 'Completed', deadline: '2026-07-04' }
    ],
    followUps: [],
    referencedObjects: ['COM-4431 (FPT)', 'APPRENTICE-CONTRACT-99'],
    knowledgeVersion: 'KNL-RULES-v7.2'
  }
};

const SEED_AUDITS: ConversationAuditRecord[] = [
  {
    id: 'AUD-CONV-001',
    conversationId: 'CONV-STU-1001',
    executionId: 'EXEC-771',
    agentId: 'AGT-COA-03',
    intent: 'Career Advice',
    knowledgeVersion: 'KNL-RULES-v7.2',
    memoryVersion: 'MEM-STU-v1.4',
    promptVersion: 'PRMPT-COA-v3.0.1',
    actionsEvaluated: ['LoadMemory', 'LoadKnowledge', 'GenerateAnswer', 'EvaluateRisk'],
    summary: 'Verified successfully. No sensitive data leaks or rule hallucinations detected.',
    timestamp: '2026-07-04T18:31:00Z',
    status: 'VERIFIED'
  }
];

// ============================================================================
// MAIN COMPONENT DEFINITION
// ============================================================================

export default function AIConversationEngineWorkspace() {
  // Top-Level Navigation State
  const [activeSubTab, setActiveSubTab] = useState<'interactive' | 'pipeline' | 'collaboration' | 'analytics' | 'audit' | 'schemas' | 'testing'>('interactive');

  // Dynamic Lists with state
  const [conversations, setConversations] = useState<ConversationObject[]>(SEED_CONVERSATIONS);
  const [messages, setMessages] = useState<MessageObject[]>(SEED_MESSAGES);
  const [memories, setMemories] = useState<Record<string, ConversationMemoryObject>>(SEED_MEMORIES);
  const [audits, setAudits] = useState<ConversationAuditRecord[]>(SEED_AUDITS);

  // Active Selected Conversation state
  const [selectedConvId, setSelectedConvId] = useState<string>('CONV-STU-1001');

  // User input text box inside chat simulation
  const [chatInput, setChatInput] = useState('');
  const [chatLanguage, setChatLanguage] = useState<'English' | 'Korean' | 'Vietnamese' | 'Japanese' | 'Chinese' | 'German'>('English');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilterStatus, setSearchFilterStatus] = useState<string>('ALL');

  // Multilingual auto-detection simulate indicator
  const [autoDetectLang, setAutoDetectLang] = useState(true);

  // Pipeline execution log stack trace
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);

  // Multi-Agent Collaboration Panel States
  const [collabMode, setCollabMode] = useState<'Sequential' | 'Parallel' | 'Consensus'>('Sequential');
  const [collabTranscript, setCollabTranscript] = useState<Array<{ agent: string; role: string; text: string; time: string }>>([
    { agent: 'AI Career Coach', role: 'Career Coaching', text: 'I recommend preparing Nguyen for high-scale microservices questions.', time: '20:50:00' },
    { agent: 'AI Resume Reviewer', role: 'Document Optimization', text: 'Drafting specific experience updates referencing Docker and Kubernetes configuration.', time: '20:50:15' },
    { agent: 'AI Recruiter', role: 'Recruitment Interface', text: 'Synchronizing resume modifications with FPT Software criteria. Aligning submission scheduling.', time: '20:50:35' }
  ]);
  const [isCollabActive, setIsCollabActive] = useState(false);

  // Interactive follow-up schedule creator state
  const [followUpText, setFollowUpText] = useState('');
  const [followUpDelayMin, setFollowUpDelayMin] = useState(30);

  // Search Index parameters
  const [searchMethod, setSearchMethod] = useState<'keyword' | 'semantic' | 'hybrid'>('hybrid');
  const [searchConsoleLogs, setSearchConsoleLogs] = useState<string[]>([]);

  // API Playground states
  const [apiMethod, setApiMethod] = useState<'SEND_MESSAGE' | 'SUMMARIZE' | 'HANDOFF' | 'TRIGGER_FOLLOWUP'>('SEND_MESSAGE');
  const [apiResponseJson, setApiResponseJson] = useState<any>(null);

  // Test Suite logs
  const [testSuiteLogs, setTestSuiteLogs] = useState<string[]>([
    'Conversation Test Runner is idle.',
    'Press "Execute Enterprise Conversation Audit Scans" to run standard benchmarks.'
  ]);
  const [isTestSuiteRunning, setIsTestSuiteRunning] = useState(false);

  // Current active conversation context data structure
  const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];
  const activeMemory = memories[activeConv.id] || {
    intent: 'General Inquiry',
    summary: 'No contextual memory created yet.',
    importantDecisions: [],
    actionItems: [],
    followUps: [],
    referencedObjects: [],
    knowledgeVersion: 'v1.0'
  };

  // Notification status indicators
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 4000);
  };

  // Trigger auto api response block sync
  useEffect(() => {
    let mockRes: any = {};
    if (apiMethod === 'SEND_MESSAGE') {
      mockRes = {
        endpoint: 'POST /api/v1/conversations/message',
        payload: {
          conversationId: 'CONV-STU-1001',
          senderId: 'STU-9201',
          text: 'I submitted the updated diagrams.',
          language: 'English',
          autoDetect: true
        },
        response: {
          status: 201,
          messageId: 'MSG-MOCK-991',
          detectedLanguage: 'English',
          detectedIntent: 'Project Discussion',
          intentConfidence: 96,
          sentiment: 'Neutral',
          moderationCheck: { valid: true, riskRating: 'Low' },
          pipelineLatencyMs: 44.5,
          timestamp: new Date().toISOString()
        }
      };
    } else if (apiMethod === 'SUMMARIZE') {
      mockRes = {
        endpoint: 'POST /api/v1/conversations/summarize',
        payload: { conversationId: 'CONV-STU-1001', granularity: 'Detailed' },
        response: {
          status: 200,
          conversationId: 'CONV-STU-1001',
          summary: ' Nguyen Hoang Long collaborated with AI Career Coach regarding React and system design, establishing task targets.',
          decisionPoints: ['Draft architectural layouts', 'Schedule mock review'],
          tokenOptimization: { previousHistoryTokens: 1420, summaryTokens: 150, savedPercentage: '89.4%' },
          timestamp: new Date().toISOString()
        }
      };
    } else if (apiMethod === 'HANDOFF') {
      mockRes = {
        endpoint: 'POST /api/v1/conversations/handoff',
        payload: {
          conversationId: 'CONV-STU-1001',
          sourceAgentId: 'AGT-COA-03',
          targetAgentId: 'AGT-REC-01',
          contextPreserved: true
        },
        response: {
          status: 200,
          handoffToken: 'HNDF-TKN-91280A',
          sourceAgent: 'AI Career Coach',
          targetAgent: 'AI Recruiter',
          transferredContext: {
            studentId: 'STU-9201',
            lastIntent: 'Career Advice',
            unsavedActionItemsCount: 2
          },
          handoffStatus: 'Transferred',
          timestamp: new Date().toISOString()
        }
      };
    } else {
      mockRes = {
        endpoint: 'POST /api/v1/conversations/followup',
        payload: {
          conversationId: 'CONV-STU-1001',
          text: 'Check if architecture diagram refactor has completed successfully.',
          delaySeconds: 1800
        },
        response: {
          status: 202,
          followUpId: 'FLP-MOCK-39',
          scheduledEpoch: new Date(Date.now() + 1800 * 1000).toISOString(),
          scheduleStatus: 'Scheduled',
          dispatchedVia: 'System Scheduler Daemon'
        }
      };
    }
    setApiResponseJson(mockRes);
  }, [apiMethod]);

  // Handle live sending of simulated user messages
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiGenerating) return;

    const userMsgText = chatInput;
    setChatInput('');
    setIsAiGenerating(true);

    // Language detection simulation
    let detectedLanguage = chatLanguage;
    if (autoDetectLang) {
      const vnMappings = ['xin chào', 'cảm ơn', 'hồ sơ', 'dự án', 'học viên'];
      const koMappings = ['안녕', '감사', '포트폴리오', '이력서'];
      const textLower = userMsgText.toLowerCase();
      if (vnMappings.some(w => textLower.includes(w))) {
        detectedLanguage = 'Vietnamese';
      } else if (koMappings.some(w => textLower.includes(w))) {
        detectedLanguage = 'Korean';
      }
    }

    // Append User Message to local state messages array
    const userMsg: MessageObject = {
      id: `MSG-USER-${Date.now()}`,
      conversationId: activeConv.id,
      senderType: 'User',
      senderName: activeConv.participants[0]?.name || 'User Student',
      text: userMsgText,
      timestamp: new Date().toISOString(),
      language: detectedLanguage,
      sentiment: userMsgText.includes('happy') || userMsgText.includes('good') ? 'Positive' : 'Neutral',
      sensitiveMasked: false,
      integritySignature: `sha256_dyn_${Math.random().toString(36).substring(3, 11)}`
    };

    setMessages(prev => [...prev, userMsg]);
    triggerToast(`Message dispatched. Language: ${detectedLanguage}`);

    // Trigger full context pipeline trace logs
    setIsPipelineRunning(true);
    setPipelineLogs([]);
    const log = (msg: string) => setPipelineLogs(prev => [...prev, msg]);

    await new Promise(r => setTimeout(r, 200));
    log('🔐 Pipeline Step 1: Authentication verified. Session cryptographically matched.');
    await new Promise(r => setTimeout(r, 250));
    log('🛡️ Pipeline Step 2: Running Permission Evaluation... (Agent permissions & scope evaluated [PASS])');
    await new Promise(r => setTimeout(r, 200));
    log('💼 Pipeline Step 3: Context Assembly loading minimal token footprint (Student, Scores, Trust loaded).');
    await new Promise(r => setTimeout(r, 300));
    log(`🧠 Pipeline Step 4: Memory retrieved from cache registry (referencedObjects: ${activeMemory.referencedObjects.join(', ')})`);
    await new Promise(r => setTimeout(r, 250));
    log('📚 Pipeline Step 5: Injecting Platform Policies & Knowledge guidelines (KNL-RULES-v7.2 loaded).');
    await new Promise(r => setTimeout(r, 200));
    log(`🎯 Pipeline Step 6: Intent classification calculated: "${activeConv.intent}" with confidence ${activeConv.intentConfidence}%`);
    await new Promise(r => setTimeout(r, 350));
    log('🤖 Pipeline Step 7: Generating complete state-aware response using prompt criteria...');
    await new Promise(r => setTimeout(r, 300));
    log('⚖️ Pipeline Step 8: Running output validation rules (Safety, Token moderation, PII mask checks [PASS]).');
    await new Promise(r => setTimeout(r, 200));
    log('📁 Pipeline Step 9: Committing new interaction states to the Conversation Memory and Audit Framework.');

    // Generate response text based on active agent
    let aiResponseText = `I have received your query regarding "${userMsgText}". Under platform guidelines, let us schedule a milestone review or examine credentials to ensure zero error rates.`;
    if (activeConv.activeAgent.id === 'AGT-COA-03') {
      aiResponseText = `Understood. I have logged your design interest in OAuth. Let us create a practice checklist in your workspace and update the Student Profile targets.`;
    } else if (activeConv.activeAgent.id === 'AGT-REC-01') {
      aiResponseText = `As your AI Recruiter, I will verify this with the company representative and ensure correct validation mapping is used during scheduling.`;
    }

    const aiMsg: MessageObject = {
      id: `MSG-AI-${Date.now()}`,
      conversationId: activeConv.id,
      senderType: 'AI',
      senderName: activeConv.activeAgent.name,
      text: aiResponseText,
      timestamp: new Date().toISOString(),
      language: detectedLanguage,
      sentiment: 'Positive',
      sensitiveMasked: false,
      integritySignature: `sha256_gen_${Math.random().toString(36).substring(3, 11)}`
    };

    setMessages(prev => [...prev, aiMsg]);

    // Append to memory decisions / summaries
    const updatedMemory: ConversationMemoryObject = {
      ...activeMemory,
      summary: `Conversation refined on ${detectedLanguage} about matching developer credentials. Recent user query: "${userMsgText.slice(0, 45)}...".`,
      importantDecisions: [
        ...activeMemory.importantDecisions,
        `Identified ${detectedLanguage} localization query intent`
      ]
    };
    setMemories(prev => ({ ...prev, [activeConv.id]: updatedMemory }));

    // Append to Immutable Audit log
    const newAudit: ConversationAuditRecord = {
      id: `AUD-CONV-DYN-${Math.floor(Math.random() * 900) + 100}`,
      conversationId: activeConv.id,
      executionId: activeConv.executionId,
      agentId: activeConv.activeAgent.id,
      intent: activeConv.intent,
      knowledgeVersion: 'KNL-RULES-v7.2',
      memoryVersion: 'MEM-STU-DYN-v1.0',
      promptVersion: 'PRMPT-DYN-v3.2',
      actionsEvaluated: ['LoadMemory', 'LoadKnowledge', 'GenerateResponse', 'IntegritySigning'],
      summary: 'Dynamic response validated and signed successfully. Stateless payload clean.',
      timestamp: new Date().toISOString(),
      status: 'VERIFIED'
    };
    setAudits(prev => [newAudit, ...prev]);

    setIsAiGenerating(false);
    setIsPipelineRunning(false);
  };

  // Switch Conversation / Handoff Simulate
  const handleAgentHandoff = (targetAgentId: string) => {
    const targetAgent = SEED_AGENTS.find(a => a.id === targetAgentId);
    if (!targetAgent) return;

    // Log the transfer
    const systemHandoffMsg: MessageObject = {
      id: `MSG-SYS-HNDF-${Date.now()}`,
      conversationId: activeConv.id,
      senderType: 'System',
      senderName: 'System Router',
      text: `🔄 CONVERSATION HANDOFF INITIATED: [${activeConv.activeAgent.name}] transferred ownership to [${targetAgent.name}]. Full interaction memory history preserved.`,
      timestamp: new Date().toISOString(),
      language: 'English',
      sentiment: 'Neutral',
      sensitiveMasked: false,
      integritySignature: 'sha256_system_router'
    };

    // Update conversation properties
    const updatedConvs = conversations.map(c => {
      if (c.id === activeConv.id) {
        return {
          ...c,
          activeAgent: targetAgent,
          status: 'Transferred' as const,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });

    setConversations(updatedConvs);
    setMessages(prev => [...prev, systemHandoffMsg]);
    triggerToast(`Ownership successfully transferred to ${targetAgent.name}`);
  };

  // Add a follow up to memory
  const handleAddFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpText.trim()) return;

    const newFlp = {
      id: `FLP-DYN-${Date.now()}`,
      text: followUpText,
      scheduledTime: new Date(Date.now() + followUpDelayMin * 60000).toISOString(),
      status: 'Scheduled' as const
    };

    const currentMemory = activeMemory;
    const updatedMemory: ConversationMemoryObject = {
      ...currentMemory,
      followUps: [...currentMemory.followUps, newFlp]
    };

    setMemories(prev => ({ ...prev, [activeConv.id]: updatedMemory }));
    setFollowUpText('');
    triggerToast('Follow-up notification scheduled successfully!');
  };

  // Execute Semantic Hybrid Search simulation
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchConsoleLogs([
      `Initializing ${searchMethod.toUpperCase()} query evaluation...`,
      `Query: "${searchQuery}"`,
      `Applying RLS (Row Level Security) filters for active user...`,
      `Searching across Conversation Registry and Memory indexes...`,
      `Found 1 relevant transaction match with 92% confidence rating.`
    ]);
  };

  // Collab multi-agent discussion loop simulate
  const triggerMultiAgentCollab = async () => {
    if (isCollabActive) return;
    setIsCollabActive(true);
    setCollabTranscript([]);

    const responses = [
      { agent: 'AI Recruiter', role: 'Recruiting Agent', text: 'Analyzing FPT Software job specifications... Found critical skill alignment with Nguyen Hoang Long.' },
      { agent: 'AI Career Coach', role: 'Career Coaching', text: 'Agreed. Navigated matching scores. Formulating targeted behavioral guidance matrices.' },
      { agent: 'AI Project Manager', role: 'Project Director', text: 'Validating progress metrics. Milestones completed: 9/10. Student is qualified for fast-track interview pipeline.' },
      { agent: 'AI Hiring Advisor', role: 'Hiring Approval', text: 'Consensus established. Standard fit assessment complete. Formulating evaluation summary.' }
    ];

    for (let i = 0; i < responses.length; i++) {
      setCollabTranscript(prev => [...prev, {
        agent: responses[i].agent,
        role: responses[i].role,
        text: responses[i].text,
        time: new Date().toLocaleTimeString()
      }]);
      await new Promise(r => setTimeout(r, 600));
    }
    setIsCollabActive(false);
  };

  // Test Suite Execution
  const runSecurityTestSuite = async () => {
    if (isTestSuiteRunning) return;
    setIsTestSuiteRunning(true);
    setTestSuiteLogs([]);

    const log = (msg: string) => {
      setTestSuiteLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    log('🚀 Initializing Dialogue Orchestration and Conversation Security Test Suite (v8.0)...');
    await new Promise(r => setTimeout(r, 450));

    log('🛡️ TEST 1: Stateless Conversation Pipeline Validation...');
    log('Sending mock message string to evaluation router. Matching integrity signatures...');
    log('Checking authentication, permission layer, context assembler, memory, and validation checks...');
    log('Pipeline result: GRANTED. Output safely signed with integrity SHA256. [PASS]');
    await new Promise(r => setTimeout(r, 400));

    log('🔍 TEST 2: Intent Engine Confidence Scoring...');
    log('Injecting ambiguous prompt: "Can you help me? Not sure..."');
    log('Detected Intent: Information Request. Confidence: 45% (Below limit threshold 70%).');
    log('Clarification response triggered: "I detected your interest in general platform assistance. Could you elaborate?" [PASS]');
    await new Promise(r => setTimeout(r, 450));

    log('💼 TEST 3: Row Level Security (RLS) Permission-Aware Search Vetting...');
    log('Attempting to execute semantic search for restricted "Student Warn Record" under standard User credentials...');
    log('Result: BLOCKED. Verified that search engine restricts query scopes based on RBAC/RLS policies. [PASS]');
    await new Promise(r => setTimeout(r, 400));

    log('⏱️ TEST 4: Integrity Signature Validation & Anti-Tampering...');
    log('Checking SHA256 hash chains of history database indexes...');
    log('Verify matching cryptographic sequences for messages. [PASS]');
    await new Promise(r => setTimeout(r, 300));

    log('📊 TEST 5: Load capacity throughput simulation...');
    log('Spawning virtual thread queues handling 100,000 parallel dialogue transactions...');
    log('Result: Stream processing latency averaged 22ms. Mean pipeline transaction time: 38ms. [PASS]');
    await new Promise(r => setTimeout(r, 500));

    log('✅ SCANS COMPLETED. 5/5 Conversational sub-modules verified green. Compliance Grade verified.');
    setIsTestSuiteRunning(false);
  };

  // Filter messages based on active conversation
  const activeMessages = messages.filter(m => m.conversationId === activeConv.id);

  // Search filtered conversations
  const filteredConvs = conversations.filter(c => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = c.id.toLowerCase().includes(query) ||
                          c.intent.toLowerCase().includes(query) ||
                          c.goal.toLowerCase().includes(query);
    const matchesStatus = searchFilterStatus === 'ALL' || c.status === searchFilterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 text-neutral-200 shadow-2xl relative overflow-hidden" id="ai-conversation-engine-workspace">
      {/* Background ambient highlights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Toast Notification popup */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 bg-indigo-900/90 border border-indigo-700/50 text-indigo-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 z-50 text-xs font-semibold backdrop-blur-md"
          >
            <Bell className="w-4 h-4 text-indigo-400 animate-bounce" />
            {toastNotification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
              SPECIFICATION 8.0
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              Centralized Dialogue Orchestrator
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-100 mt-1 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" /> AI Conversation Engine
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Unified dialogue orchestration for all multi-agent collaborations, human-to-AI interactions, and localized student/company workflows. Enforces context safety and cryptographic integrity.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="bg-neutral-900 border border-neutral-800 px-3.5 py-1.5 rounded-2xl flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-neutral-500 block text-[9px] uppercase">Active Channels</span>
              <span className="text-indigo-400 font-bold">{conversations.length} Active</span>
            </div>
            <div className="border-l border-neutral-800 h-6 pl-4">
              <span className="text-neutral-500 block text-[9px] uppercase">Message Capacity</span>
              <span className="text-purple-400 font-bold">100M Scale</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sub-tab Navigation */}
      <div className="flex flex-wrap gap-1.5 border-b border-neutral-800/80 pb-3 mb-6">
        {[
          { id: 'interactive', label: 'Dialogue Interface', icon: MessageSquare },
          { id: 'pipeline', label: 'Dialogue Pipeline Steps', icon: Sliders },
          { id: 'collaboration', label: 'Multi-Agent Collab', icon: Users },
          { id: 'analytics', label: 'Conversation Analytics', icon: Activity },
          { id: 'audit', label: 'Immutable Audit Trail', icon: Shield },
          { id: 'schemas', label: 'Database Registries', icon: Database },
          { id: 'testing', label: 'Security & Integrity Tests', icon: Terminal }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Switch Contents */}
      <AnimatePresence mode="wait">

        {/* TAB 1: DIALOGUE INTERFACE */}
        {activeSubTab === 'interactive' && (
          <motion.div
            key="interactive"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Sidebar list of conversations */}
            <div className="lg:col-span-4 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-4 flex flex-col h-[620px]">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search dialogues, goals, intent..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-950/60 border border-neutral-800 rounded-xl py-2 pl-9 pr-4 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="flex items-center justify-between mt-3 text-[10px] font-semibold text-neutral-400">
                  <span>DIALOGUE FILTERS</span>
                  <select
                    value={searchFilterStatus}
                    onChange={(e) => setSearchFilterStatus(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 rounded px-1.5 py-0.5 text-[9px] text-neutral-300 focus:outline-none"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Waiting">Waiting</option>
                    <option value="Escalated">Escalated</option>
                    <option value="Transferred">Transferred</option>
                  </select>
                </div>
              </div>

              {/* Scrollable List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredConvs.map(c => {
                  const isSelected = c.id === selectedConvId;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedConvId(c.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-100 shadow-lg' : 'bg-neutral-900/30 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-neutral-400 font-bold">
                          {c.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : c.status === 'Waiting' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {c.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-neutral-200 mt-1.5 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${c.activeAgent.avatarColor}`} />
                        {c.activeAgent.name} ↔ {c.participants[0]?.name}
                      </h4>
                      <p className="text-[10px] text-neutral-400 mt-1 line-clamp-1">
                        {c.goal}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[9px] font-mono text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Globe className="w-2.5 h-2.5" /> {c.language}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 text-indigo-400" /> {c.intent} ({c.intentConfidence}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-neutral-800 pt-3 mt-3">
                <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-xl p-2.5 text-[10px] text-indigo-400">
                  <div className="font-bold flex items-center gap-1 mb-1">
                    <Shield className="w-3.5 h-3.5" /> Context-Aware Routing
                  </div>
                  All messages pass strict RLS security parameters. Unauthorized roles cannot fetch dialogue blocks.
                </div>
              </div>
            </div>

            {/* Chat Thread Area */}
            <div className="lg:col-span-8 flex flex-col h-[620px] bg-neutral-900/20 border border-neutral-800 rounded-3xl overflow-hidden">
              
              {/* Chat Thread Header */}
              <div className="bg-neutral-900/60 border-b border-neutral-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-neutral-200">
                      {activeConv.id} Thread
                    </h2>
                    <span className="text-[10px] font-mono text-neutral-500">
                      Workflow: {activeConv.workflowId}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    Active Goal: {activeConv.goal}
                  </p>
                </div>

                {/* Handoff controls */}
                <div className="flex items-center gap-1.5 self-start sm:self-center">
                  <span className="text-[10px] text-neutral-400 mr-1">Handoff:</span>
                  {SEED_AGENTS.filter(a => a.id !== activeConv.activeAgent.id).slice(0, 3).map(agent => (
                    <button
                      key={agent.id}
                      onClick={() => handleAgentHandoff(agent.id)}
                      className="px-2.5 py-1 rounded bg-neutral-950 hover:bg-neutral-900 text-[10px] font-bold border border-neutral-800 hover:border-indigo-500/50 text-neutral-300 transition-all cursor-pointer"
                      title={`Handoff dialogue to ${agent.name}`}
                    >
                      {agent.name.split(' ')[1] || agent.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat messages viewport */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {activeMessages.map((msg, idx) => {
                  const isAi = msg.senderType === 'AI';
                  const isSystem = msg.senderType === 'System';
                  
                  if (isSystem) {
                    return (
                      <div key={msg.id || idx} className="flex justify-center my-2">
                        <div className="bg-neutral-900 border border-neutral-800 px-3.5 py-1.5 rounded-xl text-[10px] text-indigo-400 font-mono text-center max-w-lg leading-relaxed shadow-md">
                          {msg.text}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id || idx}
                      className={`flex gap-3 max-w-xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-neutral-800 shadow-md ${isAi ? activeConv.activeAgent.avatarColor : 'bg-neutral-800'}`}>
                        {isAi ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-neutral-300" />}
                      </div>

                      {/* Content Card */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-neutral-300">{msg.senderName}</span>
                          <span className="text-[9px] text-neutral-500 font-mono">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${isAi ? 'bg-neutral-900 border border-neutral-800 text-neutral-200' : 'bg-indigo-600 text-white'}`}>
                          {msg.text}
                        </div>
                        {/* Cryptographic integrity stamp */}
                        <div className="flex items-center gap-1 text-[8px] font-mono text-neutral-500 justify-end">
                          <Shield className="w-2.5 h-2.5 text-neutral-600" /> Integrity Signed: {msg.integritySignature}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Simulated loader */}
                {isAiGenerating && (
                  <div className="flex gap-3 mr-auto max-w-xl">
                    <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center animate-spin">
                      <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-neutral-400">Pipeline Generating...</span>
                      <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-2xl text-xs text-neutral-400 animate-pulse">
                        Evaluating business rules, loading memory states, and formatting response translation layer.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat controls and input box */}
              <div className="p-4 bg-neutral-900/60 border-t border-neutral-800">
                <form onSubmit={handleSendMessage} className="space-y-2.5">
                  <div className="flex items-center justify-between gap-4 text-[10px] font-semibold text-neutral-400">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoDetectLang}
                          onChange={(e) => setAutoDetectLang(e.target.checked)}
                          className="rounded bg-neutral-950 border-neutral-800 text-indigo-500 focus:ring-0"
                        />
                        Auto-detect input language
                      </label>
                      
                      {!autoDetectLang && (
                        <select
                          value={chatLanguage}
                          onChange={(e) => setChatLanguage(e.target.value as any)}
                          className="bg-neutral-950 border border-neutral-800 rounded px-1.5 py-0.5 text-[9px] text-neutral-300"
                        >
                          <option value="English">English</option>
                          <option value="Korean">Korean</option>
                          <option value="Vietnamese">Vietnamese</option>
                          <option value="Japanese">Japanese</option>
                          <option value="Chinese">Chinese</option>
                          <option value="German">German</option>
                        </select>
                      )}
                    </div>

                    <span className="font-mono text-[9px] text-neutral-500">
                      Active Cache Version: {activeConv.version}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Send message as student to ${activeConv.activeAgent.name}...`}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      disabled={isAiGenerating}
                      className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={isAiGenerating || !chatInput.trim()}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 rounded-xl text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: DIALOGUE PIPELINE STEPS */}
        {activeSubTab === 'pipeline' && (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Pipeline Stage visualizer */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-neutral-300 mb-2">Centralized Authorization & Assembly Pipeline</h3>
              <p className="text-[10px] text-neutral-500 mb-6">
                Every dialogue interaction is fed stateless into the pipeline for validation. Mocking verification traces below.
              </p>

              {/* Interactive Pipeline simulation button */}
              <div className="flex flex-wrap items-center gap-3 mb-6 bg-neutral-950 p-4 border border-neutral-800 rounded-xl">
                <div className="text-xs text-neutral-300">
                  Select Scenario:
                </div>
                <select
                  value={selectedConvId}
                  onChange={(e) => setSelectedConvId(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200"
                >
                  {conversations.map(c => (
                    <option key={c.id} value={c.id}>{c.id} ({c.intent})</option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setChatInput('Simulated dialogue ping query.');
                    setTimeout(() => {
                      const event = { preventDefault: () => {} };
                      handleSendMessage(event as any);
                    }, 100);
                  }}
                  disabled={isAiGenerating}
                  className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ml-auto"
                >
                  <Play className="w-3.5 h-3.5" />
                  Run Live Pipeline Evaluation
                </button>
              </div>

              {/* Grid visual pipeline flow representation */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
                {[
                  { step: '1', title: 'Authenticate', desc: 'Secure session check', color: 'border-indigo-500 text-indigo-400 bg-indigo-950/10' },
                  { step: '2', title: 'Permission', desc: 'Check agent RBAC', color: 'border-blue-500 text-blue-400 bg-blue-950/10' },
                  { step: '3', title: 'Context', desc: 'Load student/company', color: 'border-cyan-500 text-cyan-400 bg-cyan-950/10' },
                  { step: '4', title: 'Memory', desc: 'Fetch conversation logs', color: 'border-purple-500 text-purple-400 bg-purple-950/10' },
                  { step: '5', title: 'Knowledge', desc: 'Platform regulations', color: 'border-pink-500 text-pink-400 bg-pink-950/10' },
                  { step: '6', title: 'Intent', desc: 'Confidence threshold', color: 'border-amber-500 text-amber-400 bg-amber-950/10' },
                  { step: '7', title: 'Generate', desc: 'Tone & Terminology', color: 'border-violet-500 text-violet-400 bg-violet-950/10' },
                  { step: '8', title: 'Verify Audit', desc: 'Sign integrity hash', color: 'border-emerald-500 text-emerald-400 bg-emerald-950/10' }
                ].map((st, i) => (
                  <div key={i} className={`p-3 rounded-xl border flex flex-col justify-between h-28 text-center ${st.color}`}>
                    <div className="text-lg font-extrabold">{st.step}</div>
                    <div>
                      <div className="text-[10px] font-bold">{st.title}</div>
                      <div className="text-[8px] text-neutral-400 mt-0.5 line-clamp-2 leading-tight">{st.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Execution Trace Console output */}
              <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-4 font-mono text-[11px] leading-relaxed">
                <div className="flex items-center justify-between text-neutral-400 border-b border-neutral-800 pb-2 mb-2">
                  <span className="flex items-center gap-1.5"><Terminal className="w-4.5 h-4.5 text-neutral-500" /> Pipeline Stack Trace Output</span>
                  <span className="text-[9px] uppercase">Stateless Evaluation Context</span>
                </div>
                <div className="space-y-1 h-44 overflow-y-auto">
                  {pipelineLogs.length === 0 ? (
                    <div className="text-neutral-500 italic">No pipeline run in buffer. Press "Run Live Pipeline Evaluation" above or send chat message.</div>
                  ) : (
                    pipelineLogs.map((log, idx) => (
                      <div key={idx} className="text-neutral-300">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: MULTI-AGENT COLLABORATION */}
        {activeSubTab === 'collaboration' && (
          <motion.div
            key="collaboration"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Control Panel */}
            <div className="lg:col-span-5 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-neutral-300">Multi-Agent Dialogue & Consensus</h3>
                <p className="text-[10px] text-neutral-500 mt-1">
                  Enables parallel, sequential, or supervised collaboration between AI personas prior to final dispatch.
                </p>
              </div>

              {/* Collaboration mode select */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Collaboration Protocol</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Sequential', label: 'Sequential', desc: 'Handoff chain' },
                    { id: 'Parallel', label: 'Parallel', desc: 'Concurrent input' },
                    { id: 'Consensus', label: 'Consensus', desc: 'Supervisor audit' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setCollabMode(m.id as any)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${collabMode === m.id ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-200' : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-400'}`}
                    >
                      <div className="text-xs font-bold">{m.label}</div>
                      <div className="text-[8px] text-neutral-500 mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt triggering action */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
                <h4 className="text-[11px] font-bold text-neutral-300">Collaborating Team:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">AI Recruiter</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">AI Project Manager</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] bg-violet-500/10 text-violet-400 border border-violet-500/20">AI Career Coach</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20">AI Hiring Advisor</span>
                </div>
                <button
                  onClick={triggerMultiAgentCollab}
                  disabled={isCollabActive}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  {isCollabActive ? 'Negotiating Consensus...' : 'Execute Multi-Agent Synthesis Loop'}
                </button>
              </div>

              {/* Follow-up reminder scheduler */}
              <form onSubmit={handleAddFollowUp} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
                <h4 className="text-[11px] font-bold text-neutral-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> Auto-Schedule Dialogue Follow-up
                </h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="e.g. Schedule checking code plagiarism score"
                    value={followUpText}
                    onChange={(e) => setFollowUpText(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-neutral-500">Delay Interval:</span>
                    <select
                      value={followUpDelayMin}
                      onChange={(e) => setFollowUpDelayMin(Number(e.target.value))}
                      className="bg-neutral-900 border border-neutral-800 rounded p-1 text-[10px]"
                    >
                      <option value={10}>10 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={60}>1 Hour</option>
                      <option value={1440}>1 Day</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!followUpText.trim()}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-semibold text-xs rounded-xl border border-neutral-800 hover:border-neutral-700 cursor-pointer"
                >
                  Schedule Follow-up Daemon
                </button>
              </form>
            </div>

            {/* Transcription Console */}
            <div className="lg:col-span-7 bg-neutral-900/20 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between h-[550px]">
              <div>
                <h3 className="text-xs font-bold text-neutral-300">Live Synthesis Transcript</h3>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  Real-time consensus negotiation transcript of collaborating agent entities
                </p>
              </div>

              {/* Transcript list */}
              <div className="flex-1 my-4 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
                {collabTranscript.map((tr, idx) => (
                  <div key={idx} className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                    <div className="flex items-center justify-between border-b border-neutral-900 pb-1.5 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span className="text-[11px] font-bold text-neutral-300">{tr.agent}</span>
                        <span className="text-[9px] text-neutral-500">({tr.role})</span>
                      </div>
                      <span className="text-[9px] font-mono text-neutral-500">{tr.time}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">{tr.text}</p>
                  </div>
                ))}
                {collabTranscript.length === 0 && (
                  <div className="text-center py-20 text-xs text-neutral-500 italic">
                    Press "Execute Multi-Agent Synthesis Loop" to populate simulated synthesis thread.
                  </div>
                )}
              </div>

              {/* Consensus verified stamp */}
              <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-400">
                <span className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4.5 h-4.5" /> Consensus Protocol Status:
                </span>
                <span className="font-mono font-bold">READY_TO_DISPATCH (v8.0)</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: CONVERSATION ANALYTICS */}
        {activeSubTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Average Response Time Bar Chart */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-neutral-300 mb-4">Dialogue Response Latencies</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Recruiter', LatencyMs: 45 },
                        { name: 'PM Agent', LatencyMs: 82 },
                        { name: 'Career Coach', LatencyMs: 38 },
                        { name: 'Hiring Advisor', LatencyMs: 95 },
                        { name: 'Fraud Det', LatencyMs: 120 }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="name" stroke="#737373" style={{ fontSize: 9 }} />
                      <YAxis stroke="#737373" style={{ fontSize: 9 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040' }} />
                      <Bar dataKey="LatencyMs" fill="#818cf8" radius={[4, 4, 0, 0]}>
                        <Cell fill="#10b981" />
                        <Cell fill="#6366f1" />
                        <Cell fill="#8b5cf6" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#f43f5e" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-[10px] text-center text-neutral-500 mt-1">Average response millisecond metric per agent entity</div>
              </div>

              {/* Sentiment ratio over time Area Chart */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-neutral-300 mb-4">Dialogue Sentiment Over Time</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { day: 'Mon', Positive: 82, Neutral: 12, Negative: 6 },
                        { day: 'Tue', Positive: 88, Neutral: 10, Negative: 2 },
                        { day: 'Wed', Positive: 85, Neutral: 11, Negative: 4 },
                        { day: 'Thu', Positive: 79, Neutral: 15, Negative: 6 },
                        { day: 'Fri', Positive: 91, Neutral: 7, Negative: 2 }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="day" stroke="#737373" style={{ fontSize: 9 }} />
                      <YAxis stroke="#737373" style={{ fontSize: 9 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040' }} />
                      <Area type="monotone" dataKey="Positive" stroke="#10b981" fill="#10b981" fillOpacity={0.05} />
                      <Area type="monotone" dataKey="Neutral" stroke="#6366f1" fill="#6366f1" fillOpacity={0.05} />
                      <Area type="monotone" dataKey="Negative" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.05} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-[10px] text-center text-neutral-500 mt-1">Sentiment distribution (%) tracked across student/company dialogues</div>
              </div>

              {/* Intent breakdown Donut */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-neutral-300">Dialogue Intent Distribution</h3>
                </div>
                <div className="h-40 flex items-center justify-center my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Career coaching', value: 45, color: '#6366f1' },
                          { name: 'Project Milestone', value: 25, color: '#10b981' },
                          { name: 'Hiring Agreement', value: 20, color: '#f59e0b' },
                          { name: 'Fraud Investigation', value: 10, color: '#f43f5e' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#6366f1" />
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#f43f5e" />
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-indigo-500" />
                    <span className="text-neutral-400">Career (45%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-emerald-500" />
                    <span className="text-neutral-400">Milestone (25%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-amber-500" />
                    <span className="text-neutral-400">Hiring (20%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-rose-500" />
                    <span className="text-neutral-400">Fraud (10%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Dialogue Volume Stats */}
            <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Cumulative Session Volume', val: '4,812,092', change: '+24.1% MoM', color: 'text-indigo-400' },
                { label: 'Successful Transfer Rate', val: '99.82%', change: 'Zero context loss', color: 'text-emerald-400' },
                { label: 'Token Reduction Factor', val: '84.2%', change: 'Dynamic memory caching', color: 'text-cyan-400' },
                { label: 'Handoff Resolution Latency', val: '1.2s', change: 'Stateless handover', color: 'text-purple-400' }
              ].map((s, idx) => (
                <div key={idx} className="space-y-1 border-l border-neutral-800 pl-4">
                  <div className="text-[10px] uppercase font-bold text-neutral-500">{s.label}</div>
                  <div className={`text-xl font-extrabold ${s.color}`}>{s.val}</div>
                  <div className="text-[9px] text-neutral-400">{s.change}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 5: IMMUTABLE AUDIT TRAIL */}
        {activeSubTab === 'audit' && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Search filter for audits */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xs font-bold text-neutral-300">Cryptographically Signed Dialogue Audit Log</h3>
                  <p className="text-[10px] text-neutral-500">
                    Irreversible validation audits mapping matching signatures, memory revisions, and safety flags.
                  </p>
                </div>
                
                {/* Search query box */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search by ID, Agent, action..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-1.5 text-xs text-neutral-300 focus:outline-none placeholder-neutral-500"
                  />
                </div>
              </div>

              {/* Table of audits */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 uppercase text-[9px] tracking-wider font-mono">
                      <th className="pb-3 pl-2">Audit ID / Conversation</th>
                      <th className="pb-3">Executing Agent</th>
                      <th className="pb-3">Classified Intent</th>
                      <th className="pb-3">Vetted Versions</th>
                      <th className="pb-3">Pipeline Actions Checked</th>
                      <th className="pb-3">Decision Summary</th>
                      <th className="pb-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {audits.map(ad => (
                      <tr key={ad.id} className="hover:bg-neutral-900/30 transition-all font-mono">
                        <td className="py-3.5 pl-2">
                          <span className="font-bold text-indigo-400 block">{ad.id}</span>
                          <span className="text-[10px] text-neutral-500">{ad.conversationId}</span>
                        </td>
                        <td className="py-3.5 text-neutral-200">
                          {ad.agentId}
                        </td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 font-bold text-[9px]">
                            {ad.intent}
                          </span>
                        </td>
                        <td className="py-3.5 text-[10px] text-neutral-400">
                          <div>KNL: {ad.knowledgeVersion}</div>
                          <div>MEM: {ad.memoryVersion}</div>
                          <div>PRMPT: {ad.promptVersion}</div>
                        </td>
                        <td className="py-3.5">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {ad.actionsEvaluated.map((ac, idx) => (
                              <span key={idx} className="bg-neutral-950 border border-neutral-800 text-neutral-400 px-1 py-0.5 rounded text-[8px]">
                                {ac}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 text-neutral-300 text-[10px] max-w-xs leading-normal font-sans">
                          {ad.summary}
                        </td>
                        <td className="py-3.5 text-[10px] text-neutral-500 font-bold">
                          {new Date(ad.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: DATABASE REGISTRIES */}
        {activeSubTab === 'schemas' && (
          <motion.div
            key="schemas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Database schema layout code block */}
            <div className="lg:col-span-7 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-neutral-300 mb-2 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-indigo-400" /> Relational SQL Registry Schema (Specification 8.0)
                </h3>
                <p className="text-[10px] text-neutral-500 mb-4">
                  Drizzle ORM definition schemas for conversation persistence, message tracking, RLS rules, and transfers.
                </p>
              </div>

              <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 overflow-x-auto font-mono text-[11px] leading-relaxed text-neutral-300">
                <pre>{`// src/db/schema.ts - Conversation Registry Models

export const conversations = pgTable('conversations', {
  id: varchar('id', { length: 64 }).primaryKey(),
  sessionId: varchar('session_id', { length: 64 }).notNull(),
  executionId: varchar('execution_id', { length: 64 }).notNull(),
  workflowId: varchar('workflow_id', { length: 64 }).notNull(),
  activeAgentId: varchar('active_agent_id', { length: 64 }).notNull(),
  language: varchar('language', { length: 32 }).default('English'),
  intent: varchar('intent', { length: 64 }),
  intentConfidence: integer('intent_confidence'),
  status: varchar('status', { length: 32 }).default('Created'),
  priority: varchar('priority', { length: 32 }).default('Medium'),
  startedAt: timestamp('started_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  summary: text('summary'),
  version: varchar('version', { length: 16 }).default('v1.0')
});

export const messages = pgTable('messages', {
  id: varchar('id', { length: 64 }).primaryKey(),
  conversationId: varchar('conversation_id').references(() => conversations.id),
  senderType: varchar('sender_type', { length: 32 }), // 'User' | 'AI' | 'System'
  senderName: varchar('sender_name', { length: 128 }),
  text: text('text').notNull(),
  timestamp: timestamp('timestamp').defaultNow(),
  sentiment: varchar('sentiment', { length: 32 }),
  sensitiveMasked: boolean('sensitive_masked').default(false),
  integritySignature: varchar('integrity_signature', { length: 256 }) // SHA256 integrity check
});

export const conversationTransfers = pgTable('conversation_transfers', {
  id: varchar('id', { length: 64 }).primaryKey(),
  conversationId: varchar('conversation_id').references(() => conversations.id),
  fromAgentId: varchar('from_agent_id', { length: 64 }),
  toAgentId: varchar('to_agent_id', { length: 64 }),
  contextPreserved: boolean('context_preserved').default(true),
  transferredAt: timestamp('transferred_at').defaultNow()
});`}</pre>
              </div>
            </div>

            {/* API Specification list on the right */}
            <div className="lg:col-span-5 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-neutral-300 mb-2">REST API Endpoint Playground</h3>
                <p className="text-[10px] text-neutral-500 mb-4">
                  Test and execute mock gateway interactions representing the Dialogue pipeline endpoints.
                </p>

                {/* API method selector */}
                <div className="grid grid-cols-2 gap-1.5 mb-4">
                  {[
                    { id: 'SEND_MESSAGE', label: 'POST Send Message' },
                    { id: 'SUMMARIZE', label: 'POST Summarize' },
                    { id: 'HANDOFF', label: 'POST Handoff' },
                    { id: 'TRIGGER_FOLLOWUP', label: 'POST Followup' }
                  ].map(ep => (
                    <button
                      key={ep.id}
                      onClick={() => setApiMethod(ep.id as any)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold text-left transition-all border cursor-pointer ${apiMethod === ep.id ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-400'}`}
                    >
                      {ep.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* API Response display */}
              <div className="flex-1 bg-neutral-950 rounded-xl border border-neutral-800 p-4 font-mono text-[10px] text-neutral-400 space-y-3">
                <div>
                  <span className="text-[9px] uppercase text-neutral-500 font-bold block">GATEWAY ROUTE</span>
                  <span className="text-indigo-400 text-xs font-semibold font-mono">{apiResponseJson?.endpoint}</span>
                </div>
                {apiResponseJson?.payload && (
                  <div>
                    <span className="text-[9px] uppercase text-neutral-500 font-bold block">PAYLOAD JSON</span>
                    <pre className="text-neutral-300 bg-neutral-900/40 p-1.5 rounded border border-neutral-900 overflow-x-auto max-w-sm">
                      {JSON.stringify(apiResponseJson?.payload, null, 2)}
                    </pre>
                  </div>
                )}
                <div>
                  <span className="text-[9px] uppercase text-neutral-500 font-bold block">RESPONSE METRIC</span>
                  <pre className="text-emerald-400 bg-neutral-900/40 p-1.5 rounded border border-neutral-900 overflow-x-auto max-w-sm">
                    {JSON.stringify(apiResponseJson?.response, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 7: TESTING SUITE */}
        {activeSubTab === 'testing' && (
          <motion.div
            key="testing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Automatic unit and integration testing module */}
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-xs font-bold text-neutral-300">Automated Enterprise Test Runner (Specification 8.0)</h3>
                  <p className="text-[10px] text-neutral-500">
                    Runs unit tests, latency load benchmarks, and cryptographic integrity sweeps.
                  </p>
                </div>

                <button
                  onClick={runSecurityTestSuite}
                  disabled={isTestSuiteRunning}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Terminal className="w-4 h-4" />
                  {isTestSuiteRunning ? 'Running Scans...' : 'Execute Enterprise Conversation Audit Scans'}
                </button>
              </div>

              {/* Console log box for testing */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 font-mono text-[11px] leading-relaxed text-neutral-300">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2 text-neutral-400">
                  <span>Dialogue Testing Console Logs</span>
                  <span className="text-[9px] uppercase text-indigo-400 font-bold">V8.0 COMPLIANT</span>
                </div>
                <div className="space-y-1 h-60 overflow-y-auto">
                  {testSuiteLogs.map((log, idx) => {
                    const isPass = log.includes('[PASS]');
                    const isHeader = log.includes('🚀') || log.includes('✅');
                    return (
                      <div
                        key={idx}
                        className={`${isPass ? 'text-emerald-400 font-bold' : isHeader ? 'text-indigo-300 font-bold' : 'text-neutral-400'}`}
                      >
                        {log}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
