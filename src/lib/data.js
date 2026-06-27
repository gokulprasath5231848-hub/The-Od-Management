'use client';

// ============================================================
// CampusOD — Data Service
// In-memory + localStorage data layer with demo seed data.
// Ready to swap for Supabase/Prisma when deployed to production.
// ============================================================

const STORAGE_KEY = 'campusod_data';

// ── Role Constants ──────────────────────────────────────────
export const ROLES = {
  STUDENT: 'STUDENT',
  CLASS_TEACHER: 'CLASS_TEACHER',
  HOD: 'HOD',
  PRINCIPAL: 'PRINCIPAL',
  CULTURAL_STAFF: 'CULTURAL_STAFF',
};

// ── Status Constants ────────────────────────────────────────
export const OD_STATUS = {
  PENDING_CT: 'PENDING_CT',
  APPROVED_CT: 'APPROVED_CT',
  PENDING_HOD: 'PENDING_HOD',
  APPROVED_HOD: 'APPROVED_HOD',
  PENDING_PRINCIPAL: 'PENDING_PRINCIPAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

export const OD_TYPE = {
  STUDENT_REQUEST: 'STUDENT_REQUEST',
  CULTURAL_EVENT: 'CULTURAL_EVENT',
};

// ── Status Labels ───────────────────────────────────────────
export const STATUS_LABELS = {
  [OD_STATUS.PENDING_CT]: 'Pending Class Teacher',
  [OD_STATUS.APPROVED_CT]: 'Approved by Class Teacher',
  [OD_STATUS.PENDING_HOD]: 'Pending HOD',
  [OD_STATUS.APPROVED_HOD]: 'Approved by HOD',
  [OD_STATUS.PENDING_PRINCIPAL]: 'Pending Principal',
  [OD_STATUS.APPROVED]: 'Fully Approved',
  [OD_STATUS.REJECTED]: 'Rejected',
  [OD_STATUS.CANCELLED]: 'Cancelled by Principal',
};

// ── Cancellation Reason Categories ──────────────────────────
export const CANCELLATION_REASONS = [
  { id: 'DISCIPLINARY_ACTION', label: 'Disciplinary Action' },
  { id: 'MISUSE', label: 'Misuse of OD' },
];

// ── Departments ─────────────────────────────────────────────
const DEPARTMENTS = [
  { id: 'CSE', name: 'Computer Science & Engineering' },
  { id: 'ECE', name: 'Electronics & Communication Engineering' },
  { id: 'MECH', name: 'Mechanical Engineering' },
];

// ── Classes ─────────────────────────────────────────────────
const CLASSES = [
  { id: 'CSE-A', name: 'CSE - Section A', departmentId: 'CSE', year: 3 },
  { id: 'CSE-B', name: 'CSE - Section B', departmentId: 'CSE', year: 3 },
  { id: 'ECE-A', name: 'ECE - Section A', departmentId: 'ECE', year: 3 },
  { id: 'ECE-B', name: 'ECE - Section B', departmentId: 'ECE', year: 3 },
  { id: 'MECH-A', name: 'MECH - Section A', departmentId: 'MECH', year: 3 },
  { id: 'MECH-B', name: 'MECH - Section B', departmentId: 'MECH', year: 3 },
];

// ── Seed Users ──────────────────────────────────────────────
const SEED_USERS = [
  // Students
  { id: 'STU001', name: 'Arun Kumar', email: 'student1', password: 'demo123', role: ROLES.STUDENT, departmentId: 'CSE', classId: 'CSE-A', rollNo: '21CS001' },
  { id: 'STU002', name: 'Priya Sharma', email: 'student2', password: 'demo123', role: ROLES.STUDENT, departmentId: 'CSE', classId: 'CSE-A', rollNo: '21CS002' },
  { id: 'STU003', name: 'Rahul Verma', email: 'student3', password: 'demo123', role: ROLES.STUDENT, departmentId: 'CSE', classId: 'CSE-B', rollNo: '21CS003' },
  { id: 'STU004', name: 'Sneha Patel', email: 'student4', password: 'demo123', role: ROLES.STUDENT, departmentId: 'ECE', classId: 'ECE-A', rollNo: '21EC001' },
  { id: 'STU005', name: 'Vikram Singh', email: 'student5', password: 'demo123', role: ROLES.STUDENT, departmentId: 'ECE', classId: 'ECE-A', rollNo: '21EC002' },
  { id: 'STU006', name: 'Deepa Nair', email: 'student6', password: 'demo123', role: ROLES.STUDENT, departmentId: 'ECE', classId: 'ECE-B', rollNo: '21EC003' },
  { id: 'STU007', name: 'Karthik Raja', email: 'student7', password: 'demo123', role: ROLES.STUDENT, departmentId: 'MECH', classId: 'MECH-A', rollNo: '21ME001' },
  { id: 'STU008', name: 'Anitha Devi', email: 'student8', password: 'demo123', role: ROLES.STUDENT, departmentId: 'MECH', classId: 'MECH-A', rollNo: '21ME002' },
  { id: 'STU009', name: 'Suresh Babu', email: 'student9', password: 'demo123', role: ROLES.STUDENT, departmentId: 'MECH', classId: 'MECH-B', rollNo: '21ME003' },
  { id: 'STU010', name: 'Lakshmi Priya', email: 'student10', password: 'demo123', role: ROLES.STUDENT, departmentId: 'CSE', classId: 'CSE-A', rollNo: '21CS004' },
  { id: 'STU011', name: 'Mohan Raj', email: 'student11', password: 'demo123', role: ROLES.STUDENT, departmentId: 'CSE', classId: 'CSE-B', rollNo: '21CS005' },
  { id: 'STU012', name: 'Divya Krishnan', email: 'student12', password: 'demo123', role: ROLES.STUDENT, departmentId: 'ECE', classId: 'ECE-A', rollNo: '21EC004' },

  // Class Teachers
  { id: 'CT001', name: 'Dr. Ramesh Kumar', email: 'teacher1', password: 'demo123', role: ROLES.CLASS_TEACHER, departmentId: 'CSE', classId: 'CSE-A' },
  { id: 'CT002', name: 'Prof. Saranya Devi', email: 'teacher2', password: 'demo123', role: ROLES.CLASS_TEACHER, departmentId: 'CSE', classId: 'CSE-B' },
  { id: 'CT003', name: 'Dr. Venkat Subramanian', email: 'teacher3', password: 'demo123', role: ROLES.CLASS_TEACHER, departmentId: 'ECE', classId: 'ECE-A' },
  { id: 'CT004', name: 'Prof. Meena Kumari', email: 'teacher4', password: 'demo123', role: ROLES.CLASS_TEACHER, departmentId: 'ECE', classId: 'ECE-B' },
  { id: 'CT005', name: 'Dr. Prakash Raj', email: 'teacher5', password: 'demo123', role: ROLES.CLASS_TEACHER, departmentId: 'MECH', classId: 'MECH-A' },
  { id: 'CT006', name: 'Prof. Geetha Rani', email: 'teacher6', password: 'demo123', role: ROLES.CLASS_TEACHER, departmentId: 'MECH', classId: 'MECH-B' },

  // HODs
  { id: 'HOD001', name: 'Dr. Sundar Rajan', email: 'hod_cse', password: 'demo123', role: ROLES.HOD, departmentId: 'CSE' },
  { id: 'HOD002', name: 'Dr. Kavitha Mohan', email: 'hod_ece', password: 'demo123', role: ROLES.HOD, departmentId: 'ECE' },
  { id: 'HOD003', name: 'Dr. Bala Murugan', email: 'hod_mech', password: 'demo123', role: ROLES.HOD, departmentId: 'MECH' },

  // Principal
  { id: 'PRIN001', name: 'Dr. Raghavan Iyer', email: 'principal', password: 'demo123', role: ROLES.PRINCIPAL },

  // Cultural Staff
  { id: 'CUL001', name: 'Prof. Arjun Menon', email: 'cultural1', password: 'demo123', role: ROLES.CULTURAL_STAFF },
  { id: 'CUL002', name: 'Prof. Swathi Nair', email: 'cultural2', password: 'demo123', role: ROLES.CULTURAL_STAFF },
];

// ── Seed Events ─────────────────────────────────────────────
const SEED_EVENTS = [
  {
    id: 'EVT001',
    name: 'TechFest 2026',
    description: 'Annual technical festival with coding contests, robotics, and project exhibitions',
    date: '2026-07-15',
    endDate: '2026-07-17',
    createdBy: 'CUL001',
    createdAt: '2026-06-10T09:00:00Z',
  },
  {
    id: 'EVT002',
    name: 'Cultural Night 2026',
    description: 'Annual cultural night with music, dance, and drama performances',
    date: '2026-07-20',
    endDate: '2026-07-20',
    createdBy: 'CUL002',
    createdAt: '2026-06-12T10:30:00Z',
  },
];

// ── Seed OD Requests ────────────────────────────────────────
const SEED_OD_REQUESTS = [
  {
    id: 'OD001',
    studentId: 'STU001',
    eventName: 'Inter-College Hackathon',
    reason: 'Participating in 24-hour hackathon at IIT Madras as team lead',
    startDate: '2026-06-20',
    endDate: '2026-06-21',
    duration: '2 days',
    type: OD_TYPE.STUDENT_REQUEST,
    status: OD_STATUS.APPROVED,
    createdAt: '2026-06-15T08:00:00Z',
    approvals: [
      { approverId: 'HOD001', action: 'APPROVED', remarks: 'Approved. Represent the department well.', level: 'HOD', timestamp: '2026-06-15T14:00:00Z' },
      { approverId: 'PRIN001', action: 'APPROVED', remarks: 'Approved.', level: 'PRINCIPAL', timestamp: '2026-06-16T09:00:00Z' },
    ],
  },
  {
    id: 'OD002',
    studentId: 'STU002',
    eventName: 'Paper Presentation - National Conference',
    reason: 'Presenting research paper on AI in Healthcare at Anna University',
    startDate: '2026-06-25',
    endDate: '2026-06-25',
    duration: '1 day',
    type: OD_TYPE.STUDENT_REQUEST,
    status: OD_STATUS.PENDING_HOD,
    createdAt: '2026-06-16T07:00:00Z',
    approvals: [],
  },
  {
    id: 'OD003',
    studentId: 'STU004',
    eventName: 'Workshop on IoT',
    reason: 'Attending 2-day workshop on Internet of Things at VIT',
    startDate: '2026-06-22',
    endDate: '2026-06-23',
    duration: '2 days',
    type: OD_TYPE.STUDENT_REQUEST,
    status: OD_STATUS.PENDING_HOD,
    createdAt: '2026-06-17T06:00:00Z',
    approvals: [],
  },
  {
    id: 'OD004',
    studentId: 'STU003',
    eventName: 'Sports Day - Cricket Tournament',
    reason: 'Representing college cricket team in inter-college tournament',
    startDate: '2026-06-28',
    endDate: '2026-06-29',
    duration: '2 days',
    type: OD_TYPE.STUDENT_REQUEST,
    status: OD_STATUS.REJECTED,
    createdAt: '2026-06-14T09:00:00Z',
    rejectionReason: 'Student has low attendance (below 75%). Cannot approve OD at this time. Please improve attendance first.',
    rejectedBy: 'HOD001',
    rejectedAt: '2026-06-14T15:00:00Z',
    approvals: [
      { approverId: 'HOD001', action: 'REJECTED', remarks: 'Student has low attendance (below 75%). Cannot approve OD at this time. Please improve attendance first.', level: 'HOD', timestamp: '2026-06-14T15:00:00Z' },
    ],
  },
  {
    id: 'OD005',
    studentId: 'STU005',
    eventName: 'TechFest 2026',
    reason: 'Volunteering and participating in robotics competition',
    startDate: '2026-07-15',
    endDate: '2026-07-17',
    duration: '3 days',
    type: OD_TYPE.CULTURAL_EVENT,
    eventId: 'EVT001',
    status: OD_STATUS.PENDING_PRINCIPAL,
    createdAt: '2026-06-16T12:00:00Z',
    approvals: [],
  },
];

// ── Helper: Generate unique ID ──────────────────────────────
function generateId(prefix = 'ID') {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
}

// ── Data Store Class ────────────────────────────────────────
class DataStore {
  constructor() {
    this.data = null;
  }

  // Initialize data from localStorage or seed
  init() {
    if (typeof window === 'undefined') return;
    if (this.data) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        this.data = JSON.parse(stored);
      } catch {
        this.data = null;
      }
    }

    if (!this.data) {
      this.data = {
        users: [...SEED_USERS],
        departments: [...DEPARTMENTS],
        classes: [...CLASSES],
        odRequests: [...SEED_OD_REQUESTS],
        events: [...SEED_EVENTS],
      };
      this.save();
    }
  }

  // Persist to localStorage
  save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  // Reset to seed data
  reset() {
    this.data = {
      users: [...SEED_USERS],
      departments: [...DEPARTMENTS],
      classes: [...CLASSES],
      odRequests: [...SEED_OD_REQUESTS],
      events: [...SEED_EVENTS],
    };
    this.save();
  }

  // ── Auth ────────────────────────────────────────────────
  login(email, password) {
    this.init();
    const user = this.data.users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...safeUser } = user;
      return safeUser;
    }
    return null;
  }

  // ── Users ───────────────────────────────────────────────
  getUser(id) {
    this.init();
    const user = this.data.users.find(u => u.id === id);
    if (user) {
      const { password: _, ...safeUser } = user;
      return safeUser;
    }
    return null;
  }

  getUsersByRole(role) {
    this.init();
    return this.data.users.filter(u => u.role === role).map(({ password: _, ...u }) => u);
  }

  getUsersByClass(classId) {
    this.init();
    return this.data.users.filter(u => u.classId === classId && u.role === ROLES.STUDENT).map(({ password: _, ...u }) => u);
  }

  getUsersByDepartment(departmentId) {
    this.init();
    return this.data.users.filter(u => u.departmentId === departmentId && u.role === ROLES.STUDENT).map(({ password: _, ...u }) => u);
  }

  getAllStudents() {
    this.init();
    return this.data.users.filter(u => u.role === ROLES.STUDENT).map(({ password: _, ...u }) => u);
  }

  // ── Departments ─────────────────────────────────────────
  getDepartments() {
    this.init();
    return [...this.data.departments];
  }

  getDepartment(id) {
    this.init();
    return this.data.departments.find(d => d.id === id);
  }

  // ── Classes ─────────────────────────────────────────────
  getClasses(departmentId) {
    this.init();
    if (departmentId) {
      return this.data.classes.filter(c => c.departmentId === departmentId);
    }
    return [...this.data.classes];
  }

  getClass(id) {
    this.init();
    return this.data.classes.find(c => c.id === id);
  }

  // ── OD Requests ─────────────────────────────────────────
  createOdRequest({ studentId, eventName, reason, startDate, endDate, duration, type = OD_TYPE.STUDENT_REQUEST, eventId = null }) {
    this.init();
    const request = {
      id: generateId('OD'),
      studentId,
      eventName,
      reason,
      startDate,
      endDate,
      duration,
      type,
      eventId,
      status: type === OD_TYPE.CULTURAL_EVENT ? OD_STATUS.PENDING_PRINCIPAL : OD_STATUS.PENDING_HOD,
      createdAt: new Date().toISOString(),
      approvals: [],
    };
    this.data.odRequests.push(request);
    this.save();
    return request;
  }

  getOdRequest(id) {
    this.init();
    return this.data.odRequests.find(r => r.id === id) || null;
  }

  // Get OD requests for a student
  getStudentOdRequests(studentId) {
    this.init();
    return this.data.odRequests
      .filter(r => r.studentId === studentId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Get pending OD requests for Class Teacher
  getClassTeacherPending(classId) {
    this.init();
    const classStudents = this.data.users.filter(u => u.classId === classId && u.role === ROLES.STUDENT).map(u => u.id);
    return this.data.odRequests
      .filter(r => classStudents.includes(r.studentId) && r.status === OD_STATUS.PENDING_CT && r.type === OD_TYPE.STUDENT_REQUEST)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Get all OD requests for a class (for CT overview)
  getClassOdRequests(classId) {
    this.init();
    const classStudents = this.data.users.filter(u => u.classId === classId && u.role === ROLES.STUDENT).map(u => u.id);
    return this.data.odRequests
      .filter(r => classStudents.includes(r.studentId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Get pending OD requests for HOD
  getHodPending(departmentId) {
    this.init();
    const deptStudents = this.data.users.filter(u => u.departmentId === departmentId && u.role === ROLES.STUDENT).map(u => u.id);
    return this.data.odRequests
      .filter(r => deptStudents.includes(r.studentId) && r.status === OD_STATUS.PENDING_HOD && r.type === OD_TYPE.STUDENT_REQUEST)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Get all department OD requests (for HOD overview)
  getDepartmentOdRequests(departmentId) {
    this.init();
    const deptStudents = this.data.users.filter(u => u.departmentId === departmentId && u.role === ROLES.STUDENT).map(u => u.id);
    return this.data.odRequests
      .filter(r => deptStudents.includes(r.studentId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Get all OD requests that HOD can independently approve
  getHodApprovable(departmentId) {
    this.init();
    const deptStudents = this.data.users.filter(u => u.departmentId === departmentId && u.role === ROLES.STUDENT).map(u => u.id);
    return this.data.odRequests
      .filter(r =>
        deptStudents.includes(r.studentId) &&
        r.type === OD_TYPE.STUDENT_REQUEST &&
        [OD_STATUS.PENDING_HOD].includes(r.status)
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Get pending OD for Principal (from HOD approved + cultural events)
  getPrincipalPending() {
    this.init();
    return this.data.odRequests
      .filter(r =>
        (r.status === OD_STATUS.APPROVED_HOD && r.type === OD_TYPE.STUDENT_REQUEST) ||
        (r.status === OD_STATUS.PENDING_PRINCIPAL && r.type === OD_TYPE.CULTURAL_EVENT)
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Get all OD requests (for Principal overview)
  getAllOdRequests() {
    this.init();
    return [...this.data.odRequests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Get cultural event OD requests pending with Principal
  getCulturalEventPending() {
    this.init();
    return this.data.odRequests
      .filter(r => r.type === OD_TYPE.CULTURAL_EVENT && r.status === OD_STATUS.PENDING_PRINCIPAL)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // ── Approval Actions ────────────────────────────────────
  approveOd(odId, approverId, remarks = '', level) {
    this.init();
    const request = this.data.odRequests.find(r => r.id === odId);
    if (!request) return null;

    const approval = {
      approverId,
      action: 'APPROVED',
      remarks,
      level,
      timestamp: new Date().toISOString(),
    };
    request.approvals.push(approval);

    // Advance status based on level
    switch (level) {
      case 'CT':
        request.status = OD_STATUS.APPROVED_CT;
        break;
      case 'HOD':
        request.status = OD_STATUS.APPROVED_HOD;
        break;
      case 'HOD_INDEPENDENT':
        // HOD independently approves — skip to final
        request.status = OD_STATUS.APPROVED;
        break;
      case 'PRINCIPAL':
        request.status = OD_STATUS.APPROVED;
        break;
    }

    this.save();
    return request;
  }

  rejectOd(odId, approverId, reason, level) {
    this.init();
    if (!reason || reason.trim() === '') {
      throw new Error('Rejection reason is mandatory');
    }

    const request = this.data.odRequests.find(r => r.id === odId);
    if (!request) return null;

    request.status = OD_STATUS.REJECTED;
    request.rejectionReason = reason;
    request.rejectedBy = approverId;
    request.rejectedAt = new Date().toISOString();
    request.approvals.push({
      approverId,
      action: 'REJECTED',
      remarks: reason,
      level,
      timestamp: new Date().toISOString(),
    });

    this.save();
    return request;
  }

  // Cancel an approved OD (Principal only)
  cancelOd(odId, cancelledBy, reasonCategory, remarks = '') {
    this.init();
    const request = this.data.odRequests.find(r => r.id === odId);
    if (!request) return null;
    if (request.status !== OD_STATUS.APPROVED) return null;

    request.status = OD_STATUS.CANCELLED;
    request.cancellationReason = reasonCategory;
    request.cancellationRemarks = remarks;
    request.cancelledBy = cancelledBy;
    request.cancelledAt = new Date().toISOString();
    request.approvals.push({
      approverId: cancelledBy,
      action: 'CANCELLED',
      remarks: `${reasonCategory}${remarks ? ': ' + remarks : ''}`,
      level: 'PRINCIPAL',
      timestamp: new Date().toISOString(),
    });

    this.save();
    return request;
  }

  // Mass approve all ODs for an event (Principal only)
  massApproveEvent(eventId, approverId) {
    this.init();
    const requests = this.data.odRequests.filter(
      r => r.eventId === eventId && r.status === OD_STATUS.PENDING_PRINCIPAL
    );

    requests.forEach(request => {
      request.status = OD_STATUS.APPROVED;
      request.approvals.push({
        approverId,
        action: 'APPROVED',
        remarks: 'Mass approved for cultural event',
        level: 'PRINCIPAL',
        timestamp: new Date().toISOString(),
      });
    });

    this.save();
    return requests;
  }

  // ── Events ──────────────────────────────────────────────
  createEvent({ name, description, date, endDate, createdBy }) {
    this.init();
    const event = {
      id: generateId('EVT'),
      name,
      description,
      date,
      endDate,
      createdBy,
      createdAt: new Date().toISOString(),
    };
    this.data.events.push(event);
    this.save();
    return event;
  }

  getEvents() {
    this.init();
    return [...this.data.events].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getEvent(id) {
    this.init();
    return this.data.events.find(e => e.id === id) || null;
  }

  // Create OD requests for multiple students for an event (Cultural staff)
  createBulkEventOd(eventId, studentIds, createdBy) {
    this.init();
    const event = this.getEvent(eventId);
    if (!event) return [];

    const requests = studentIds.map(studentId => {
      const existing = this.data.odRequests.find(
        r => r.eventId === eventId && r.studentId === studentId
      );
      if (existing) return existing;

      const request = {
        id: generateId('OD'),
        studentId,
        eventName: event.name,
        reason: `Participating in ${event.name} - ${event.description}`,
        startDate: event.date,
        endDate: event.endDate,
        duration: this.calculateDuration(event.date, event.endDate),
        type: OD_TYPE.CULTURAL_EVENT,
        eventId,
        status: OD_STATUS.PENDING_PRINCIPAL,
        createdAt: new Date().toISOString(),
        createdBy,
        approvals: [],
      };
      this.data.odRequests.push(request);
      return request;
    });

    this.save();
    return requests;
  }

  // ── Statistics ──────────────────────────────────────────
  getClassStats(classId) {
    const requests = this.getClassOdRequests(classId);
    const students = this.getUsersByClass(classId);
    return {
      totalStudents: students.length,
      totalRequests: requests.length,
      pending: requests.filter(r => [OD_STATUS.PENDING_HOD, OD_STATUS.APPROVED_HOD, OD_STATUS.PENDING_PRINCIPAL].includes(r.status)).length,
      approved: requests.filter(r => r.status === OD_STATUS.APPROVED).length,
      rejected: requests.filter(r => r.status === OD_STATUS.REJECTED).length,
      activeOd: requests.filter(r => {
        if (r.status !== OD_STATUS.APPROVED) return false;
        const today = new Date().toISOString().split('T')[0];
        return r.startDate <= today && r.endDate >= today;
      }).length,
    };
  }

  getDepartmentStats(departmentId) {
    const requests = this.getDepartmentOdRequests(departmentId);
    const students = this.getUsersByDepartment(departmentId);
    return {
      totalStudents: students.length,
      totalRequests: requests.length,
      pending: requests.filter(r => ![OD_STATUS.APPROVED, OD_STATUS.REJECTED, OD_STATUS.CANCELLED].includes(r.status)).length,
      approved: requests.filter(r => r.status === OD_STATUS.APPROVED).length,
      rejected: requests.filter(r => r.status === OD_STATUS.REJECTED).length,
      cancelled: requests.filter(r => r.status === OD_STATUS.CANCELLED).length,
    };
  }

  getInstitutionStats() {
    this.init();
    const requests = this.data.odRequests;
    const students = this.data.users.filter(u => u.role === ROLES.STUDENT);
    return {
      totalStudents: students.length,
      totalRequests: requests.length,
      pending: requests.filter(r => ![OD_STATUS.APPROVED, OD_STATUS.REJECTED, OD_STATUS.CANCELLED].includes(r.status)).length,
      approved: requests.filter(r => r.status === OD_STATUS.APPROVED).length,
      rejected: requests.filter(r => r.status === OD_STATUS.REJECTED).length,
      cancelled: requests.filter(r => r.status === OD_STATUS.CANCELLED).length,
      culturalEvents: this.data.events.length,
    };
  }

  // ── Helpers ─────────────────────────────────────────────
  calculateDuration(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return `${diff} day${diff > 1 ? 's' : ''}`;
  }

  // Enrich OD request with user details
  enrichOdRequest(request) {
    if (!request) return null;
    const student = this.getUser(request.studentId);
    const department = student ? this.getDepartment(student.departmentId) : null;
    const classInfo = student ? this.getClass(student.classId) : null;
    const enrichedApprovals = (request.approvals || []).map(a => ({
      ...a,
      approver: this.getUser(a.approverId),
    }));
    const rejectedByUser = request.rejectedBy ? this.getUser(request.rejectedBy) : null;
    const cancelledByUser = request.cancelledBy ? this.getUser(request.cancelledBy) : null;

    return {
      ...request,
      student,
      department,
      classInfo,
      approvals: enrichedApprovals,
      rejectedByUser,
      cancelledByUser,
    };
  }
}

// Singleton instance
const dataStore = new DataStore();
export default dataStore;
