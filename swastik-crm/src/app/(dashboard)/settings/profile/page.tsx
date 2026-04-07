'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Lock, Phone, Globe, Save, Camera } from 'lucide-react';

interface ProfileData {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  facebook: string;
  linkedin: string;
  skype: string;
  default_language: string;
  email_signature: string;
  profile_image: string;
}

export default function ProfileSettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<ProfileData>({
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: '',
    facebook: '',
    linkedin: '',
    skype: '',
    default_language: 'english',
    email_signature: '',
    profile_image: '',
  });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/staff/${session.user.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          const s = d.data;
          setProfile({
            firstname: s.firstname || '',
            lastname: s.lastname || '',
            email: s.email || '',
            phonenumber: s.phonenumber || '',
            facebook: s.facebook || '',
            linkedin: s.linkedin || '',
            skype: s.skype || '',
            default_language: s.default_language || 'english',
            email_signature: s.email_signature || '',
            profile_image: s.profile_image || '',
          });
        }
      })
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    const res = await fetch(`/api/staff/${session?.user?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError('Failed to save profile. Please try again.');
    }
  };

  const handleChangePassword = async () => {
    setError('');
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setError('All password fields are required.');
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setError('New passwords do not match.');
      return;
    }
    if (passwords.newPass.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    const res = await fetch(`/api/staff/${session?.user?.id}/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }),
    });
    setSaving(false);
    if (res.ok) {
      setPasswords({ current: '', newPass: '', confirm: '' });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      const d = await res.json();
      setError(d.error || 'Failed to change password.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
  ];

  const set = (key: keyof ProfileData, value: string) => setProfile(p => ({ ...p, [key]: value }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="w-7 h-7 text-blue-600" />
          Profile Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your personal account settings</p>
      </div>

      {/* Avatar section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {profile.profile_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.profile_image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{profile.firstname?.[0]}{profile.lastname?.[0]}</span>
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-7 h-7 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Camera className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white text-lg">{profile.firstname} {profile.lastname}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{profile.email}</p>
          <p className="text-xs text-blue-600 mt-1">{(session?.user as { isAdmin?: boolean })?.isAdmin ? 'Administrator' : 'Staff'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setError(''); setSaved(false); }}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {saved && (
        <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
          Changes saved successfully!
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">First Name</label>
              <input
                type="text"
                value={profile.firstname}
                onChange={e => set('firstname', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Last Name</label>
              <input
                type="text"
                value={profile.lastname}
                onChange={e => set('lastname', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={e => set('email', e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Phone Number
            </label>
            <input
              type="text"
              value={profile.phonenumber}
              onChange={e => set('phonenumber', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-1">
              <Globe className="w-4 h-4" /> Social & Messaging
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Facebook</label>
                <input
                  type="text"
                  value={profile.facebook}
                  onChange={e => set('facebook', e.target.value)}
                  placeholder="Facebook profile URL"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">LinkedIn</label>
                <input
                  type="text"
                  value={profile.linkedin}
                  onChange={e => set('linkedin', e.target.value)}
                  placeholder="LinkedIn profile URL"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Skype</label>
                <input
                  type="text"
                  value={profile.skype}
                  onChange={e => set('skype', e.target.value)}
                  placeholder="Skype username"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Default Language</label>
            <select
              value={profile.default_language}
              onChange={e => set('default_language', e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="arabic">Arabic</option>
              <option value="french">French</option>
              <option value="spanish">Spanish</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Signature</label>
            <textarea
              value={profile.email_signature}
              onChange={e => set('email_signature', e.target.value)}
              rows={4}
              placeholder="Your email signature..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {saving ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
              placeholder="••••••••"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
            <input
              type="password"
              value={passwords.newPass}
              onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))}
              placeholder="Min. 6 characters"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
              placeholder="••••••••"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={handleChangePassword}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {saving ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
