import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import {
  Baby,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  Heart,
  TrendingUp,
  ShieldCheck,
  User,
  BookOpen,
  Apple,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export const MyChildPage: React.FC = () => {
  const { childProfile, user } = useSettings();
  const [selectedAreaIndex, setSelectedAreaIndex] = useState<number>(0);

  const selectedArea = childProfile.learningAreas[selectedAreaIndex];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Header Profile Hero Banner */}
      <div className="rounded-4xl bg-white border border-beige-300 shadow-soft-lg p-6 sm:p-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          {/* Child Identity & Photo */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <img
                src={childProfile.photo}
                alt={childProfile.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-sage-200 shadow-soft"
              />
              <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-forest-600 text-cream text-[10px] font-bold border-2 border-white shadow-sm">
                Active Student
              </span>
            </div>

            <div className="space-y-1.5 text-left rtl:text-right">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-sage-100 px-3 py-0.5 rounded-full border border-sage-200">
                  {childProfile.program}
                </span>
                <span className="text-xs text-forest-600 font-medium">
                  {childProfile.classroom}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900">
                {childProfile.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-forest-700 pt-1">
                <span><strong>Age:</strong> {childProfile.age}</span>
                <span className="opacity-40">•</span>
                <span><strong>Birth Date:</strong> {childProfile.birthDate}</span>
                <span className="opacity-40">•</span>
                <span><strong>Enrolled:</strong> {childProfile.enrollmentDate}</span>
              </div>
            </div>
          </div>

          {/* Assigned Guides Card */}
          <div className="p-4 rounded-3xl bg-beige-100/70 border border-beige-200 w-full lg:w-auto min-w-[280px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta block mb-2">
              Assigned Montessori Guides
            </span>
            <div className="space-y-2">
              {childProfile.assignedTeachers.map((teacher, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-forest-900">{teacher.name}</p>
                    <p className="text-[11px] text-forest-600">{teacher.role}</p>
                  </div>
                  <a
                    href={`mailto:${teacher.email}`}
                    className="text-[11px] text-forest-800 underline hover:text-terracotta font-medium ml-2"
                  >
                    Email Guide
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 2. Attendance Summary Section */}
      <div className="bg-white rounded-4xl p-6 sm:p-8 border border-beige-300 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-600 bg-beige-100 px-3 py-1 rounded-full border border-beige-200 inline-block mb-1">
              Attendance Records
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest-900">
              Academic Year Attendance Summary
            </h2>
          </div>
          <span className="text-xs font-bold text-sage-600 bg-sage-50 px-3 py-1.5 rounded-full border border-sage-200">
            {childProfile.attendanceStats.attendancePercentage}% Attendance Rate
          </span>
        </div>

        {/* 4 Attendance Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-cream border border-beige-200 text-center">
            <span className="text-[11px] text-forest-600 block">Total Work Cycle Sessions</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 mt-1 block">
              {childProfile.attendanceStats.totalDays}
            </span>
            <span className="text-[10px] text-softbrown-400">Scheduled days</span>
          </div>

          <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-center">
            <span className="text-[11px] text-forest-700 block">Present & Active</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-forest-800 mt-1 block">
              {childProfile.attendanceStats.presentDays}
            </span>
            <span className="text-[10px] text-sage-600 font-semibold">Streak: {childProfile.attendanceStats.consecutivePresentStreak} days</span>
          </div>

          <div className="p-4 rounded-2xl bg-cream border border-beige-200 text-center">
            <span className="text-[11px] text-forest-600 block">Excused Absences</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 mt-1 block">
              {childProfile.attendanceStats.excusedAbsences}
            </span>
            <span className="text-[10px] text-softbrown-400">Notified in advance</span>
          </div>

          <div className="p-4 rounded-2xl bg-cream border border-beige-200 text-center">
            <span className="text-[11px] text-forest-600 block">Tardiness / Late Arrivals</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 mt-1 block">
              {childProfile.attendanceStats.tardyCount}
            </span>
            <span className="text-[10px] text-softbrown-400">Avg arrival: 8:15 AM</span>
          </div>
        </div>
      </div>

      {/* 3. Learning Progress Visualization for All 6 Learning Areas */}
      <div className="bg-white rounded-4xl p-6 sm:p-8 border border-beige-300 shadow-soft">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200 inline-block mb-1">
            Progress Tracking
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900">
            Montessori Learning Areas Progress
          </h2>
          <p className="text-xs sm:text-sm text-forest-600 mt-1 leading-relaxed">
            In our pod, learning progress is assessed by certified guides through careful scientific observation of self-correcting apparatus mastery.
          </p>
        </div>

        {/* 6 Learning Area Cards with Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {childProfile.learningAreas.map((area, index) => {
            const isSelected = selectedAreaIndex === index;
            return (
              <div
                key={index}
                onClick={() => setSelectedAreaIndex(index)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cream border-forest-600 shadow-soft-lg ring-2 ring-forest-500/20'
                    : 'bg-white border-beige-300 hover:border-beige-400 hover:shadow-soft'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
                      {area.category}
                    </span>
                    <span className="font-serif font-bold text-lg text-forest-900">
                      {area.progressPercentage}%
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-forest-900 mb-2">
                    {area.area}
                  </h3>

                  <p className="text-xs text-forest-700 leading-relaxed mb-4 line-clamp-2">
                    {area.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-beige-200 overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${area.color}`}
                      style={{ width: `${area.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-beige-200 flex items-center justify-between text-[11px] text-forest-700">
                  <span>{area.skillsMastered} of {area.totalSkills} milestones mastered</span>
                  <span className="font-semibold text-forest-800">
                    {isSelected ? 'Viewing' : 'Details →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Area Milestone Deep-Dive Box */}
        {selectedArea && (
          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-beige-100/70 border border-beige-300 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-white px-2.5 py-0.5 rounded-full border border-beige-200">
                  Detailed Milestones
                </span>
                <h3 className="font-serif text-2xl font-bold text-forest-900 mt-1">
                  {selectedArea.area} • Demonstrated Masteries
                </h3>
              </div>
              <span className="text-xs font-bold text-forest-900 bg-white px-3 py-1.5 rounded-full border border-beige-200">
                {selectedArea.skillsMastered}/{selectedArea.totalSkills} Completed
              </span>
            </div>

            <p className="text-xs text-forest-700 mb-6 leading-relaxed">
              {selectedArea.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedArea.recentMilestones.map((m, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-white border border-beige-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-forest-900">{m}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Classroom Habits & Care Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sensitive Periods & Observations */}
        <div className="p-6 sm:p-8 rounded-4xl bg-white border border-beige-300 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-terracotta" />
            <h3 className="font-serif text-xl font-bold text-forest-900">
              Active Sensitive Periods
            </h3>
          </div>
          <p className="text-xs text-forest-600 mb-4 leading-relaxed">
            Windows of developmental opportunity observed by Dr. Maria Montessori where children learn specific skills with effortless joy.
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-cream border border-beige-200">
              <span className="font-serif font-bold text-xs text-forest-900 block">Heightened Period for Order & Sequence</span>
              <p className="text-[11px] text-forest-600 mt-0.5">Oliver takes immense pride in placing work rugs and materials precisely aligned with floor rug borders.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-cream border border-beige-200">
              <span className="font-serif font-bold text-xs text-forest-900 block">Sensitive Period for Decimal Math</span>
              <p className="text-[11px] text-forest-600 mt-0.5">Fascination with manipulating units, ten bars, and hundred squares during uninterrupted morning cycles.</p>
            </div>
          </div>
        </div>

        {/* Dietary & Emergency Snapshot */}
        <div className="p-6 sm:p-8 rounded-4xl bg-white border border-beige-300 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <Apple className="w-5 h-5 text-forest-600" />
            <h3 className="font-serif text-xl font-bold text-forest-900">
              Care & Wellness Snapshot
            </h3>
          </div>
          <p className="text-xs text-forest-600 mb-4 leading-relaxed">
            Essential dietary preferences and emergency contact verified for classroom snacks and forest school.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-cream border border-beige-200">
              <span className="font-bold text-forest-900 block">Dietary & Allergy Notes:</span>
              <p className="text-forest-700 mt-0.5">{user?.dietaryNotes || 'Organic vegetarian preference; No peanut allergies.'}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-cream border border-beige-200">
              <span className="font-bold text-forest-900 block">Primary Emergency Contact:</span>
              <p className="text-forest-700 mt-0.5">{user?.emergencyContact || 'Marcus Jenkins (Father) - +1 (555) 392-1049'}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

