import React from 'react';
import './StatCard.css';

export default function StatCard({ icon, label, value, subtext, type = 'default' }) {
  return (
    <div className={`stat-card stat-card-${type}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        {subtext && <p className="stat-subtext">{subtext}</p>}
      </div>
    </div>
  );
}
