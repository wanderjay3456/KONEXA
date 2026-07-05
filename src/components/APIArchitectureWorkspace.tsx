import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Key, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Layers, 
  Globe, 
  Search, 
  Check, 
  ArrowRight, 
  Sliders, 
  Clock, 
  AlertTriangle, 
  Database,
  Lock,
  ChevronRight,
  Sparkles,
  Info,
  BookOpen,
  FileBadge,
  RefreshCw,
  Eye,
  Share2,
  SlidersHorizontal,
  FileCode2,
  CheckCircle,
  HelpCircle,
  Hash
} from 'lucide-react';

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  purpose: string;
  authRequired: boolean;
  permissions: string[];
  rateLimit: string;
  parameters: { name: string; type: string; required: boolean; desc: string }[];
  successResponse: any;
  errorResponses: { status: number; code: string; message: string; details?: any }[];
}

const apiEndpoints: { [category: string]: APIEndpoint[] } = {
  authentication: [
    {
      method: 'POST',
      path: '/api/v1/auth/register',
      purpose: 'Register student or corporate profiles with unified credentials.',
      authRequired: false,
      permissions: ['PUBLIC'],
      rateLimit: '5 requests / min',
      parameters: [
        { name: 'email', type: 'string', required: true, desc: 'Verified university or corporate email.' },
        { name: 'password', type: 'string', required: true, desc: 'Min 8 chars, 1 upper, 1 lower, 1 number.' },
        { name: 'role', type: 'string', required: true, desc: 'STUDENT or COMPANY user type.' }
      ],
      successResponse: {
        success: true,
        data: {
          user_id: '8fbd92d1-7c93-4e6c-a29d-421739c90be1',
          email: 'student@rmit.edu.vn',
          role: 'STUDENT',
          status: 'PENDING_VERIFICATION'
        },
        metadata: {
          timestamp: '2026-07-04T04:00:00Z',
          request_id: 'req_auth_reg_89a01f'
        }
      },
      errorResponses: [
        { status: 409, code: 'CONFLICT_EMAIL_EXISTS', message: 'The submitted email is already registered on the ledger.' }
      ]
    },
    {
      method: 'POST',
      path: '/api/v1/auth/login',
      purpose: 'Generate secure JWT Access Tokens and HttpOnly Refresh Tokens.',
      authRequired: false,
      permissions: ['PUBLIC'],
      rateLimit: '10 requests / min',
      parameters: [
        { name: 'email', type: 'string', required: true, desc: 'Registered user email address.' },
        { name: 'password', type: 'string', required: true, desc: 'User password.' }
      ],
      successResponse: {
        success: true,
        data: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZmJkOTJkMSIsInJvbGUiOiJTVFVERU5UIiwiaWF0IjoxNzgxNTY4MDAwfQ...',
          token_type: 'Bearer',
          expires_in: 900,
          user: {
            id: '8fbd92d1-7c93-4e6c-a29d-421739c90be1',
            email: 'student@rmit.edu.vn',
            role: 'STUDENT'
          }
        },
        metadata: {
          timestamp: '2026-07-04T04:01:22Z',
          request_id: 'req_auth_log_41c2a0'
        }
      },
      errorResponses: [
        { status: 401, code: 'INVALID_CREDENTIALS', message: 'Check your email address or access password.' }
      ]
    }
  ],
  projects: [
    {
      method: 'POST',
      path: '/api/v1/projects',
      purpose: 'Submit a micro-assignment project brief for administrator verification.',
      authRequired: true,
      permissions: ['COMPANY_REPRESENTATIVE'],
      rateLimit: '15 requests / min',
      parameters: [
        { name: 'title', type: 'string', required: true, desc: 'Comprehensive task header.' },
        { name: 'requirements', type: 'string', required: true, desc: 'Technical specifications.' },
        { name: 'skills_required', type: 'array[string]', required: true, desc: 'Competency tags mapping.' },
        { name: 'duration_weeks', type: 'integer', required: true, desc: 'Target week count (typically 4).' },
        { name: 'compensation_usd', type: 'number', required: true, desc: 'Milestone payout.' }
      ],
      successResponse: {
        success: true,
        data: {
          project_id: 'prj_cf910d2a-4819-482a-a9f2-29df3019abff',
          creator_id: 'comp_89f1d2a1',
          status: 'PENDING_APPROVAL',
          created_at: '2026-07-04T04:02:50Z'
        },
        metadata: {
          timestamp: '2026-07-04T04:02:50Z',
          request_id: 'req_prj_new_901c0b'
        }
      },
      errorResponses: [
        { status: 403, code: 'FORBIDDEN_UNVERIFIED_COMPANY', message: 'Your business registration must be verified before posting assignment briefs.' }
      ]
    },
    {
      method: 'GET',
      path: '/api/v1/projects/search',
      purpose: 'Query active micro-assignments using multi-tier parameters & indexing.',
      authRequired: true,
      permissions: ['STUDENT', 'COMPANY', 'ADMIN'],
      rateLimit: '60 requests / min',
      parameters: [
        { name: 'query', type: 'string', required: false, desc: 'Keyword text matching titles/requirements.' },
        { name: 'skills', type: 'string', required: false, desc: 'Comma-separated skill requirements.' },
        { name: 'page', type: 'integer', required: false, desc: 'Pagination pointer.' },
        { name: 'limit', type: 'integer', required: false, desc: 'Items per result set.' }
      ],
      successResponse: {
        success: true,
        data: [
          {
            project_id: 'prj_cf910d2a-4819-482a-a9f2-29df3019abff',
            title: 'Global SME Supply Chain API Integrator',
            company_name: 'Gyeongbuk Logistics Group',
            compensation_usd: 1200.00,
            duration_weeks: 4,
            skills_required: ['TypeScript', 'Express', 'PostgreSQL']
          }
        ],
        pagination: {
          current_page: 1,
          total_pages: 5,
          total_items: 48,
          limit: 10
        },
        metadata: {
          timestamp: '2026-07-04T04:03:15Z',
          request_id: 'req_prj_sch_78d0f1'
        }
      },
      errorResponses: []
    }
  ],
  ai_matching: [
    {
      method: 'GET',
      path: '/api/v1/ai/matching/students',
      purpose: 'Generate candidate recommendations using dynamic alignment mapping.',
      authRequired: true,
      permissions: ['COMPANY_REPRESENTATIVE', 'ADMIN'],
      rateLimit: '30 requests / min',
      parameters: [
        { name: 'project_id', type: 'uuid', required: true, desc: 'The target project needing matches.' },
        { name: 'min_confidence', type: 'number', required: false, desc: 'Alignment threshold.' }
      ],
      successResponse: {
        success: true,
        data: [
          {
            student_id: 'stud_89fb02c1',
            student_name: 'Nguyen Minh Anh',
            confidence_score: 0.965,
            matching_factors: {
              major_match: true,
              skills_overlap: ['TypeScript', 'Express'],
              timezone_align: 'KST_ICT_Overlap'
            },
            explanation: 'This student is highly recommended because they completed similar RMIT micro-assignments on time and have a 98% trust index score.'
          }
        ],
        metadata: {
          timestamp: '2026-07-04T04:04:10Z',
          request_id: 'req_ai_match_11b90a'
        }
      },
      errorResponses: [
        { status: 404, code: 'PROJECT_NOT_FOUND', message: 'Could not resolve reference parameters.' }
      ]
    }
  ],
  weekly_workflow: [
    {
      method: 'POST',
      path: '/api/v1/weekly/submissions',
      purpose: 'Upload objective task deliverables before deadline schedules.',
      authRequired: true,
      permissions: ['STUDENT'],
      rateLimit: '10 requests / min',
      parameters: [
        { name: 'goal_id', type: 'uuid', required: true, desc: 'Linked goal.' },
        { name: 'deliverables_url', type: 'string', required: true, desc: 'GitHub Pull Request or file metadata link.' },
        { name: 'comments', type: 'string', required: false, desc: 'Brief description of changes.' }
      ],
      successResponse: {
        success: true,
        data: {
          submission_id: 'sub_38fd29da-411a-4299',
          submitted_at: '2026-07-04T04:05:33Z',
          status: 'PENDING_EVALUATION',
          is_on_time: true
        },
        metadata: {
          timestamp: '2026-07-04T04:05:33Z',
          request_id: 'req_week_sub_a08c11'
        }
      },
      errorResponses: [
        { status: 400, code: 'DEADLINE_EXPIRED', message: 'The milestone submission timeframe has closed.' }
      ]
    }
  ],
  reviews: [
    {
      method: 'POST',
      path: '/api/v1/reviews',
      purpose: 'Submit immutable post-project rating evaluation scorecards.',
      authRequired: true,
      permissions: ['STUDENT', 'COMPANY_REPRESENTATIVE'],
      rateLimit: '5 requests / min',
      parameters: [
        { name: 'project_id', type: 'uuid', required: true, desc: 'Context assignment ID.' },
        { name: 'reviewee_id', type: 'uuid', required: true, desc: 'Subject (Foreign Key mapping).' },
        { name: 'rating_score', type: 'integer', required: true, desc: 'Value integer from 1 to 5.' },
        { name: 'written_feedback', type: 'string', required: true, desc: 'Constructive narrative.' }
      ],
      successResponse: {
        success: true,
        data: {
          review_id: 'rev_90f23da1-4478',
          is_immutable: true,
          recorded_at: '2026-07-04T04:06:45Z'
        },
        metadata: {
          timestamp: '2026-07-04T04:06:45Z',
          request_id: 'req_rev_imm_88d9c1'
        }
      },
      errorResponses: [
        { status: 409, code: 'REVIEW_ALREADY_EXISTS', message: 'You have already recorded your immutable scorecard for this project context.' }
      ]
    }
  ]
};

