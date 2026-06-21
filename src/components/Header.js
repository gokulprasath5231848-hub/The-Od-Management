'use client';

import { LogOut } from 'lucide-react';
import { getRoleLabel, getRoleColor } from '@/lib/utils';
import styles from '@/styles/dashboard.module.css';

export default function Header({ currentUser, pageTitle, onLogout }) {
  const role = currentUser?.role || 'STUDENT';
  const accent = getRoleColor(role);

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.headerTitle}>{pageTitle || 'Dashboard'}</h1>
      </div>

      <div className={styles.headerActions}>
        <span
          className={styles.userBadge}
          style={{
            background: `${accent}18`,
            color: accent,
            border: `1px solid ${accent}30`,
          }}
        >
          {getRoleLabel(role)}
        </span>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {currentUser?.name || 'User'}
        </span>
        <button className={styles.logoutBtn} onClick={onLogout} title="Logout">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
