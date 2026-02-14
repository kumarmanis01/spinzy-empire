import React from 'react';

export interface ProgressProps {
  step: number;
  total: number;
}

export function Progress({ step, total }: ProgressProps) {
  const pct = Math.round((step / total) * 100);
  return (
    <div>
      <div style={{ background: '#eee', height: 8, width: 240 }}>
        <div style={{ background: '#4caf50', height: 8, width: `${pct}%` }} />
      </div>
      <div style={{ marginTop: 6 }}>{pct}%</div>
    </div>
  );
}
