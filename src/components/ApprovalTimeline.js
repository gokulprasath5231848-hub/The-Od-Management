'use client';

import { OD_STATUS } from '@/lib/data';
import { formatDateTime, getRoleLabel } from '@/lib/utils';
import compStyles from '@/styles/components.module.css';

const APPROVAL_LEVELS = [
  { key: 'HOD', label: 'HOD Approval' },
  { key: 'PRINCIPAL', label: 'Principal Approval' },
];

export default function ApprovalTimeline({ odRequest }) {
  if (!odRequest) return null;

  const isCultural = odRequest.type === 'CULTURAL_EVENT';
  const levels = isCultural
    ? [{ key: 'PRINCIPAL', label: 'Principal Approval' }]
    : APPROVAL_LEVELS;

  const approvals = odRequest.approvals || [];
  const isRejected = odRequest.status === OD_STATUS.REJECTED;
  const isFullyApproved = odRequest.status === OD_STATUS.APPROVED;

  return (
    <div className={compStyles.timeline}>
      {levels.map((level, idx) => {
        const approval = approvals.find(a => a.level === level.key || a.level === 'HOD_INDEPENDENT' && level.key === 'HOD');
        const isCompleted = approval && approval.action === 'APPROVED';
        const isRejectedAtLevel = approval && approval.action === 'REJECTED';

        // Determine if this step is the "current" one
        let isCurrent = false;
        if (!isCompleted && !isRejectedAtLevel) {
          const prevCompleted = idx === 0 ? true : approvals.some(a => a.level === levels[idx - 1].key && a.action === 'APPROVED');
          isCurrent = prevCompleted && !isFullyApproved && !isRejected;
        }

        let dotClass = compStyles.timelineDotPending;
        if (isCompleted) dotClass = compStyles.timelineDotCompleted;
        else if (isRejectedAtLevel) dotClass = compStyles.timelineDotRejected;
        else if (isCurrent) dotClass = compStyles.timelineDotCurrent;

        let lineClass = '';
        if (isCompleted) lineClass = compStyles.timelineLineCompleted;

        return (
          <div key={level.key} className={compStyles.timelineStep}>
            <div className={compStyles.timelineDotWrapper}>
              <div className={`${compStyles.timelineDot} ${dotClass}`} />
              {idx < levels.length - 1 && (
                <div className={`${compStyles.timelineLine} ${lineClass}`} />
              )}
            </div>
            <div className={compStyles.timelineContent}>
              <div className={compStyles.timelineLabel}>{level.label}</div>
              {approval && (
                <>
                  <div className={compStyles.timelineApprover}>
                    {approval.approver?.name || 'Unknown'} ({getRoleLabel(approval.approver?.role || '')})
                  </div>
                  <div className={compStyles.timelineTimestamp}>
                    {formatDateTime(approval.timestamp)}
                  </div>
                  {approval.remarks && isRejectedAtLevel && (
                    <div className={compStyles.timelineRejectionReason}>
                      &quot;{approval.remarks}&quot;
                    </div>
                  )}
                  {approval.remarks && !isRejectedAtLevel && (
                    <div className={compStyles.timelineApprover} style={{ marginTop: 4, fontStyle: 'italic' }}>
                      &quot;{approval.remarks}&quot;
                    </div>
                  )}
                </>
              )}
              {!approval && isCurrent && (
                <div className={compStyles.timelineApprover}>Awaiting approval...</div>
              )}
              {!approval && !isCurrent && (
                <div className={compStyles.timelineApprover}>Pending</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
