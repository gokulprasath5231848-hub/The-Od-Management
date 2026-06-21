'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, CheckCircle, Clock, XCircle, ExternalLink } from 'lucide-react';
import dataStore, { OD_STATUS, OD_TYPE, STATUS_LABELS } from '@/lib/data';
import { formatDate, formatDateTime, getStatusColor } from '@/lib/utils';
import StatCard from '@/components/StatCard';
import OdRequestCard from '@/components/OdRequestCard';
import ApprovalTimeline from '@/components/ApprovalTimeline';
import styles from '@/styles/dashboard.module.css';
import compStyles from '@/styles/components.module.css';

export default function StudentDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('campusod_session');
    if (session) {
      const user = JSON.parse(session);
      setCurrentUser(user);
      loadData(user.id);
    }
  }, []);

  const loadData = (userId) => {
    const reqs = dataStore.getStudentOdRequests(userId).map(r => dataStore.enrichOdRequest(r));
    setRequests(reqs);
  };

  if (!currentUser) return <div className={styles.loadingScreen}><div className={styles.loadingSpinner}></div></div>;

  const approved = requests.filter(r => r.status === OD_STATUS.APPROVED).length;
  const pending = requests.filter(r => ![OD_STATUS.APPROVED, OD_STATUS.REJECTED].includes(r.status)).length;
  const rejected = requests.filter(r => r.status === OD_STATUS.REJECTED).length;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard icon={FileText} title="Total Requests" value={requests.length} accentColor="#6366f1" />
        <StatCard icon={CheckCircle} title="Approved" value={approved} accentColor="#22c55e" />
        <StatCard icon={Clock} title="Pending" value={pending} accentColor="#f59e0b" />
        <StatCard icon={XCircle} title="Rejected" value={rejected} accentColor="#ef4444" />
      </div>

      {/* Request List */}
      <div style={{ marginTop: '32px' }}>
        <h2 className={styles.sectionTitle}>My OD Requests</h2>
        {requests.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText size={48} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p>No OD requests yet. Click &ldquo;Request OD&rdquo; to create one.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {requests.map(req => (
              <OdRequestCard
                key={req.id}
                request={req}
                showActions={false}
                onView={() => setSelectedRequest(req)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className={compStyles.modalOverlay} onClick={() => setSelectedRequest(null)}>
          <div className={compStyles.modalContent} onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3 className={compStyles.modalTitle}>{selectedRequest.eventName}</h3>
            <div style={{ margin: '16px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <p><strong>Student:</strong> {selectedRequest.student?.name} ({selectedRequest.student?.rollNo})</p>
              <p><strong>Dates:</strong> {formatDate(selectedRequest.startDate)} – {formatDate(selectedRequest.endDate)}</p>
              <p><strong>Duration:</strong> {selectedRequest.duration}</p>
              <p><strong>Reason:</strong> {selectedRequest.reason}</p>
              <p><strong>Status:</strong> <span style={{ color: getStatusColor(selectedRequest.status) }}>{STATUS_LABELS[selectedRequest.status]}</span></p>
              {selectedRequest.rejectionReason && (
                <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <p style={{ color: '#f87171', fontWeight: 500, marginBottom: '4px' }}>Rejection Reason:</p>
                  <p style={{ color: '#fca5a5' }}>{selectedRequest.rejectionReason}</p>
                  {selectedRequest.rejectedByUser && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>By: {selectedRequest.rejectedByUser.name}</p>}
                </div>
              )}
            </div>
            <ApprovalTimeline approvals={selectedRequest.approvals} currentStatus={selectedRequest.status} odType={selectedRequest.type} />
            <div className={compStyles.modalActions} style={{ marginTop: '20px' }}>
              {selectedRequest.status === OD_STATUS.APPROVED && (
                <button className="btn btn-primary" onClick={() => router.push(`/od-letter/${selectedRequest.id}`)}>
                  <ExternalLink size={16} /> View OD Letter
                </button>
              )}
              <button className="btn btn-ghost" onClick={() => setSelectedRequest(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
