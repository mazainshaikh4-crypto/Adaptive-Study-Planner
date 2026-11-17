import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  X,
} from 'lucide-react';
import {
  AppNotification,
  PageRoute,
  Subject,
  Topic,
  UserProfile,
} from '../types';

interface LayoutShellProps {
  currentRoute: PageRoute;
  pageTitle: string;
  breadcrumb: string[];
  user: UserProfile;
  subjects: Subject[];
  topics: Topic[];
  notifications: AppNotification[];
  onNavigate: (route: PageRoute, subjectId?: string) => void;
  onStartQuiz: (topicId: string) => void;
  onMarkAllNotificationsRead: () => void;
  onMarkNotificationRead: (id: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS: {
  id: PageRoute;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'subjects', label: 'My Subjects', icon: BookOpen },
  { id: 'practice-quiz', label: 'Practice Quizzes', icon: HelpCircle },
  { id: 'weak-topics', label: 'Weak Topics', icon: AlertTriangle },
  { id: 'study-planner', label: 'Study Planner', icon: CalendarDays },
  { id: 'analytics', label: 'Progress Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const LayoutShell: React.FC<LayoutShellProps> = ({
  currentRoute,
  pageTitle,
  breadcrumb,
  user,
  subjects,
  topics,
  notifications,
  onNavigate,
  onStartQuiz,
  onMarkAllNotificationsRead,
  onMarkNotificationRead,
  onLogout,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { subjects: [] as Subject[], topics: [] as Topic[] };
    return {
      subjects: subjects.filter(
        (s) =>
          s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
      ),
      topics: topics.filter((t) => t.name.toLowerCase().includes(q)),
    };
  }, [searchQuery, subjects, topics]);

  const hasResults =
    searchResults.subjects.length > 0 || searchResults.topics.length > 0;

  const activeNavId: PageRoute =
    currentRoute === 'topic-details' ? 'subjects' : currentRoute;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64">
      {/* Brand */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-200 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-indigo-700 text-white flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="font-display font-bold text-sm text-slate-900 block leading-tight truncate">
            Adaptive Study Planner
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeNavId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-50 text-indigo-800'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-indigo-700' : 'text-slate-400'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile & Logout Footer */}
      <div className="p-3 border-t border-slate-200 space-y-1.5 shrink-0">
        <button
          onClick={() => {
            onNavigate('settings');
            setMobileMenuOpen(false);
          }}
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors text-left"
        >
          {!avatarError ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              referrerPolicy="no-referrer"
              onError={() => setAvatarError(true)}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-800 font-semibold text-xs flex items-center justify-center shrink-0">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-900 truncate">
              {user.name}
            </div>
            <div className="text-xs text-slate-500 truncate">{user.major}</div>
          </div>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors whitespace-nowrap"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex">
            {sidebarContent}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="ml-2 mt-3 p-2 h-10 w-10 rounded-lg bg-white text-slate-700 shadow-md flex items-center justify-center"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Hamburger + Breadcrumb / Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                {breadcrumb.map((crumb, idx) => (
                  <React.Fragment key={crumb + idx}>
                    {idx > 0 && <span aria-hidden="true">/</span>}
                    <span className={idx === breadcrumb.length - 1 ? 'text-slate-700 font-medium' : ''}>
                      {crumb}
                    </span>
                  </React.Fragment>
                ))}
              </div>
              <h1 className="font-display font-bold text-base sm:text-lg text-slate-900 truncate">
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Right: Search, Notifications, Student Profile */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Search Input */}
            <div className="relative hidden md:block w-64 lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects or topics..."
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors"
                aria-label="Search subjects or topics"
              />

              {searchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-40 max-h-80 overflow-y-auto">
                  {hasResults ? (
                    <div className="py-1.5">
                      {searchResults.subjects.map((subj) => (
                        <button
                          key={subj.id}
                          onMouseDown={() => {
                            onNavigate('topic-details', subj.id);
                            setSearchQuery('');
                          }}
                          className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-900 truncate">
                              {subj.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              Subject · {subj.code}
                            </div>
                          </div>
                          <span className="text-xs font-medium text-indigo-700 shrink-0">
                            View
                          </span>
                        </button>
                      ))}
                      {searchResults.topics.map((topic) => (
                        <button
                          key={topic.id}
                          onMouseDown={() => {
                            onStartQuiz(topic.id);
                            setSearchQuery('');
                          }}
                          className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-900 truncate">
                              {topic.name}
                            </div>
                            <div className="text-xs text-slate-500 tabular-nums">
                              Topic · {topic.mastery}% mastery
                            </div>
                          </div>
                          <span className="text-xs font-medium text-indigo-700 shrink-0">
                            Quiz
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-xs text-slate-500 text-center">
                      No matching subjects or topics found.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notification Popover */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-700 text-white text-[10px] font-mono font-semibold flex items-center justify-center tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-lg z-40 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                    <span className="text-sm font-semibold text-slate-900">
                      Study Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={onMarkAllNotificationsRead}
                        className="text-xs font-medium text-indigo-700 hover:text-indigo-800 inline-flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          onMarkNotificationRead(n.id);
                          setNotifOpen(false);
                          onNavigate(n.targetRoute);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${
                          n.read ? 'opacity-70' : 'bg-indigo-50/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-900">
                            {n.title}
                          </span>
                          <span className="text-[11px] text-slate-400 shrink-0">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {n.message}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar + Name */}
            <button
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {!avatarError ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarError(true)}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-semibold text-xs flex items-center justify-center shrink-0">
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
              )}
              <span className="hidden sm:inline text-sm font-medium text-slate-800 whitespace-nowrap">
                {user.name}
              </span>
            </button>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
