import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ChildProfileData,
  DailyLogItem,
  NotificationItem,
  PaymentItem,
  TeacherReportItem,
  TuitionSummary,
} from '../data/dashboardData';
import { apiRequest } from '../lib/api';

export type HomeLayoutType = 'layout1' | 'layout2';
export type ThemeType = 'light' | 'dark';
export type UserRole = 'parent' | 'admin';

export interface NotificationPreferences {
  emailAlerts: boolean;
  dailyDigest: boolean;
  urgentSms: boolean;
  photoTagging: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  provider?: string;
  hasPassword?: boolean;
  emergencyContact?: string;
  dietaryNotes?: string;
  notificationPreferences: NotificationPreferences;
  createdAt?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  requestedRole?: 'parent' | 'teacher';
  childName?: string;
  childAge?: string;
  preferredProgram?: string;
  agreeToTerms?: boolean;
}

export interface RegisterResult {
  user?: UserProfile;
  pendingApproval?: boolean;
  requestedRole?: 'parent' | 'teacher';
  message?: string;
}

const EMPTY_CHILD_PROFILE: ChildProfileData = {
  name: '',
  photo: '',
  age: '',
  birthDate: '',
  program: '',
  classroom: '',
  enrollmentDate: '',
  assignedTeachers: [],
  attendanceStats: {
    totalDays: 0,
    presentDays: 0,
    excusedAbsences: 0,
    unexcusedAbsences: 0,
    tardyCount: 0,
    attendancePercentage: 100,
    consecutivePresentStreak: 0,
  },
  learningAreas: [],
};

const EMPTY_TUITION_SUMMARY: TuitionSummary = {
  totalTuitionFee: 0,
  amountPaid: 0,
  outstandingBalance: 0,
  nextPaymentDueDate: '—',
  paymentPlan: 'Standard Schedule',
  tuitionCycle: 'Academic Year 2026–2027',
};

interface ParentOverviewResponse {
  user: UserProfile;
  childProfile: ChildProfileData | null;
  dailyLogs: DailyLogItem[];
  teacherReports: TeacherReportItem[];
  tuitionSummary: TuitionSummary;
  paymentHistory: PaymentItem[];
  notifications: NotificationItem[];
}

interface SettingsContextType {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
  isRtl: boolean;
  toggleRtl: () => void;
  homeLayout: HomeLayoutType;
  setHomeLayout: (layout: HomeLayoutType) => void;
  toggleHomeLayout: () => void;

  // Modals State
  isTourModalOpen: boolean;
  openTourModal: () => void;
  closeTourModal: () => void;
  isEnrollModalOpen: boolean;
  selectedEnrollProgram: string;
  openEnrollModal: (programName?: string) => void;
  closeEnrollModal: () => void;

  // Auth & RBAC State
  user: UserProfile | null;
  authLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<UserProfile>;
  register: (payload: RegisterPayload) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  refreshPortalData: () => Promise<UserProfile | null>;

  // Parent Profile & Password
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;

  // Child Profile
  childProfile: ChildProfileData;
  updateChildProfile: (updates: Partial<ChildProfileData>) => Promise<void>;

  // Daily Logs & Comments
  dailyLogs: DailyLogItem[];
  addLogComment: (logId: string, text: string) => Promise<void>;

  // Teacher Reports
  teacherReports: TeacherReportItem[];

  // Tuition & Payments
  tuitionSummary: TuitionSummary;
  paymentHistory: PaymentItem[];
  processSimulatedPayment: (details: {
    amount: number;
    description: string;
    method: string;
    paymentId?: string;
  }) => Promise<{ success: boolean; receiptNumber: string }>;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  clearNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Theme (light/dark)
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('montessori_theme');
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  // 2. RTL / LTR layout direction
  const [isRtl, setIsRtl] = useState<boolean>(() => {
    return localStorage.getItem('montessori_dir') === 'rtl';
  });

