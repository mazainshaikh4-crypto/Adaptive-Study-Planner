import React, { useState } from 'react';
import { CheckCircle2, LogOut, RotateCcw, Save } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsPageProps {
  user: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onResetDemoData: () => void;
  onLogout: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  onSaveProfile,
  onResetDemoData,
  onLogout,
}) => {
  const [form, setForm] = useState<UserProfile>(user);
  const [savedNotice, setSavedNotice] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [avatarError, setAvatarError] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(form);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 6) return;
    setCurrentPw('');
    setNewPw('');
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {!avatarError ? (
            <img
              src={form.avatarUrl}
              alt={form.name}
              referrerPolicy="no-referrer"
              onError={() => setAvatarError(true)}
              className="w-16 h-16 rounded-full object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-800 font-bold text-lg flex items-center justify-center shrink-0">
              {form.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
          )}
          <div>
            <h2 className="font-display font-bold text-xl text-slate-900">
              {form.name}
            </h2>
            <p className="text-sm text-slate-600">{form.email}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {form.major} · {form.semester}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors self-start sm:self-center whitespace-nowrap shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-sm text-emerald-900 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Profile and study preferences saved successfully.</span>
        </div>
      )}

      {/* Main Profile & Study Preferences Form */}
      <form
        onSubmit={handleSave}
        className="bg-white border border-slate-200 rounded-xl p-6 space-y-6"
      >
        <div>
          <h3 className="font-display font-semibold text-base text-slate-900">
            Edit Student Profile & Study Preferences
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily study goal changes automatically apply when regenerating your weekly study plan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Academic Major
            </label>
            <input
              type="text"
              value={form.major}
              onChange={(e) => setForm({ ...form, major: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Semester / Year
            </label>
            <input
              type="text"
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Daily Study Goal
            </label>
            <select
              value={form.dailyStudyGoalMinutes}
              onChange={(e) =>
                setForm({
                  ...form,
                  dailyStudyGoalMinutes: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
            >
              <option value={60}>60 minutes / day (1 hr)</option>
              <option value={90}>90 minutes / day (1.5 hrs)</option>
              <option value={120}>120 minutes / day (2 hrs)</option>
              <option value={150}>150 minutes / day (2.5 hrs)</option>
              <option value={180}>180 minutes / day (3 hrs)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Preferred Study Hours
            </label>
            <select
              value={form.preferredStudyHours}
              onChange={(e) =>
                setForm({
                  ...form,
                  preferredStudyHours: e.target
                    .value as UserProfile['preferredStudyHours'],
                })
              }
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
            >
              <option value="Morning (7AM - 12PM)">Morning (7AM - 12PM)</option>
              <option value="Afternoon (12PM - 5PM)">
                Afternoon (12PM - 5PM)
              </option>
              <option value="Evening (5PM - 9PM)">Evening (5PM - 9PM)</option>
              <option value="Night (9PM - 12AM)">Night (9PM - 12AM)</option>
            </select>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <h4 className="text-sm font-semibold text-slate-900">
            Notification Preferences
          </h4>
          <div className="space-y-2.5">
            {[
              {
                key: 'quizReminders' as const,
                title: 'Daily Quiz & Spaced Repetition Reminders',
                desc: 'Receive a reminder during your preferred study hours.',
              },
              {
                key: 'weakTopicAlerts' as const,
                title: 'Weak Topic Mastery Alerts',
                desc: 'Notify when BKT estimates a topic drops below 40% mastery.',
              },
              {
                key: 'weeklySummary' as const,
                title: 'Weekly Progress Analytics Summary',
                desc: 'Get a Sunday digest of quiz scores and hours studied.',
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-start justify-between gap-4 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-500">{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.notifications[item.key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notifications: {
                        ...form.notifications,
                        [item.key]: e.target.checked,
                      },
                    })
                  }
                  className="mt-1 rounded border-slate-300 text-indigo-700 focus:ring-indigo-600"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>

      {/* Account Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
        >
          <h3 className="font-display font-semibold text-base text-slate-900">
            Account Security
          </h3>
          {passwordSaved && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
              Password updated successfully.
            </div>
          )}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              Current Password
            </label>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              New Password (min 6 chars)
            </label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Update Password
          </button>
        </form>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="font-display font-semibold text-base text-slate-900">
              Workspace Data Management
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Reset all subjects, quiz history, BKT mastery estimates, and weekly study tasks back to Alex Rivera’s initial semester dataset.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onResetDemoData}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
