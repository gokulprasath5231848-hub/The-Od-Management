'use client';

import { useState, useEffect } from 'react';
import { Send, Calendar, FileText, Clock } from 'lucide-react';
import dataStore from '@/lib/data';
import { calculateDuration } from '@/lib/utils';
import { useToast } from '@/components/Toast';
import styles from '@/styles/dashboard.module.css';

export default function RequestODPage() {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [eventName, setEventName] = useState('');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('campusod_session');
    if (session) setCurrentUser(JSON.parse(session));
  }, []);

  const duration = startDate && endDate && endDate >= startDate ? calculateDuration(startDate, endDate) : '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventName.trim() || !reason.trim() || !startDate || !endDate) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    if (endDate < startDate) {
      showToast('End date must be on or after start date', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      dataStore.createOdRequest({
        studentId: currentUser.id,
        eventName: eventName.trim(),
        reason: reason.trim(),
        startDate,
        endDate,
        duration,
      });
      showToast('OD request submitted successfully! It will be reviewed by your HOD.', 'success');
      setEventName('');
      setReason('');
      setStartDate('');
      setEndDate('');
    } catch (err) {
      showToast('Failed to submit. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) return <div className={styles.loadingScreen}><div className={styles.loadingSpinner}></div></div>;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', maxWidth: '700px' }}>
      <div style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        backdropFilter: 'var(--glass-blur)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} color="#6366f1" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Request On-Duty</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Submit a new OD request for approval</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="od-event">Event / Activity Name *</label>
            <input id="od-event" type="text" className="input" value={eventName} onChange={e => setEventName(e.target.value)} placeholder="e.g., Inter-College Hackathon" required />
          </div>

          <div>
            <label htmlFor="od-reason">Reason / Description *</label>
            <textarea id="od-reason" className="textarea" value={reason} onChange={e => setReason(e.target.value)} placeholder="Describe why you need on-duty leave..." required rows={4} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label htmlFor="od-start">Start Date *</label>
              <input id="od-start" type="date" className="input" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="od-end">End Date *</label>
              <input id="od-end" type="date" className="input" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} required />
            </div>
          </div>

          {duration && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'rgba(99,102,241,0.08)', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.15)' }}>
              <Clock size={16} color="#6366f1" />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Duration: <strong style={{ color: 'var(--text-primary)' }}>{duration}</strong></span>
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '12px 24px', fontSize: '0.95rem', marginTop: '8px' }}>
            <Send size={18} />
            {isSubmitting ? 'Submitting...' : 'Submit OD Request'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(99,102,241,0.05)', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.1)' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Approval Flow:</strong> Your request will go through Head of Department → Principal for approval.
        </p>
      </div>
    </div>
  );
}
