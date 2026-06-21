'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ToastProvider } from '@/components/Toast';
import styles from '@/styles/dashboard.module.css';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    const session = localStorage.getItem('campusod_session');
    if (!session) {
      router.push('/');
      return;
    }
    try {
      setCurrentUser(JSON.parse(session));
    } catch {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    // Derive active page from pathname
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 2) {
      setActivePage(segments[segments.length - 1]);
    } else {
      setActivePage('dashboard');
    }
  }, [pathname]);

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
    const rolePrefix = pathname.split('/').slice(0, 3).join('/');
    if (pageId === 'dashboard') {
      router.push(rolePrefix);
    } else {
      router.push(`${rolePrefix}/${pageId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('campusod_session');
    router.push('/');
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      request: 'Request On-Duty',
      letters: 'My OD Letters',
      pending: 'Pending Approvals',
      history: 'Approval History',
      independent: 'Independent Approve',
      overview: 'Department Overview',
      cultural: 'Cultural Event ODs',
      mass: 'Mass Approve',
      create: 'Create Event',
      events: 'Event History',
    };
    return titles[activePage] || 'Dashboard';
  };

  if (!currentUser) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className={styles.layout}>
        <Sidebar
          currentUser={currentUser}
          activePage={activePage}
          onNavigate={handleNavigate}
        />
        <div className={styles.main}>
          <Header
            currentUser={currentUser}
            pageTitle={getPageTitle()}
            onLogout={handleLogout}
          />
          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
