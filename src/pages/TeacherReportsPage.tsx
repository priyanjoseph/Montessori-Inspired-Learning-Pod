import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { TeacherReportItem } from '../data/dashboardData';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Award,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  X,
  User,
  Heart,
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const TeacherReportsPage: React.FC = () => {
  const { teacherReports, childProfile, user } = useSettings();
  const [selectedReport, setSelectedReport] = useState<TeacherReportItem | null>(null);
  const [printableModal, setPrintableModal] = useState<TeacherReportItem | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="rounded-4xl bg-white border border-beige-300 shadow-soft p-6 sm:p-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-sage-100 px-3 py-1 rounded-full border border-sage-200 inline-block mb-2">
            Pedagogical Evaluations
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-forest-900">
            Teacher Progress Reports
          </h1>
          <p className="text-forest-700 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Written evaluations authored by certified lead guides, assessing your child's sensitive periods, cognitive milestones, social poise, and independent mastery.
          </p>
        </div>
      </div>

      {/* 2. Reports Cards List */}
      <div className="space-y-8">
        {teacherReports.length === 0 && (
          <div className="rounded-4xl bg-white border border-beige-300 shadow-soft p-10 text-center space-y-2">
            <h2 className="font-serif text-xl font-bold text-forest-900">
              No Term Progress Reports Published Yet
            </h2>
            <p className="text-xs text-forest-600 max-w-md mx-auto">
              Comprehensive Montessori developmental evaluations for {childProfile.name || 'your child'} will appear here once completed by your lead guide.
            </p>
          </div>
        )}
        {teacherReports.map((report) => (
          <div
            key={report.id}
            className="rounded-4xl bg-white border border-beige-300 shadow-soft hover:shadow-soft-lg transition-all p-6 sm:p-10"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-beige-200">
              
              {/* Report Header & Guide Bio */}
              <div className="flex items-start gap-4">
                <img
                  src={report.teacherAvatar}
                  alt={report.teacherName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-forest-400 shadow-sm flex-shrink-0"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-terracotta bg-terracotta-50 px-2.5 py-0.5 rounded-full border border-terracotta-200">
                      {report.term}
                    </span>
                    <span className="text-xs text-forest-600">
                      Published {report.reportDate}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-forest-900">
                    {report.reportTitle}
                  </h2>
                  <p className="text-xs text-forest-700 mt-0.5">
                    Lead Guide: <strong>{report.teacherName}</strong> • {report.teacherRole}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="flex-1 lg:flex-none px-5 py-2.5 rounded-full bg-cream hover:bg-beige-100 text-forest-900 text-xs font-bold border border-beige-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-forest-700" />
                  <span>View Full Report</span>
                </button>

                <button
                  onClick={() => setPrintableModal(report)}
                  className="flex-1 lg:flex-none px-5 py-2.5 rounded-full bg-forest-600 hover:bg-forest-700 text-cream text-xs font-bold shadow-soft transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Download</span>
                </button>
              </div>

            </div>

            {/* Overall Summary & Grade Badge */}
            <div className="py-6 border-b border-beige-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-600">
                  Overall Developmental Assessment
                </span>
                <p className="text-xs sm:text-sm text-forest-800 leading-relaxed font-medium">
                  "{report.overallProgress}"
                </p>
              </div>
              <div className="md:col-span-4 p-4 rounded-3xl bg-sage-50 border border-sage-200 text-center">
                <span className="text-[11px] text-forest-600 block">Horizon Status</span>
                <span className="font-serif text-lg font-bold text-forest-900 mt-0.5 block">
                  {report.progressGrade}
                </span>
                <span className="text-[10px] text-sage-600 font-semibold">100% AMI Metric Compliance</span>
              </div>
            </div>

            {/* Progress Metrics Visual Bars */}
            <div className="py-6 border-b border-beige-200">
              <h3 className="font-serif font-bold text-base text-forest-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-terracotta" />
                <span>Montessori Domain Progress Scores</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {report.chartMetrics.map((metric, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-cream border border-beige-200">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-forest-900">{metric.area}</span>
                      <span className="font-serif font-bold text-forest-800">{metric.score}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-beige-200 overflow-hidden mb-1.5">
                      <div
                        className="h-full rounded-full bg-forest-600 transition-all duration-700"
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-softbrown-400">
                      <span>Observed: {metric.score}%</span>
                      <span>Target Level: {metric.target}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Areas for Improvement Snapshot */}
            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-5 rounded-3xl bg-sage-50/70 border border-sage-200">
                <h4 className="font-serif font-bold text-sm text-forest-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600" />
                  <span>Demonstrated Strengths</span>
                </h4>
                <ul className="space-y-2">
                  {report.strengths.slice(0, 3).map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-forest-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest-600 mt-1.5 flex-shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-3xl bg-beige-100/70 border border-beige-300">
                <h4 className="font-serif font-bold text-sm text-forest-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-terracotta" />
                  <span>Next Developmental Horizons</span>
                </h4>
                <ul className="space-y-2">
                  {report.areasForImprovement.map((area, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-forest-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta mt-1.5 flex-shrink-0" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* ========================================================
          3. FULL REPORT MODAL VIEW
         ======================================================== */}
      {selectedReport && (
        <div
          onClick={() => setSelectedReport(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/75 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-cream rounded-4xl p-6 sm:p-10 shadow-soft-xl border border-beige-300 max-h-[92vh] overflow-y-auto text-left rtl:text-right space-y-6"
          >
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-full bg-white text-forest-800 shadow-sm hover:bg-beige-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200">
                Official Report Portfolio
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 mt-2">
                {selectedReport.reportTitle}
              </h2>
              <p className="text-xs text-forest-600 mt-1">
                Student: <strong>{childProfile.name}</strong> • Term: {selectedReport.term} • Date: {selectedReport.reportDate}
              </p>
            </div>

            {/* Domain Analysis Sections */}
            <div className="space-y-4 text-xs sm:text-sm text-forest-800">
              
              <div className="p-4 rounded-3xl bg-white border border-beige-200 space-y-1">
                <h4 className="font-serif font-bold text-forest-900 text-sm">Language & Literacy Development</h4>
                <p className="text-forest-700 leading-relaxed">{selectedReport.languageDevelopment}</p>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-beige-200 space-y-1">
                <h4 className="font-serif font-bold text-forest-900 text-sm">Mathematical Mind & Decimal Concepts</h4>
                <p className="text-forest-700 leading-relaxed">{selectedReport.mathematicalDevelopment}</p>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-beige-200 space-y-1">
                <h4 className="font-serif font-bold text-forest-900 text-sm">Social Grace & Multi-Age Community poise</h4>
                <p className="text-forest-700 leading-relaxed">{selectedReport.socialObservations}</p>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-beige-200 space-y-1">
                <h4 className="font-serif font-bold text-forest-900 text-sm">Practical Life & Motor Independence</h4>
                <p className="text-forest-700 leading-relaxed">{selectedReport.practicalLifeObservations}</p>
              </div>

              {/* Teacher Comments */}
              <div className="p-5 rounded-3xl bg-beige-100 border border-beige-300">
                <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta block mb-1">
                  Lead Guide Reflection
                </span>
                <p className="italic text-forest-900 leading-relaxed">
                  "{selectedReport.teacherComments}"
                </p>
                <p className="text-xs font-bold text-forest-700 mt-2">
                  — {selectedReport.teacherName}, {selectedReport.teacherCredentials}
                </p>
              </div>

              {/* Recommended Home Activities */}
              <div>
                <h4 className="font-serif font-bold text-forest-900 text-sm mb-2">Recommended Home Alignment Activities</h4>
                <ul className="space-y-1.5">
                  {selectedReport.recommendedHomeActivities.map((act, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-forest-700">
                      <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div className="pt-4 border-t border-beige-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-5 py-2 text-xs font-semibold text-forest-700"
              >
                Close View
              </button>

              <button
                onClick={() => {
                  setSelectedReport(null);
                  setPrintableModal(selectedReport);
                }}
                className="px-6 py-2.5 rounded-full bg-forest-600 text-cream text-xs font-semibold hover:bg-forest-700 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Open Printable Format</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          4. PRINTABLE REPORT FORMAT MODAL
         ======================================================== */}
      {printableModal && (
        <div
          onClick={() => setPrintableModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-white rounded-3xl p-8 sm:p-12 shadow-soft-xl max-h-[95vh] overflow-y-auto text-left rtl:text-right border border-beige-300 print:m-0 print:p-0 print:border-none print:shadow-none"
          >
            {/* Top print bar (hidden in actual print) */}
            <div className="flex items-center justify-between pb-6 border-b border-beige-300 print:hidden">
              <span className="text-xs font-bold text-forest-700">Printable Official Document Format</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="px-6 py-2.5 rounded-full bg-forest-600 text-cream text-xs font-bold hover:bg-forest-700 shadow-sm flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document / Save PDF</span>
                </button>
                <button
                  onClick={() => setPrintableModal(null)}
                  className="p-2 rounded-full bg-beige-100 hover:bg-beige-200 text-forest-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Report Document Body */}
            <div className="pt-6 space-y-6 text-forest-900 font-sans">
              
              {/* Official Pod Letterhead */}
              <div className="flex items-center justify-between border-b-2 border-forest-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-forest-700 text-cream flex items-center justify-center font-bold">
                    <Sparkles className="w-7 h-7 text-sage-200" />
                  </div>
                  <div>
                    <h1 className="font-serif text-2xl font-bold tracking-tight text-forest-900">
                      Montessori Learning Pod
                    </h1>
                    <p className="text-xs text-forest-600">
                      742 Evergreen Botanical Way, Boulder, CO 80302 • info@montessorilearningpod.edu
                    </p>
                  </div>
                </div>
                <div className="text-right rtl:text-left text-xs text-forest-700">
                  <p><strong>AMI Affiliated</strong></p>
                  <p>Academic Year 2026–2027</p>
                </div>
              </div>

              {/* Student Identification Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-cream border border-beige-300 text-xs">
                <div>
                  <span className="text-forest-600 block">Student Name</span>
                  <span className="font-serif font-bold text-sm text-forest-900">{childProfile.name}</span>
                </div>
                <div>
                  <span className="text-forest-600 block">Program & Class</span>
                  <span className="font-bold text-forest-900">{childProfile.program}</span>
                </div>
                <div>
                  <span className="text-forest-600 block">Evaluation Period</span>
                  <span className="font-bold text-forest-900">{printableModal.term}</span>
                </div>
                <div>
                  <span className="text-forest-600 block">Lead Guide</span>
                  <span className="font-bold text-forest-900">{printableModal.teacherName}</span>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h3 className="font-serif font-bold text-base text-forest-900 border-b border-beige-200 pb-1 mb-2">
                  1. Executive Pedagogical Evaluation
                </h3>
                <p className="text-xs leading-relaxed text-forest-800">
                  {printableModal.overallProgress}
                </p>
              </div>

              {/* Domain Performance */}
              <div>
                <h3 className="font-serif font-bold text-base text-forest-900 border-b border-beige-200 pb-1 mb-3">
                  2. Montessori Learning Area Progress
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {printableModal.chartMetrics.map((m, i) => (
                    <div key={i} className="p-3 rounded-xl border border-beige-200 bg-cream/40 text-xs">
                      <span className="font-bold text-forest-900 block">{m.area}</span>
                      <span className="text-forest-700">Score: <strong>{m.score}%</strong> (Target: {m.target}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Observations */}
              <div>
                <h3 className="font-serif font-bold text-base text-forest-900 border-b border-beige-200 pb-1 mb-2">
                  3. Key Observed Competencies & Strengths
                </h3>
                <ul className="list-disc list-inside text-xs space-y-1 text-forest-800">
                  {printableModal.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Guide Signoff */}
              <div className="pt-8 border-t border-beige-300 flex items-end justify-between">
                <div>
                  <p className="font-serif font-bold text-sm text-forest-900">{printableModal.teacherName}</p>
                  <p className="text-[11px] text-forest-600">{printableModal.teacherCredentials}</p>
                  <p className="text-[10px] text-softbrown-400 mt-1">Lead Guide Signature: <em>Amina Al-Khatib</em></p>
                </div>
                <div className="text-right rtl:text-left text-xs text-forest-600">
                  <p>Date Issued: {printableModal.reportDate}</p>
                  <p className="text-[10px] text-forest-500">Official Montessori Learning Pod Seal</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

