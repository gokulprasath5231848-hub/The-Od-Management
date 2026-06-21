'use client';

import { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, XCircle, Music, CheckCheck, BarChart3, Calendar, Inbox, Zap } from 'lucide-react';
import dataStore, { OD_STATUS, OD_TYPE } from '@/lib/data';
import { formatDate, getStatusColor } from '@/lib/utils';
import StatCard from '@/components/StatCard';
import OdRequestCard from '@/components/OdRequestCard';
import RejectModal from '@/components/RejectModal';
import { useToast } from '@/components/Toast';
import styles from '@/styles/dashboard.module.css';

export default function PrincipalDashboard() {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [pendingStudent, setPendingStudent] = useState([]);
  const [pendingCultural, setPendingCultural] = useState([]);
  const [events, setEvents] = useState([]);
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
    setStats(dataStore.getInstitutionStats());
    const pending = dataStore.getPrincipalPending().map(r => dataStore.enrichOdRequest(r));
    setPendingStudent(pending.filter(r => r.type === OD_TYPE.STUDENT_REQUEST));
    setPendingCultural(pending.filter(r => r.type === OD_TYPE.CULTURAL_EVENT));
    setEvents(dataStore.getEvents());
    setAllRequests(dataStore.getAllOdRequests().map(r => dataStore.enrichOdRequest(r)));
  };

  const handleApprove = (odId) => {
    dataStore.approveOd(odId, currentUser.id, 'Approved by Principal', 'PRINCIPAL');
    showToast('OD request approved', 'success');
    loadData(currentUser);
  };

  const handleReject = (reason) => {
    if (!rejectModal.request) return;
    dataStore.rejectOd(rejectModal.request.id, currentUser.id, reason, 'PRINCIPAL');
    showToast('OD request rejected', 'info');
    setRejectModal({ isOpen: false, request: null });
    loadData(currentUser);
  };

  const handleMassApprove = (eventId) => {
    const approved = dataStore.massApproveEvent(eventId, currentUser.id);
    showToast(`Mass approved ${approved.length} OD requests`, 'success');
    loadData(currentUser);
  };

  if (!currentUser || !stats) return <div className={styles.loadingScreen}><div className={styles.loadingSpinner}></div></div>;

  const getEventPendingCount = (eventId) => {
    return dataStore.getAllOdRequests().filter(r => r.eventId === eventId && r.status === OD_STATUS.PENDING_PRINCIPAL).length;
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard icon={Users} title="Total Students" value={stats.totalStudents} accentColor="#10b981" />
        <StatCard icon={BarChart3} title="Total Requests" value={stats.totalRequests} accentColor="#6366f1" />
        <StatCard icon={Clock} title="Pending" value={stats.pending} accentColor="#f59e0b" />
        <StatCard icon={CheckCircle} title="Approved" value={stats.approved} accentColor="#22c55e" />
      </div>

      {/* Student OD Pending */}
      <div style={{ marginTop: '32px' }}>
        <h2 className={styles.sectionTitle}>
          <Clock size={18} style={{ color: '#f59e0b', verticalAlign: 'middle', marginRight: '8px' }} />
          Student OD Requests ({pendingStudent.length})
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Approved by HOD, awaiting your final approval</p>
        {pendingStudent.length === 0 ? (
          <div className={styles.emptyState}><Inbox size={40} style={{ opacity: 0.3, marginBottom: '8px' }} /><p>No pending student OD requests.</p></div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {pendingStudent.map(req => (
              <OdRequestCard key={req.id} request={req} showActions={true}
                onApprove={() => handleApprove(req.id)}
                onReject={() => setRejectModal({ isOpen: true, request: req })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cultural Event ODs */}
      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Music size={20} color="#f43f5e" />
          <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Cultural Event ODs ({pendingCultural.length})</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Directly from Cultural Department (bypasses CT & HOD)</p>
        {pendingCultural.length === 0 ? (
          <div className={styles.emptyState}><p>No pending cultural event ODs.</p></div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {pendingCultural.map(req => (
              <OdRequestCard key={req.id} request={req} showActions={true}
                onApprove={() => handleApprove(req.id)}
                onReject={() => setRejectModal({ isOpen: true, request: req })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mass Approve */}
      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <CheckCheck size={20} color="#10b981" />
          <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Mass Approve — Cultural Events</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Approve all pending ODs for an event at once</p>
        {events.length === 0 ? (
          <div className={styles.emptyState}><p>No events created yet.</p></div>
        ) : (
          <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {events.map(event => {
              const pendingCount = getEventPendingCount(event.id);
              return (
                <div key={event.id} style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{event.name}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{event.description}</p>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Calendar size={14} /> {formatDate(event.date)} – {formatDate(event.endDate)}
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: pendingCount > 0 ? '#f59e0b' : 'var(--text-muted)' }}>
                      {pendingCount} pending OD{pendingCount !== 1 ? 's' : ''}
                    </span>
                    {pendingCount > 0 && (
                      <button className="btn btn-sm btn-primary" onClick={() => handleMassApprove(event.id)}>
                        <Zap size={14} /> Mass Approve All
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All Requests Table */}
      <div style={{ marginTop: '32px' }}>
        <h2 className={styles.sectionTitle}>All Institution Requests ({allRequests.length})</h2>
        {allRequests.length > 0 && (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead><tr><th>Student</th><th>Dept</th><th>Event</th><th>Type</th><th>Dates</th><th>Status</th></tr></thead>
              <tbody>
                {allRequests.slice(0, 20).map(req => (
                  <tr key={req.id}>
                    <td><div style={{ fontWeight: 500 }}>{req.student?.name}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.student?.rollNo}</div></td>
                    <td style={{ fontSize: '0.85rem' }}>{req.department?.name?.split(' ')[0]}</td>
                    <td>{req.eventName}</td>
                    <td><span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: req.type === OD_TYPE.CULTURAL_EVENT ? 'rgba(244,63,94,0.12)' : 'rgba(99,102,241,0.12)', color: req.type === OD_TYPE.CULTURAL_EVENT ? '#f43f5e' : '#6366f1' }}>
                      {req.type === OD_TYPE.CULTURAL_EVENT ? 'Cultural' : 'Student'}
                    </span></td>
                    <td style={{ fontSize: '0.85rem' }}>{formatDate(req.startDate)}</td>
                    <td><span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: `${getStatusColor(req.status)}18`, color: getStatusColor(req.status) }}>
                      {req.status === OD_STATUS.APPROVED ? 'Approved' : req.status === OD_STATUS.REJECTED ? 'Rejected' : 'Pending'}
                    </span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RejectModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ isOpen: false, request: null })} onSubmit={handleReject} studentName={rejectModal.request?.student?.name || ''} />
    </div>
  );
}
