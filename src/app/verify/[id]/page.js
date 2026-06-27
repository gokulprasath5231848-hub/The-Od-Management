'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, XCircle, Clock, GraduationCap, Calendar, User, Shield } from 'lucide-react';
import dataStore, { OD_STATUS, STATUS_LABELS } from '@/lib/data';
import { formatDate, formatDateTime, getRoleLabel, getStatusColor } from '@/lib/utils';


export default function VerifyPage() {
  const params = useParams();
  const [odRequest, setOdRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (params.id) {
      const request = dataStore.getOdRequest(params.id);
      if (request) {
        setOdRequest(dataStore.enrichOdRequest(request));
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }
  }, [params.id]);

  const isApproved = odRequest?.status === OD_STATUS.APPROVED;
  const isRejected = odRequest?.status === OD_STATUS.REJECTED;
  const isCancelled = odRequest?.status === OD_STATUS.CANCELLED;

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <Clock size={48} color="#f59e0b" />
          <h2 style={{ marginTop: '16px', color: '#f0f0f5' }}>Verifying...</h2>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <XCircle size={64} color="#ef4444" />
          <h2 style={{ marginTop: '16px', color: '#ef4444' }}>Invalid OD Certificate</h2>
          <p style={{ color: '#8888a0', marginTop: '8px' }}>This OD certificate ID does not exist or is invalid.</p>
          <p style={{ color: '#55556a', marginTop: '4px', fontSize: '0.85rem' }}>ID: {params.id}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ ...cardStyle, maxWidth: '600px' }}>
        {/* Status Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {isApproved ? (
            <CheckCircle size={64} color="#22c55e" />
          ) : isRejected || isCancelled ? (
            <XCircle size={64} color={isCancelled ? '#f59e0b' : '#ef4444'} />
          ) : (
            <Clock size={64} color="#f59e0b" />
          )}
          <h1 style={{ 
            marginTop: '16px', 
            fontSize: '1.5rem', 
            color: isApproved ? '#22c55e' : isRejected ? '#ef4444' : isCancelled ? '#f59e0b' : '#f59e0b',
            fontWeight: 700 
          }}>
            {isApproved ? 'VERIFIED \u2014 OD Certificate Valid' : isRejected ? 'REJECTED \u2014 OD Not Approved' : isCancelled ? 'CANCELLED \u2014 OD Revoked by Principal' : 'PENDING \u2014 Approval In Progress'}
          </h1>
          <p style={{ color: '#8888a0', marginTop: '4px' }}>
            Status: {STATUS_LABELS[odRequest.status]}
          </p>
        </div>

        {/* Details */}
        <div style={{ display: 'grid', gap: '16px' }}>
          <DetailRow icon={<User size={18} />} label="Student" value={odRequest.student?.name || 'Unknown'} />
          <DetailRow icon={<GraduationCap size={18} />} label="Roll No" value={odRequest.student?.rollNo || ''} />
          <DetailRow icon={<Shield size={18} />} label="Department" value={odRequest.department?.name || ''} />
          <DetailRow icon={<Calendar size={18} />} label="Event" value={odRequest.eventName} />
          <DetailRow icon={<Calendar size={18} />} label="Dates" value={`${formatDate(odRequest.startDate)} \u2013 ${formatDate(odRequest.endDate)}`} />
          <DetailRow icon={<Clock size={18} />} label="Duration" value={odRequest.duration} />
        </div>

        {/* Approval Chain */}
        {odRequest.approvals && odRequest.approvals.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f0f0f5', marginBottom: '16px' }}>Approval Chain</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {odRequest.approvals.map((approval, index) => (
                <div key={index} style={{
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  border: `1px solid ${approval.action === 'APPROVED' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#f0f0f5', fontWeight: 500 }}>
                      {approval.approver?.name || 'Unknown'}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: approval.action === 'APPROVED' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: approval.action === 'APPROVED' ? '#22c55e' : '#ef4444',
                    }}>
                      {approval.action}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#8888a0', marginTop: '4px' }}>
                    {getRoleLabel(approval.level === 'CT' ? 'CLASS_TEACHER' : approval.level)} \u2022 {formatDateTime(approval.timestamp)}
                  </div>
                  {approval.remarks && (
                    <div style={{ fontSize: '0.8rem', color: '#55556a', marginTop: '4px', fontStyle: 'italic' }}>
                      &quot;{approval.remarks}&quot;
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OD ID */}
        <div style={{ marginTop: '24px', textAlign: 'center', color: '#55556a', fontSize: '0.8rem' }}>
          OD Reference: {odRequest.id}
        </div>

        {/* Branding */}
        <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
          <p style={{ color: '#55556a', fontSize: '0.8rem' }}>
            Verified by <strong style={{ color: '#6366f1' }}>CampusOD</strong> \u2014 College On-Duty Management System
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '10px',
    }}>
      <span style={{ color: '#6366f1' }}>{icon}</span>
      <span style={{ color: '#8888a0', fontSize: '0.85rem', minWidth: '100px' }}>{label}</span>
      <span style={{ color: '#f0f0f5', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#0a0a0f',
  padding: '20px',
  fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
};

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '20px',
  padding: '40px',
  width: '100%',
  maxWidth: '500px',
  backdropFilter: 'blur(20px)',
  textAlign: 'center',
};
