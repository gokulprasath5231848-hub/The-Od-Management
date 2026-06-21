'use client';

import { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, XCircle, AlertCircle, Inbox } from 'lucide-react';
import dataStore, { OD_STATUS } from '@/lib/data';
import { formatDate, formatDateTime, getStatusColor } from '@/lib/utils';
import StatCard from '@/components/StatCard';
import OdRequestCard from '@/components/OdRequestCard';
import RejectModal from '@/components/RejectModal';
import { useToast } from '@/components/Toast';
import styles from '@/styles/dashboard.module.css';

export default function ClassTeacherDashboard() {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, request: null });

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
    setPendingRequests(dataStore.getClassTeacherPending(user.classId).map(r => dataStore.enrichOdRequest(r)));
    setAllRequests(dataStore.getClassOdRequests(user.classId).map(r => dataStore.enrichOdRequest(r)));
  };

  const handleApprove = (odId) => {
    dataStore.approveOd(odId, currentUser.id, 'Approved by Class Teacher', 'CT');
    showToast('OD request approved and forwarded to HOD', 'success');
    loadData(currentUser);
  };

  const handleReject = (reason) => {
    if (!rejectModal.request) return;
    dataStore.rejectOd(rejectModal.request.id, currentUser.id, reason, 'CT');
    showToast('OD request rejected', 'info');
    setRejectModal({ isOpen: false, request: null });
    loadData(currentUser);
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

      {/* Pending Approvals */}
      <div style={{ marginTop: '32px' }}>
        <h2 className={styles.sectionTitle}>
          <Clock size={18} style={{ color: '#f59e0b', verticalAlign: 'middle', marginRight: '8px' }} />
          Pending Approvals ({pendingRequests.length})
        </h2>
        {pendingRequests.length === 0 ? (
          <div className={styles.emptyState}>
            <Inbox size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <p>No pending approvals at this time.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {pendingRequests.map(req => (
              <OdRequestCard
                key={req.id}
                request={req}
                showActions={true}
                onApprove={() => handleApprove(req.id)}
                onReject={() => setRejectModal({ isOpen: true, request: req })}
              />
            ))}
          </div>
        )}
      </div>

      {/* All OD History */}
      <div style={{ marginTop: '32px' }}>
        <h2 className={styles.sectionTitle}>All Class OD Requests ({allRequests.length})</h2>
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
                        {req.status === OD_STATUS.APPROVED ? 'Approved' : req.status === OD_STATUS.REJECTED ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RejectModal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, request: null })}
        onSubmit={handleReject}
        studentName={rejectModal.request?.student?.name || ''}
      />
    </div>
  );
}
