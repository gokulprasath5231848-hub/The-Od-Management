'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileCheck, ExternalLink, Calendar, Inbox } from 'lucide-react';
import dataStore, { OD_STATUS } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import OdLetterTemplate from '@/components/OdLetterTemplate';
import styles from '@/styles/dashboard.module.css';
import compStyles from '@/styles/components.module.css';

export default function StudentLettersPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [letters, setLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('campusod_session');
    if (session) {
      const user = JSON.parse(session);
      setCurrentUser(user);
      const reqs = dataStore.getStudentOdRequests(user.id)
        .filter(r => r.status === OD_STATUS.APPROVED)
        .map(r => dataStore.enrichOdRequest(r));
      setLetters(reqs);
    }
  }, []);

  if (!currentUser) return <div className={styles.loadingScreen}><div className={styles.loadingSpinner}></div></div>;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <h2 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FileCheck size={20} color="#22c55e" /> Approved OD Letters
      </h2>

      {letters.length === 0 ? (
        <div className={styles.emptyState}>
          <Inbox size={48} style={{ marginBottom: '12px', opacity: 0.3 }} />
          <p>No approved OD letters yet.</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Once your OD requests are fully approved, letters will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
          {letters.map(letter => (
            <div key={letter.id} style={{
              background: 'var(--glass-bg)',
              border: '1px solid rgba(34,197,94,0.15)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all var(--transition-base)',
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(34,197,94,0.35)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(34,197,94,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{letter.eventName}</h3>
                <span className="badge-approved">Approved</span>
              </div>
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <Calendar size={14} />
                {formatDate(letter.startDate)} – {formatDate(letter.endDate)} ({letter.duration})
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button className="btn btn-sm btn-primary" onClick={(e) => { e.stopPropagation(); router.push(`/od-letter/${letter.id}`); }}>
                  <ExternalLink size={14} /> View Letter
                </button>
                <button className="btn btn-sm btn-ghost" onClick={(e) => { e.stopPropagation(); setSelectedLetter(letter); }}>
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {selectedLetter && (
        <div className={compStyles.modalOverlay} onClick={() => setSelectedLetter(null)}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', width: '90%', maxHeight: '90vh', overflowY: 'auto', margin: '5vh auto', borderRadius: '16px' }}>
            <OdLetterTemplate odRequest={selectedLetter} />
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <button className="btn btn-ghost" onClick={() => setSelectedLetter(null)}>Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
