'use client';

import { Printer } from 'lucide-react';
import { formatDate, formatDateTime, getRoleLabel, getQrData } from '@/lib/utils';
import QrCode from '@/components/QrCode';
import compStyles from '@/styles/components.module.css';

export default function OdLetterTemplate({ odRequest }) {
  if (!odRequest) return null;

  const qrData = getQrData(odRequest);
  const today = formatDate(new Date().toISOString());

  return (
    <div className={compStyles.letterWrapper}>
      <button className={compStyles.letterPrintBtn} onClick={() => window.print()}>
        <Printer size={16} />
        Print Letter
      </button>

      <div className={compStyles.letter}>
        {/* Header */}
        <div className={compStyles.letterHeader}>
          <div className={compStyles.letterInstitution}>
            Sri Venkateswara College of Engineering
          </div>
          <div className={compStyles.letterAddress}>
            Pennalur, Sriperumbudur Tk – 602117 | Autonomous Institution | Affiliated to Anna University
          </div>
        </div>

        <div className={compStyles.letterTitle}>On-Duty Certificate</div>

        <div className={compStyles.letterRef}>
          <span>Ref: {odRequest.id}</span>
          <span>Date: {today}</span>
        </div>

        <div className={compStyles.letterBody}>
          <p>To Whom It May Concern,</p>
          <p style={{ marginTop: 12 }}>
            This is to certify that <strong>{odRequest.student?.name || 'the student'}</strong>
            {odRequest.student?.rollNo ? ` (Roll No: ${odRequest.student.rollNo})` : ''},
            {odRequest.department ? ` Department of ${odRequest.department.name},` : ''}
            {odRequest.classInfo ? ` ${odRequest.classInfo.name},` : ''}
            has been granted On-Duty permission for the following event/activity:
          </p>

          <div className={compStyles.letterEventDetails}>
            <div className={compStyles.letterEventRow}>
              <span className={compStyles.letterEventLabel}>Event / Activity:</span>
              <span className={compStyles.letterEventValue}>{odRequest.eventName}</span>
            </div>
            <div className={compStyles.letterEventRow}>
              <span className={compStyles.letterEventLabel}>Reason:</span>
              <span className={compStyles.letterEventValue}>{odRequest.reason}</span>
            </div>
            <div className={compStyles.letterEventRow}>
              <span className={compStyles.letterEventLabel}>From:</span>
              <span className={compStyles.letterEventValue}>{formatDate(odRequest.startDate)}</span>
            </div>
            <div className={compStyles.letterEventRow}>
              <span className={compStyles.letterEventLabel}>To:</span>
              <span className={compStyles.letterEventValue}>{formatDate(odRequest.endDate)}</span>
            </div>
            <div className={compStyles.letterEventRow}>
              <span className={compStyles.letterEventLabel}>Duration:</span>
              <span className={compStyles.letterEventValue}>{odRequest.duration}</span>
            </div>
          </div>

          <p>
            The student is exempted from attending regular classes during the above-mentioned period.
            All faculty members are requested to grant attendance accordingly.
          </p>
        </div>

        {/* Signatures */}
        <div className={compStyles.letterSignatures}>
          <div className={compStyles.letterSignaturesTitle}>Approval Signatures</div>
          <div className={compStyles.letterSignaturesGrid}>
            {(odRequest.approvals || [])
              .filter(a => a.action === 'APPROVED')
              .map((approval, idx) => (
                <div key={idx} className={compStyles.letterSignatureCard}>
                  <div className={compStyles.letterSignatureName}>
                    {approval.approver?.name || 'Unknown'}
                  </div>
                  <div className={compStyles.letterSignatureRole}>
                    {getRoleLabel(approval.approver?.role || '')}
                  </div>
                  <div className={compStyles.letterSignatureTimestamp}>
                    {formatDateTime(approval.timestamp)}
                  </div>
                  <div className={compStyles.letterSignatureLabel}>✓ Approved</div>
                </div>
              ))}
          </div>
        </div>

        {/* QR Code */}
        <div className={compStyles.letterQrSection}>
          <div className={compStyles.letterQrCodePrint}>
            <QrCode data={qrData} size={100} />
          </div>
          <div className={compStyles.letterQrLabel}>
            Scan to verify this OD certificate
          </div>
        </div>
      </div>
    </div>
  );
}
