import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Award,
  CreditCard,
  Send,
  Baby,
  ArrowRight,
  TrendingUp,
  Heart,
  MessageSquare,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    user,
    childProfile,
    dailyLogs,
    teacherReports,
    tuitionSummary,
    notifications
  } = useSettings();

  const [guideNote, setGuideNote] = useState('');
  const [noteSent, setNoteSent] = useState(false);

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (guideNote.trim()) {
      setNoteSent(true);
      setTimeout(() => {
        setGuideNote('');
        setNoteSent(false);
      }, 4000);
    }
  };

  // Formatted current date
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const latestLog = dailyLogs[0];
  const latestReport = teacherReports[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ========================================================
          1. WELCOME SECTION: Personalized Greeting & Date
         ======================================================== */}
      <div className="rounded-3xl bg-white border border-beige-300 text-forest-900 p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-forest-800 bg-sage-100 px-2.5 py-0.5 rounded-full border border-sage-200">
                {childProfile.program}
              </span>
              <span className="text-xs font-medium text-forest-600">
                Room: {childProfile.classroom}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 leading-tight">
              Welcome Back, {user?.name || 'Sarah Jenkins'}!
            </h1>
            <p className="text-xs sm:text-sm text-forest-600 mt-1.5 flex flex-wrap items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-forest-600" />
              <span>{currentDateFormatted}</span>
              <span className="opacity-40">•</span>
              <span>Child: <strong className="text-forest-800">{childProfile.name}</strong> ({childProfile.age})</span>
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              to="/dashboard/child"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-forest-700 text-cream text-xs font-bold shadow-soft hover:bg-forest-800 transition-colors"
            >
              <Baby className="w-4 h-4 text-cream" />
              <span>View Full Child Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. SUMMARY CARDS: 4 Core Metrics
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Child's Attendance */}
        <div className="p-6 rounded-3xl bg-white border border-beige-300 shadow-soft hover:shadow-soft-lg transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-600">
                Child Attendance
              </span>
              <div className="w-9 h-9 rounded-2xl bg-sage-100 text-forest-700 flex items-center justify-center group-hover:bg-forest-600 group-hover:text-cream transition-colors">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-forest-900">
                {childProfile.attendanceStats.attendancePercentage}%
              </span>
              <span className="text-xs text-sage-600 font-semibold">Excellent</span>
            </div>
            <p className="text-xs text-forest-600 mt-1">
              {childProfile.attendanceStats.presentDays} of {childProfile.attendanceStats.totalDays} sessions attended
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-beige-200 flex items-center justify-between text-[11px] text-forest-700">
            <span>Streak: {childProfile.attendanceStats.consecutivePresentStreak} days present</span>
            <span className="text-sage-600 font-bold">Present Today</span>
          </div>
        </div>

        {/* Card 2: Learning Activities Completed */}
        <div className="p-6 rounded-3xl bg-white border border-beige-300 shadow-soft hover:shadow-soft-lg transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-600">
                Completed Works
              </span>
              <div className="w-9 h-9 rounded-2xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center group-hover:bg-terracotta group-hover:text-white transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-forest-900">
                {dailyLogs.length * 6}
              </span>
              <span className="text-xs text-terracotta font-semibold">Works logged</span>
            </div>
            <p className="text-xs text-forest-600 mt-1">
              Active across all 6 core Montessori areas
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-beige-200 flex items-center justify-between text-[11px] text-forest-700">
            <span>
              {latestLog ? `Latest: ${latestLog.title.slice(0, 18)}...` : 'Awaiting first classroom log'}
            </span>
            <Link to="/dashboard/logs" className="text-terracotta font-bold hover:underline">
              View Logs →
            </Link>
          </div>
        </div>

        {/* Card 3: Upcoming Events */}
        <div className="p-6 rounded-3xl bg-white border border-beige-300 shadow-soft hover:shadow-soft-lg transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-600">
                Upcoming Event
              </span>
              <div className="w-9 h-9 rounded-2xl bg-beige-200 text-forest-800 flex items-center justify-center group-hover:bg-forest-600 group-hover:text-cream transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold text-forest-900">
                Nov 8, 2026
              </span>
            </div>
            <p className="text-xs text-forest-800 font-semibold mt-1 truncate">
              Autumn Harvest Feast
            </p>
            <p className="text-[11px] text-forest-600">
              9:00 AM • Courtyard & Kitchen
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-beige-200 flex items-center justify-between text-[11px] text-forest-700">
            <span>Family Community Feast</span>
            <span className="text-forest-600 font-semibold">Confirmed</span>
          </div>
        </div>

        {/* Card 4: Tuition Payment Status */}
        <div className="p-6 rounded-3xl bg-white border border-beige-300 shadow-soft hover:shadow-soft-lg transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-600">
                Tuition Status
              </span>
              <div className="w-9 h-9 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center group-hover:bg-forest-600 group-hover:text-cream transition-colors">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-forest-900">
                ${tuitionSummary.outstandingBalance.toLocaleString()}
              </span>
              <span className="text-xs text-forest-700 font-semibold">Due Dec 1</span>
            </div>
            <p className="text-xs text-forest-600 mt-1">
              Current Month (November): <strong className="text-forest-900">Paid ($1,480)</strong>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-beige-200 flex items-center justify-between text-[11px] text-forest-700">
            <span>Plan: 10-Month Schedule</span>
            <Link to="/dashboard/tuition" className="text-forest-800 font-bold hover:underline">
              Manage →
            </Link>
          </div>
        </div>

      </div>

      {/* ========================================================
          3. MAIN DASHBOARD CONTENT GRID:
             Left: Latest Learning Log & Developmental Radar
             Right: Quick Message to Guide & Announcements
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Latest Daily Learning Log Showcase */}
          <div className="bg-white rounded-4xl p-6 sm:p-8 border border-beige-300 shadow-soft">
            {latestLog ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta bg-terracotta-50 px-2.5 py-0.5 rounded-full border border-terracotta-200 inline-block">
                        Latest Daily Classroom Log
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 bg-beige-100 px-2.5 py-0.5 rounded-full border border-beige-200 inline-block">
                        {latestLog.category}
                      </span>
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest-900">
                      {latestLog.title}
                    </h2>
                    <p className="text-xs text-forest-600 mt-0.5">
                      Logged on {latestLog.date} at {latestLog.time} by Guide {latestLog.guideName}
                    </p>
                  </div>

                  <Link
                    to="/dashboard/logs"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:text-forest-950 underline underline-offset-4"
                  >
                    <span>View All Logs</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </Link>
                </div>

                {/* Full-width Description, Observation & Skills */}
                <div className="space-y-3.5 text-left rtl:text-right">
                  <p className="text-xs sm:text-sm text-forest-800 leading-relaxed font-medium">
                    {latestLog.description}
                  </p>
                  <div className="p-4 rounded-2xl bg-cream border border-beige-200 text-xs sm:text-sm text-forest-700 italic">
                    "{latestLog.teacherObservations}"
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {latestLog.skillsDeveloped.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-beige-100 text-[11px] font-medium text-forest-800 border border-beige-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-6 text-center space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-sage-100 px-3 py-1 rounded-full border border-sage-200 inline-block">
                  Orientation Phase
                </span>
                <h2 className="font-serif text-xl font-bold text-forest-900">
                  Daily Classroom Journal Ready
                </h2>
                <p className="text-xs text-forest-600 max-w-md mx-auto">
                  As your Montessori guide observes {childProfile.name || 'your child'} during the morning work cycle, daily activity records and notes will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Child Developmental Progress Overview */}
          <div className="bg-white rounded-4xl p-6 sm:p-8 border border-beige-300 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-600 bg-sage-100 px-2.5 py-0.5 rounded-full border border-sage-200 inline-block mb-1">
                  Developmental Horizons
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest-900">
                  Learning Area Progress
                </h2>
              </div>
              <Link
                to="/dashboard/child"
                className="text-xs font-bold text-forest-800 hover:underline"
              >
                Detailed Breakdown →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {childProfile.learningAreas.map((area, index) => (
                <div key={index} className="p-4 rounded-2xl bg-cream border border-beige-200">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-serif font-bold text-forest-900">{area.area}</span>
                    <span className="font-bold text-forest-700">{area.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-beige-200 overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${area.color}`}
                      style={{ width: `${area.progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-forest-600">
                    <span>{area.category}</span>
                    <span>{area.skillsMastered}/{area.totalSkills} milestones</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (lg:col-span-4): Teacher Report snippet & Note to Guide */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Latest Teacher Report Card */}
          <div className="bg-white rounded-4xl p-6 sm:p-7 border border-beige-300 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-terracotta" />
              <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
                Published Report
              </span>
            </div>

            {latestReport ? (
              <>
                <h3 className="font-serif text-lg font-bold text-forest-900 mb-1">
                  {latestReport.reportTitle}
                </h3>
                <p className="text-[11px] text-forest-600 mb-4">
                  {latestReport.term} • Lead Guide {latestReport.teacherName}
                </p>

                <div className="p-4 rounded-2xl bg-sage-50/80 border border-sage-200 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 block mb-1">
                    Evaluation Summary
                  </span>
                  <p className="text-xs text-forest-800 leading-relaxed font-medium">
                    "{latestReport.overallProgress}"
                  </p>
                </div>

                <Link
                  to="/dashboard/reports"
                  className="w-full py-2.5 rounded-full bg-forest-600 hover:bg-forest-700 text-cream text-xs font-semibold shadow-soft flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Read Full Report & Download</span>
                  <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
              </>
            ) : (
              <div className="py-4 space-y-3 text-xs text-forest-700">
                <p className="leading-relaxed">
                  Term progress evaluations for {childProfile.name || 'your child'} will appear here once completed by the lead guide.
                </p>
                <Link
                  to="/dashboard/reports"
                  className="inline-flex items-center gap-1 font-semibold text-forest-800 hover:underline"
                >
                  <span>Open Reports Area</span>
                  <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
              </div>
            )}
          </div>

          {/* Direct Note to Guide Box */}
          <div className="bg-white rounded-4xl p-6 sm:p-7 border border-beige-300 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-forest-600" />
              <h3 className="font-serif text-lg font-bold text-forest-900">
                Direct Message to Guide
              </h3>
            </div>
            <p className="text-xs text-forest-600 mb-4 leading-relaxed">
              Share home observations or weekend updates directly with Guide Amina Al-Khatib.
            </p>

            {noteSent ? (
              <div className="p-4 rounded-2xl bg-sage-100 border border-sage-200 text-xs text-forest-800 flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-forest-600 flex-shrink-0" />
                <span>Message delivered to morning guide briefing!</span>
              </div>
            ) : (
              <form onSubmit={handleSendNote} className="space-y-3">
                <textarea
                  required
                  rows={3}
                  value={guideNote}
                  onChange={(e) => setGuideNote(e.target.value)}
                  placeholder="e.g. Oliver loved counting with the beads yesterday and was singing the sound phonograms at dinner..."
                  className="w-full p-3.5 text-xs rounded-2xl bg-cream border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900 placeholder:text-forest-400"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-forest-600 hover:bg-forest-700 text-cream text-xs font-semibold shadow-soft flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>Send Note to Classroom</span>
                </button>
              </form>
            )}
          </div>

          {/* Quick Notifications Alert List */}
          <div className="bg-white rounded-4xl p-6 sm:p-7 border border-beige-300 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-bold text-forest-900">
                Recent Alerts
              </h3>
              <Link to="/dashboard/notifications" className="text-[11px] font-bold text-terracotta hover:underline">
                View All ({notifications.length})
              </Link>
            </div>

            <div className="space-y-2.5">
              {notifications.slice(0, 3).map((n) => (
                <Link
                  key={n.id}
                  to={n.actionUrl || '/dashboard/notifications'}
                  className="block p-3 rounded-2xl bg-cream hover:bg-beige-100 transition-colors border border-beige-200 text-left rtl:text-right"
                >
                  <p className="font-serif font-bold text-xs text-forest-900 leading-snug">
                    {n.title}
                  </p>
                  <p className="text-[11px] text-forest-600 truncate mt-0.5">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-softbrown-400 block mt-1">
                    {n.date}
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