export default function APIArchitectureWorkspace() {
  const [selectedCategory, setSelectedCategory] = useState<string>('authentication');
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint>(apiEndpoints.authentication[0]);
  
  // Interactive API Client Simulator states
  const [clientQueryParam, setClientQueryParam] = useState<string>('');
  const [clientIsLoading, setClientIsLoading] = useState<boolean>(false);
  const [clientResponse, setClientResponse] = useState<any>(null);
  const [clientStatusCode, setClientStatusCode] = useState<number | null>(null);
  const [simulationDelay, setSimulationDelay] = useState<number>(800);
  const [simulatedToken, setSimulatedToken] = useState<string>('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZmJkOTJkMSIsInJvbGUiOiJTVFVERU5UIiwiaWF0IjoxNzgxNTY4MDAwfQ...');
  const [clientSelectedResponse, setClientSelectedResponse] = useState<'success' | 'error_0'>('success');

  // Interactive Endpoint Tester Execution
  const triggerMockAPICall = () => {
    setClientIsLoading(true);
    setClientResponse(null);
    setClientStatusCode(null);

    setTimeout(() => {
      setClientIsLoading(false);
      if (clientSelectedResponse === 'success') {
        setClientStatusCode(200);
        // Deep copy success response and append query parameter changes if search is selected
        let res = { ...selectedEndpoint.successResponse };
        if (selectedEndpoint.path.includes('search') && clientQueryParam) {
          res.data = [{
            ...res.data[0],
            title: `Query: ${clientQueryParam} - ${res.data[0].title}`
          }];
        }
        setClientResponse(res);
      } else {
        const errorTemplate = selectedEndpoint.errorResponses[0] || { status: 400, code: 'BAD_REQUEST', message: 'Generic constraint validation failed.' };
        setClientStatusCode(errorTemplate.status);
        setClientResponse({
          success: false,
          error: {
            code: errorTemplate.code,
            message: errorTemplate.message,
            timestamp: new Date().toISOString(),
            request_id: `req_err_${Math.random().toString(36).substring(7)}`
          }
        });
      }
    }, simulationDelay);
  };

  // Keep endpoint selections in sync
  const selectCategoryHandler = (cat: string) => {
    setSelectedCategory(cat);
    const defaults = apiEndpoints[cat][0];
    setSelectedEndpoint(defaults);
    setClientResponse(null);
    setClientStatusCode(null);
    setClientSelectedResponse('success');
  };

  const selectEndpointHandler = (ep: APIEndpoint) => {
    setSelectedEndpoint(ep);
    setClientResponse(null);
    setClientStatusCode(null);
    setClientSelectedResponse('success');
  };

  return (
    <div className="space-y-6" id="api-architecture-workspace">
      
      {/* API Design Hero Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-950/20 via-neutral-900 to-neutral-950 border border-blue-900/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs uppercase tracking-wider font-mono">
            <Terminal className="w-4 h-4 text-blue-400" /> Phase 8 Backend Engine & REST Specifications
          </div>
          <h2 className="text-xl md:text-2xl font-black text-neutral-100 tracking-tight">Backend API Architecture</h2>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            The complete, production-ready REST API design ledger for KONEXA. Every endpoint maps strictly to transaction requirements, implementing standardized JSON envelopes, strict versioning, secure JWT workflows, and granular Role-Based Access Control.
          </p>
        </div>
      </div>

      {/* Main Grid: Endpoint Explorer on the Left, Live Sandbox Playground on the Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (Width: 5): API Category and Endpoint Tree */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Module Selector */}
          <div className="p-6 rounded-3xl bg-neutral-900/30 border border-neutral-900 space-y-3.5">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">Endpoint Category Grouping</h3>
              <p className="text-[10px] text-neutral-500">Structured REST APIs separating concerns cleanly</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'authentication', label: 'Auth & JWT Key' },
                { id: 'projects', label: 'Micro-Assignments' },
                { id: 'ai_matching', label: 'AI Match Engine' },
                { id: 'weekly_workflow', label: 'Weekly Deliverables' },
                { id: 'reviews', label: 'Immutable Scorecard' }
              ].map(cat => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => selectCategoryHandler(cat.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-neutral-950 text-blue-400 border-neutral-850 shadow-md font-black' 
                        : 'text-neutral-500 bg-neutral-950/20 border-neutral-950/40 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Endpoint List Tree */}
          <div className="p-6 rounded-3xl bg-neutral-900/30 border border-neutral-900 space-y-4">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">Target Resource Endpoints</h3>
              <p className="text-[10px] text-neutral-500">Inspect path signatures, required security scopes, and payloads</p>
            </div>

            <div className="space-y-2">
              {apiEndpoints[selectedCategory].map((ep, idx) => {
                const isSelected = selectedEndpoint.path === ep.path;
                const methodColor = 
                  ep.method === 'GET' ? 'text-blue-400 bg-blue-950/40 border-blue-900/20' :
                  ep.method === 'POST' ? 'text-emerald-400 bg-emerald-950/40 border-emerald-900/20' :
                  ep.method === 'PUT' ? 'text-orange-400 bg-orange-950/40 border-orange-900/20' :
                  'text-red-400 bg-red-950/40 border-red-900/20';

                return (
                  <button
                    key={idx}
                    onClick={() => selectEndpointHandler(ep)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col gap-2 cursor-pointer ${
                      isSelected 
                        ? 'bg-neutral-950 border-blue-500/20 shadow-xl' 
                        : 'bg-neutral-950/20 border-neutral-950/40 hover:bg-neutral-900/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-black border ${methodColor}`}>
                          {ep.method}
                        </span>
                        <span className={`text-xs font-mono font-bold ${isSelected ? 'text-neutral-100' : 'text-neutral-400'}`}>
                          {ep.path}
                        </span>
                      </div>
                      {ep.authRequired ? (
                        <Lock className="w-3.5 h-3.5 text-neutral-500" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-blue-400/80" />
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-500 leading-normal">{ep.purpose}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secure Headers Reference Card */}
          <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-3.5">
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black block">Standard Request Headers Matrix</span>
            <div className="space-y-2 text-xs font-mono">
              {[
                { k: 'Authorization', v: 'Bearer <AccessToken>', desc: 'Verifies verified student/SME identity.' },
                { k: 'Content-Type', v: 'application/json', desc: 'Default format standard.' },
                { k: 'X-RateLimit-Client', v: 'Automatic', desc: 'Calculated IP fingerprint scope.' }
              ].map((h, i) => (
                <div key={i} className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-900 flex justify-between items-center">
                  <div>
                    <span className="text-neutral-300 font-bold block">{h.k}</span>
                    <span className="text-[10px] text-neutral-500 block">{h.desc}</span>
                  </div>
                  <span className="text-[9px] text-blue-400 bg-blue-950/20 border border-blue-900/10 px-1.5 py-0.5 rounded font-black">{h.v}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Width: 7): Interactive API Client Sandbox */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Interactive Playground */}
          <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">REST API Client Sandbox</h3>
                <p className="text-[10px] text-neutral-500">Simulate request dispatches and verify real-time JSON format integrity</p>
              </div>

              {/* Toggle target responses */}
              <div className="flex bg-neutral-950 border border-neutral-850 rounded-xl p-0.5">
                <button
                  onClick={() => setClientSelectedResponse('success')}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1.5 ${
                    clientSelectedResponse === 'success' ? 'bg-neutral-900 text-emerald-400' : 'text-neutral-500'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Success (200 OK)
                </button>
                <button
                  onClick={() => setClientSelectedResponse('error_0')}
                  disabled={selectedEndpoint.errorResponses.length === 0}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1.5 disabled:opacity-40 ${
                    clientSelectedResponse === 'error_0' ? 'bg-neutral-900 text-red-400' : 'text-neutral-500'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Error Case
                </button>
              </div>
            </div>

            {/* Input params builder */}
            <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-900 space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-black border ${
                  selectedEndpoint.method === 'GET' ? 'text-blue-400 bg-blue-950/40 border-blue-900/20' : 'text-emerald-400 bg-emerald-950/40'
                }`}>
                  {selectedEndpoint.method}
                </span>
                <span className="text-xs font-mono font-bold text-neutral-200">
                  {selectedEndpoint.path}
                </span>
              </div>

              {/* Dynamic Query Param or Request Body Mock fields */}
              <div className="space-y-3.5">
                {selectedEndpoint.parameters.map((param, pIdx) => (
                  <div key={pIdx} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono">
                      <div className="flex items-center gap-1">
                        <span className="text-neutral-300 font-bold">{param.name}</span>
                        {param.required && <span className="text-red-400">*required</span>}
                      </div>
                      <span className="text-neutral-500">{param.type}</span>
                    </div>

                    {param.name === 'query' ? (
                      <input 
                        type="text"
                        value={clientQueryParam}
                        onChange={(e) => setClientQueryParam(e.target.value)}
                        placeholder="Search text (e.g. Supply Chain)"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 outline-none focus:border-blue-500"
                      />
                    ) : (
                      <div className="w-full bg-neutral-900/40 border border-neutral-900 rounded-xl px-3 py-2 text-xs text-neutral-500 italic">
                        {param.desc}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Auth Header Toggle */}
              {selectedEndpoint.authRequired && (
                <div className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-850 space-y-1.5 font-mono text-[10px]">
                  <span className="text-neutral-400 font-bold flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-blue-400" /> Bearer JWT Auth Token Attached</span>
                  <input 
                    type="text"
                    value={simulatedToken}
                    onChange={(e) => setSimulatedToken(e.target.value)}
                    className="w-full bg-neutral-950 text-neutral-400 border border-neutral-850 rounded px-2 py-1 text-[9px] outline-none"
                  />
                </div>
              )}

              {/* Dispatch Action Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={triggerMockAPICall}
                  disabled={clientIsLoading}
                  className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-black font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {clientIsLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Dispatching API Request...
                    </>
                  ) : (
                    <>
                      Execute API Request <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
                  <span>Simulated Delay:</span>
                  <select 
                    value={simulationDelay}
                    onChange={(e) => setSimulationDelay(Number(e.target.value))}
                    className="bg-neutral-900 border border-neutral-850 rounded px-1.5 py-0.5"
                  >
                    <option value={100}>100ms (Local CDN)</option>
                    <option value={800}>800ms (KST Global)</option>
                    <option value={2000}>2000ms (Slow WAN)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* API Client response ledger output */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-neutral-500 uppercase tracking-widest font-black">JSON Response Envelope</span>
                {clientStatusCode && (
                  <span className={`font-bold px-2 py-0.5 rounded-full border ${
                    clientStatusCode === 200 
                      ? 'text-emerald-400 bg-emerald-950/40 border-emerald-900/30' 
                      : 'text-red-400 bg-red-950/40 border-red-900/30'
                  }`}>
                    HTTP Status: {clientStatusCode}
                  </span>
                )}
              </div>

              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-900 font-mono text-[11px] leading-relaxed overflow-x-auto text-neutral-300 max-h-80 select-all">
                {clientIsLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-2 text-neutral-500">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                    <span>Resolving DNS, executing JWT decryption checks...</span>
                  </div>
                ) : clientResponse ? (
                  <pre>{JSON.stringify(clientResponse, null, 2)}</pre>
                ) : (
                  <div className="py-12 text-center text-neutral-500 italic">
                    Click "Execute API Request" above to view response envelopes matching real-time JWT validations.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Secure JWT Verification Architecture Spec Card */}
          <div className="p-6 rounded-3xl bg-neutral-900/20 border border-neutral-900 space-y-4">
            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-neutral-400">JWT Payload Verification Model (Sovereign Token Matrix)</h3>
              <p className="text-[10px] text-neutral-500">Role-Based Access is validated cryptographically without database queries</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 space-y-2">
                <span className="text-[9px] text-red-400 font-bold block">JWT HEADER</span>
                <pre className="text-[10px] text-neutral-400">
{`{
  "alg": "HS256",
  "typ": "JWT"
}`}
                </pre>
              </div>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 space-y-2">
                <span className="text-[9px] text-blue-400 font-bold block">JWT PAYLOAD (DECODED)</span>
                <pre className="text-[10px] text-neutral-400">
{`{
  "sub": "8fbd92d1-7c93-4e6c-a29d",
  "email": "student@rmit.edu.vn",
  "role": "STUDENT",
  "verification_status": "VERIFIED",
  "iat": 1781568000,
  "exp": 1781568900
}`}
                </pre>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
