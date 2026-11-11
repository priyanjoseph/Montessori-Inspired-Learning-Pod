import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { NotificationItem } from '../data/dashboardData';
import {
  Bell,
  CheckCheck,
  Trash2,
  BookOpen,
  FileCheck2,
  CreditCard,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification,
    clearAllNotifications
  } = useSettings();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'log' | 'report' | 'tuition' | 'event' | 'announcement'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter !== 'all') return n.type === activeFilter;
    return true;
  });

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'log':
        return <BookOpen className="w-5 h-5 text-forest-600" />;
      case 'report':
        return <FileCheck2 className="w-5 h-5 text-terracotta" />;
      case 'tuition':
        return <CreditCard className="w-5 h-5 text-forest-700" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-sage-600" />;
      case 'announcement':
      default:
        return <AlertCircle className="w-5 h-5 text-softbrown-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="rounded-4xl bg-white border border-beige-300 shadow-soft p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-sage-100 px-3 py-1 rounded-full border border-sage-200">
                Alerts & Updates
              </span>
              {unreadNotificationsCount > 0 && (
                <span className="text-xs font-bold text-terracotta bg-terracotta-50 px-2.5 py-1 rounded-full border border-terracotta-200">
                  {unreadNotificationsCount} Unread
                </span>
              )}
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-forest-900">
              Parent Notifications
            </h1>
            <p className="text-forest-700 text-xs sm:text-sm mt-1.5 leading-relaxed max-w-xl">
              Stay updated on newly published daily learning logs, quarterly teacher reports, tuition reminders, and school calendar events.
            </p>
          </div>

          {/* Global Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="px-4 py-2 rounded-full bg-forest-600 hover:bg-forest-700 text-cream text-xs font-semibold shadow-soft transition-colors flex items-center gap-1.5"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="px-4 py-2 rounded-full bg-beige-100 hover:bg-beige-200 text-forest-800 text-xs font-semibold border border-beige-300 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-terracotta" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-beige-200">
          <span className="text-xs font-semibold text-forest-700 mr-2 rtl:mr-0 rtl:ml-2">Filter:</span>
          {[
            { id: 'all', label: `All (${notifications.length})` },
            { id: 'unread', label: `Unread (${unreadNotificationsCount})` },
            { id: 'log', label: 'Learning Logs' },
            { id: 'report', label: 'Teacher Reports' },
            { id: 'tuition', label: 'Tuition' },
            { id: 'event', label: 'Events' },
            { id: 'announcement', label: 'Announcements' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === tab.id
                  ? 'bg-forest-600 text-cream shadow-sm'
                  : 'bg-beige-100/80 text-forest-800 hover:bg-beige-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-4xl border border-beige-300 p-8">
            <Bell className="w-12 h-12 text-forest-300 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-forest-900 mb-1">
              No notifications to display
            </h3>
            <p className="text-xs text-forest-600">
              {activeFilter === 'unread'
                ? "You are all caught up! You have zero unread notifications."
                : "No alerts match your current filter selection."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                !n.isRead
                  ? 'bg-white border-forest-400 shadow-soft'
                  : 'bg-white/80 border-beige-300 hover:bg-white'
              }`}
            >
              {/* Left Content */}
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  !n.isRead ? 'bg-sage-100 ring-2 ring-forest-500/30' : 'bg-beige-100'
                }`}>
                  {getIconForType(n.type)}
                </div>

                <div className="space-y-1 text-left rtl:text-right">
                  <div className="flex items-center gap-2">
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-terracotta" title="Unread" />
                    )}
                    <h3 className={`font-serif text-sm sm:text-base ${
                      !n.isRead ? 'font-bold text-forest-950' : 'font-semibold text-forest-900'
                    }`}>
                      {n.title}
                    </h3>
                  </div>

                  <p className="text-xs text-forest-700 leading-relaxed max-w-2xl">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-softbrown-400">
                    <span>{n.date}</span>
                    <span className="opacity-40">•</span>
                    <span className="capitalize font-medium text-forest-600">{n.type}</span>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {n.actionUrl && (
                  <Link
                    to={n.actionUrl}
                    onClick={() => markNotificationAsRead(n.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-cream hover:bg-beige-100 text-forest-900 text-xs font-semibold border border-beige-300 transition-colors inline-flex items-center gap-1"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                  </Link>
                )}

                {!n.isRead && (
                  <button
                    onClick={() => markNotificationAsRead(n.id)}
                    className="p-2 rounded-xl text-forest-600 hover:text-forest-900 hover:bg-beige-100 transition-colors"
                    title="Mark as Read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => clearNotification(n.id)}
                  className="p-2 rounded-xl text-softbrown-400 hover:text-terracotta hover:bg-terracotta-50 transition-colors"
                  title="Clear Notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};

