'use client';

import { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, XCircle, ShieldCheck, BarChart3, Inbox } from 'lucide-react';
import dataStore, { OD_STATUS } from '@/lib/data';
import { formatDate, getStatusColor } from '@/lib/utils';
import StatCard from '@/components/StatCard';
import OdRequestCard from '@/components/OdRequestCard';
import RejectModal from '@/components/RejectModal';
import { useToast } from '@/components/Toast';
import styles from '@/styles/dashboard.module.css';

export default function HodDashboard() {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [independentRequests, setIndependentRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, request: null, level: 'HOD' });

  useEffect(() => {
    const session = localStorage.getItem('campusod_session');
    if (session) {
      const user = JSON.parse(session);
      setCurrentUser(user);
      loadData(user);
    }
  }, []);

  const loadData = (user) => {
    setStats(dataStore.getDepartmentStats(user.departmentId));
    setPendingRequests(dataStore.getHodPending(user.departmentId).map(r => dataStore.enrichOdRequest(r)));
    setIndependentRequests(dataStore.getHodApprovable(user.departmentId).map(r => dataStore.enrichOdRequest(r)));
    setAllRequests(dataStore.getDepartmentOdRequests(user.departmentId).map(r => dataStore.enrichOdRequest(r)));
  };

  const handleApprove = (odId, level = 'HOD') => {
    dataStore.approveOd(odId, currentUser.id, level === 'HOD_INDEPENDENT' ? 'Directly approved by HOD' : 'Approved by HOD', level);
    showToast(level === 'HOD_INDEPENDENT' ? 'OD directly approved (skipped remaining hierarchy)' : 'OD approved and forwarded to Principal', 'success');
    loadData(currentUser);
  };

  const handleReject = (reason) => {
    if (!rejectModal.request) return;
    dataStore.rejectOd(rejectModal.request.id, currentUser.id, reason, 'HOD');
    showToast('OD request rejected', 'info');
    setRejectModal({ isOpen: false, request: null, level: 'HOD' });
    loadData(currentUser);
  };

  if (!currentUser || !stats) return <div className={styles.loadingScreen}><div className={styles.loadingSpinner}></div></div>;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard icon={Users} title="Dept Students" value={stats.totalStudents} accentColor="#8b5cf6" />
        <StatCard icon={BarChart3} title="Total Requests" value={stats.totalRequests} accentColor="#6366f1" />
        <StatCard icon={Clock} title="Pending" value={stats.pending} accentColor="#f59e0b" />
        <StatCard icon={CheckCircle} title="Approved" value={stats.approved} accentColor="#22c55e" />
      </div>

      {/* Pending HOD Approvals */}
      <div style={{ marginTop: '32px' }}>
        <h2 className={styles.sectionTitle}>
          <Clock size={18} style={{ color: '#f59e0b', verticalAlign: 'middle', marginRight: '8px' }} />
          Pending HOD Approval ({pendingRequests.length})
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Student OD requests awaiting your review</p>
        {pendingRequests.length === 0 ? (
          <div className={styles.emptyState}><Inbox size={40} style={{ opacity: 0.3, marginBottom: '8px' }} /><p>No pending approvals.</p></div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {pendingRequests.map(req => (
              <OdRequestCard key={req.id} request={req} showActions={true}
                onApprove={() => handleApprove(req.id, 'HOD')}
                onReject={() => setRejectModal({ isOpen: true, request: req, level: 'HOD' })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Independent Approval */}
      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <ShieldCheck size={20} color="#8b5cf6" />
          <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Independent Approval</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
          Directly approve any pending OD in your department (skips remaining hierarchy)
        </p>
        {independentRequests.length === 0 ? (
          <div className={styles.emptyState}><p>No requests available for independent approval.</p></div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {independentRequests.map(req => (
              <OdRequestCard key={req.id} request={req} showActions={true}
                onApprove={() => handleApprove(req.id, 'HOD_INDEPENDENT')}
                onReject={() => setRejectModal({ isOpen: true, request: req, level: 'HOD' })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Department Overview */}
      <div style={{ marginTop: '32px' }}>
        <h2 className={styles.sectionTitle}>Department Overview ({allRequests.length})</h2>
        {allRequests.length > 0 && (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead><tr><th>Student</th><th>Class</th><th>Event</th><th>Dates</th><th>Status</th></tr></thead>
              <tbody>
                {allRequests.map(req => (
                  <tr key={req.id}>
                    <td><div style={{ fontWeight: 500 }}>{req.student?.name}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.student?.rollNo}</div></td>
                    <td style={{ fontSize: '0.85rem' }}>{req.classInfo?.name}</td>
                    <td>{req.eventName}</td>
                    <td style={{ fontSize: '0.85rem' }}>{formatDate(req.startDate)} – {formatDate(req.endDate)}</td>
                    <td><span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: `${getStatusColor(req.status)}18`, color: getStatusColor(req.status), border: `1px solid ${getStatusColor(req.status)}30` }}>
                      {req.status === OD_STATUS.APPROVED ? 'Approved' : req.status === OD_STATUS.REJECTED ? 'Rejected' : req.status === OD_STATUS.CANCELLED ? 'Cancelled' : 'Pending'}
                    </span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RejectModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, request: null, level: 'HOD' })} onSubmit={handleReject} studentName={rejectModal.request?.student?.name || ''} />
    </div>
  );
}
