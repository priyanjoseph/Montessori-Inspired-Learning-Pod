import React, { useState, useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';
import { DailyLogItem } from '../data/dashboardData';
import {
  Search,
  Filter,
  Calendar,
  Sparkles,
  BookOpen,
  CheckCircle2,
  X,
  MessageSquare,
  Send,
  Eye,
  Clock,
  User,
  Layers
} from 'lucide-react';

export const DailyLogsPage: React.FC = () => {
  const { dailyLogs, addLogComment } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('All');
  const [activeLogModal, setActiveLogModal] = useState<DailyLogItem | null>(null);
  const [parentComment, setParentComment] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentError, setCommentError] = useState('');

  const categories = [
    'All',
    'Mathematics',
    'Sensorial',
    'Nature & Ecology',
    'Language',
    'Practical Life',
    'Social Grace'
  ];

  // Filtering logic
  const filteredLogs = useMemo(() => {
    return dailyLogs.filter(log => {
      // Search match
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        log.title.toLowerCase().includes(query) ||
        log.description.toLowerCase().includes(query) ||
        log.teacherObservations.toLowerCase().includes(query) ||
        log.skillsDeveloped.some(s => s.toLowerCase().includes(query)) ||
        log.guideName.toLowerCase().includes(query);

      // Category match
      const matchesCategory =
        selectedCategory === 'All' || log.category === selectedCategory;

      // Date match
      let matchesDate = true;
      if (selectedDateFilter === 'Today') {
        matchesDate = log.date.includes('Today');
      } else if (selectedDateFilter === 'This Week') {
        matchesDate = log.date.includes('Today') || log.date.includes('Yesterday') || log.date.includes('Nov');
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [dailyLogs, searchTerm, selectedCategory, selectedDateFilter]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLogModal || !parentComment.trim()) return;
    setCommentError('');
    try {
      await addLogComment(activeLogModal.id, parentComment.trim());
      setCommentSuccess(true);
      setParentComment('');
      setTimeout(() => {
        setCommentSuccess(false);
      }, 3500);
    } catch (err: any) {
      setCommentError(err?.message || 'Unable to post comment.');
    }
  };

  const currentModalLog = activeLogModal
    ? dailyLogs.find((l) => l.id === activeLogModal.id) || activeLogModal
    : null;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="rounded-4xl bg-white border border-beige-300 shadow-soft p-6 sm:p-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-sage-100 px-3 py-1 rounded-full border border-sage-200 inline-block mb-2">
            Classroom Journal
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-forest-900">
            Daily Learning Logs
          </h1>
          <p className="text-forest-700 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Observations recorded by lead guides during the 3-hour uninterrupted morning work cycle. Discover what apparatus captured your child's concentration today.
          </p>
        </div>

        {/* 2. Controls Bar: Search, Category & Date Filters */}
        <div className="mt-6 pt-6 border-t border-beige-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3 w-4 h-4 text-forest-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, apparatus, skill (e.g. beads, seeds, colors)..."
              className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 text-xs sm:text-sm rounded-2xl bg-cream border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900 placeholder:text-softbrown-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 rtl:right-auto rtl:left-3 top-2.5 p-1 text-forest-400 hover:text-forest-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Date Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-forest-700 hidden sm:inline">Timeline:</span>
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl bg-cream border border-beige-300 text-xs font-semibold text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              <option value="All">All Dates Recorded</option>
              <option value="Today">Today Only</option>
              <option value="This Week">Past 7 Days</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-beige-100">
          <span className="text-xs font-semibold text-forest-700 mr-2 rtl:mr-0 rtl:ml-2">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-forest-600 text-cream shadow-sm'
                  : 'bg-beige-100/80 text-forest-800 hover:bg-beige-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Daily Logs Grid */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-4xl border border-beige-300 p-8">
          <BookOpen className="w-12 h-12 text-forest-400 mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-xl font-bold text-forest-900 mb-1">No logs match your filter</h3>
          <p className="text-xs text-forest-600 max-w-sm mx-auto mb-4">
            Try adjusting your search keywords, category selection, or timeline window.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedDateFilter('All');
            }}
            className="px-5 py-2 rounded-full bg-forest-600 text-cream text-xs font-semibold hover:bg-forest-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="rounded-3xl bg-white border border-beige-300 shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Log Image with Overlays */}
              <div className="relative h-48 overflow-hidden bg-beige-100">
                <img
                  src={log.photoUrl}
                  alt={log.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent pointer-events-none" />

                {/* Category badge */}
                <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/95 text-forest-900 border border-beige-200 shadow-sm">
                    {log.category}
                  </span>
                </div>

                {/* Date & Time badge */}
                <div className="absolute bottom-2.5 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1.5 text-white text-[11px] font-medium">
                  <Clock className="w-3.5 h-3.5 text-sage-300" />
                  <span>{log.date} • {log.time}</span>
                </div>
              </div>

              {/* Log Content */}
              <div className="p-6 flex-1 flex flex-col justify-between text-left rtl:text-right">
                <div>
                  <h3 className="font-serif text-lg font-bold text-forest-900 group-hover:text-forest-700 transition-colors mb-2">
                    {log.title}
                  </h3>

                  <p className="text-xs text-forest-700 leading-relaxed mb-4 line-clamp-2">
                    {log.description}
                  </p>

                  {/* Teacher observation quote snippet */}
                  <div className="p-3 rounded-2xl bg-cream border border-beige-200 text-[11px] text-forest-700 italic mb-4 line-clamp-2">
                    "{log.teacherObservations}"
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {log.skillsDeveloped.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-beige-100 text-[10px] text-forest-800 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {log.skillsDeveloped.length > 3 && (
                      <span className="text-[10px] text-softbrown-400 self-center">
                        +{log.skillsDeveloped.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer with Guide name & Detail trigger */}
                <div className="pt-3 border-t border-beige-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={log.guideAvatar}
                      alt={log.guideName}
                      className="w-6 h-6 rounded-full object-cover border border-forest-400"
                    />
                    <span className="text-[11px] text-forest-700 font-semibold truncate max-w-[110px]">
                      {log.guideName}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveLogModal(log)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-forest-800 hover:text-forest-950 underline underline-offset-4"
                  >
                    <span>View Log Details</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Detailed Activity View Modal */}
      {activeLogModal && (
        <div
          onClick={() => setActiveLogModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/75 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-cream rounded-4xl p-6 sm:p-8 shadow-soft-xl border border-beige-300 max-h-[92vh] overflow-y-auto text-left rtl:text-right"
          >
            {/* Close button */}
            <button
              onClick={() => setActiveLogModal(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-full bg-white/80 hover:bg-white text-forest-800 shadow-sm"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta bg-terracotta-50 px-3 py-0.5 rounded-full border border-terracotta-200">
                {activeLogModal.category}
              </span>
              <span className="text-xs text-forest-600 font-medium">
                {activeLogModal.date} at {activeLogModal.time}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 mb-4">
              {activeLogModal.title}
            </h2>

            {/* Large Activity Image */}
            <div className="rounded-3xl overflow-hidden h-64 sm:h-72 bg-beige-100 shadow-sm mb-6">
              <img
                src={activeLogModal.photoUrl}
                alt={activeLogModal.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details Grid */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-serif font-bold text-sm text-forest-900 mb-1">Activity Overview</h3>
                <p className="text-xs sm:text-sm text-forest-700 leading-relaxed">
                  {activeLogModal.description}
                </p>
              </div>

              {/* Teacher Observation */}
              <div className="p-4 rounded-3xl bg-white border border-beige-300 shadow-soft">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={activeLogModal.guideAvatar}
                    alt={activeLogModal.guideName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold text-forest-900">
                    Guide Observation ({activeLogModal.guideName})
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-forest-800 leading-relaxed italic">
                  "{activeLogModal.teacherObservations}"
                </p>
              </div>

              {/* Participation & Materials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-beige-100/80 border border-beige-200">
                  <span className="text-forest-600 font-medium block">Child Engagement:</span>
                  <span className="font-serif font-bold text-forest-900 text-sm mt-0.5 block">
                    {activeLogModal.childParticipation}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-beige-100/80 border border-beige-200">
                  <span className="text-forest-600 font-medium block">Classroom Apparatus:</span>
                  <span className="font-semibold text-forest-900 mt-0.5 block truncate">
                    {activeLogModal.materialsUsed}
                  </span>
                </div>
              </div>

              {/* Skills Developed */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 mb-2">
                  Cognitive & Motor Skills Cultivated
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeLogModal.skillsDeveloped.map((s, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sage-100 text-forest-900 text-xs font-medium border border-sage-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-sage-600" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Parent Reflection / Comment Form */}
            <div className="pt-4 border-t border-beige-200 space-y-3">
              <h4 className="font-serif font-bold text-sm text-forest-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-forest-600" />
                <span>Parent Reflection or Question on this Activity</span>
              </h4>

              {currentModalLog?.comments && currentModalLog.comments.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {currentModalLog.comments.map((cmt) => (
                    <div
                      key={cmt.id}
                      className="p-2.5 rounded-xl bg-beige-100/90 border border-beige-200 text-xs text-forest-900"
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-forest-700 mb-0.5">
                        <span>{cmt.authorName}</span>
                        <span className="text-forest-500">
                          {new Date(cmt.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p>{cmt.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {commentError && (
                <p className="text-xs text-terracotta font-medium">{commentError}</p>
              )}

              {commentSuccess ? (
                <div className="p-3 rounded-2xl bg-sage-100 text-forest-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0" />
                  <span>Thank you! Your reflection was saved and shared with Guide {activeLogModal.guideName}.</span>
                </div>
              ) : (
                <form onSubmit={handlePostComment} className="flex gap-2">
                  <input
                    type="text"
                    value={parentComment}
                    onChange={(e) => setParentComment(e.target.value)}
                    placeholder="e.g. Oliver was singing about the Golden Beads at dinner tonight..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white border border-beige-300 focus:outline-none focus:ring-2 focus:ring-forest-500 text-forest-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-cream text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                  >
                    <span>Send</span>
                    <Send className="w-3 h-3 rtl:rotate-180" />
                  </button>
                </form>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveLogModal(null)}
                className="px-6 py-2.5 rounded-full bg-beige-200 hover:bg-beige-300 text-forest-900 text-xs font-semibold transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

