import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Briefcase, 
  ChevronRight, 
  TrendingUp, 
  FileText, 
  PlusCircle, 
  Star, 
  HelpCircle, 
  Globe2,
  X,
  FileBadge
} from 'lucide-react';

interface LandingPageProps {
  onEnterPlatform: (role?: 'STUDENT' | 'COMPANY' | 'ADMIN') => void;
}

export default function LandingPage({ onEnterPlatform }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'student' | 'company'>('student');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = [
    { value: '1,420+', label: 'RMIT Verified Students', desc: 'RMIT University Vietnam' },
    { value: '120+', label: 'Verified Korean SMEs', desc: 'Gyeongbuk Province Partners' },
    { value: '480+', label: 'Completed Projects', desc: 'Objective evidence created' },
    { value: '94.6%', label: 'Hiring Success Rate', desc: 'After collaborative projects' }
  ];

  const faqs = [
    {
      question: "Why should we use KONEXA instead of a traditional internship?",
      answer: "Traditional internships often assign random support tasks without objective metrics. KONEXA operates on strict project-based weekly milestones. Each week, students submit high-quality code/designs, and companies evaluate them across 6 key metrics (Communication, Quality, etc.). This yields empirical, immutable collaboration data before any full-time hiring offer is made."
    },
    {
      question: "How are students from RMIT Vietnam verified?",
      answer: "Platform administrators manually review academic records, official English certifications (IELTS 7.5+ required), GitHub profiles, past portfolios, and an obligatory self-introduction video. Only verified students are accessible to Korean employers."
    },
    {
      question: "How does the matching process work?",
      answer: "Companies define a project with weekly deliverables. Our AI analyze requirements against student profiles and alerts qualified candidates. Students apply with targeted answers, and companies can review actual portfolios before choosing a candidate."
    },
    {
      question: "Are there fees associated with the platform?",
      answer: "Students join 100% free. Companies pay a structured Project Management Fee to guarantee weekly milestones, followed by a standard Hiring Success Fee when confirming full-time positions."
    }
  ];

  return (
    <div className="bg-neutral-950 text-white min-h-screen font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      {/* Premium Header */}
      <nav className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-sky-400 flex items-center justify-center shadow-lg shadow-emerald-500/15">
              <FileBadge className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="font-sans font-bold tracking-tight text-xl text-neutral-100">KONEXA</span>
              <div className="text-[9px] text-emerald-400 font-mono tracking-widest uppercase">Talent Validation</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-neutral-400 font-medium">
            <a href="#problem" className="hover:text-white transition-colors">The Problem</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-white transition-colors">Philosophy</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onEnterPlatform()} 
              className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs px-4 py-2.5 rounded-lg transition-all"
            >
              Log In
            </button>
            <button 
              onClick={() => onEnterPlatform('STUDENT')} 
              className="bg-gradient-to-r from-emerald-400 to-emerald-500 hover:brightness-110 text-black font-semibold text-xs px-5 py-2.5 rounded-lg shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-24 pb-20 px-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Connecting RMIT University Vietnam with Korean SMEs
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-100 max-w-4xl mx-auto leading-[1.1] mb-6 font-sans"
          >
            Don't Hire First.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
              Work Together First.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Resumes cannot represent a person's real ability. KONEXA enables global companies and elite international students to build objective trust through actual project collaboration before employment.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => onEnterPlatform('STUDENT')} 
              className="w-full sm:w-auto px-8 py-4 bg-emerald-400 hover:bg-emerald-300 text-black font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all text-sm"
            >
              Join as RMIT Student <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onEnterPlatform('COMPANY')} 
              className="w-full sm:w-auto px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
            >
              Verify Your Company <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </button>
          </motion.div>
        </div>

        {/* Live Statistics */}
        <div className="max-w-7xl mx-auto px-6 mt-28">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-2xl bg-neutral-900/40 border border-neutral-900 backdrop-blur-sm"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center lg:text-left border-r last:border-0 border-neutral-900/60 pr-4 last:pr-0">
                <div className="text-3xl md:text-4xl font-extrabold text-neutral-100 tracking-tight font-mono mb-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-neutral-200">{stat.label}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{stat.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* Philosophy & Comparison */}
      <section id="problem" className="py-24 border-t border-neutral-900 bg-neutral-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-emerald-400 tracking-widest uppercase mb-3 font-mono">The Challenge</h2>
            <p className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-100">
              Why Traditional Global Recruitment Fails
            </p>
            <p className="text-neutral-400 mt-4 text-sm md:text-base">
              Hiring international talent over static resumes leads to high financial loss, cultural friction, and mismatching deliverables.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Traditional way */}
            <div className="p-8 rounded-2xl bg-neutral-900/20 border border-neutral-900 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-red-500 text-sm font-bold uppercase font-mono px-2.5 py-1 bg-red-950/60 rounded-full border border-red-900">
                    Traditional Recruitment
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-neutral-300">Decisions Guided by Assumptions</h3>
                <ul className="space-y-4 text-sm text-neutral-400">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 mt-1 font-bold">✕</span>
                    <span>Resumes packed with exaggerated skills and unverified certificates.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 mt-1 font-bold">✕</span>
                    <span>No actual visibility on communication responsiveness or work ethic.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 mt-1 font-bold">✕</span>
                    <span>High failure costs (SMEs lose over $30,000 USD for a bad global hire).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 mt-1 font-bold">✕</span>
                    <span>Students lack professional international portfolios to prove execution.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-neutral-900 text-xs text-neutral-500 italic">
                Result: High anxiety, high failure rate, missed global opportunities.
              </div>
            </div>

            {/* KONEXA way */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-emerald-500/20 relative overflow-hidden flex flex-col justify-between shadow-xl shadow-emerald-950/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-emerald-400 text-sm font-bold uppercase font-mono px-2.5 py-1 bg-emerald-950/60 rounded-full border border-emerald-900">
                    The KONEXA Standard
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-neutral-200">Decisions Driven by Real Performance Data</h3>
                <ul className="space-y-4 text-sm text-neutral-300">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span><strong>1-Month Guided Projects</strong> representing real-world SME business requirements.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span><strong>Weekly Milestones</strong> with clear delivery timelines.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span><strong>Empirical Evaluations</strong> across Communication, Speed, Quality, and Problem Solving.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span><strong>Trust Before Hiring</strong>: Employers confirm employment after working together.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-neutral-900 text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 animate-bounce" /> Evidence-based validation removes 98% of HR hiring risk.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-neutral-900/10 border-t border-neutral-900 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-emerald-400 tracking-widest uppercase mb-3 font-mono">The Flow</h2>
            <p className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-100">
              The Path to Verified Hiring
            </p>
            <p className="text-neutral-400 mt-3 text-sm">
              We orchestrate collaboration step-by-step, collecting objective metrics along the way.
            </p>

            <div className="flex items-center justify-center gap-2 mt-8 p-1 rounded-lg bg-neutral-900 max-w-xs mx-auto border border-neutral-800">
              <button 
                onClick={() => setActiveTab('student')} 
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${activeTab === 'student' ? 'bg-emerald-400 text-black' : 'text-neutral-400 hover:text-white'}`}
              >
                For RMIT Students
              </button>
              <button 
                onClick={() => setActiveTab('company')} 
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${activeTab === 'company' ? 'bg-emerald-400 text-black' : 'text-neutral-400 hover:text-white'}`}
              >
                For Korean SMEs
              </button>
            </div>
          </div>

          {activeTab === 'student' ? (
            <div className="grid md:grid-cols-4 gap-6 relative">
              {[
                { step: '01', title: 'Admin Verification', desc: 'Complete profile. Administrators manually verify your English level, GitHub, and academic portfolio.' },
                { step: '02', title: 'Apply to Projects', desc: 'Browse matched projects posted by verified Korean companies and submit custom proposals.' },
                { step: '03', title: 'Weekly Deliverables', desc: 'Submit weekly goals, files, and progress reflections. Receive structured grades from mentors.' },
                { step: '04', title: 'Direct SME Hiring', desc: 'Successfully complete the project. Your performance data unlocks immediate employment channels.' }
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 relative group hover:border-emerald-500/30 transition-all">
                  <div className="text-xs font-mono font-bold text-emerald-400 mb-4">{item.step}</div>
                  <h3 className="text-lg font-bold mb-2 text-neutral-200">{item.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-6 relative">
              {[
                { step: '01', title: 'SME Approval', desc: 'Register with business licenses. We verify your company’s global readiness and hiring purpose.' },
                { step: '02', title: 'Create Weekly Goals', desc: 'Post a 4-week validation project outlining specific deliverables and technical skill tags.' },
                { step: '03', title: 'Monitor Progress', desc: 'Review weekly commits and submissions. Rate performance metrics directly on our dashboard.' },
                { step: '04', title: 'Hire with Certainty', desc: 'View cumulative rating charts. Hire candidates immediately based on verified empirical data.' }
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 relative group hover:border-emerald-500/30 transition-all">
                  <div className="text-xs font-mono font-bold text-sky-400 mb-4">{item.step}</div>
                  <h3 className="text-lg font-bold mb-2 text-neutral-200">{item.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Philosophies & Benefits */}
      <section id="benefits" className="py-24 bg-neutral-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-emerald-400 tracking-widest uppercase mb-3 font-mono">Platform Philosophy</h2>
            <p className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-100">
              Operating System for Global Talent Mobility
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-900">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-neutral-200 mb-3">Verification Over Search</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                We believe in curation. We do not support mass spamming of profiles. Every single student and SME goes through strict verification to ensure professional communication and execution capability.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-900">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-xl font-bold text-neutral-200 mb-3">Work-Based Credibility</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Traditional platforms sell resumes. We sell validated collaboration history. Every project is archived with weekly file uploads, reflections, and mentor evaluations, creating a living technical passport.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-900/30 border border-neutral-900">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
                <Globe2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-neutral-200 mb-3">Removing Borders Safely</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Our ecosystem handles communication scaffolding and weekly alignment check-ins, allowing Korean SMEs to confidently engage global developers in Vietnam with zero administrative overhead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-24 border-t border-neutral-900 bg-neutral-950 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-emerald-400 tracking-widest uppercase mb-3 font-mono">Got Questions?</h2>
            <p className="text-3xl md:text-4xl font-bold text-neutral-100">Frequently Asked Questions</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-neutral-900 rounded-xl bg-neutral-900/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-6 flex justify-between items-center hover:bg-neutral-900/30 transition-colors"
                >
                  <span className="font-semibold text-neutral-200 text-sm md:text-base">{faq.question}</span>
                  <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform ${openFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-sm text-neutral-400 border-t border-neutral-900 leading-relaxed bg-neutral-950/20">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conversion / Call to Action */}
      <section className="py-24 border-t border-neutral-900 bg-neutral-900/10 relative">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="p-12 md:p-16 rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl" />

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-100 mb-6">
              Ready to build trust?
            </h2>
            <p className="text-neutral-400 text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Step into the operating system for global collaborative recruitment. Join thousands of RMIT students and Korean SME mentors working together.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => onEnterPlatform('STUDENT')} 
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-black font-semibold rounded-lg text-sm transition-all"
              >
                Join as Student
              </button>
              <button 
                onClick={() => onEnterPlatform('COMPANY')} 
                className="w-full sm:w-auto px-8 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 rounded-lg text-sm transition-all"
              >
                Register Your SME
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-black py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-400 flex items-center justify-center">
              <FileBadge className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold tracking-tight text-neutral-200">KONEXA</span>
          </div>

          <p className="text-xs text-neutral-500">
            © 2026 KONEXA Platform. Designed for Gyeongbuk Province SMEs & RMIT University Vietnam. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
            <span className="text-neutral-700">|</span>
            <span className="cursor-pointer hover:text-white transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
