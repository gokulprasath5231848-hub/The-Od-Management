'use client';

import { useState, useEffect } from 'react';
import { Calendar, CalendarPlus, Users, Clock, CheckCircle, Send, Inbox, Music } from 'lucide-react';
import dataStore, { OD_STATUS, OD_TYPE } from '@/lib/data';
import { formatDate, getStatusColor } from '@/lib/utils';
import StatCard from '@/components/StatCard';
import StudentSelector from '@/components/StudentSelector';
import { useToast } from '@/components/Toast';
import styles from '@/styles/dashboard.module.css';

export default function CulturalDashboard() {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [eventOds, setEventOds] = useState([]);

  // Create event form
  const [eventName, setEventName] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [createdEvent, setCreatedEvent] = useState(null);

  // Student selection
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  // Add to existing event
  const [selectedEventId, setSelectedEventId] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('campusod_session');
    if (session) {
      const user = JSON.parse(session);
      setCurrentUser(user);
      loadData();
    }
  }, []);

  const loadData = () => {
    setEvents(dataStore.getEvents());
    setAllStudents(dataStore.getAllStudents());
    setEventOds(dataStore.getAllOdRequests().filter(r => r.type === OD_TYPE.CULTURAL_EVENT));
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!eventName.trim() || !eventStart || !eventEnd) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    const event = dataStore.createEvent({
      name: eventName.trim(),
      description: eventDesc.trim(),
      date: eventStart,
      endDate: eventEnd,
      createdBy: currentUser.id,
    });
    setCreatedEvent(event);
    showToast('Event created! Now select students to push OD.', 'success');
    setEventName('');
    setEventDesc('');
    setEventStart('');
    setEventEnd('');
    loadData();
  };

  const handlePushOd = (eventId) => {
    if (selectedStudentIds.length === 0) {
      showToast('Please select at least one student', 'error');
      return;
    }
    const results = dataStore.createBulkEventOd(eventId, selectedStudentIds, currentUser.id);
    showToast(`Pushed ${results.length} OD requests directly to Principal`, 'success');
    setSelectedStudentIds([]);
    setCreatedEvent(null);
    setSelectedEventId('');
    loadData();
  };

  if (!currentUser) return <div className={styles.loadingScreen}><div className={styles.loadingSpinner}></div></div>;

  const pendingCount = eventOds.filter(r => r.status === OD_STATUS.PENDING_PRINCIPAL).length;
  const approvedCount = eventOds.filter(r => r.status === OD_STATUS.APPROVED).length;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard icon={Calendar} title="Total Events" value={events.length} accentColor="#f43f5e" />
        <StatCard icon={Users} title="Event ODs" value={eventOds.length} accentColor="#6366f1" />
        <StatCard icon={Clock} title="Pending" value={pendingCount} accentColor="#f59e0b" />
        <StatCard icon={CheckCircle} title="Approved" value={approvedCount} accentColor="#22c55e" />
      </div>

      {/* Create Event */}
      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <CalendarPlus size={20} color="#f43f5e" />
          <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Create New Event</h2>
        </div>
        <div style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
        }}>
          <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="event-name">Event Name *</label>
              <input id="event-name" type="text" className="input" value={eventName} onChange={e => setEventName(e.target.value)} placeholder="e.g., TechFest 2026" required />
            </div>
            <div>
              <label htmlFor="event-desc">Description</label>
              <textarea id="event-desc" className="textarea" value={eventDesc} onChange={e => setEventDesc(e.target.value)} placeholder="Brief description of the event..." rows={3} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label htmlFor="event-start">Start Date *</label>
                <input id="event-start" type="date" className="input" value={eventStart} onChange={e => setEventStart(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="event-end">End Date *</label>
                <input id="event-end" type="date" className="input" value={eventEnd} onChange={e => setEventEnd(e.target.value)} min={eventStart} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              <CalendarPlus size={16} /> Create Event
            </button>
          </form>
        </div>
      </div>

      {/* After creating event, show student selector */}
      {createdEvent && (
        <div style={{ marginTop: '24px' }}>
          <div style={{
            background: 'rgba(244,63,94,0.05)',
            border: '1px solid rgba(244,63,94,0.15)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>
              Select Students for: {createdEvent.name}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>OD will be sent directly to the Principal for approval</p>
            <StudentSelector students={allStudents} selectedIds={selectedStudentIds} onSelectionChange={setSelectedStudentIds} />
            <button className="btn btn-primary" onClick={() => handlePushOd(createdEvent.id)} disabled={selectedStudentIds.length === 0} style={{ marginTop: '16px' }}>
              <Send size={16} /> Push {selectedStudentIds.length} OD{selectedStudentIds.length !== 1 ? 's' : ''} to Principal
            </button>
          </div>
        </div>
      )}

      {/* Add Students to Existing Event */}
      <div style={{ marginTop: '32px' }}>
        <h2 className={styles.sectionTitle}>
          <Users size={18} style={{ color: '#6366f1', verticalAlign: 'middle', marginRight: '8px' }} />
          Add Students to Existing Event
        </h2>
        <div style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
        }}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="select-event">Select Event</label>
            <select id="select-event" className="select" value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)}>
              <option value="">Choose an event...</option>
              {events.map(evt => (
                <option key={evt.id} value={evt.id}>{evt.name} ({formatDate(evt.date)})</option>
              ))}
            </select>
          </div>

          {selectedEventId && (
            <>
              <StudentSelector students={allStudents} selectedIds={selectedStudentIds} onSelectionChange={setSelectedStudentIds} />
              <button className="btn btn-primary" onClick={() => handlePushOd(selectedEventId)} disabled={selectedStudentIds.length === 0} style={{ marginTop: '16px' }}>
                <Send size={16} /> Push {selectedStudentIds.length} OD{selectedStudentIds.length !== 1 ? 's' : ''} to Principal
              </button>
            </>
          )}
        </div>
      </div>

      {/* Event History */}
      <div style={{ marginTop: '32px' }}>
        <h2 className={styles.sectionTitle}>
          <Music size={18} style={{ color: '#f43f5e', verticalAlign: 'middle', marginRight: '8px' }} />
          Event History
        </h2>
        {events.length === 0 ? (
          <div className={styles.emptyState}><Inbox size={40} style={{ opacity: 0.3, marginBottom: '8px' }} /><p>No events created yet.</p></div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {events.map(event => {
              const eOds = eventOds.filter(r => r.eventId === event.id);
              const ePending = eOds.filter(r => r.status === OD_STATUS.PENDING_PRINCIPAL).length;
              const eApproved = eOds.filter(r => r.status === OD_STATUS.APPROVED).length;
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
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{event.description}</p>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', gap: '16px', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {formatDate(event.date)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {eOds.length} students</span>
                    <span style={{ color: '#f59e0b' }}>{ePending} pending</span>
                    <span style={{ color: '#22c55e' }}>{eApproved} approved</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
