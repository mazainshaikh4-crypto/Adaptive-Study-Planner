import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Brain,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  HelpCircle,
  X,
} from 'lucide-react';
import { BktVisualization } from '../components/BktVisualization';
import { HERO_ILLUSTRATION_URL } from '../data/initialData';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onDemoLogin: () => void;
}

type FooterModalType = 'About' | 'Contact' | 'Privacy' | null;

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLogin,
  onDemoLogin,
}) => {
  const [heroImgError, setHeroImgError] = useState(false);
  const [footerModal, setFooterModal] = useState<FooterModalType>(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark */}
          <a
            href="#top"
            className="flex items-center gap-2.5 font-display font-bold text-base sm:text-lg tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            <span className="w-8 h-8 rounded-lg bg-indigo-700 text-white flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </span>
            <span>Adaptive Study Planner</span>
          </a>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => scrollTo('features')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('bkt-model')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              BKT Model
            </button>
            <button
              onClick={onLogin}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="shrink-0">
            <button
              onClick={onGetStarted}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left Copy Column */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <p className="text-xs font-medium text-indigo-700 tracking-wide">
                Personalized Learning Intelligence · Bayesian Knowledge Tracing
              </p>

              <h1
                className="font-display font-bold text-slate-900 tracking-tight leading-[1.1] [text-wrap:balance]"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
              >
                Study Smarter. Learn Better. Achieve More.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Adaptive Study Planner diagnoses topic-level mastery from short quizzes, uncovers your weakest concepts with Bayesian Knowledge Tracing, and builds a personalized weekly schedule tailored to your exam timeline.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onGetStarted}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollTo('features')}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Explore Features</span>
                </button>
                <button
                  onClick={onDemoLogin}
                  className="text-sm font-medium text-indigo-700 hover:text-indigo-900 px-3 py-2 underline underline-offset-4 whitespace-nowrap shrink-0"
                >
                  Open Student Demo
                </button>
              </div>

              <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <div className="font-display font-bold text-xl tabular-nums text-slate-900">
                    BKT Model
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Real-time mastery estimation
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-xl tabular-nums text-slate-900">
                    7-Day Plan
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Auto-weighted by weak topics
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-xl tabular-nums text-slate-900">
                    4 States
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Clear topic proficiency tiers
                  </div>
                </div>
              </div>
            </div>

            {/* Right Illustration Column */}
            <div className="lg:col-span-6 flex">
              <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex flex-col">
                {!heroImgError ? (
                  <img
                    src={HERO_ILLUSTRATION_URL}
                    alt="College student studying with adaptive mastery analytics and weekly schedule dashboard"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="w-full h-full object-cover min-h-[300px] lg:min-h-[420px]"
                  />
                ) : (
                  <div className="w-full h-full min-h-[340px] flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-50 text-center">
                    <Brain className="w-12 h-12 text-indigo-700 mb-3" />
                    <div className="font-display font-semibold text-slate-900">
                      Adaptive Mastery & Weekly Planner
                    </div>
                    <p className="text-sm text-slate-600 mt-1 max-w-sm">
                      Interactive topic mastery tracking, smart quizzes, and dynamic time allocation.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section — Asymmetric Bento Grid */}
        <section id="features" className="bg-slate-50 border-y border-slate-200 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-medium text-indigo-700">Core Capabilities</p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 [text-wrap:balance]">
                Engineered around how college students actually master technical subjects
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Every quiz response updates your knowledge state and reshapes your upcoming study calendar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Feature 1 (Wide) */}
              <div className="md:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                    <Brain className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">01</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-lg text-slate-900">
                    AI-Powered Weak Topic Detection
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Instead of raw quiz averages that penalize early mistakes forever, Bayesian Knowledge Tracing models your latent mastery probability P(L) accounting for lucky guesses and careless slips—pinpointing exactly which concepts are Weak or Need Practice.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
                  <span>Strong ≥ 80%</span>
                  <span>Improving 60–79%</span>
                  <span>Needs Practice 40–59%</span>
                  <span>Weak &lt; 40%</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="md:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center shrink-0">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">02</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-lg text-slate-900">
                    Personalized Weekly Study Plans
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Dynamically allocates your Monday–Sunday study budget. Weak topics receive deeper 60-minute concept reviews early in the week, while mastered topics stay sharp through 20-minute spaced repetition.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="md:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">03</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-lg text-slate-900">
                    Smart Quiz Engine
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Focused topic-wise quizzes with instant step-by-step explanations, BKT mastery delta readouts, and concrete next-step recommendations after every submission.
                  </p>
                </div>
              </div>

              {/* Feature 4 (Wide) */}
              <div className="md:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">04</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-lg text-slate-900">
                    Learning Progress Analytics
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Track weekly quiz accuracy trends, subject-by-subject mastery growth, strong-versus-weak topic distributions, and logged study hours in one clean academic dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works — 4 Steps */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-2xl space-y-2 mb-10">
            <p className="text-xs font-medium text-indigo-700">Workflow</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 [text-wrap:balance]">
              How Adaptive Study Planner works in four steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01. Add Your Subjects',
                desc: 'Organize your semester courses and break each syllabus down into trackable topics.',
              },
              {
                step: '02. Take Topic Quizzes',
                desc: 'Complete short multiple-choice assessments designed to test conceptual understanding.',
              },
              {
                step: '03. Update BKT Mastery',
                desc: 'Bayesian Knowledge Tracing recalculates topic mastery and flags Weak or Needs Practice areas.',
              },
              {
                step: '04. Follow Adaptive Plan',
                desc: 'Generate an updated Monday–Sunday schedule that prioritizes high-impact study sessions.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white border border-slate-200 rounded-xl p-6 space-y-2.5"
              >
                <CheckCircle2 className="w-5 h-5 text-indigo-700" />
                <h3 className="font-display font-semibold text-base text-slate-900">
                  {item.step}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI/ML BKT Visualization Section */}
        <section id="bkt-model" className="bg-slate-50 border-t border-slate-200 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-medium text-indigo-700">AI/ML Engine</p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 [text-wrap:balance]">
                Transparent mastery estimation powered by Bayesian Knowledge Tracing
              </h2>
            </div>

            <BktVisualization />

            <div className="bg-indigo-950 text-white rounded-xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-xl">
                <h3 className="font-display font-bold text-xl sm:text-2xl">
                  Ready to build your personalized study schedule?
                </h3>
                <p className="text-sm text-indigo-200">
                  Create your student profile or explore Alex Rivera’s live semester workspace right away.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={onGetStarted}
                  className="px-5 py-2.5 text-sm font-semibold bg-white text-indigo-950 hover:bg-indigo-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Get Started
                </button>
                <button
                  onClick={onDemoLogin}
                  className="px-5 py-2.5 text-sm font-medium border border-indigo-400/50 text-white hover:bg-indigo-900 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Try Live Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2 font-display font-semibold text-slate-800">
            <GraduationCap className="w-4 h-4 text-indigo-700" />
            <span>Adaptive Study Planner</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setFooterModal('About')}
              className="hover:text-slate-900 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="hover:text-slate-900 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => setFooterModal('Contact')}
              className="hover:text-slate-900 transition-colors"
            >
              Contact
            </button>
            <button
              onClick={() => setFooterModal('Privacy')}
              className="hover:text-slate-900 transition-colors"
            >
              Privacy
            </button>
          </div>
        </div>
      </footer>

      {footerModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-lg text-slate-900">
                {footerModal}
              </h3>
              <button
                onClick={() => setFooterModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {footerModal === 'About' &&
                'Adaptive Study Planner is an academic productivity platform designed to help college students diagnose topic mastery using Bayesian Knowledge Tracing (BKT) and generate balanced weekly revision schedules.'}
              {footerModal === 'Contact' &&
                'For academic inquiries, project feedback, or department pilots, reach our team at support@adaptivestudyplanner.edu.'}
              {footerModal === 'Privacy' &&
                'Your subjects, quiz history, and mastery estimates are stored locally in your browser workspace for instant privacy-first access with no third-party ad tracking.'}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setFooterModal(null)}
                className="px-4 py-2 text-sm font-medium bg-indigo-700 text-white rounded-lg hover:bg-indigo-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
