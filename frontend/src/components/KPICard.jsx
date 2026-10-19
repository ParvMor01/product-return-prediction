import React from 'react';

export default function KPICard({ label, value, subtext, icon: Icon, color = 'blue' }) {
  const colorMap = {
    blue: { bg: 'var(--primary-blue-light)', text: 'var(--primary-blue)' },
    green: { bg: 'var(--success-green-light)', text: 'var(--success-green)' },
    amber: { bg: 'var(--warning-amber-light)', text: 'var(--warning-amber)' },
    red: { bg: 'var(--danger-red-light)', text: 'var(--danger-red)' },
    navy: { bg: 'rgba(23, 32, 51, 0.08)', text: 'var(--primary-navy)' },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-label">{label}</span>
        {Icon && (
          <div className="kpi-icon-wrap" style={{ backgroundColor: scheme.bg, color: scheme.text }}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="kpi-value">{value}</div>
      {subtext && <div className="kpi-subtext">{subtext}</div>}
    </div>
  );
}
