'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { CANCELLATION_REASONS } from '@/lib/data';
import compStyles from '@/styles/components.module.css';

export default function CancelOdModal({ isOpen, onClose, onSubmit, studentName, odId }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedReason('');
      setRemarks('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedReason) return;
    const reasonLabel = CANCELLATION_REASONS.find(r => r.id === selectedReason)?.label || selectedReason;
    onSubmit(reasonLabel, remarks.trim());
  };

  return (
    <div className={compStyles.modalOverlay} onClick={onClose}>
      <div className={compStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'rgba(245,158,11,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldAlert size={20} color="#f59e0b" />
          </div>
          <div>
            <h3 className={compStyles.modalTitle}>Cancel Approved OD</h3>
            {studentName && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Cancelling OD for <strong>{studentName}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Warning */}
        <div style={{
          marginTop: '16px', padding: '12px 14px',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.84rem', color: '#fbbf24', lineHeight: 1.5,
        }}>
          ⚠️ This will revoke a previously approved OD. The student will no longer be exempted from classes for this period.
        </div>

        {/* Reason Selection */}
        <div style={{ marginTop: '20px' }}>
          <label style={{
            display: 'block', marginBottom: '10px',
            fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)',
          }}>
            Reason for Cancellation <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CANCELLATION_REASONS.map(reason => (
              <label
                key={reason.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 14px',
                  background: selectedReason === reason.id
                    ? 'rgba(245,158,11,0.1)'
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selectedReason === reason.id
                    ? 'rgba(245,158,11,0.3)'
                    : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
                }}
              >
                <input
                  type="radio"
                  name="cancel-reason"
                  value={reason.id}
                  checked={selectedReason === reason.id}
                  onChange={() => setSelectedReason(reason.id)}
                  style={{ accentColor: '#f59e0b', width: '16px', height: '16px' }}
                />
                {reason.label}
              </label>
            ))}
          </div>
        </div>

        {/* Remarks */}
        <div style={{ marginTop: '16px' }}>
          <label htmlFor="cancel-remarks" style={{
            display: 'block', marginBottom: '8px',
            fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)',
          }}>
            Additional Remarks <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            id="cancel-remarks"
            className="textarea"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Provide any additional details..."
            maxLength={500}
            rows={3}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>{remarks.length}/500</span>
          </div>
        </div>

        {/* Actions */}
        <div className={compStyles.modalActions} style={{ marginTop: '20px' }}>
          <button className="btn btn-ghost" onClick={onClose}>Go Back</button>
          <button
            className="btn btn-danger"
            onClick={handleSubmit}
            disabled={!selectedReason}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ShieldAlert size={15} />
            Cancel OD
          </button>
        </div>
      </div>
    </div>
  );
}
