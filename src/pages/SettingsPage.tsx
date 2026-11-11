import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import {
  User,
  Mail,
  Phone,
  Baby,
  Lock,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  Shield,
  Camera,
  Heart
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUserProfile, childProfile, updateChildProfile, changePassword } = useSettings();

  // Parent Profile state
  const [parentName, setParentName] = useState(user?.name || 'Sarah Jenkins');
  const [email, setEmail] = useState(user?.email || 'parent@example.com');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 724-8190');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300');

  // Child details state
  const [childName, setChildName] = useState(childProfile.name || 'Oliver Jenkins');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || 'Marcus Jenkins (Father) - +1 (555) 392-1049');
  const [dietaryNotes, setDietaryNotes] = useState(user?.dietaryNotes || 'Organic vegetarian preference; No peanut allergies.');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Notification preferences state
  const [emailAlerts, setEmailAlerts] = useState(user?.notificationPreferences.emailAlerts ?? true);
  const [dailyDigest, setDailyDigest] = useState(user?.notificationPreferences.dailyDigest ?? true);
  const [urgentSms, setUrgentSms] = useState(user?.notificationPreferences.urgentSms ?? true);
  const [photoTagging, setPhotoTagging] = useState(user?.notificationPreferences.photoTagging ?? true);

  // General feedback
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Curated avatar options
  const avatarOptions = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
  ];

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!parentName.trim()) {
      setValidationError('Parent name cannot be blank.');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    try {
      await updateUserProfile({
        name: parentName,
        email,
        phone,
        avatar,
        emergencyContact,
        dietaryNotes,
        notificationPreferences: {
          emailAlerts,
          dailyDigest,
          urgentSms,
          photoTagging,
        },
      });

      if (childName.trim() !== childProfile.name) {
        await updateChildProfile({ name: childName });
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3500);
    } catch (err: any) {
      setValidationError(err?.message || 'Unable to save profile updates.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters and include uppercase, lowercase, and a number.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 4000);
    } catch (err: any) {
      setPasswordError(err?.message || 'Unable to update password.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-left rtl:text-right">
      
      {/* 1. Header Banner */}
      <div className="rounded-4xl bg-white border border-beige-300 shadow-soft p-6 sm:p-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-sage-100 px-3 py-1 rounded-full border border-sage-200 inline-block mb-2">
            Family Profile & Security
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-forest-900">
            Settings and Profile
          </h1>
          <p className="text-forest-700 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Update your family contact information, manage classroom notification alerts, configure emergency care notes, and update your portal password.
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="p-4 rounded-3xl bg-sage-100 border border-sage-300 text-xs sm:text-sm text-forest-900 flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-forest-600 flex-shrink-0" />
          <span>Parent profile & preferences saved successfully to your browser session!</span>
        </div>
      )}

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 rounded-3xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* 2. Main Profile Form */}
      <form onSubmit={handleProfileSave} className="space-y-8">
        
        {/* Parent Personal Info & Avatar */}
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-beige-300 shadow-soft space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-forest-600" />
            <h2 className="font-serif text-xl font-bold text-forest-900">
              Parent / Guardian Information
            </h2>
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-forest-800 mb-2">
              Profile Avatar
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <img
                src={avatar}
                alt="Selected avatar"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-forest-600 shadow-sm"
              />
              <div className="space-y-1">
                <span className="text-xs text-forest-600 block">Choose from curated parent avatars:</span>
                <div className="flex items-center gap-2">
                  {avatarOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatar(opt)}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-transform ${
                        avatar === opt ? 'border-forest-600 scale-110 shadow-sm' : 'border-beige-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={opt} alt="Avatar option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-forest-800 mb-1">
                Full Name *
              </label>
              <input
                required
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-cream border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-800 mb-1">
                Email Address *
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-cream border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-800 mb-1">
                Primary Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-cream border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-800 mb-1">
                Relationship to Student
              </label>
              <select className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-cream border border-beige-300 text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-500">
                <option value="Mother">Mother / Primary Guardian</option>
                <option value="Father">Father / Primary Guardian</option>
                <option value="Legal Guardian">Legal Guardian</option>
              </select>
            </div>
          </div>
        </div>

        {/* Child Information & Care Details */}
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-beige-300 shadow-soft space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Baby className="w-5 h-5 text-terracotta" />
            <h2 className="font-serif text-xl font-bold text-forest-900">
              Child Details & Care Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-forest-800 mb-1">
                Student Full Name *
              </label>
              <input
                required
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-cream border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-800 mb-1">
                Enrolled Program (Locked by Admissions)
              </label>
              <input
                disabled
                type="text"
                value={childProfile.program}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-beige-100/60 border border-beige-300 text-forest-700 cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-forest-800 mb-1">
                Primary Emergency Contact & Phone *
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-cream border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-forest-800 mb-1">
                Dietary Preferences & Allergy Precautions
              </label>
              <textarea
                rows={2}
                value={dietaryNotes}
                onChange={(e) => setDietaryNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-cream border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-beige-300 shadow-soft space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-forest-600" />
            <h2 className="font-serif text-xl font-bold text-forest-900">
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Daily Learning Log Alerts',
                desc: 'Receive immediate email when a guide posts an observation log or activity photo.',
                checked: emailAlerts,
                onChange: setEmailAlerts
              },
              {
                title: 'Daily Evening Digest',
                desc: 'Receive a consolidated summary email of classroom events at 5:00 PM.',
                checked: dailyDigest,
                onChange: setDailyDigest
              },
              {
                title: 'Urgent Weather & Campus SMS',
                desc: 'Text notifications for weather closures, delayed starts, or emergency announcements.',
                checked: urgentSms,
                onChange: setUrgentSms
              },
              {
                title: 'Photographic Tag Alerts',
                desc: 'Notification when your child appears in classroom activity photos.',
                checked: photoTagging,
                onChange: setPhotoTagging
              }
            ].map((pref, i) => (
              <label
                key={i}
                className="p-4 rounded-2xl bg-cream border border-beige-200 flex items-start justify-between gap-4 cursor-pointer hover:bg-beige-100/50 transition-colors"
              >
                <div>
                  <span className="font-bold text-xs sm:text-sm text-forest-900 block">{pref.title}</span>
                  <span className="text-[11px] text-forest-600 mt-0.5 block leading-snug">{pref.desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={pref.checked}
                  onChange={(e) => pref.onChange(e.target.checked)}
                  className="w-4 h-4 rounded text-forest-600 border-beige-300 focus:ring-forest-500 mt-1 cursor-pointer"
                />
              </label>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-7 py-3 rounded-full bg-forest-600 hover:bg-forest-700 text-cream text-xs sm:text-sm font-semibold shadow-soft hover:shadow-soft-lg transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile & Preferences</span>
            </button>
          </div>
        </div>

      </form>

      {/* 3. Change Password Interface */}
      <div className="bg-white rounded-4xl p-6 sm:p-8 border border-beige-300 shadow-soft space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-5 h-5 text-terracotta" />
          <h2 className="font-serif text-xl font-bold text-forest-900">
            Change Portal Password
          </h2>
        </div>

        {passwordSuccess && (
          <div className="p-3.5 rounded-2xl bg-sage-100 border border-sage-200 text-xs text-forest-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-forest-600" />
            <span>Your portal password was updated successfully.</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-forest-800 mb-1">
              Current Password *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-cream border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-800 mb-1">
              New Password (min 6 characters) *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-cream border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-800 mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-cream border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-forest-600 hover:bg-forest-700 text-cream text-xs font-semibold shadow-soft transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>

    </div>
  );
};