  // 3. Homepage layout preference
  const [homeLayout, setHomeLayoutState] = useState<HomeLayoutType>(() => {
    const saved = localStorage.getItem('montessori_home_layout');
    return saved === 'layout1' || saved === 'layout2' ? saved : 'layout1';
  });

  // 4. Modals
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedEnrollProgram, setSelectedEnrollProgram] = useState('');

  // 5. Authenticated User (never seeded from hardcoded client defaults)
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // 6. Parent-only Portal State (hydrated strictly from backend for authenticated parents)
  const [childProfile, setChildProfile] = useState<ChildProfileData>(EMPTY_CHILD_PROFILE);
  const [dailyLogs, setDailyLogs] = useState<DailyLogItem[]>([]);
  const [teacherReports, setTeacherReports] = useState<TeacherReportItem[]>([]);
  const [tuitionSummary, setTuitionSummary] = useState<TuitionSummary>(EMPTY_TUITION_SUMMARY);
  const [paymentHistory, setPaymentHistory] = useState<PaymentItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const applyParentOverview = (data: ParentOverviewResponse) => {
    setUser(data.user);
    setChildProfile(data.childProfile || EMPTY_CHILD_PROFILE);
    setDailyLogs(data.dailyLogs || []);
    setTeacherReports(data.teacherReports || []);
    setTuitionSummary(data.tuitionSummary || EMPTY_TUITION_SUMMARY);
    setPaymentHistory(data.paymentHistory || []);
    setNotifications(data.notifications || []);
  };

  const resetPortalData = () => {
    setChildProfile(EMPTY_CHILD_PROFILE);
    setDailyLogs([]);
    setTeacherReports([]);
    setTuitionSummary(EMPTY_TUITION_SUMMARY);
    setPaymentHistory([]);
    setNotifications([]);
  };

  const hydrateSession = async (): Promise<UserProfile | null> => {
    try {
      const meRes = await apiRequest<{ authenticated: boolean; user: UserProfile | null }>('/api/auth/me');
      if (!meRes.user) {
        setUser(null);
        resetPortalData();
        return null;
      }

      if (meRes.user.role === 'parent') {
        const overview = await apiRequest<ParentOverviewResponse>('/api/parent/overview');
        applyParentOverview(overview);
        return overview.user;
      }

      setUser(meRes.user);
      resetPortalData();
      return meRes.user;
    } catch {
      setUser(null);
      resetPortalData();
      return null;
    }
  };

  // Clear legacy unauthenticated demo keys & hydrate real backend session
  useEffect(() => {
    localStorage.removeItem('montessori_user');
    localStorage.removeItem('montessori_child');
    localStorage.removeItem('montessori_logs');
    localStorage.removeItem('montessori_reports');
    localStorage.removeItem('montessori_tuition');
    localStorage.removeItem('montessori_payments');
    localStorage.removeItem('montessori_notifs');

    hydrateSession().finally(() => setAuthLoading(false));
  }, []);

  // Theme class sync
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('montessori_theme', theme);
  }, [theme]);

  // Direction sync
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    localStorage.setItem('montessori_dir', isRtl ? 'rtl' : 'ltr');
  }, [isRtl]);

  // Home layout sync
  useEffect(() => {
    localStorage.setItem('montessori_home_layout', homeLayout);
  }, [homeLayout]);

  const toggleTheme = () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  const setTheme = (newTheme: ThemeType) => setThemeState(newTheme);
  const toggleRtl = () => setIsRtl((prev) => !prev);
  const setHomeLayout = (layout: HomeLayoutType) => setHomeLayoutState(layout);
  const toggleHomeLayout = () => setHomeLayoutState((prev) => (prev === 'layout1' ? 'layout2' : 'layout1'));

  const openTourModal = () => setIsTourModalOpen(true);
  const closeTourModal = () => setIsTourModalOpen(false);
  const openEnrollModal = (programName = '') => {
    setSelectedEnrollProgram(programName);
    setIsEnrollModalOpen(true);
  };
  const closeEnrollModal = () => {
    setIsEnrollModalOpen(false);
    setSelectedEnrollProgram('');
  };

  // Auth Actions
  const login = async (email: string, password: string, rememberMe = true): Promise<UserProfile> => {
    const res = await apiRequest<{ user: UserProfile }>('/api/auth/login', {
      method: 'POST',
      body: { email, password, rememberMe },
    });

    if (res.user.role === 'parent') {
      const overview = await apiRequest<ParentOverviewResponse>('/api/parent/overview');
      applyParentOverview(overview);
      return overview.user;
    }

    setUser(res.user);
    resetPortalData();
    return res.user;
  };

  const register = async (payload: RegisterPayload): Promise<RegisterResult> => {
    const res = await apiRequest<RegisterResult>('/api/auth/register', {
      method: 'POST',
      body: payload,
    });
    if (res.pendingApproval) {
      return res;
    }
    const overview = await apiRequest<ParentOverviewResponse>('/api/parent/overview');
    applyParentOverview(overview);
    return { user: overview.user };
  };

  const logout = async (): Promise<void> => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      resetPortalData();
    }
  };

  const refreshPortalData = async (): Promise<UserProfile | null> => {
    return await hydrateSession();
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    const overview = await apiRequest<ParentOverviewResponse>('/api/parent/profile', {
      method: 'PATCH',
      body: updates,
    });
    applyParentOverview(overview);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await apiRequest('/api/parent/change-password', {
      method: 'POST',
      body: { currentPassword, newPassword },
    });
  };

  const updateChildProfile = async (updates: Partial<ChildProfileData>) => {
    const overview = await apiRequest<ParentOverviewResponse>('/api/parent/profile', {
      method: 'PATCH',
      body: { childProfile: updates },
    });
    applyParentOverview(overview);
  };

  const addLogComment = async (logId: string, text: string) => {
    const res = await apiRequest<{
      comment: { id: string; authorName: string; authorRole: string; text: string; createdAt: string };
      comments: { id: string; authorName: string; authorRole: string; text: string; createdAt: string }[];
    }>(`/api/parent/logs/${encodeURIComponent(logId)}/comments`, {
      method: 'POST',
      body: { text },
    });
    setDailyLogs((prev) =>
      prev.map((log) => (log.id === logId ? { ...log, comments: res.comments } : log))
    );
  };

  const processSimulatedPayment = async (details: {
    amount: number;
    description: string;
    method: string;
    paymentId?: string;
  }): Promise<{ success: boolean; receiptNumber: string }> => {
    const overview = await apiRequest<
      ParentOverviewResponse & { receiptNumber?: string; success?: boolean }
    >('/api/parent/payments', {
      method: 'POST',
      body: details,
    });
    applyParentOverview(overview);
    return {
      success: Boolean(overview.success ?? true),
      receiptNumber: overview.receiptNumber || overview.paymentHistory?.[0]?.receiptNumber || '',
    };
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const markNotificationAsRead = async (id: string) => {
    await apiRequest(`/api/parent/notifications/${encodeURIComponent(id)}/read`, {
      method: 'PATCH',
    });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = async () => {
    await apiRequest('/api/parent/notifications/read-all', { method: 'POST' });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotification = async (id: string) => {
    await apiRequest(`/api/parent/notifications/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = async () => {
    await apiRequest('/api/parent/notifications', { method: 'DELETE' });
    setNotifications([]);
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme,
        isRtl,
        toggleRtl,
        homeLayout,
        setHomeLayout,
        toggleHomeLayout,
        isTourModalOpen,
        openTourModal,
        closeTourModal,
        isEnrollModalOpen,
        selectedEnrollProgram,
        openEnrollModal,
        closeEnrollModal,
        user,
        authLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        refreshPortalData,
        updateUserProfile,
        changePassword,
        childProfile,
        updateChildProfile,
        dailyLogs,
        addLogComment,
        teacherReports,
        tuitionSummary,
        paymentHistory,
        processSimulatedPayment,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
