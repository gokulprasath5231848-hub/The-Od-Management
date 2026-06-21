'use client';

import {
  GraduationCap,
  LayoutDashboard,
  FilePlus,
  FileCheck,
  Clock,
  History,
  ShieldCheck,
  BarChart3,
  Music,
  CheckCheck,
  CalendarPlus,
  Calendar,
} from 'lucide-react';
import styles from '@/styles/dashboard.module.css';

const NAV_ITEMS = {
  STUDENT: [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'request', icon: FilePlus, label: 'Request OD' },
    { id: 'letters', icon: FileCheck, label: 'My OD Letters' },
  ],
  CLASS_TEACHER: [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'pending', icon: Clock, label: 'Pending Approvals' },
    { id: 'history', icon: History, label: 'History' },
  ],
  HOD: [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'pending', icon: Clock, label: 'Pending Approvals' },
    { id: 'independent', icon: ShieldCheck, label: 'Independent Approve' },
    { id: 'overview', icon: BarChart3, label: 'Dept Overview' },
  ],
  PRINCIPAL: [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'pending', icon: Clock, label: 'Pending Approvals' },
    { id: 'cultural', icon: Music, label: 'Cultural Event ODs' },
    { id: 'mass', icon: CheckCheck, label: 'Mass Approve' },
  ],
  CULTURAL_STAFF: [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'create', icon: CalendarPlus, label: 'Create Event' },
    { id: 'events', icon: Calendar, label: 'Event History' },
  ],
};

const ROLE_ACCENT = {
  STUDENT: '#06b6d4',
  CLASS_TEACHER: '#f59e0b',
  HOD: '#8b5cf6',
  PRINCIPAL: '#10b981',
  CULTURAL_STAFF: '#f43f5e',
};

const ROLE_LABEL = {
  STUDENT: 'Student',
  CLASS_TEACHER: 'Class Teacher',
  HOD: 'Head of Dept',
  PRINCIPAL: 'Principal',
  CULTURAL_STAFF: 'Cultural Staff',
};

export default function Sidebar({ currentUser, activePage, onNavigate }) {
  const role = currentUser?.role || 'STUDENT';
  const items = NAV_ITEMS[role] || NAV_ITEMS.STUDENT;
  const accent = ROLE_ACCENT[role] || '#6366f1';

  const initials = (currentUser?.name || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarLogo}>
          <GraduationCap size={20} color="#fff" />
        </div>
        <div className={styles.sidebarBrand}>
          <h1>CampusOD</h1>
          <span>On-Duty System</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.sidebarNav}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              onClick={() => onNavigate?.(item.id)}
              style={
                isActive
                  ? {
                      background: `${accent}15`,
                      color: accent,
                    }
                  : undefined
              }
            >
              <Icon size={18} className={styles.navIcon} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer — User Info */}
      <div className={styles.sidebarFooter}>
        <div className={styles.userCard}>
          <div
            className={styles.userAvatar}
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
          >
            {initials}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{currentUser?.name || 'User'}</div>
            <div className={styles.userRole}>{ROLE_LABEL[role] || role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
