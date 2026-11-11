import React, { useState } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Download,
  FileText,
  GraduationCap,
  Megaphone,
  NotebookPen,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';
import { ADMIN_NAV_ITEMS, AdminOverviewData } from '../layouts/AdminLayout';
import { apiRequest } from '../lib/api';

interface AdminOutletContext {
  overview: AdminOverviewData | null;
  setOverview: React.Dispatch<React.SetStateAction<AdminOverviewData | null>>;
  refreshAdminData: () => Promise<void>;
}

export const AdminDashboardPage: React.FC = () => {
  const { section = 'overview' } = useParams<{ section: string }>();
  const { overview, setOverview } = useOutletContext<AdminOutletContext>();

  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Form States across sections
  const [studentForm, setStudentForm] = useState({
    name: '',
    age: '',
    program: 'Primary Program (Casa dei Bambini)',
    classroom: 'Casa Studio II (East Garden Wing)',
    assignedTeacher: 'Amina Al-Khatib, AMS',
    parentId: '',
  });
  const [parentForm, setParentForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: '',
    credentials: 'AMS / AMI Certified Guide',
    experience: '5 Years',
    email: '',
    classroom: 'Casa Studio II',
  });
  const [programForm, setProgramForm] = useState({
    title: '',
    ageGroup: '',
    ratio: '1 Guide : 8 Children',
    hours: '8:30 AM – 3:00 PM',
    tuition: '$1,500 / month',
    capacity: 15,
  });
  const [attendanceForm, setAttendanceForm] = useState({
    childId: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'Present',
    notes: '',
  });
  const [logForm, setLogForm] = useState({
    childId: '',
    title: '',
    category: 'Practical Life',
    description: '',
    teacherObservations: '',
    materialsUsed: '',
  });
  const [reportForm, setReportForm] = useState({
    childId: '',
    reportTitle: '',
    term: 'Winter Term 2026',
    progressGrade: 'Exceeding Expectations',
    overallProgress: '',
  });
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '9:30 AM – 11:30 AM',
    location: 'Pod Courtyard',
    category: 'Community Event',
    audience: 'All Families',
    description: '',
  });
  const [chargeForm, setChargeForm] = useState({ childId: '', description: '', amount: '1480' });
  const [notifForm, setNotifForm] = useState({
    userId: '',
    type: 'announcement',
    title: '',
    message: '',
  });
  const [settingsDraft, setSettingsDraft] = useState<Record<string, string> | null>(null);
  const [cmsDrafts, setCmsDrafts] = useState<Record<string, { title: string; subtitle: string; body: string }>>({});

  if (!overview) return null;

  const notify = (msg: string) => {
    setErrorMsg('');
    setStatusMsg(msg);
    window.setTimeout(() => setStatusMsg(''), 4000);
  };

  const runMutation = async (
    path: string,
    method: 'POST' | 'PATCH' | 'DELETE',
    body?: unknown,
    successText?: string
  ) => {
    setErrorMsg('');
    try {
      const updated = await apiRequest<AdminOverviewData>(path, { method, body });
      setOverview(updated);
      if (successText) notify(successText);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Administrative action failed.');
    }
  };

  const handleExportCsv = () => {
    const headers = ['Student ID', 'Student Name', 'Age', 'Program', 'Classroom', 'Guide', 'Parent', 'Parent Email'];
    const rows = overview.students.map((s) =>
      [s.id, s.name, s.age, s.program, s.classroom, s.assignedTeacher, s.parentName, s.parentEmail]
        .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'montessori-pod-enrollment-report.csv';
    a.click();
    URL.revokeObjectURL(url);
    notify('Student enrollment report exported to CSV.');
  };

  const filteredStudents = overview.students.filter((s) =>
    `${s.name} ${s.program} ${s.parentName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSettings = settingsDraft || overview.systemSettings;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Feedback Banners */}
      {statusMsg && (
        <div
          role="status"
          className="p-3.5 rounded-2xl bg-sage-100 dark:bg-forest-800 border border-sage-300 dark:border-sage-600 text-forest-900 dark:text-cream text-xs sm:text-sm flex items-center gap-2.5"
        >
          <CheckCircle2 className="w-4 h-4 text-forest-700 dark:text-sage-300 flex-shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div
          role="alert"
          className="p-3.5 rounded-2xl bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs sm:text-sm flex items-center gap-2.5"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* =========================================================
          1. ADMIN DASHBOARD OVERVIEW
         ========================================================= */}
      {section === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              {
                label: 'Enrolled Students',
                value: overview.metrics.totalStudents,
                sub: `${overview.metrics.activePrograms} active pods`,
                icon: GraduationCap,
              },
              {
                label: 'Registered Parents',
                value: overview.metrics.totalParents,
                sub: 'Verified parent accounts',
                icon: Users,
              },
              {
                label: 'Teaching Guides',
                value: overview.metrics.totalStaff,
                sub: `${overview.metrics.attendanceRate}% attendance rate`,
                icon: UserCheck,
              },
              {
                label: 'Tuition Collected',
                value: `$${overview.metrics.totalCollected.toLocaleString()}`,
                sub: `$${overview.metrics.totalOutstanding.toLocaleString()} outstanding`,
                icon: CreditCard,
              },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.label}
                  className="p-5 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-forest-600 dark:text-sage-300">
                      {kpi.label}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-sage-100 dark:bg-forest-800 text-forest-700 dark:text-sage-300 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="font-serif text-3xl font-bold text-forest-900 dark:text-cream">
                    {kpi.value}
                  </p>
                  <p className="text-xs text-forest-600 dark:text-beige-200 mt-1">{kpi.sub}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-bold">Recent Student Roster</h2>
                <Link to="/admin/students" className="text-xs font-semibold text-forest-700 dark:text-sage-300 hover:underline">
                  Manage Students →
                </Link>
              </div>
              <div className="space-y-3">
                {overview.students.slice(0, 5).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-beige-200 dark:border-forest-800"
                  >
                    <div>
                      <p className="font-semibold text-sm">{s.name}</p>
                      <p className="text-xs text-forest-600 dark:text-beige-300">
                        {s.program} • Parent: {s.parentName}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-sage-100 dark:bg-forest-800 text-forest-800 dark:text-sage-200">
                      {s.classroom}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-bold">Administrative Modules</h2>
                <ShieldCheck className="w-5 h-5 text-forest-600 dark:text-sage-300" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {ADMIN_NAV_ITEMS.filter((i) => i.slug !== 'overview').map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.slug}
                      to={item.to}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-200 dark:border-forest-800 hover:border-forest-500 text-xs font-semibold transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 text-forest-600 dark:text-sage-300 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          2. STUDENT MANAGEMENT
         ========================================================= */}
      {section === 'students' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft">
            <h2 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-forest-600" />
              <span>Enroll New Student</span>
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const chosenParentId = studentForm.parentId || overview.parents[0]?.id || '';
                runMutation(
                  '/api/admin/students',
                  'POST',
                  { ...studentForm, parentId: chosenParentId },
                  'New student enrolled successfully.'
                );
                setStudentForm({ ...studentForm, name: '', age: '' });
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              <input
                required
                placeholder="Student Full Name"
                value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <input
                required
                placeholder="Age (e.g. 4 Years)"
                value={studentForm.age}
                onChange={(e) => setStudentForm({ ...studentForm, age: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <select
                value={studentForm.parentId || overview.parents[0]?.id || ''}
                onChange={(e) => setStudentForm({ ...studentForm, parentId: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              >
                {overview.parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    Parent: {p.name} ({p.email})
                  </option>
                ))}
              </select>
              <input
                placeholder="Program"
                value={studentForm.program}
                onChange={(e) => setStudentForm({ ...studentForm, program: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <input
                placeholder="Classroom"
                value={studentForm.classroom}
                onChange={(e) => setStudentForm({ ...studentForm, classroom: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream text-xs font-semibold"
              >
                Add Student Record
              </button>
            </form>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="font-serif text-lg font-bold">Enrolled Students ({filteredStudents.length})</h2>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-forest-500" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by name or parent..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left rtl:text-right">
                <thead className="border-b border-beige-200 dark:border-forest-800 text-forest-600 dark:text-sage-300">
                  <tr>
                    <th className="py-2.5 pr-3">Student</th>
                    <th className="py-2.5 pr-3">Age</th>
                    <th className="py-2.5 pr-3">Program & Classroom</th>
                    <th className="py-2.5 pr-3">Parent / Guardian</th>
                    <th className="py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige-200/70 dark:divide-forest-800">
                  {filteredStudents.map((s) => (
                    <tr key={s.id}>
                      <td className="py-3 pr-3 font-semibold">{s.name}</td>
                      <td className="py-3 pr-3">{s.age}</td>
                      <td className="py-3 pr-3">
                        <span className="block font-medium">{s.program}</span>
                        <span className="text-[11px] text-forest-600 dark:text-beige-300">{s.classroom}</span>
                      </td>
                      <td className="py-3 pr-3">
                        <span className="block font-medium">{s.parentName}</span>
                        <span className="text-[11px] text-forest-600 dark:text-beige-300">{s.parentEmail}</span>
                      </td>
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() => runMutation(`/api/admin/students/${s.id}`, 'DELETE', undefined, `Removed ${s.name}.`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-terracotta hover:bg-terracotta/10 font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          3. PARENT MANAGEMENT
         ========================================================= */}
      {section === 'parents' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft">
            <h2 className="font-serif text-lg font-bold mb-4">Add Parent Account</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runMutation('/api/admin/parents', 'POST', parentForm, 'Parent account created.');
                setParentForm({ name: '', email: '', phone: '', password: '' });
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
            >
              <input
                required
                placeholder="Parent Name"
                value={parentForm.name}
                onChange={(e) => setParentForm({ ...parentForm, name: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={parentForm.email}
                onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <input
                placeholder="Phone"
                value={parentForm.phone}
                onChange={(e) => setParentForm({ ...parentForm, phone: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <input
                type="password"
                placeholder="Initial Password"
                value={parentForm.password}
                onChange={(e) => setParentForm({ ...parentForm, password: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream text-xs font-semibold"
              >
                Create Parent
              </button>
            </form>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft">
            <h2 className="font-serif text-lg font-bold mb-4">Registered Parent Directory ({overview.parents.length})</h2>
            <div className="space-y-2.5">
              {overview.parents.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-beige-200 dark:border-forest-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-forest-600 dark:text-beige-300">
                      {p.email} • {p.phone || 'No phone on file'} • Children Linked: {p.childrenCount}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-sage-100 dark:bg-forest-800 font-semibold">
                      Provider: {p.provider}
                    </span>
                    <button
                      type="button"
                      onClick={() => runMutation(`/api/admin/parents/${p.id}`, 'DELETE', undefined, `Removed parent ${p.name}.`)}
                      className="px-2.5 py-1 rounded-lg text-terracotta hover:bg-terracotta/10 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          4. TEACHER & STAFF MANAGEMENT
         ========================================================= */}
      {section === 'staff' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft">
            <h2 className="font-serif text-lg font-bold mb-4">Add Montessori Guide / Staff</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runMutation('/api/admin/staff', 'POST', staffForm, 'Faculty guide added.');
                setStaffForm({ ...staffForm, name: '', role: '', email: '' });
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              <input
                required
                placeholder="Guide Name"
                value={staffForm.name}
                onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <input
                required
                placeholder="Title / Role"
                value={staffForm.role}
                onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <input
                placeholder="Credentials (e.g. AMI 3–6)"
                value={staffForm.credentials}
                onChange={(e) => setStaffForm({ ...staffForm, credentials: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <input
                placeholder="Classroom Assignment"
                value={staffForm.classroom}
                onChange={(e) => setStaffForm({ ...staffForm, classroom: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <input
                type="email"
                placeholder="Email"
                value={staffForm.email}
                onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream text-xs font-semibold"
              >
                Add Guide
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overview.staff.map((g) => (
              <div
                key={g.id}
                className="p-5 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft flex justify-between items-start gap-3"
              >
                <div className="space-y-1 text-xs">
                  <p className="font-serif text-base font-bold">{g.name}</p>
                  <p className="font-semibold text-forest-700 dark:text-sage-300">{g.role}</p>
                  <p className="text-forest-600 dark:text-beige-300">{g.credentials} • {g.experience}</p>
                  <p className="text-forest-600 dark:text-beige-300">{g.classroom} • {g.email}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      runMutation(
                        `/api/admin/staff/${g.id}`,
                        'PATCH',
                        { status: g.status === 'Active' ? 'On Leave' : 'Active' },
                        `Updated status for ${g.name}.`
                      )
                    }
                    className="px-2.5 py-1 rounded-full bg-sage-100 dark:bg-forest-800 text-[11px] font-semibold"
                  >
                    {g.status}
                  </button>
                  <button
                    type="button"
                    onClick={() => runMutation(`/api/admin/staff/${g.id}`, 'DELETE', undefined, `Removed ${g.name}.`)}
                    className="text-[11px] font-semibold text-terracotta hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          5. PROGRAMS & CURRICULUM MANAGEMENT
         ========================================================= */}
      {section === 'programs' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft">
            <h2 className="font-serif text-lg font-bold mb-4">Add Montessori Program Cohort</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runMutation('/api/admin/programs', 'POST', programForm, 'Program cohort added.');
                setProgramForm({ ...programForm, title: '', ageGroup: '' });
              }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <input
                required
                placeholder="Program Title"
                value={programForm.title}
                onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <input
                required
                placeholder="Age Group (e.g. 6 – 9 Years)"
                value={programForm.ageGroup}
                onChange={(e) => setProgramForm({ ...programForm, ageGroup: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Add Program</span>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {overview.programs.map((prog) => (
              <div
                key={prog.id}
                className="p-5 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif text-base font-bold">{prog.title}</h3>
                  <button
                    type="button"
                    onClick={() =>
                      runMutation(
                        `/api/admin/programs/${prog.id}`,
                        'PATCH',
                        { status: prog.status === 'Active' ? 'Waitlist Only' : 'Active' },
                        `Updated ${prog.title} status.`
                      )
                    }
                    className="px-2.5 py-1 rounded-full bg-sage-100 dark:bg-forest-800 font-semibold text-[11px]"
                  >
                    {prog.status}
                  </button>
                </div>
                <p className="text-forest-600 dark:text-beige-300">{prog.ageGroup} • {prog.ratio}</p>
                <p className="text-forest-600 dark:text-beige-300">{prog.hours}</p>
                <p className="font-semibold text-forest-800 dark:text-cream">{prog.tuition}</p>
                <p className="pt-2 border-t border-beige-200 dark:border-forest-800 font-semibold">
                  Capacity: {prog.enrolledCount} / {prog.capacity} seats filled
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          6. ATTENDANCE MANAGEMENT
         ========================================================= */}
      {section === 'attendance' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft">
            <h2 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-forest-600" />
              <span>Record Daily Student Attendance</span>
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const childId = attendanceForm.childId || overview.students[0]?.id || '';
                runMutation(
                  '/api/admin/attendance',
                  'POST',
                  { ...attendanceForm, childId },
                  'Attendance check-in recorded.'
                );
                setAttendanceForm({ ...attendanceForm, notes: '' });
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
            >
              <select
                value={attendanceForm.childId || overview.students[0]?.id || ''}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, childId: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              >
                {overview.students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={attendanceForm.date}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <select
                value={attendanceForm.status}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              >
                <option value="Present">Present</option>
                <option value="Excused">Excused</option>
                <option value="Absent">Absent</option>
                <option value="Tardy">Tardy</option>
              </select>
              <input
                placeholder="Morning check-in note"
                value={attendanceForm.notes}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, notes: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream text-xs font-semibold"
              >
                Save Attendance
              </button>
            </form>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft space-y-2.5">
            <h2 className="font-serif text-lg font-bold mb-2">Attendance Roll History</h2>
            {overview.attendance.map((a) => (
              <div
                key={a.id}
                className="p-3.5 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-beige-200 dark:border-forest-800 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold">{a.childName} • {a.date}</p>
                  <p className="text-forest-600 dark:text-beige-300">{a.classroom} {a.notes ? `— ${a.notes}` : ''}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-sage-100 dark:bg-forest-800 font-semibold">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          7. DAILY LEARNING LOGS MANAGEMENT
         ========================================================= */}
      {section === 'logs' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft">
            <h2 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
              <NotebookPen className="w-4 h-4 text-forest-600" />
              <span>Publish Daily Learning Log</span>
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const childId = logForm.childId || overview.students[0]?.id || '';
                runMutation(
                  '/api/admin/logs',
                  'POST',
                  { ...logForm, childId },
                  'Learning log published and parent notified.'
                );
                setLogForm({ ...logForm, title: '', description: '', teacherObservations: '', materialsUsed: '' });
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={logForm.childId || overview.students[0]?.id || ''}
                  onChange={(e) => setLogForm({ ...logForm, childId: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
                >
                  {overview.students.map((s) => (
                    <option key={s.id} value={s.id}>Student: {s.name}</option>
                  ))}
                </select>
                <input
                  required
                  placeholder="Observation Title"
                  value={logForm.title}
                  onChange={(e) => setLogForm({ ...logForm, title: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
                />
                <select
                  value={logForm.category}
                  onChange={(e) => setLogForm({ ...logForm, category: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
                >
                  {['Practical Life', 'Sensorial', 'Mathematics', 'Language', 'Nature & Ecology', 'Social Grace'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <textarea
                required
                rows={2}
                placeholder="Activity description & Montessori materials used..."
                value={logForm.description}
                onChange={(e) => setLogForm({ ...logForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream text-xs font-semibold"
              >
                Publish Log to Parent Portal
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {overview.logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft flex justify-between items-start gap-4 text-xs"
              >
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sage-100 dark:bg-forest-800 font-semibold text-[11px]">
                    {log.childName} • {log.category}
                  </span>
                  <h3 className="font-serif text-base font-bold mt-1.5">{log.title}</h3>
                  <p className="text-forest-700 dark:text-beige-200 mt-1">{log.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => runMutation(`/api/admin/logs/${log.id}`, 'DELETE', undefined, 'Deleted learning log.')}
                  className="text-terracotta font-semibold hover:underline flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          8. TEACHER REPORTS MANAGEMENT
         ========================================================= */}
      {section === 'reports' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft">
            <h2 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-forest-600" />
              <span>Issue Pedagogical Progress Report</span>
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const childId = reportForm.childId || overview.students[0]?.id || '';
                runMutation('/api/admin/reports', 'POST', { ...reportForm, childId }, 'Teacher report published.');
                setReportForm({ ...reportForm, reportTitle: '', overallProgress: '' });
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={reportForm.childId || overview.students[0]?.id || ''}
                  onChange={(e) => setReportForm({ ...reportForm, childId: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
                >
                  {overview.students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <input
                  required
                  placeholder="Report Title"
                  value={reportForm.reportTitle}
                  onChange={(e) => setReportForm({ ...reportForm, reportTitle: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
                />
                <input
                  placeholder="Term (e.g. Winter Term 2026)"
                  value={reportForm.term}
                  onChange={(e) => setReportForm({ ...reportForm, term: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
                />
              </div>
              <textarea
                required
                rows={2}
                placeholder="Overall developmental progress evaluation..."
                value={reportForm.overallProgress}
                onChange={(e) => setReportForm({ ...reportForm, overallProgress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream text-xs font-semibold"
              >
                Publish Report
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {overview.reports.map((rep) => (
              <div
                key={rep.id}
                className="p-5 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft flex justify-between items-start gap-4 text-xs"
              >
                <div>
                  <p className="font-semibold text-forest-700 dark:text-sage-300">
                    {rep.childName} • {rep.term} • {rep.progressGrade}
                  </p>
                  <h3 className="font-serif text-base font-bold mt-1">{rep.reportTitle}</h3>
                  <p className="text-forest-700 dark:text-beige-200 mt-1">{rep.overallProgress}</p>
                </div>
                <button
                  type="button"
                  onClick={() => runMutation(`/api/admin/reports/${rep.id}`, 'DELETE', undefined, 'Deleted teacher report.')}
                  className="text-terracotta font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          9. EVENTS MANAGEMENT
         ========================================================= */}
      {section === 'events' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft">
            <h2 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-forest-600" />
              <span>Schedule Pod Community Event</span>
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runMutation('/api/admin/events', 'POST', eventForm, 'Community event scheduled.');
                setEventForm({ ...eventForm, title: '', date: '', description: '' });
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
            >
              <input
                required
                placeholder="Event Title"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <input
                required
                placeholder="Date (e.g. Jan 15, 2027)"
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <input
                placeholder="Location"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream text-xs font-semibold"
              >
                Create Event
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overview.events.map((evt) => (
              <div
                key={evt.id}
                className="p-5 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft flex justify-between items-start gap-3 text-xs"
              >
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sage-100 dark:bg-forest-800 font-semibold">
                    {evt.date} • {evt.time}
                  </span>
                  <h3 className="font-serif text-base font-bold mt-2">{evt.title}</h3>
                  <p className="text-forest-600 dark:text-beige-300 mt-0.5">{evt.location} • {evt.audience}</p>
                  <p className="text-forest-700 dark:text-beige-200 mt-1.5">{evt.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => runMutation(`/api/admin/events/${evt.id}`, 'DELETE', undefined, 'Event deleted.')}
                  className="text-terracotta font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          10. TUITION & PAYMENTS MANAGEMENT
         ========================================================= */}
      {section === 'tuition' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft">
            <h2 className="font-serif text-lg font-bold mb-4">Issue Tuition Invoice / Charge</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const childId = chargeForm.childId || overview.students[0]?.id || '';
                runMutation(
                  '/api/admin/tuition/charges',
                  'POST',
                  { ...chargeForm, childId, amount: Number(chargeForm.amount) },
                  'Invoice added to family ledger.'
                );
                setChargeForm({ ...chargeForm, description: '' });
              }}
              className="grid grid-cols-1 sm:grid-cols-4 gap-3"
            >
              <select
                value={chargeForm.childId || overview.students[0]?.id || ''}
                onChange={(e) => setChargeForm({ ...chargeForm, childId: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              >
                {overview.students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <input
                required
                placeholder="Charge Description"
                value={chargeForm.description}
                onChange={(e) => setChargeForm({ ...chargeForm, description: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <input
                required
                type="number"
                min="1"
                placeholder="Amount ($)"
                value={chargeForm.amount}
                onChange={(e) => setChargeForm({ ...chargeForm, amount: e.target.value })}
                className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream text-xs font-semibold"
              >
                Issue Invoice
              </button>
            </form>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft space-y-3">
            <h2 className="font-serif text-lg font-bold">Campus Payment Ledger</h2>
            {overview.payments.map((pay) => (
              <div
                key={pay.id}
                className="p-3.5 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-beige-200 dark:border-forest-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <p className="font-semibold">
                    {pay.childName} ({pay.parentName}) — ${pay.amount.toLocaleString()}
                  </p>
                  <p className="text-forest-600 dark:text-beige-300">
                    {pay.description} • {pay.date} • {pay.receiptNumber}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full font-semibold ${
                      pay.status === 'Paid'
                        ? 'bg-sage-100 text-forest-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {pay.status}
                  </span>
                  {pay.status !== 'Paid' && (
                    <button
                      type="button"
                      onClick={() =>
                        runMutation(`/api/admin/payments/${pay.id}`, 'PATCH', { status: 'Paid' }, 'Marked invoice paid.')
                      }
                      className="px-3 py-1 rounded-lg bg-forest-700 text-cream font-semibold"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          11. NOTIFICATIONS MANAGEMENT
         ========================================================= */}
      {section === 'notifications' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft">
            <h2 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-forest-600" />
              <span>Send Parent Announcement / Alert</span>
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runMutation('/api/admin/notifications', 'POST', notifForm, 'Notification dispatched.');
                setNotifForm({ ...notifForm, title: '', message: '' });
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={notifForm.userId}
                  onChange={(e) => setNotifForm({ ...notifForm, userId: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
                >
                  <option value="">All Registered Parents</option>
                  {overview.parents.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <select
                  value={notifForm.type}
                  onChange={(e) => setNotifForm({ ...notifForm, type: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
                >
                  <option value="announcement">Announcement</option>
                  <option value="event">Event</option>
                  <option value="tuition">Tuition</option>
                  <option value="log">Learning Log</option>
                </select>
                <input
                  required
                  placeholder="Notification Title"
                  value={notifForm.title}
                  onChange={(e) => setNotifForm({ ...notifForm, title: e.target.value })}
                  className="px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
                />
              </div>
              <textarea
                required
                rows={2}
                placeholder="Write notification message for parents..."
                value={notifForm.message}
                onChange={(e) => setNotifForm({ ...notifForm, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream text-xs font-semibold"
              >
                Dispatch Notification
              </button>
            </form>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft space-y-2.5">
            <h2 className="font-serif text-lg font-bold">Recent Family Dispatches</h2>
            {overview.notifications.slice(0, 15).map((n) => (
              <div
                key={n.id}
                className="p-3 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-beige-200 dark:border-forest-800 text-xs"
              >
                <div className="flex justify-between font-semibold">
                  <span>{n.title}</span>
                  <span className="text-forest-600 dark:text-sage-300">To: {n.recipientName}</span>
                </div>
                <p className="text-forest-700 dark:text-beige-200 mt-1">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          12. WEBSITE CONTENT MANAGEMENT (CMS)
         ========================================================= */}
      {section === 'cms' && (
        <div className="space-y-4">
          {overview.cmsContent.map((block) => {
            const draft = cmsDrafts[block.key] || {
              title: block.title,
              subtitle: block.subtitle,
              body: block.body,
            };
            return (
              <div
                key={block.key}
                className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-lg font-bold">{block.section}</h2>
                  <span className="text-[11px] font-mono text-forest-500">Key: {block.key}</span>
                </div>
                <input
                  value={draft.title}
                  onChange={(e) =>
                    setCmsDrafts({ ...cmsDrafts, [block.key]: { ...draft, title: e.target.value } })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs font-semibold"
                />
                <input
                  value={draft.subtitle}
                  onChange={(e) =>
                    setCmsDrafts({ ...cmsDrafts, [block.key]: { ...draft, subtitle: e.target.value } })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
                />
                <textarea
                  rows={2}
                  value={draft.body}
                  onChange={(e) =>
                    setCmsDrafts({ ...cmsDrafts, [block.key]: { ...draft, body: e.target.value } })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-xs"
                />
                <button
                  type="button"
                  onClick={() =>
                    runMutation(`/api/admin/cms/${block.key}`, 'PATCH', draft, `Saved CMS section "${block.section}".`)
                  }
                  className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream text-xs font-semibold"
                >
                  Save Content Block
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================
          13. ADMINISTRATIVE REPORTS
         ========================================================= */}
      {section === 'analytics' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold">Executive Administrative Reports</h2>
              <p className="text-xs text-forest-600 dark:text-beige-300 mt-1">
                Live enrollment capacity, tuition ledger recovery, and attendance health across classrooms.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream text-xs font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>Export Roster CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {overview.programs.map((p) => {
              const pct = Math.min(100, Math.round((p.enrolledCount / Math.max(1, p.capacity)) * 100));
              return (
                <div
                  key={p.id}
                  className="p-5 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft space-y-2 text-xs"
                >
                  <p className="font-serif text-base font-bold">{p.title}</p>
                  <p className="text-forest-600 dark:text-beige-300">
                    {p.enrolledCount} / {p.capacity} enrolled ({pct}%)
                  </p>
                  <div className="h-2.5 rounded-full bg-beige-200 dark:bg-forest-800 overflow-hidden">
                    <div className="h-full bg-forest-600 dark:bg-sage-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          14. SYSTEM SETTINGS
         ========================================================= */}
      {section === 'settings' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft max-w-2xl space-y-4">
          <h2 className="font-serif text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-forest-600" />
            <span>Global Pod System Settings</span>
          </h2>
          <div className="space-y-3 text-xs">
            {[
              { key: 'school_name', label: 'School / Pod Name' },
              { key: 'academic_year', label: 'Active Academic Cycle' },
              { key: 'observation_hours', label: 'Campus Observation Hours' },
              { key: 'session_timeout_hours', label: 'Default Session Timeout (Hours)' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block font-semibold uppercase tracking-wider text-forest-700 dark:text-sage-300 mb-1">
                  {field.label}
                </label>
                <input
                  value={currentSettings[field.key] || ''}
                  onChange={(e) =>
                    setSettingsDraft({ ...currentSettings, [field.key]: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-beige-300 dark:border-forest-700 text-sm"
                />
              </div>
            ))}

            <label className="flex items-center gap-2.5 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentSettings.allow_parent_registration !== 'false'}
                onChange={(e) =>
                  setSettingsDraft({
                    ...currentSettings,
                    allow_parent_registration: e.target.checked ? 'true' : 'false',
                  })
                }
                className="w-4 h-4 accent-forest-600"
              />
              <span className="font-semibold">Allow Self-Service Parent Account Registration (/register)</span>
            </label>
          </div>

          <button
            type="button"
            onClick={() => runMutation('/api/admin/settings', 'PATCH', currentSettings, 'System settings saved.')}
            className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream text-xs font-semibold"
          >
            Save Global Settings
          </button>
        </div>
      )}
    </div>
  );
};

