'use client';

import compStyles from '@/styles/components.module.css';

export default function StatCard({ title, value, subtitle, icon: Icon, accentColor = '#6366f1' }) {
  return (
    <div className={compStyles.statCard}>
      <div className={compStyles.statCardHeader}>
        <div
          className={compStyles.statCardIconWrapper}
          style={{ background: `${accentColor}25`, color: accentColor }}
        >
          {Icon && <Icon size={22} />}
        </div>
      </div>
      <div className={compStyles.statCardValue}>{value ?? 0}</div>
      <div className={compStyles.statCardTitle}>{title}</div>
      {subtitle && <div className={compStyles.statCardSubtitle}>{subtitle}</div>}
    </div>
  );
}
