'use client';

import { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import dataStore, { OD_STATUS } from '@/lib/data';
import { formatDate, getStatusColor } from '@/lib/utils';
import StatCard from '@/components/StatCard';
import styles from '@/styles/dashboard.module.css';

export default function ClassTeacherDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [allRequests, setAllRequests] = useState([]);

  useEffect(() => {
    const session = localStorage.getItem('campusod_session');
    if (session) {
      const user = JSON.parse(session);
      setCurrentUser(user);
      loadData(user);
    }
  }, []);

  const loadData = (user) => {
    setStats(dataStore.getClassStats(user.classId));
    setAllRequests(dataStore.getClassOdRequests(user.classId).map(r => dataStore.enrichOdRequest(r)));
  };

  if (!currentUser || !stats) return <div className={styles.loadingScreen}><div className={styles.loadingSpinner}></div></div>;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard icon={Users} title="Total Students" value={stats.totalStudents} accentColor="#6366f1" />
        <StatCard icon={AlertCircle} title="Active OD" value={stats.activeOd} accentColor="#06b6d4" />
        <StatCard icon={Clock} title="Pending" value={stats.pending} accentColor="#f59e0b" />
        <StatCard icon={CheckCircle} title="Approved" value={stats.approved} accentColor="#22c55e" />
      </div>

      {/* All OD Requests — View Only */}
      <div style={{ marginTop: '32px' }}>
        <h2 className={styles.sectionTitle}>Class OD Requests ({allRequests.length})</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
          Overview of all OD requests from your class students
        </p>
        {allRequests.length === 0 ? (
          <div className={styles.emptyState}><p>No OD requests found.</p></div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Event</th>
                  <th>Dates</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allRequests.map(req => (
                  <tr key={req.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{req.student?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.student?.rollNo}</div>
                    </td>
                    <td>{req.eventName}</td>
                    <td style={{ fontSize: '0.85rem' }}>{formatDate(req.startDate)} – {formatDate(req.endDate)}</td>
                    <td>{req.duration}</td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: `${getStatusColor(req.status)}18`,
                        color: getStatusColor(req.status),
                        border: `1px solid ${getStatusColor(req.status)}30`,
                      }}>
                        {req.status === OD_STATUS.APPROVED ? 'Approved'
                          : req.status === OD_STATUS.REJECTED ? 'Rejected'
                          : req.status === OD_STATUS.CANCELLED ? 'Cancelled'
                          : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
