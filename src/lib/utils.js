// Format date for display
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Format date and time
export function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Get role display name
export function getRoleLabel(role) {
  const labels = {
    STUDENT: 'Student',
    CLASS_TEACHER: 'Class Teacher',
    HOD: 'Head of Department',
    PRINCIPAL: 'Principal',
    CULTURAL_STAFF: 'Cultural Dept',
  };
  return labels[role] || role;
}

// Get role accent color
export function getRoleColor(role) {
  const colors = {
    STUDENT: '#06b6d4',
    CLASS_TEACHER: '#f59e0b',
    HOD: '#8b5cf6',
    PRINCIPAL: '#10b981',
    CULTURAL_STAFF: '#f43f5e',
  };
  return colors[role] || '#6366f1';
}

// Get status color
export function getStatusColor(status) {
  const colors = {
    PENDING_CT: '#f59e0b',
    APPROVED_CT: '#3b82f6',
    PENDING_HOD: '#8b5cf6',
    APPROVED_HOD: '#3b82f6',
    PENDING_PRINCIPAL: '#f59e0b',
    APPROVED: '#22c55e',
    REJECTED: '#ef4444',
  };
  return colors[status] || '#888';
}

// Get QR verification data
export function getQrData(odRequest, baseUrl = '') {
  return JSON.stringify({
    id: odRequest.id,
    student: odRequest.student?.name || 'Unknown',
    rollNo: odRequest.student?.rollNo || '',
    event: odRequest.eventName,
    status: odRequest.status,
    dates: `${odRequest.startDate} to ${odRequest.endDate}`,
    verifyUrl: `${baseUrl}/verify/${odRequest.id}`,
  });
}

// Calculate days between dates
export function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return `${diff} day${diff > 1 ? 's' : ''}`;
}
