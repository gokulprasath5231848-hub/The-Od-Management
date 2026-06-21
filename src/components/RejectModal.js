'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import compStyles from '@/styles/components.module.css';

export default function RejectModal({ isOpen, onClose, onSubmit, studentName }) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) setReason('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onSubmit(reason.trim());
    setReason('');
  };

  return (
    <div className={compStyles.modalOverlay} onClick={onClose}>
      <div className={compStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={20} color="#ef4444" />
          </div>
          <div>
            <h3 className={compStyles.modalTitle}>Reject OD Request</h3>
            {studentName && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Rejecting OD for <strong>{studentName}</strong></p>}
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <label htmlFor="reject-reason" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Reason for Rejection <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            id="reject-reason"
            className="textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a detailed reason for rejection..."
            maxLength={500}
            rows={4}
            style={{ width: '100%' }}
            autoFocus
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>{!reason.trim() ? 'Reason is required to reject' : ''}</span>
            <span>{reason.length}/500</span>
          </div>
        </div>

        <div className={compStyles.modalActions} style={{ marginTop: '20px' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-danger"
            onClick={handleSubmit}
            disabled={!reason.trim()}
          >
            Reject Request
          </button>
        </div>
      </div>
    </div>
  );
}
