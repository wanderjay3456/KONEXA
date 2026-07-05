import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  Globe2, 
  User, 
  Building2, 
  CheckCircle, 
  UploadCloud, 
  FileText, 
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Smartphone,
  Eye,
  EyeOff,
  UserCheck,
  X
} from 'lucide-react';
import { UserRole } from '../types';

interface AuthModuleProps {
  onSuccess: (role: UserRole, email: string, isVerified: boolean, customId: string) => void;
  onBackToLanding: () => void;
  initialRole?: 'STUDENT' | 'COMPANY' | 'ADMIN';
}

export default function AuthModule({ onSuccess, onBackToLanding, initialRole }: AuthModuleProps) {
  const [role, setRole] = useState<'STUDENT' | 'COMPANY' | 'ADMIN'>(initialRole || 'STUDENT');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration parameters
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [major, setMajor] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Simulation parameters
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);

  const handleOAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Let's sign in a realistic mock user based on selected role
      if (role === 'STUDENT') {
        onSuccess(UserRole.STUDENT, 'minh.anh@rmit.edu.vn', true, 'user_student_1');
      } else if (role === 'COMPANY') {
        onSuccess(UserRole.COMPANY, 'hiring@vuno.co.kr', true, 'user_company_1');
      } else {
        onSuccess(UserRole.ADMIN, 'admin@konexa.co', true, 'user_admin_1');
      }
    }, 1200);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Basic Validation
    if (!email) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Invalid email format. Must contain @.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password is too weak. Must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (isLogin) {
        // Mock Login checks
        if (role === 'ADMIN' && email !== 'admin@konexa.co') {
          setErrorMsg('Unauthorized admin credentials. Try admin@konexa.co');
          return;
        }

        // Simulating login
        let mockId = 'user_student_1';
        let verified = true;
        
        if (role === 'STUDENT') {
          if (email.toLowerCase().includes('huy')) {
            mockId = 'user_student_2';
            verified = false; // Huy is pending/unverified
          }
        } else if (role === 'COMPANY') {
          mockId = 'user_company_1';
          if (email.toLowerCase().includes('sensor') || email.toLowerCase().includes('gb')) {
            mockId = 'user_company_2';
            verified = false; // Sensor is pending
          }
        } else {
          mockId = 'user_admin_1';
        }

        onSuccess(
          role === 'STUDENT' ? UserRole.STUDENT : role === 'COMPANY' ? UserRole.COMPANY : UserRole.ADMIN,
          email,
          verified,
          mockId
        );
      } else {
        // Mock Registration
        if (role === 'STUDENT') {
          setSuccessMsg('Account created! A secure confirmation link has been sent to your RMIT email.');
          setShowVerificationForm(true);
        } else {
          if (!selectedFile) {
            setErrorMsg('Business Registration Certificate (.pdf) is mandatory to verify Korean SMEs.');
            return;
          }
          setSuccessMsg('Registration submitted! Our Admin Team will review your company business files within 12 hours.');
          setShowVerificationForm(true);
        }
      }
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      setTimeout(() => {
        setSelectedFile(file);
        setIsUploading(false);
      }, 1000);
    }
  };

  const verifyCodeAndProceed = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Move to completed state
      if (role === 'STUDENT') {
        onSuccess(UserRole.STUDENT, email || 'new.student@rmit.edu.vn', false, 'user_student_2');
      } else {
        onSuccess(UserRole.COMPANY, email || 'new.company@gb-sensor.co.kr', false, 'user_company_2');
      }
    }, 1000);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your registered email address first.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg('Password reset instructions successfully sent to your inbox.');
      setShowResetForm(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-neutral-900/60 border border-neutral-900 rounded-3xl p-8 backdrop-blur-md relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-[10px] text-emerald-400 font-mono uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure Authentication Portal
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome to KONEXA</h2>
          <p className="text-xs text-neutral-400 mt-1.5">
            {isLogin ? 'Sign in to access your validated talent workspace.' : 'Create your premium verified talent profile.'}
          </p>
        </div>

        {/* Account Quick Switcher (Highly requested for prototype testing) */}
        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 mb-6 text-center">
          <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-2 font-bold">
            💡 Quick Demo Accounts (No password required)
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button 
              onClick={() => {
                setRole('STUDENT');
                onSuccess(UserRole.STUDENT, 'minh.anh@rmit.edu.vn', true, 'user_student_1');
              }}
              className="px-2 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-[9px] font-semibold text-emerald-400 border border-neutral-700 flex items-center justify-center gap-1"
            >
              <User className="w-2.5 h-2.5" /> RMIT Student
            </button>
            <button 
              onClick={() => {
                setRole('COMPANY');
                onSuccess(UserRole.COMPANY, 'hiring@vuno.co.kr', true, 'user_company_1');
              }}
              className="px-2 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-[9px] font-semibold text-sky-400 border border-neutral-700 flex items-center justify-center gap-1"
            >
              <Building2 className="w-2.5 h-2.5" /> VUNO SME
            </button>
            <button 
              onClick={() => {
                setRole('ADMIN');
                onSuccess(UserRole.ADMIN, 'admin@konexa.co', true, 'user_admin_1');
              }}
              className="px-2 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-[9px] font-semibold text-purple-400 border border-neutral-700 flex items-center justify-center gap-1"
            >
              <UserCheck className="w-2.5 h-2.5" /> Admin Panel
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Email Verification Sim */}
          {showVerificationForm ? (
            <motion.div 
              key="verif"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900 text-xs text-emerald-400 leading-relaxed text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                {successMsg}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-400">Enter Verification Code</label>
                <input 
                  type="text" 
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="e.g., 882103" 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 font-mono text-center tracking-widest text-lg"
                />
              </div>

              <button 
                onClick={verifyCodeAndProceed}
                className="w-full py-3 bg-emerald-400 text-black font-semibold rounded-xl text-xs hover:bg-emerald-300 transition-colors flex items-center justify-center gap-2"
              >
                Verify & Setup Dashboard <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setShowVerificationForm(false)} 
                className="w-full text-center text-[11px] text-neutral-500 hover:text-neutral-400"
              >
                Resend Code
              </button>
            </motion.div>
          ) : showResetForm ? (
            <motion.form 
              key="reset"
              onSubmit={handleResetPassword}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-semibold text-neutral-200">Reset Password</h3>
              <p className="text-xs text-neutral-400">Enter your email and we'll send password reset parameters.</p>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@rmit.edu.vn" 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-neutral-100 hover:bg-white text-black font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Send Reset Link'}
              </button>

              <button 
                type="button"
                onClick={() => setShowResetForm(false)} 
                className="w-full text-center text-xs text-neutral-500 hover:text-neutral-400"
              >
                Back to Login
              </button>
            </motion.form>
          ) : (
            <motion.div 
              key="standard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Role Picker (Only shown on register or custom) */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-neutral-950 border border-neutral-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${role === 'STUDENT' ? 'bg-emerald-400 text-black shadow-md' : 'text-neutral-400 hover:text-white'}`}
                >
                  <User className="w-3.5 h-3.5" /> Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('COMPANY')}
                  className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${role === 'COMPANY' ? 'bg-sky-400 text-black shadow-md' : 'text-neutral-400 hover:text-white'}`}
                >
                  <Building2 className="w-3.5 h-3.5" /> SME Repo
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${role === 'ADMIN' ? 'bg-purple-400 text-black shadow-md' : 'text-neutral-400 hover:text-white'}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin
                </button>
              </div>

              {/* Google OAuth Button */}
              {role !== 'ADMIN' && (
                <button
                  type="button"
                  onClick={handleOAuth}
                  disabled={isLoading}
                  className="w-full py-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.245-3.125C18.29 1.49 15.54 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.19-1.925H12.24z"/>
                  </svg>
                  Continue with Google OAuth
                </button>
              )}

              {role !== 'ADMIN' && (
                <div className="relative flex py-1.5 items-center">
                  <div className="flex-grow border-t border-neutral-900"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-neutral-500 font-mono uppercase tracking-widest">Or email setup</span>
                  <div className="flex-grow border-t border-neutral-900"></div>
                </div>
              )}

              {/* Status Alert Messages */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/60 text-red-400 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-4">
                {/* Extra registration fields */}
                {!isLogin && role === 'STUDENT' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                  >
                    <div className="space-y-1">
                      <label className="text-xs text-neutral-400">Full Name (English)</label>
                      <input 
                        type="text" 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyen Minh Anh" 
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-neutral-400">RMIT Major</label>
                      <input 
                        type="text" 
                        required
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="Bachelor of Software Engineering (Honours)" 
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </motion.div>
                )}

                {!isLogin && role === 'COMPANY' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                  >
                    <div className="space-y-1">
                      <label className="text-xs text-neutral-400">Registered Company Name</label>
                      <input 
                        type="text" 
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="VUNO AI Solutions" 
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    {/* Business File Upload */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-400 flex justify-between">
                        <span>Business Registration Certificate</span>
                        <span className="text-[10px] text-rose-400 font-mono uppercase">Required</span>
                      </label>
                      
                      <div className="border border-dashed border-neutral-800 rounded-xl p-4 bg-neutral-950 text-center relative hover:border-sky-400/30 transition-colors">
                        <input 
                          type="file" 
                          accept=".pdf,.png,.jpg"
                          onChange={handleFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-1.5">
                            <RefreshCw className="w-5 h-5 text-sky-400 animate-spin" />
                            <span className="text-[10px] text-neutral-400">Verifying file structure...</span>
                          </div>
                        ) : selectedFile ? (
                          <div className="flex items-center justify-center gap-2">
                            <FileText className="w-5 h-5 text-sky-400" />
                            <span className="text-xs text-neutral-200 truncate max-w-[200px]">{selectedFile.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1.5">
                            <UploadCloud className="w-5 h-5 text-neutral-500" />
                            <span className="text-xs text-neutral-400">Upload PDF / image certificate</span>
                            <span className="text-[9px] text-neutral-600 font-mono">Maximum size 5MB</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">
                    {role === 'STUDENT' ? 'RMIT Email Address' : 'Work Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={role === 'STUDENT' ? 's3912345@rmit.edu.vn' : 'hiring@vuno.co.kr'} 
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-400 text-neutral-200"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-neutral-400">Password</label>
                    {isLogin && (
                      <button 
                        type="button" 
                        onClick={() => setShowResetForm(true)}
                        className="text-[10px] text-neutral-400 hover:text-white hover:underline transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-emerald-400 text-neutral-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    role === 'STUDENT' ? 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-lg shadow-emerald-500/10' :
                    role === 'COMPANY' ? 'bg-sky-400 text-black hover:bg-sky-300 shadow-lg shadow-sky-500/10' :
                    'bg-purple-400 text-black hover:bg-purple-300'
                  }`}
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? 'Sign In Workspace' : 'Create Verified Profile'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Toggle Login/Register */}
              {role !== 'ADMIN' && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-xs text-neutral-400 hover:text-white underline transition-colors"
                  >
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-neutral-900/60 text-center">
          <button 
            onClick={onBackToLanding}
            className="text-xs text-neutral-500 hover:text-neutral-300 flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            ← Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}
