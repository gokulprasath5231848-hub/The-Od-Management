'use client';

import { Calendar, Clock, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';
import { OD_STATUS, STATUS_LABELS } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import compStyles from '@/styles/components.module.css';

function getStatusBadgeClass(status) {
  if (status === OD_STATUS.APPROVED) return compStyles.statusApproved;
  if (status === OD_STATUS.REJECTED) return compStyles.statusRejected;
  if (status === OD_STATUS.CANCELLED) return compStyles.statusCancelled;
  if ([OD_STATUS.APPROVED_HOD, OD_STATUS.PENDING_HOD].includes(status)) return compStyles.statusInProgress;
  return compStyles.statusPending;
}

export default function OdRequestCard({ request, showActions = false, onView, onApprove, onReject, onCancel }) {
  if (!request) return null;

  const statusLabel = STATUS_LABELS[request.status] || request.status;
  const badgeClass = getStatusBadgeClass(request.status);

  return (
    <div className={compStyles.odCard} onClick={() => onView?.(request)}>
      <div className={compStyles.odCardTopRow}>
        <div>
          <div className={compStyles.odCardStudentName}>
            {request.student?.name || 'Unknown Student'}
          </div>
          <div className={compStyles.odCardRollNo}>
            {request.student?.rollNo || ''}
            {request.classInfo ? ` • ${request.classInfo.name}` : ''}
          </div>
        </div>
        <span className={`${compStyles.statusBadge} ${badgeClass}`}>
          {statusLabel}
        </span>
      </div>

      <div className={compStyles.odCardEventName}>{request.eventName}</div>

      <div className={compStyles.odCardMeta}>
        <span className={compStyles.odCardMetaItem}>
          <Calendar size={14} />
          {formatDate(request.startDate)} — {formatDate(request.endDate)}
        </span>
        <span className={compStyles.odCardMetaItem}>
          <Clock size={14} />
          {request.duration}
        </span>
      </div>

      {request.status === OD_STATUS.REJECTED && request.rejectionReason && (
        <div className={compStyles.odCardRejectionInfo}>
          <div className={compStyles.odCardRejectionLabel}>Rejection Reason</div>
          <div className={compStyles.odCardRejectionReason}>{request.rejectionReason}</div>
          {request.rejectedByUser && (
            <div className={compStyles.odCardRejectedBy}>— {request.rejectedByUser.name}</div>
          )}
        </div>
      )}

      {request.status === OD_STATUS.CANCELLED && request.cancellationReason && (
        <div className={compStyles.odCardCancellationInfo}>
          <div className={compStyles.odCardCancellationLabel}>Cancelled — {request.cancellationReason}</div>
          {request.cancellationRemarks && (
            <div className={compStyles.odCardCancellationRemarks}>{request.cancellationRemarks}</div>
          )}
          {request.cancelledByUser && (
            <div className={compStyles.odCardCancelledBy}>— {request.cancelledByUser.name}</div>
          )}
        </div>
      )}

      {showActions && ![OD_STATUS.APPROVED, OD_STATUS.REJECTED, OD_STATUS.CANCELLED].includes(request.status) && (
        <div className={compStyles.odCardActions} onClick={(e) => e.stopPropagation()}>
          <button
            className={compStyles.btnApprove}
            onClick={(e) => { e.stopPropagation(); onApprove?.(request); }}
          >
            <CheckCircle size={16} />
            Approve
          </button>
          <button
            className={compStyles.btnReject}
            onClick={(e) => { e.stopPropagation(); onReject?.(request); }}
          >
            <XCircle size={16} />
            Reject
          </button>
        </div>
      )}

      {onCancel && request.status === OD_STATUS.APPROVED && (
        <div className={compStyles.odCardActions} onClick={(e) => e.stopPropagation()}>
          <button
            className={compStyles.btnCancel}
            onClick={(e) => { e.stopPropagation(); onCancel?.(request); }}
          >
            <ShieldAlert size={16} />
            Cancel OD
          </button>
        </div>
      )}
    </div>
  );
}
