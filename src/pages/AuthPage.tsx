import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, GraduationCap, Lock, Mail, User } from 'lucide-react';

interface AuthPageProps {
  initialMode: 'login' | 'register';
  onSwitchMode: (mode: 'login' | 'register') => void;
  onLoginSuccess: (email: string, rememberMe: boolean) => void;
  onRegisterSuccess: (fullName: string, email: string) => void;
  onDemoLogin: () => void;
  onBackToLanding: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode,
  onSwitchMode,
  onLoginSuccess,
  onRegisterSuccess,
  onDemoLogin,
  onBackToLanding,
}) => {
  const [email, setEmail] = useState('alex.rivera@university.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid college or personal email address.');
      return;
    }
    if (password.trim().length < 4) {
      setErrorMsg('Please enter your password (minimum 4 characters).');
      return;
    }
    onLoginSuccess(email.trim(), rememberMe);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both fields.');
      return;
    }
    onRegisterSuccess(fullName.trim(), regEmail.trim());
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Enter your account email to receive reset instructions.');
      return;
    }
    setErrorMsg('');
    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 font-display font-bold text-slate-900">
          <span className="w-8 h-8 rounded-lg bg-indigo-700 text-white flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </span>
          <span>Adaptive Study Planner</span>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto my-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        {forgotMode ? (
          <div className="space-y-5">
            <div>
              <h1 className="font-display font-bold text-2xl text-slate-900">
                Reset Password
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Enter your student email and we’ll send a password recovery link.
              </p>
            </div>

            {resetSent ? (
              <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50 text-sm text-emerald-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  Recovery instructions sent to <span className="font-medium">{email}</span>.
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                    {errorMsg}
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@university.edu"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors"
                >
                  Send Reset Link
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setForgotMode(false);
                setResetSent(false);
                setErrorMsg('');
              }}
              className="text-sm font-medium text-indigo-700 hover:text-indigo-900"
            >
              Return to Login
            </button>
          </div>
        ) : initialMode === 'login' ? (
          <div className="space-y-6">
            <div>
              <h1 className="font-display font-bold text-2xl text-slate-900">
                Sign in to your study space
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Continue tracking topic mastery and weekly study goals.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.rivera@university.edu"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-700 focus:ring-indigo-600"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setForgotMode(true);
                  }}
                  className="font-medium text-indigo-700 hover:text-indigo-900"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors"
              >
                Login
              </button>
            </form>

            <div className="pt-4 border-t border-slate-200 space-y-3">
              <button
                type="button"
                onClick={onDemoLogin}
                className="w-full py-2.5 px-4 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              >
                Continue as Demo Student (Alex Rivera)
              </button>
              <p className="text-center text-sm text-slate-600">
                New to Adaptive Study Planner?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    onSwitchMode('register');
                  }}
                  className="font-semibold text-indigo-700 hover:text-indigo-900"
                >
                  Create an account
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="font-display font-bold text-2xl text-slate-900">
                Create your student account
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Set up your subjects and start personalized BKT study planning.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-name"
                  className="block text-sm font-medium text-slate-700"
                >
                  Full name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="reg-email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="alex.rivera@university.edu"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="reg-password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="reg-confirm"
                  className="block text-sm font-medium text-slate-700"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors"
              >
                Create account
              </button>
            </form>

            <p className="text-center text-sm text-slate-600 pt-2 border-t border-slate-200">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  onSwitchMode('login');
                }}
                className="font-semibold text-indigo-700 hover:text-indigo-900"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-slate-400">
        Adaptive Study Planner · College Academic Productivity Platform
      </div>
    </div>
  );
};
